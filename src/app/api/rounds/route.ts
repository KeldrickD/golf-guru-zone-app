import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET /api/rounds - Retrieve user rounds
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse query parameters
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const courseId = url.searchParams.get('courseId');
    
    // Build query
    const query: any = {
      where: {
        userId: session.user.id,
        ...(courseId ? { courseId } : {}),
      },
      orderBy: {
        date: 'desc',
      },
      take: limit,
      skip: offset,
      include: {
        course: {
          select: {
            name: true,
            location: true,
          },
        },
      },
    };
    
    // Get rounds
    const rounds = await prisma.round.findMany(query);
    const total = await prisma.round.count({ where: query.where });
    
    return NextResponse.json({ 
      rounds, 
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      } 
    });
  } catch (error) {
    console.error('Error in /api/rounds GET:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve rounds' },
      { status: 500 }
    );
  }
}

// POST /api/rounds - Create a new round
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    
    // Basic validation
    if (!data.date || !data.totalScore) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create round
    const round = await prisma.round.create({
      data: {
        date: new Date(data.date),
        totalScore: data.totalScore,
        putts: data.putts,
        fairwaysHit: data.fairwaysHit,
        totalFairways: data.totalFairways,
        greensInRegulation: data.greensInRegulation,
        totalGreens: data.totalGreens,
        courseId: data.courseId,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
    
    return NextResponse.json({ round });
  } catch (error) {
    console.error('Error in /api/rounds POST:', error);
    return NextResponse.json(
      { error: 'Failed to create round' },
      { status: 500 }
    );
  }
} 