import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("user_id");
    if (!userId) return NextResponse.json({ error: "user_id required" }, { status: 400 });

    const supabase = getServiceClient();

    const { data: user } = await supabase
      .from("users")
      .select("referral_code, referral_credits_earned")
      .eq("id", userId)
      .single();

    const { count: totalReferrals } = await supabase
      .from("referrals")
      .select("*", { count: "exact", head: true })
      .eq("referrer_id", userId);

    const { count: converted } = await supabase
      .from("referrals")
      .select("*", { count: "exact", head: true })
      .eq("referrer_id", userId)
      .eq("status", "converted");

    return NextResponse.json({
      referral_code: user?.referral_code,
      total_referrals: totalReferrals || 0,
      converted: converted || 0,
      credits_earned: user?.referral_credits_earned || 0,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { referral_code, referred_user_id } = await request.json();
    if (!referral_code || !referred_user_id) {
      return NextResponse.json({ error: "referral_code and referred_user_id required" }, { status: 400 });
    }

    const supabase = getServiceClient();

    // Find referrer
    const { data: referrer } = await supabase
      .from("users")
      .select("id")
      .eq("referral_code", referral_code)
      .single();

    if (!referrer) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });
    }

    if (referrer.id === referred_user_id) {
      return NextResponse.json({ error: "Cannot refer yourself" }, { status: 400 });
    }

    // Check if already referred
    const { data: existing } = await supabase
      .from("referrals")
      .select("id")
      .eq("referred_id", referred_user_id)
      .single();

    if (existing) {
      return NextResponse.json({ error: "User already referred" }, { status: 409 });
    }

    // Create referral
    await supabase.from("referrals").insert({
      referrer_id: referrer.id,
      referred_id: referred_user_id,
      status: "signed_up",
    });

    // Give bonus credit to referred user
    await supabase.rpc("increment_credits", { uid: referred_user_id, amount: 1 });

    // Update referred_by on user
    await supabase.from("users").update({ referred_by: referrer.id }).eq("id", referred_user_id);

    return NextResponse.json({ success: true, message: "Referral linked, +1 bonus credit" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
