import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { stripe } from "@/lib/stripe";

const PRINT_PRICES: Record<string, number> = {
  "20x30": 29,
  "30x40": 49,
  "40x60": 89,
  "50x70": 149,
};

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("user_id");
    if (!userId) return NextResponse.json({ error: "user_id required" }, { status: 400 });

    const supabase = getServiceClient();
    const { data: orders } = await supabase
      .from("print_orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    return NextResponse.json({ orders: orders || [] });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user_id, portrait_id, size, shipping_address } = await request.json();

    if (!user_id || !portrait_id || !size || !shipping_address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const price = PRINT_PRICES[size];
    if (!price) {
      return NextResponse.json({ error: "Invalid print size" }, { status: 400 });
    }

    const supabase = getServiceClient();

    // Create print order record
    const { data: order, error } = await supabase
      .from("print_orders")
      .insert({ user_id, portrait_id, size, price_eur: price, shipping_address })
      .select()
      .single();

    if (error || !order) {
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    // Create Stripe checkout for the print
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `ArtlyPet Print - ${size} cm`,
              description: "Museum-quality archival print, shipped worldwide",
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.APP_URL}/dashboard?print_success=true`,
      cancel_url: `${process.env.APP_URL}/dashboard?print_cancelled=true`,
      metadata: {
        type: "print",
        order_id: order.id,
        user_id,
      },
    });

    return NextResponse.json({ checkout_url: session.url, order_id: order.id });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
