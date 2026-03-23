import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CREDIT_COSTS: Record<string, number> = {
  single: 100,
  mix: 150,
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

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

    const { original_id, style_id, generation_type = "single" } = await req.json();
    if (!original_id || !style_id) return new Response(JSON.stringify({ error: "Missing original_id or style_id" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const creditCost = CREDIT_COSTS[generation_type] || CREDIT_COSTS.single;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Check credits
    const { data: profile } = await supabase
      .from("profiles")
      .select("credit_balance")
      .eq("user_id", user.id)
      .single();

    if (!profile || profile.credit_balance < creditCost) {
      return new Response(JSON.stringify({ error: "Insufficient credits", required: creditCost, current: profile?.credit_balance || 0 }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Deduct credits
    const newBalance = profile.credit_balance - creditCost;
    await supabase
      .from("profiles")
      .update({ credit_balance: newBalance, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);

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
      metadata: { generation_id: generation.id, style_id, original_id, generation_type, credit_cost: creditCost },
    });

    // Start async generation (non-blocking)
    const _generateAsync = (async () => {
      try {
        // Update status to processing
        await supabase
          .from("generated_images")
          .update({ status: "processing" })
          .eq("id", generation.id);

        // Fetch original image
        const { data: original } = await supabase
          .from("image_originals")
          .select("storage_path")
          .eq("id", original_id)
          .single();

        if (!original) throw new Error("Original image not found");

        const { data: imageData } = await supabase.storage
          .from("original-images")
          .download(original.storage_path);

        if (!imageData) throw new Error("Failed to download original image");

        // Fetch style prompt
        const { data: style } = await supabase
          .from("styles")
          .select("prompt_template, name")
          .eq("id", style_id)
          .single();

        if (!style) throw new Error("Style not found");

        // Convert image to base64 (chunk-safe for large files)
        const arrayBuffer = await imageData.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        let binary = "";
        const chunkSize = 8192;
        for (let i = 0; i < bytes.length; i += chunkSize) {
          binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
        }
        const base64Image = btoa(binary);

        // Call Gemini API
        const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
        const geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{
                parts: [
                  {
                    inlineData: {
                      mimeType: "image/jpeg",
                      data: base64Image,
                    },
                  },
                  {
                    text: style.prompt_template,
                  },
                ],
              }],
              generationConfig: {
                responseModalities: ["TEXT", "IMAGE"],
              },
            }),
          },
        );

        if (!geminiResponse.ok) {
          const errorText = await geminiResponse.text();
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
      } catch (err) {
        // Mark as failed and refund
        await supabase
          .from("generated_images")
          .update({ status: "failed", error_message: err.message })
          .eq("id", generation.id);

        // Refund credits
        const { data: currentProfile } = await supabase
          .from("profiles")
          .select("credit_balance")
          .eq("user_id", user.id)
          .single();

        const refundBalance = (currentProfile?.credit_balance || 0) + creditCost;
        await supabase
          .from("profiles")
          .update({ credit_balance: refundBalance, updated_at: new Date().toISOString() })
          .eq("user_id", user.id);

        await supabase.from("credit_transactions").insert({
          user_id: user.id,
          type: "refund",
          amount: creditCost,
          balance_after: refundBalance,
          description: `Generation failed — automatic refund (${creditCost} credits)`,
        });

        await supabase.from("audit_log").insert({
          user_id: user.id,
          event_type: "generation_failed",
          metadata: { generation_id: generation.id, error: err.message },
        });
      }
    })();

    return new Response(
      JSON.stringify({ generation_id: generation.id, status: "pending" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
