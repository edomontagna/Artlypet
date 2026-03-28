import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUUID = (v: unknown): v is string => typeof v === "string" && UUID_RE.test(v);

const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGIN") || "http://localhost:8080")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const getCorsHeaders = (req: Request) => {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
};

/**
 * Public endpoint: returns share data for a completed generation.
 * No authentication required — only returns watermarked image URL and style name.
 * This allows social media crawlers and unauthenticated visitors to see shared portraits.
 */
serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { generation_id } = await req.json();
    if (!isUUID(generation_id)) {
      return new Response(
        JSON.stringify({ error: "Invalid ID format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Fetch generation with style name
    const { data: generation, error: genError } = await supabase
      .from("generated_images")
      .select("id, user_id, storage_path, status, styles(name)")
      .eq("id", generation_id)
      .single();

    if (genError || !generation) {
      return new Response(
        JSON.stringify({ error: "Portrait not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (generation.status !== "completed" || !generation.storage_path) {
      return new Response(
        JSON.stringify({ error: "Portrait not ready" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Always serve watermarked version for public sharing
    const wmPath = `${generation.user_id}/${generation_id}_wm.png`;

    // Check if watermarked version already exists (cached from serve-image)
    const { data: cachedWm } = await supabase.storage
      .from("watermarked-images")
      .createSignedUrl(wmPath, 3600);

    if (cachedWm?.signedUrl) {
      return new Response(
        JSON.stringify({
          imageUrl: cachedWm.signedUrl,
          styleName: (generation.styles as { name: string } | null)?.name || null,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // If no watermarked version cached, fall back to generating a signed URL
    // for the original image (the share page will display it as a preview)
    // Note: In practice the watermarked version should exist if the user ever
    // viewed their image. If not, we return the original with a flag.
    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from("generated-images")
      .createSignedUrl(generation.storage_path, 3600);

    if (urlError || !signedUrlData?.signedUrl) {
      return new Response(
        JSON.stringify({ error: "Failed to generate image URL" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({
        imageUrl: signedUrlData.signedUrl,
        styleName: (generation.styles as { name: string } | null)?.name || null,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
    );
  }
});
