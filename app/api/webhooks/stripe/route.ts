import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { getServiceClient } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = getServiceClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata || {};

    if (metadata.type === "credits") {
      // Credit pack purchase
      const userId = metadata.user_id;
      const plan = metadata.plan as "creator" | "pro";
      const credits = parseInt(metadata.credits || "0", 10);
      const resolution = metadata.resolution || "hd";
      const couponCode = metadata.coupon_code;

      if (userId && credits > 0) {
        // Update user credits and subscription
        const { data: user } = await supabase
          .from("users")
          .select("credits")
          .eq("id", userId)
          .single();

        const currentCredits = user?.credits || 0;

        await supabase
          .from("users")
          .update({
            credits: currentCredits + credits,
            subscription: plan,
            resolution_max: resolution,
          })
          .eq("id", userId);

        // Create transaction record
        await supabase.from("transactions").insert({
          user_id: userId,
          stripe_session_id: session.id,
          type: "credits",
          amount_eur: (session.amount_total || 0) / 100,
          credits_added: credits,
          coupon_code: couponCode || null,
        });

        // If coupon used, increment used_count
        if (couponCode) {
          const { data: discount } = await supabase
            .from("discount_codes")
            .select("used_count")
            .eq("code", couponCode)
            .single();

          if (discount) {
            await supabase
              .from("discount_codes")
              .update({ used_count: (discount.used_count || 0) + 1 })
              .eq("code", couponCode);
          }
        }

        // Check if user was referred — award referrer credit on first purchase
        const { data: referral } = await supabase
          .from("referrals")
          .select("*")
          .eq("referred_id", userId)
          .eq("credits_awarded", false)
          .single();

        if (referral) {
          // Give referrer a bonus credit
          const { data: referrer } = await supabase
            .from("users")
            .select("credits, referral_credits_earned")
            .eq("id", referral.referrer_id)
            .single();

          if (referrer) {
            await supabase
              .from("users")
              .update({
                credits: (referrer.credits || 0) + 1,
                referral_credits_earned: (referrer.referral_credits_earned || 0) + 1,
              })
              .eq("id", referral.referrer_id);
          }

          await supabase
            .from("referrals")
            .update({ status: "converted", credits_awarded: true })
            .eq("id", referral.id);
        }
      }
    } else if (metadata.type === "print") {
      // Print order payment
      const orderId = metadata.order_id;
      if (orderId) {
        await supabase
          .from("print_orders")
          .update({ status: "processing" })
          .eq("id", orderId);

        // TODO: Trigger print-on-demand fulfillment via Gelato/Printful API
      }
    }
  }

  return NextResponse.json({ received: true });
}

export const dynamic = "force-dynamic";
