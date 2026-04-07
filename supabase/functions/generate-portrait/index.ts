import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CREDIT_COSTS: Record<string, number> = {
  single: 100,
  mix: 150,
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUUID = (v: unknown): v is string => typeof v === "string" && UUID_RE.test(v);

const REQUIRED_ENV_VARS = ["SUPABASE_URL", "SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY", "GEMINI_API_KEY", "ALLOWED_ORIGIN"];
const missingEnvVars = REQUIRED_ENV_VARS.filter((v) => !Deno.env.get(v));
if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
}

// --- Rate limiting ---
// NOTE: In-memory rate limiter — resets on cold start, per-isolate only.
// TODO: Replace with database-backed rate limiting for production scale.
const rateLimitMap = new Map<string, number[]>();
const MAX_REQUESTS = 5;
const WINDOW_MS = 60000;

const checkRateLimit = (userId: string): { allowed: boolean; remaining: number } => {
  const now = Date.now();
  const requests = rateLimitMap.get(userId)?.filter(t => now - t < WINDOW_MS) || [];
  if (requests.length >= MAX_REQUESTS) return { allowed: false, remaining: 0 };
  requests.push(now);
  rateLimitMap.set(userId, requests);
  return { allowed: true, remaining: MAX_REQUESTS - requests.length };
};

const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGIN") || "http://localhost:8080").split(",").map(o => o.trim()).filter(Boolean);

