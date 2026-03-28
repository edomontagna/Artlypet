import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Image } from "https://deno.land/x/imagescript@1.4.0/mod.ts";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUUID = (v: unknown): v is string => typeof v === "string" && UUID_RE.test(v);

const REQUIRED_ENV_VARS = ["SUPABASE_URL", "SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY", "ALLOWED_ORIGIN"];
const missingEnvVars = REQUIRED_ENV_VARS.filter((v) => !Deno.env.get(v));
if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
}

const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGIN") || "http://localhost:8080").split(",").map(o => o.trim()).filter(Boolean);

const getCorsHeaders = (req: Request) => {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
};

const WATERMARK_SIZE = 768;
const WATERMARK_TEXT = "ARTLYPET PREVIEW";

// Google Fonts URL for Inter Bold — use CDN mirror for reliability on Deno Deploy
const FONT_URLS = [
  "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.ttf",
  "https://github.com/google/fonts/raw/main/ofl/inter/Inter%5Bopsz%2Cwght%5D.ttf",
];

// Cache the font in memory so we only fetch it once per cold start
let _fontCache: Uint8Array | null = null;
const getFont = async (): Promise<Uint8Array> => {
  if (_fontCache) return _fontCache;
  for (const url of FONT_URLS) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        _fontCache = new Uint8Array(await res.arrayBuffer());
        return _fontCache;
      }
    } catch {
      // Try next URL
    }
  }
  throw new Error("Failed to fetch font from all sources");
};

/**
 * Apply a tiled diagonal watermark across the entire image.
 * The watermark is semi-transparent white text with a dark shadow,
 * repeated in a grid so it cannot be cropped out.
 *
 * Uses ImageScript (https://deno.land/x/imagescript) which is a
 * zero-dependency Deno image manipulation library.
 */
const applyWatermark = async (imageBytes: Uint8Array): Promise<Uint8Array> => {
  const img = await Image.decode(imageBytes);
  const font = await getFont();

  // Scale font size relative to image dimensions (roughly 3-4% of the larger dimension)
  const fontSize = Math.max(24, Math.round(Math.max(img.width, img.height) * 0.035));

  // Render shadow text (dark, offset) — renderText is async, must be awaited
  const shadowText = await Image.renderText(
    font,
    fontSize,
    WATERMARK_TEXT,
    0x00000066, // black at ~40% opacity
  );

  // Render main text (white, semi-transparent)
  const mainText = await Image.renderText(
    font,
    fontSize,
    WATERMARK_TEXT,
    0xFFFFFF4D, // white at ~30% opacity
  );

  // Create a single watermark tile: shadow + main text
  const tileWidth = mainText.width + 4;
  const tileHeight = mainText.height + 4;
  const tile = new Image(tileWidth, tileHeight);
  tile.composite(shadowText, 3, 3); // shadow offset by 3px
  tile.composite(mainText, 0, 0);

  // Rotate the tile diagonally (-30 degrees)
  // resize=true so the canvas expands to fit the rotated content without clipping
  const rotatedTile = tile.rotate(-30, true);

  // Tile spacing: leave gaps between repetitions
  const spacingX = rotatedTile.width + Math.round(img.width * 0.08);
  const spacingY = rotatedTile.height + Math.round(img.height * 0.10);

  // Overlay the watermark in a tiled grid across the full image
  // Start from negative offsets to cover edges after rotation
  const startX = -rotatedTile.width;
  const startY = -rotatedTile.height;

  for (let y = startY; y < img.height + rotatedTile.height; y += spacingY) {
    for (let x = startX; x < img.width + rotatedTile.width; x += spacingX) {
      img.composite(rotatedTile, x, y);
    }
  }

  // Encode as PNG (compression level 1 = fast, reasonable size)
  return await img.encode(1);
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

    const { generation_id } = await req.json();
    if (!isUUID(generation_id)) return new Response(JSON.stringify({ error: "Invalid ID format" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

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

    // FREE: check cache first (use .png extension to match actual content type)
    const wmPath = `${user.id}/${generation_id}_wm.png`;
    const { data: cachedWm } = await supabase.storage
      .from("watermarked-images")
      .createSignedUrl(wmPath, 3600);

    if (cachedWm?.signedUrl) {
      return new Response(
        JSON.stringify({ mode: "watermarked", url: cachedWm.signedUrl }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // FREE: generate watermarked version with real image-level watermark
    const { data: imageBlob } = await supabase.storage
      .from("generated-images")
      .download(generation.storage_path);

    if (!imageBlob) throw new Error("Failed to download image");

    const arrayBuffer = await imageBlob.arrayBuffer();
    const originalBytes = new Uint8Array(arrayBuffer);

    // Apply tiled diagonal watermark burned into the image pixels
    const watermarkedBytes = await applyWatermark(originalBytes);

    await supabase.storage
      .from("watermarked-images")
      .upload(wmPath, watermarkedBytes, {
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
      { status: 500, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
    );
  }
});
