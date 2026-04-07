import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14?target=deno";

const REQUIRED_ENV_VARS = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"];
const missingEnvVars = REQUIRED_ENV_VARS.filter((v) => !Deno.env.get(v));
if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
}

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2024-12-18.acacia" });
const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

serve(async (req) => {
  if (missingEnvVars.length > 0) {
    return new Response(JSON.stringify({ error: "Server configuration error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    console.error("Stripe webhook: missing signature header");
    return new Response("Missing signature", { status: 200 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    console.error("Stripe webhook: invalid signature:", err.message);
    return new Response("Invalid signature", { status: 200 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;

    if (!userId) {
      return new Response("Missing user_id in metadata", { status: 400 });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const purchaseType = session.metadata?.purchase_type || session.metadata?.order_type || "credit";

    // === HD IMAGE UNLOCK ===
    if (purchaseType === "hd_image") {
      const generationId = session.metadata?.generation_id;
      if (!generationId) return new Response("Missing generation_id", { status: 400 });

      // Idempotency: check if already unlocked with this session
      const { data: existing } = await supabase
        .from("generated_images")
        .select("id, hd_stripe_session_id")
        .eq("id", generationId)
        .single();

      if (existing?.hd_stripe_session_id === session.id) {
        return new Response(JSON.stringify({ received: true, note: "already processed" }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      // Unlock HD
      await supabase
        .from("generated_images")
        .update({ is_hd_unlocked: true, hd_stripe_session_id: session.id })
        .eq("id", generationId)
        .eq("user_id", userId);

      // Delete cached watermarked version
      const wmPath = `${userId}/${generationId}_wm.jpg`;
      await supabase.storage.from("watermarked-images").remove([wmPath]);

      await supabase.from("audit_log").insert({
        user_id: userId,
        event_type: "hd_unlock_purchased",
        metadata: { generation_id: generationId, stripe_session_id: session.id },
      });

      return new Response(JSON.stringify({ received: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // === PRINT ORDER ===
    if (purchaseType === "print") {
      await supabase
        .from("print_orders")
        .update({ status: "paid", updated_at: new Date().toISOString() })
        .eq("stripe_session_id", session.id);

      await supabase.from("audit_log").insert({
        user_id: userId,
        event_type: "print_order_paid",
        metadata: { stripe_session_id: session.id },
      });

      return new Response(JSON.stringify({ received: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // === PREMIUM / CREDIT PURCHASE ===
    const credits = parseInt(session.metadata?.credits || "0", 10);
    const packageId = session.metadata?.package_id;
    const planUpgrade = session.metadata?.plan_upgrade;

    if (!credits || isNaN(credits) || credits <= 0 || credits > 10000) {
      return new Response("Invalid credits amount", { status: 400 });
    }

    // Idempotency: check if this session was already processed
    const { data: existingTx } = await supabase
      .from("credit_transactions")
      .select("id")
      .eq("stripe_session_id", session.id)
      .single();

    if (existingTx) {
      return new Response(JSON.stringify({ received: true, note: "already processed" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Atomic credit addition — prevents race conditions
    const { data: newBalance, error: addError } = await supabase.rpc("add_credits", {
      p_user_id: userId,
      p_amount: credits,
      p_plan_upgrade: planUpgrade || null,
    });

    if (addError || newBalance === -1) {
      return new Response("Failed to add credits", { status: 500 });
    }

    // Insert transaction record
    await supabase.from("credit_transactions").insert({
      user_id: userId,
      type: "purchase",
      amount: credits,
      balance_after: newBalance,
      stripe_session_id: session.id,
      idempotency_key: `stripe-${session.id}`,
      description: `Purchased ${credits} credits (${packageId})`,
    });

    // Audit log
    const eventType = planUpgrade === "premium" ? "premium_purchased" : "credit_purchase";
    await supabase.from("audit_log").insert({
      user_id: userId,
      event_type: eventType,
      metadata: { package_id: packageId, credits, stripe_session_id: session.id, plan_upgrade: planUpgrade },
    });
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
