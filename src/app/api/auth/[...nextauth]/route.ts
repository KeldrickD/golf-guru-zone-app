import { NextResponse } from 'next/server';

// Mock user data for authentication
const mockUser = {
  id: '1',
  name: 'Demo User',
  email: 'demo@example.com',
  image: 'https://via.placeholder.com/150',
  subscription: {
    status: 'active',
    plan: 'premium',
    nextBillingDate: '2023-12-01',
  }
};

// Simple session response
export async function GET() {
  return NextResponse.json({
    user: mockUser,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 1 week
  });
}

// Simple sign-in response
export async function POST(request: Request) {
  const body = await request.json();
  
  // Very simple mock authentication
  if (body.email === 'demo@example.com' && body.password === 'password') {
    return NextResponse.json({
      user: mockUser,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 1 week
    });
  }
  
  // Default to a successful mock response for demo purposes
  return NextResponse.json({
    user: mockUser,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 1 week
  });
} 