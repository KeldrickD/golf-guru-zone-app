import { NextRequest, NextResponse } from 'next/server';

// Mock data for different API endpoints
const mockData = {
  clubs: [
    { id: 1, name: 'Driver', type: 'Wood', loft: 10.5 },
    { id: 2, name: '3 Wood', type: 'Wood', loft: 15 },
    { id: 3, name: '5 Iron', type: 'Iron', loft: 27 },
    { id: 4, name: 'Pitching Wedge', type: 'Wedge', loft: 46 },
    { id: 5, name: 'Putter', type: 'Putter', loft: 3 },
  ],
  stats: {
    handicap: 12.4,
    roundsPlayed: 24,
    averageScore: 86.2,
    fairwaysHit: 62,
    greensInRegulation: 48,
    puttsPerRound: 32.1,
    drivingDistance: 245.8,
    scoringBreakdown: {
      eagles: 1,
      birdies: 32,
      pars: 156,
      bogeys: 198,
      doubleBogeys: 87,
      others: 34
    }
  },
  subscription: {
    status: 'active',
    plan: 'premium',
    nextBillingDate: '2023-12-01',
    features: ['unlimited_bets', 'advanced_analytics', 'no_transaction_fees']
  },
  bets: [
    {
      id: 'bet_1',
      type: 'Match Play',
      amount: '25',
      players: ['Player 1', 'Player 2'],
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      id: 'bet_2',
      type: 'Nassau',
      amount: '10',
      players: ['Player 1', 'Player 3', 'Player 4'],
      status: 'completed',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ]
};

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path || [];
  const endpoint = path[0];
  
  // Return appropriate mock data based on the endpoint
  if (endpoint && mockData[endpoint as keyof typeof mockData]) {
    return NextResponse.json(mockData[endpoint as keyof typeof mockData]);
  }
  
  // Default response if endpoint not found
  return NextResponse.json({ message: 'Mock API endpoint not found' }, { status: 404 });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path || [];
  const endpoint = path[0];
  
  // For POST requests, just return a success response
  return NextResponse.json({ 
    success: true, 
    message: `Mock ${endpoint} data created successfully` 
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path || [];
  const endpoint = path[0];
  
  // For PUT requests, just return a success response
  return NextResponse.json({ 
    success: true, 
    message: `Mock ${endpoint} data updated successfully` 
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path || [];
  const endpoint = path[0];
  
  // For DELETE requests, just return a success response
  return NextResponse.json({ 
    success: true, 
    message: `Mock ${endpoint} data deleted successfully` 
  });
} 