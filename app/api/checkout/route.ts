import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getServiceClient } from "@/lib/supabase";

const PLANS: Record<string, { name: string; credits: number; price: number; resolution: string }> = {
  creator: { name: "Creator Pack - 15 Credits", credits: 15, price: 1900, resolution: "hd" },
  pro: { name: "Pro Pack - 40 Credits + 4K", credits: 40, price: 3900, resolution: "4k" },
};

export async function POST(request: NextRequest) {
  try {
    const { plan, user_id, email, coupon_code } = await request.json();

    if (!plan || !PLANS[plan]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    if (!user_id || !email) {
      return NextResponse.json({ error: "user_id and email are required" }, { status: 400 });
    }

    const selectedPlan = PLANS[plan];

    // Validate coupon if provided
    let discounts: Array<{ coupon: string }> = [];
    if (coupon_code) {
      const supabase = getServiceClient();
      const { data: discountData } = await supabase
        .from("discount_codes")
        .select("*")
        .eq("code", coupon_code.toUpperCase())
        .single();

      const discount = discountData as Record<string, unknown> | null;

      if (discount) {
        const now = new Date();
        const isValid =
          (!discount.valid_until || new Date(discount.valid_until as string) > now) &&
          new Date(discount.valid_from as string) <= now &&
          (!discount.max_uses || (discount.used_count as number) < (discount.max_uses as number));

        if (isValid) {
          // Create a Stripe coupon on the fly
          const stripeCoupon = await stripe.coupons.create(
            (discount.type as string) === "percentage"
              ? { percent_off: Number(discount.value), duration: "once" as const }
              : { amount_off: Number(discount.value) * 100, currency: "eur", duration: "once" as const }
          );
          discounts = [{ coupon: stripeCoupon.id }];
        }
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: selectedPlan.name,
              description: `${selectedPlan.credits} credits${plan === "pro" ? " + 4K Ultra HD + 1 free print" : ""}`,
            },
            unit_amount: selectedPlan.price,
          },
          quantity: 1,
        },
      ],
      ...(discounts.length > 0 ? { discounts } : {}),
      customer_email: email,
      success_url: `${process.env.APP_URL || process.env.NEXTAUTH_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL || process.env.NEXTAUTH_URL}/pricing`,
      metadata: {
        type: "credits",
        user_id,
        plan,
        credits: String(selectedPlan.credits),
        resolution: selectedPlan.resolution,
        coupon_code: coupon_code || "",
      },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
