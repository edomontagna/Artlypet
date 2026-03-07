import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import { PRICING_PLANS } from '@/config/pricing';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const supabaseAdmin = createAdminClient();
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      const planId = session.metadata?.plan_id;

      if (userId && planId) {
        const plan = PRICING_PLANS.find((p) => p.id === planId);
        if (plan) {
          await supabaseAdmin
            .from('profiles')
            .update({
              subscription_tier: plan.tier,
              subscription_status: 'active',
              credits: plan.credits,
              stripe_customer_id: session.customer as string,
            })
            .eq('id', userId);
        }
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single();

      if (profile) {
        await supabaseAdmin
          .from('profiles')
          .update({
            subscription_status: subscription.status === 'active' ? 'active' : 'past_due',
          })
          .eq('id', profile.id);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single();

      if (profile) {
        await supabaseAdmin
          .from('profiles')
          .update({
            subscription_tier: 'free',
            subscription_status: 'canceled',
            credits: 3, // Reset to free plan credits
          })
          .eq('id', profile.id);
      }
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      // Monthly credit refresh on successful payment
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id, subscription_tier')
        .eq('stripe_customer_id', customerId)
        .single();

      if (profile) {
        const plan = PRICING_PLANS.find((p) => p.tier === profile.subscription_tier);
        if (plan) {
          await supabaseAdmin
            .from('profiles')
            .update({ credits: plan.credits })
            .eq('id', profile.id);
        }
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
