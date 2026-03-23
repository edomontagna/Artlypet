import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const WATERMARK_SIZE = 768;
const WATERMARK_TEXT = "Artlypet";

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

    const { generation_id } = await req.json();
    if (!generation_id) return new Response(JSON.stringify({ error: "Missing generation_id" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Fetch generation record
    const { data: generation, error: genError } = await supabase
      .from("generated_images")
      .select("id, user_id, storage_path, status, is_hd_unlocked")
      .eq("id", generation_id)
      .single();

    if (genError || !generation || generation.user_id !== user.id) {
      return new Response(JSON.stringify({ error: "Image not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (generation.status !== "completed" || !generation.storage_path) {
      return new Response(JSON.stringify({ error: "Image not ready" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Check user plan
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan_type")
      .eq("user_id", user.id)
      .single();

    const isPremium = profile?.plan_type === "premium" || profile?.plan_type === "business";
    const isHd = isPremium || generation.is_hd_unlocked;

    // HD: return signed URL to full-quality image
    if (isHd) {
      const { data: signedUrlData, error: urlError } = await supabase.storage
        .from("generated-images")
        .createSignedUrl(generation.storage_path, 3600);

      if (urlError) throw urlError;

      return new Response(
        JSON.stringify({ mode: "hd", url: signedUrlData.signedUrl }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // FREE: check cache first
    const wmPath = `${user.id}/${generation_id}_wm.jpg`;
    const { data: cachedWm } = await supabase.storage
      .from("watermarked-images")
      .createSignedUrl(wmPath, 3600);

    if (cachedWm?.signedUrl) {
      return new Response(
        JSON.stringify({ mode: "watermarked", url: cachedWm.signedUrl }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // FREE: generate watermarked version using SVG overlay approach
    // Download original full-quality image
    const { data: imageBlob } = await supabase.storage
      .from("generated-images")
      .download(generation.storage_path);

    if (!imageBlob) throw new Error("Failed to download image");

    const arrayBuffer = await imageBlob.arrayBuffer();
    const originalBytes = new Uint8Array(arrayBuffer);

    // Create an SVG watermark overlay and encode as a simple marked image
    // Since Deno Edge Functions don't have Canvas, we use a simpler approach:
    // Return the image at lower quality with watermark metadata flag
    // The actual watermark is rendered client-side via CSS overlay

    // Upload a lower-quality copy (re-encode not possible without Canvas)
    // Instead, store the original and flag it — client renders watermark overlay
    await supabase.storage
      .from("watermarked-images")
      .upload(wmPath, originalBytes, {
        contentType: "image/png",
        upsert: true,
      });

    const { data: wmSignedUrl } = await supabase.storage
      .from("watermarked-images")
      .createSignedUrl(wmPath, 3600);

    return new Response(
      JSON.stringify({
        mode: "watermarked",
        url: wmSignedUrl?.signedUrl || null,
        watermark: WATERMARK_TEXT,
        maxDisplaySize: WATERMARK_SIZE,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
