import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { REFERRAL_CREDITS_REWARD } from '@/config/pricing';

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = createAdminClient();
    const { code, email } = await request.json();

    if (!code || !email) {
      return NextResponse.json({ error: 'Missing code or email' }, { status: 400 });
    }

    // Find referrer by code
    const { data: referrer } = await supabaseAdmin
      .from('profiles')
      .select('id, credits, total_referrals')
      .eq('referral_code', code)
      .single();

    if (!referrer) {
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 });
    }

    // Check if this email was already referred
    const { data: existingReferral } = await supabaseAdmin
      .from('referrals')
      .select('id')
      .eq('referred_email', email)
      .single();

    if (existingReferral) {
      return NextResponse.json({ error: 'Already referred' }, { status: 409 });
    }

    // Record referral
    await supabaseAdmin.from('referrals').insert({
      referrer_id: referrer.id,
      referred_email: email,
      status: 'pending',
    });

    // Award credits to referrer
    await supabaseAdmin
      .from('profiles')
      .update({
        credits: referrer.credits + REFERRAL_CREDITS_REWARD,
        total_referrals: referrer.total_referrals + 1,
      })
      .eq('id', referrer.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Referral error:', error);
    return NextResponse.json({ error: 'Failed to process referral' }, { status: 500 });
  }
}
