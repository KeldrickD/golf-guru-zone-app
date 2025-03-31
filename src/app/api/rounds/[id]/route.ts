import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET /api/rounds/[id] - Get a single round
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const round = await prisma.round.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });
    
    if (!round) {
      return NextResponse.json(
        { error: 'Round not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(round);
  } catch (error) {
    console.error('Error fetching round:', error);
    return NextResponse.json(
      { error: 'Failed to fetch round' },
      { status: 500 }
    );
  }
}

// PUT /api/rounds/[id] - Update a round
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    
    const round = await prisma.round.update({
      where: {
        id: params.id,
        userId: session.user.id,
      },
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
      },
    });
    
    return NextResponse.json(round);
  } catch (error) {
    console.error('Error updating round:', error);
    return NextResponse.json(
      { error: 'Failed to update round' },
      { status: 500 }
    );
  }
}

// DELETE /api/rounds/[id] - Delete a round
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await prisma.round.delete({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting round:', error);
    return NextResponse.json(
      { error: 'Failed to delete round' },
      { status: 500 }
    );
  }
} 