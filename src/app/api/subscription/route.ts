import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

// Mock subscription data
const mockSubscription = {
  id: '123',
  userId: '1',
  status: 'active',
  plan: 'premium',
  nextBillingDate: '2023-12-01',
  features: ['unlimited_bets', 'advanced_analytics', 'no_transaction_fees']
};

// GET endpoint to fetch current user's subscription
export async function GET(request: NextRequest) {
  try {
    // Get the session
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // In a real app, we would fetch from the database
    // For now, just return mock data
    return NextResponse.json(mockSubscription);
    
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}

// POST endpoint to create a checkout session for subscription
export async function POST(request: NextRequest) {
  try {
    // Get the session
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const { plan } = await request.json();
    
    if (!plan) {
      return NextResponse.json(
        { error: "Missing plan" },
        { status: 400 }
      );
    }
    
    // In a real app, we would create a checkout session with Stripe
    // For now, just return a mock URL
    return NextResponse.json({
      url: `https://example.com/checkout?plan=${plan}&user=${session.user.id}`
    });
    
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
} 