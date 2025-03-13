import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const DOMAIN = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const PLANS = {
  Pro: {
    monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID,
    trial_days: 7
  },
  Elite: {
    monthly: process.env.STRIPE_ELITE_MONTHLY_PRICE_ID,
    yearly: process.env.STRIPE_ELITE_YEARLY_PRICE_ID,
    trial_days: 7
  },
};

export async function POST(request: Request) {
  try {
    const { plan, interval } = await request.json();

    // Get the plan configuration
    const planConfig = PLANS[plan as keyof typeof PLANS];
    
    if (!planConfig) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    // Get the price ID for the selected plan and interval
    const priceId = planConfig[interval as 'monthly' | 'yearly'];

    if (!priceId) {
      return NextResponse.json(
        { error: 'Invalid interval selected' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session with trial period
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${DOMAIN}/dashboard?success=true`,
      cancel_url: `${DOMAIN}/pricing?canceled=true`,
      automatic_tax: { enabled: true },
      customer_email: 'auto', // Allows customer to enter email at checkout
      subscription_data: {
        trial_period_days: planConfig.trial_days,
      },
      allow_promotion_codes: true, // Enable promo codes for special discounts
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 