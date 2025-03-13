import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function GET(request: Request) {
  try {
    // TODO: Get the actual customer ID from the authenticated user
    const customerId = 'cus_example'; // This should come from your user authentication

    // Fetch the customer's subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'all',
      expand: ['data.default_payment_method'],
    });

    if (!subscriptions.data.length) {
      return NextResponse.json({
        status: 'inactive',
        plan: 'No active subscription',
      });
    }

    const subscription = subscriptions.data[0];
    const paymentMethod = subscription.default_payment_method as Stripe.PaymentMethod;

    return NextResponse.json({
      status: subscription.status,
      plan: subscription.items.data[0].price.nickname || 'Unknown Plan',
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      paymentMethod: paymentMethod ? {
        brand: paymentMethod.card?.brand || 'unknown',
        last4: paymentMethod.card?.last4 || '****',
      } : undefined,
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription details' },
      { status: 500 }
    );
  }
} 