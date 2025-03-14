import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// Mock clubs data
const mockClubs = [
  {
    id: 1,
    name: 'Driver',
    brand: 'TaylorMade',
    model: 'Stealth Plus',
    type: 'Driver',
    loft: 10.5,
    flex: 'Stiff',
    shaft: 'Mitsubishi Tensei 1K White 65',
    yearReleased: 2022,
    condition: 'Excellent',
    notes: 'Primary driver for distance shots',
    inBag: true,
    userId: '1'
  },
  {
    id: 2,
    name: '3-Wood',
    brand: 'Callaway',
    model: 'Rogue ST Max',
    type: 'Fairway Wood',
    loft: 15,
    flex: 'Stiff',
    shaft: 'Project X HZRDUS Smoke',
    yearReleased: 2022,
    condition: 'Good',
    notes: 'Great for long fairway shots',
    inBag: true,
    userId: '1'
  },
  {
    id: 3,
    name: '5-Iron',
    brand: 'Mizuno',
    model: 'JPX 921 Forged',
    type: 'Iron',
    loft: 24,
    flex: 'Stiff',
    shaft: 'True Temper Dynamic Gold 120',
    yearReleased: 2021,
    condition: 'Very Good',
    notes: 'Consistent and forgiving',
    inBag: true,
    userId: '1'
  },
  {
    id: 4,
    name: 'Pitching Wedge',
    brand: 'Cleveland',
    model: 'RTX ZipCore',
    type: 'Wedge',
    loft: 46,
    flex: 'Stiff',
    shaft: 'True Temper Dynamic Gold',
    yearReleased: 2021,
    condition: 'Excellent',
    notes: 'Great spin control',
    inBag: true,
    userId: '1'
  },
  {
    id: 5,
    name: 'Putter',
    brand: 'Odyssey',
    model: 'White Hot OG #1',
    type: 'Putter',
    loft: 3,
    flex: 'N/A',
    shaft: 'Steel',
    yearReleased: 2021,
    condition: 'Excellent',
    notes: 'Consistent roll and feel',
    inBag: true,
    userId: '1'
  }
];

// GET /api/clubs - Retrieve user club data
export async function GET() {
  return NextResponse.json(mockClubs);
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

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Simulate creating a new club
    const newClub = {
      id: mockClubs.length + 1,
      ...data,
      userId: '1'
    };
    
    return NextResponse.json(newClub, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create club' },
      { status: 500 }
    );
  }
} 