const getCorsHeaders = (req: Request) => {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : "";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
};

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  if (missingEnvVars.length > 0) {
    return new Response(JSON.stringify({ error: "Server configuration error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // Rate limit check
    const rateCheck = checkRateLimit(user.id);
    if (!rateCheck.allowed) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please wait a moment before trying again." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": String(Math.ceil(WINDOW_MS / 1000)), "X-RateLimit-Limit": String(MAX_REQUESTS), "X-RateLimit-Remaining": "0" } },
      );
    }

    const { original_id, style_id, generation_type = "single", original_id_2 } = await req.json();

    // Validate UUID format on all IDs
    if (!isUUID(original_id) || !isUUID(style_id)) {
      return new Response(JSON.stringify({ error: "Invalid ID format" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (original_id_2 && !isUUID(original_id_2)) {
      return new Response(JSON.stringify({ error: "Invalid original_id_2 format" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const creditCost = CREDIT_COSTS[generation_type] || CREDIT_COSTS.single;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Atomic credit deduction — prevents race conditions
    const { data: newBalance, error: deductError } = await supabase.rpc("deduct_credits", {
      p_user_id: user.id,
      p_cost: creditCost,
    });

    if (deductError || newBalance === -1) {
      return new Response(JSON.stringify({ error: "Insufficient credits", required: creditCost }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Record deduction
    await supabase.from("credit_transactions").insert({
      user_id: user.id,
      type: "deduction",
      amount: -creditCost,
      balance_after: newBalance,
      description: `Portrait generation (${generation_type}) — ${creditCost} credits`,
    });

    // Create generation record
    const { data: generation, error: genError } = await supabase
      .from("generated_images")
      .insert({
        user_id: user.id,
        style_id,
        original_id,
        status: "pending",
        generation_type,
      })
      .select()
      .single();

    if (genError) throw genError;

    // Audit log
    await supabase.from("audit_log").insert({
      user_id: user.id,
      event_type: "generation_requested",
      metadata: { generation_id: generation.id, style_id, original_id, original_id_2, generation_type, credit_cost: creditCost },
    });

    // Run generation synchronously — Edge Functions terminate after response
    try {
      // Update status to processing
      await supabase
        .from("generated_images")
        .update({ status: "processing" })
        .eq("id", generation.id);

      // Fetch original image — verify ownership
      const { data: original } = await supabase
        .from("image_originals")
        .select("storage_path")
        .eq("id", original_id)
        .eq("user_id", user.id)
        .single();

      if (!original) throw new Error("Original image not found");

      const { data: imageData } = await supabase.storage
        .from("pet-originals")
        .download(original.storage_path);

      if (!imageData) throw new Error("Failed to download original image");

      // Fetch style prompt
      const { data: style } = await supabase
        .from("styles")
        .select("prompt_template, name")
        .eq("id", style_id)
        .single();

      if (!style) throw new Error("Style not found");

      // Helper: convert blob to base64 (chunk-safe for large files)
      const blobToBase64 = async (blob: Blob): Promise<string> => {
        const arrayBuffer = await blob.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        let binary = "";
        const chunkSize = 8192;
        for (let i = 0; i < bytes.length; i += chunkSize) {
          binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
        }
        return btoa(binary);
      };

      const base64Image = await blobToBase64(imageData);

      // Build Gemini request parts based on generation type
      const contentParts: Array<Record<string, unknown>> = [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image,
          },
        },
      ];

      // If mix mode with second image, download and add it
      if (generation_type === "mix" && original_id_2) {
        const { data: original2 } = await supabase
          .from("image_originals")
          .select("storage_path")
          .eq("id", original_id_2)
          .eq("user_id", user.id)
          .single();

        if (!original2) throw new Error("Second original image not found");

        const { data: imageData2 } = await supabase.storage
          .from("pet-originals")
          .download(original2.storage_path);

        if (!imageData2) throw new Error("Failed to download second original image");

        const base64Image2 = await blobToBase64(imageData2);

        contentParts.push({
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image2,
          },
        });

        contentParts.push({
          text: `Combine these two subjects (a pet and a person) into a single artistic portrait. ${style.prompt_template}. Place both subjects together in the same scene, interacting naturally.`,
        });
      } else {
        contentParts.push({
          text: style.prompt_template,
        });
      }

      // Call Gemini API with retry on 503/429 (high demand / rate limit)
      const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
      const RETRY_DELAYS = [2000, 5000, 10000]; // 2s, 5s, 10s
      let geminiResponse: Response | null = null;

      for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
        geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": geminiApiKey!,
            },
            body: JSON.stringify({
              contents: [{
                parts: contentParts,
              }],
              generationConfig: {
                responseModalities: ["TEXT", "IMAGE"],
              },
            }),
          },
        );

        if (geminiResponse.ok || (geminiResponse.status !== 503 && geminiResponse.status !== 429)) {
          break; // Success or non-retryable error
        }

        if (attempt < RETRY_DELAYS.length) {
          console.log(`Gemini API returned ${geminiResponse.status}, retrying in ${RETRY_DELAYS[attempt]}ms (attempt ${attempt + 1}/${RETRY_DELAYS.length})`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAYS[attempt]));
        }
      }

      if (!geminiResponse || !geminiResponse.ok) {
        const errorText = geminiResponse ? await geminiResponse.text() : "No response";
        throw new Error(`Gemini API error: ${errorText}`);
      }

      const geminiData = await geminiResponse.json();

      // Extract generated image from response
      let generatedImageData: Uint8Array | null = null;
      for (const part of geminiData.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const binaryString = atob(part.inlineData.data);
          generatedImageData = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            generatedImageData[i] = binaryString.charCodeAt(i);
          }
          break;
        }
      }

      if (!generatedImageData) throw new Error("No image in Gemini response");

      // Upload to storage
      const storagePath = `${user.id}/${generation.id}.png`;
      const { error: uploadError } = await supabase.storage
        .from("generated-images")
        .upload(storagePath, generatedImageData, {
          contentType: "image/png",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Update generation record
      await supabase
        .from("generated_images")
        .update({
          status: "completed",
          storage_path: storagePath,
          completed_at: new Date().toISOString(),
        })
        .eq("id", generation.id);

      // Audit
      await supabase.from("audit_log").insert({
        user_id: user.id,
        event_type: "generation_completed",
        metadata: { generation_id: generation.id },
      });

      return new Response(
        JSON.stringify({ generation_id: generation.id, status: "completed", storage_path: storagePath }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    } catch (genErr) {
      console.error("Generation failed:", genErr.message, genErr.stack || genErr);

      // Mark as failed and refund atomically
      await supabase
        .from("generated_images")
        .update({ status: "failed", error_message: genErr.message })
        .eq("id", generation.id);

      // Atomic refund
      const { data: refundBalance } = await supabase.rpc("refund_credits", {
        p_user_id: user.id,
        p_amount: creditCost,
      });

      await supabase.from("credit_transactions").insert({
        user_id: user.id,
        type: "refund",
        amount: creditCost,
        balance_after: refundBalance ?? 0,
        description: `Generation failed — automatic refund (${creditCost} credits)`,
      });

      await supabase.from("audit_log").insert({
        user_id: user.id,
        event_type: "generation_failed",
        metadata: { generation_id: generation.id, error: genErr.message },
      });

      return new Response(
        JSON.stringify({ generation_id: generation.id, status: "failed", error: "Portrait generation failed. Your credits have been refunded." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
  } catch (err) {
    console.error("generate-portrait unhandled error:", err.message, err.stack || err);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      { status: 500, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
    );
  }
});
