import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user with their Stripe customer ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { subscription: true },
    });

    if (!user?.stripeCustomerId) {
      return NextResponse.json({
        status: 'inactive',
        plan: 'No active subscription',
      });
    }

    // Fetch the customer's subscriptions from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
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

    // Update subscription in database if needed
    if (user.subscription?.stripeSubscriptionId !== subscription.id ||
        user.subscription?.status !== subscription.status) {
      await prisma.subscription.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          stripeCustomerId: user.stripeCustomerId,
          status: subscription.status,
          plan: subscription.items.data[0].price.nickname || 'Unknown Plan',
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        },
        update: {
          status: subscription.status,
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        },
      });
    }

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