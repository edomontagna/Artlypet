import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2024-12-18.acacia" });

const PRINT_PRICE_FREE = 7990;    // €79.90
const PRINT_PRICE_PREMIUM = 5990; // €59.90

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUUID = (v: unknown): v is string => typeof v === "string" && UUID_RE.test(v);

const REQUIRED_ENV_VARS = ["SUPABASE_URL", "SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY", "STRIPE_SECRET_KEY", "ALLOWED_ORIGIN"];
const missingEnvVars = REQUIRED_ENV_VARS.filter((v) => !Deno.env.get(v));
if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
}

// --- Rate limiting (database-backed) ---
const checkRateLimit = async (
  supabase: ReturnType<typeof createClient>,
  userId: string,
  endpoint: string,
  maxRequests = 5,
  windowSeconds = 60,
): Promise<{ allowed: boolean }> => {
  const { data, error } = await supabase.rpc("check_rate_limit", {
    p_user_id: userId,
    p_endpoint: endpoint,
    p_max_requests: maxRequests,
    p_window_seconds: windowSeconds,
  });
  if (error) {
    console.error("Rate limit check failed:", error);
    return { allowed: true };
  }
  return { allowed: data as boolean };
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
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } });

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

    const { generated_image_id } = await req.json();
    if (!isUUID(generated_image_id)) return new Response(JSON.stringify({ error: "Invalid ID format" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const serviceSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Rate limit check
    const rateCheck = await checkRateLimit(serviceSupabase, user.id, "create-print-order");
    if (!rateCheck.allowed) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please wait a moment before trying again." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": "60" } },
      );
    }

    // Verify image belongs to user, is completed, and check HD status
    const { data: image, error: imageError } = await serviceSupabase
      .from("generated_images")
      .select("id, status, is_hd_unlocked")
      .eq("id", generated_image_id)
      .eq("user_id", user.id)
      .eq("status", "completed")
      .single();

    if (imageError || !image) {
      return new Response(JSON.stringify({ error: "Image not found or not completed" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Get user plan type
    const { data: profile } = await serviceSupabase
      .from("profiles")
      .select("plan_type")
      .eq("user_id", user.id)
      .single();

    const isPremium = profile?.plan_type === "premium" || profile?.plan_type === "business";

    // Free users must have HD unlocked to print
    if (!isPremium && !image.is_hd_unlocked) {
      return new Response(JSON.stringify({ error: "HD unlock required for printing. Unlock this image or upgrade to Premium." }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const priceCents = isPremium ? PRINT_PRICE_PREMIUM : PRINT_PRICE_FREE;
    const priceLabel = isPremium ? "€59.90" : "€79.90";

    // Check for existing pending order to prevent duplicates
    const { data: existingOrder } = await serviceSupabase
      .from("print_orders")
      .select("id, stripe_session_id")
      .eq("user_id", user.id)
      .eq("generated_image_id", generated_image_id)
      .eq("status", "pending")
      .single();

    if (existingOrder) {
      // Return existing session URL instead of creating a new one
      const existingSession = await stripe.checkout.sessions.retrieve(existingOrder.stripe_session_id);
      if (existingSession.url && existingSession.status === "open") {
        return new Response(
          JSON.stringify({ url: existingSession.url }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      // Session expired — clean up old order and create new one
      await serviceSupabase.from("print_orders").delete().eq("id", existingOrder.id);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: { name: `Artlypet Canvas Print — Museum Quality (${priceLabel})` },
          unit_amount: priceCents,
        },
        quantity: 1,
      }],
      mode: "payment",
      shipping_address_collection: { allowed_countries: ["AT", "BE", "DE", "DK", "ES", "FI", "FR", "IE", "IT", "LU", "NL", "PT", "SE"] },
      success_url: `${req.headers.get("origin")}/dashboard?print=success`,
      cancel_url: `${req.headers.get("origin")}/dashboard?print=cancelled`,
      metadata: {
        user_id: user.id,
        generated_image_id,
        order_type: "print",
      },
    });

    await serviceSupabase.from("print_orders").insert({
      user_id: user.id,
      generated_image_id,
      status: "pending",
      price_cents: priceCents,
      currency: "eur",
      stripe_session_id: session.id,
    });

    await serviceSupabase.from("audit_log").insert({
      user_id: user.id,
      event_type: "print_order_created",
      metadata: { generated_image_id, stripe_session_id: session.id, price_cents: priceCents },
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
    );
  }
});
