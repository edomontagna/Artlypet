import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    if (!code) return NextResponse.json({ error: "Code required" }, { status: 400 });

    const supabase = getServiceClient();

    const { data: discountData } = await supabase
      .from("discount_codes")
      .select("*")
      .eq("code", code.toUpperCase())
      .single();

    const discount = discountData as Record<string, unknown> | null;

    if (!discount) {
      return NextResponse.json({ valid: false, message: "Invalid discount code" });
    }

    const now = new Date();
    if (discount.valid_until && new Date(discount.valid_until as string) < now) {
      return NextResponse.json({ valid: false, message: "This code has expired" });
    }
    if (new Date(discount.valid_from as string) > now) {
      return NextResponse.json({ valid: false, message: "This code is not yet active" });
    }
    if (discount.max_uses && (discount.used_count as number) >= (discount.max_uses as number)) {
      return NextResponse.json({ valid: false, message: "This code has reached its usage limit" });
    }

    return NextResponse.json({
      valid: true,
      type: discount.type,
      value: discount.value,
      message: (discount.type as string) === "percentage"
        ? `${discount.value}% off applied!`
        : `€${discount.value} off applied!`,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
