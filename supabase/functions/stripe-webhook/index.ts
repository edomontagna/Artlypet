import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2024-12-18.acacia" });
const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    return new Response(`Invalid signature: ${err.message}`, { status: 400 });
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

    if (!credits) {
      return new Response("Missing credits in metadata", { status: 400 });
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

    // Get current balance
    const { data: profile } = await supabase
      .from("profiles")
      .select("credit_balance")
      .eq("user_id", userId)
      .single();

    const currentBalance = profile?.credit_balance || 0;
    const newBalance = currentBalance + credits;

    // Update balance + plan if premium
    const updateData: Record<string, unknown> = {
      credit_balance: newBalance,
      updated_at: new Date().toISOString(),
    };

    if (planUpgrade === "premium") {
      updateData.plan_type = "premium";
      updateData.premium_purchased_at = new Date().toISOString();
    }

    await supabase
      .from("profiles")
      .update(updateData)
      .eq("user_id", userId);

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
