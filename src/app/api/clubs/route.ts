import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET /api/clubs - Retrieve user club distances
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get club distances
    const clubDistances = await prisma.clubDistance.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        avgDistance: 'desc',
      },
    });
    
    // If the user doesn't have club data yet, return a default set
    if (clubDistances.length === 0) {
      return NextResponse.json({ 
        clubDistances: [
          { club: 'Driver', avgDistance: 230, minDistance: 210, maxDistance: 250 },
          { club: '3-Wood', avgDistance: 210, minDistance: 195, maxDistance: 225 },
          { club: '5-Wood', avgDistance: 195, minDistance: 180, maxDistance: 210 },
          { club: '4-Iron', avgDistance: 180, minDistance: 170, maxDistance: 190 },
          { club: '5-Iron', avgDistance: 170, minDistance: 160, maxDistance: 180 },
          { club: '6-Iron', avgDistance: 160, minDistance: 150, maxDistance: 170 },
          { club: '7-Iron', avgDistance: 150, minDistance: 140, maxDistance: 160 },
          { club: '8-Iron', avgDistance: 140, minDistance: 130, maxDistance: 150 },
          { club: '9-Iron', avgDistance: 130, minDistance: 120, maxDistance: 140 },
          { club: 'PW', avgDistance: 120, minDistance: 110, maxDistance: 130 },
          { club: 'GW', avgDistance: 100, minDistance: 90, maxDistance: 110 },
          { club: 'SW', avgDistance: 80, minDistance: 70, maxDistance: 90 },
          { club: 'LW', avgDistance: 60, minDistance: 50, maxDistance: 70 },
        ],
        isDefault: true
      });
    }
    
    return NextResponse.json({ 
      clubDistances,
      isDefault: false
    });
  } catch (error) {
    console.error('Error in /api/clubs GET:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve club distances' },
      { status: 500 }
    );
  }
}

// PUT /api/clubs - Update a club distance
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    
    // Basic validation
    if (!data.club || !data.avgDistance) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Update or create club distance
    const clubDistance = await prisma.clubDistance.upsert({
      where: {
        userId_club: {
          userId: session.user.id,
          club: data.club,
        },
      },
      update: {
        avgDistance: data.avgDistance,
        minDistance: data.minDistance || undefined,
        maxDistance: data.maxDistance || undefined,
        shotCount: {
          increment: 1,
        },
      },
      create: {
        userId: session.user.id,
        club: data.club,
        avgDistance: data.avgDistance,
        minDistance: data.minDistance || null,
        maxDistance: data.maxDistance || null,
        shotCount: 1,
      },
    });
    
    return NextResponse.json({ clubDistance });
  } catch (error) {
    console.error('Error in /api/clubs PUT:', error);
    return NextResponse.json(
      { error: 'Failed to update club distance' },
      { status: 500 }
    );
  }
} 