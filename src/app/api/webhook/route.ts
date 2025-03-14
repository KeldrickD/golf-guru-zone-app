import { NextResponse } from 'next/server';

// Mock webhook handler
export async function POST(request: Request) {
  try {
    // Instead of verifying the signature, just log the event
    console.log('Webhook received');

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
} 