import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '../auth/[...nextauth]/route';

// GET /api/rounds - Retrieve user rounds
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const rounds = await prisma.round.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        date: 'desc',
      },
    });
    
    return NextResponse.json(rounds);
  } catch (error) {
    console.error('Error fetching rounds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rounds' },
      { status: 500 }
    );
  }
}

// POST /api/rounds - Create a new round
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const {
      course,
      date,
      totalScore,
      putts,
      fairwaysHit,
      totalFairways,
      greensInRegulation,
      totalGreens,
      notes,
    } = body;
    
    const round = await prisma.round.create({
      data: {
        course,
        date: new Date(date),
        totalScore: parseInt(totalScore),
        putts: putts ? parseInt(putts) : null,
        fairwaysHit: fairwaysHit ? parseInt(fairwaysHit) : null,
        totalFairways: totalFairways ? parseInt(totalFairways) : null,
        greensInRegulation: greensInRegulation ? parseInt(greensInRegulation) : null,
        totalGreens: totalGreens ? parseInt(totalGreens) : null,
        notes,
        userId: session.user.id,
      },
    });
    
    return NextResponse.json(round);
  } catch (error) {
    console.error('Error creating round:', error);
    return NextResponse.json(
      { error: 'Failed to create round' },
      { status: 500 }
    );
  }
} 