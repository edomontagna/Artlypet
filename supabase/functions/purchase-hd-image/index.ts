import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2024-12-18.acacia" });

const HD_UNLOCK_PRICE_CENTS = 490; // €4.90

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUUID = (v: unknown): v is string => typeof v === "string" && UUID_RE.test(v);

const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGIN") || "http://localhost:8080").split(",");

const getCorsHeaders = (req: Request) => {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
};

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
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
    if (!isUUID(generation_id)) return new Response(JSON.stringify({ error: "Invalid ID format" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Verify image belongs to user, is completed, and NOT already unlocked
    const { data: image, error: imageError } = await supabase
      .from("generated_images")
      .select("id, status, is_hd_unlocked")
      .eq("id", generation_id)
      .eq("user_id", user.id)
      .eq("status", "completed")
      .single();

    if (imageError || !image) {
      return new Response(JSON.stringify({ error: "Image not found or not completed" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (image.is_hd_unlocked) {
      return new Response(JSON.stringify({ error: "Image already unlocked in HD" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Check if user is already premium (no need to purchase)
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan_type")
      .eq("user_id", user.id)
      .single();

    if (profile?.plan_type === "premium" || profile?.plan_type === "business") {
      return new Response(JSON.stringify({ error: "Premium users already have HD access" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: { name: "HD Unlock — Artlypet Portrait" },
          unit_amount: HD_UNLOCK_PRICE_CENTS,
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/dashboard?hd_unlock=success`,
      cancel_url: `${req.headers.get("origin")}/dashboard?hd_unlock=cancelled`,
      metadata: {
        user_id: user.id,
        generation_id,
        purchase_type: "hd_image",
      },
      idempotency_key: `hd-${user.id}-${generation_id}-${Date.now()}`,
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
