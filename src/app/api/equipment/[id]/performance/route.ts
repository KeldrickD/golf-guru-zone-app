import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';

interface Shot {
  distance: number | null;
  result: string | null;
}

interface Round {
  date: Date;
  shots: Shot[];
}

interface Equipment {
  id: string;
  type: string;
  brand: string;
  model: string;
  createdAt: Date;
  rounds: Round[];
  user: {
    email: string;
  };
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const equipment = await prisma.equipment.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        rounds: {
          include: {
            shots: true,
          },
        },
      },
    }) as Equipment | null;

    if (!equipment) {
      return NextResponse.json({ error: 'Equipment not found' }, { status: 404 });
    }

    if (equipment.user.email !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Calculate performance metrics
    const totalRounds = equipment.rounds.length;
    const totalShots = equipment.rounds.reduce((acc: number, round: Round) => acc + round.shots.length, 0);
    const totalDistance = equipment.rounds.reduce((acc: number, round: Round) => {
      return acc + round.shots.reduce((shotAcc: number, shot: Shot) => shotAcc + (shot.distance || 0), 0);
    }, 0);
    const averageDistance = totalRounds > 0 ? totalDistance / totalShots : 0;

    // Calculate accuracy based on shot results
    const accurateShots = equipment.rounds.reduce((acc: number, round: Round) => {
      return acc + round.shots.filter((shot: Shot) => shot.result === 'fairway' || shot.result === 'green').length;
    }, 0);
    const accuracy = totalShots > 0 ? (accurateShots / totalShots) * 100 : 0;

    // Calculate consistency (standard deviation of distances)
    const distances = equipment.rounds.flatMap((round: Round) =>
      round.shots.map((shot: Shot) => shot.distance || 0)
    );
    const avgDistance = distances.reduce((a: number, b: number) => a + b, 0) / distances.length;
    const variance = distances.reduce((acc: number, dist: number) => acc + Math.pow(dist - avgDistance, 2), 0) / distances.length;
    const consistency = 100 - (Math.sqrt(variance) / avgDistance) * 100;

    const performance = {
      id: equipment.id,
      type: equipment.type,
      brand: equipment.brand,
      model: equipment.model,
      totalRounds,
      averageDistance: Math.round(averageDistance),
      accuracy: Math.round(accuracy),
      consistency: Math.round(consistency),
      lastUsed: equipment.rounds[0]?.date || equipment.createdAt,
    };

    return NextResponse.json(performance);
  } catch (error) {
    console.error('Error fetching equipment performance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch equipment performance' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const equipment = await prisma.equipment.findUnique({
      where: { id: params.id },
      include: { user: true },
    }) as Equipment | null;

    if (!equipment) {
      return NextResponse.json({ error: 'Equipment not found' }, { status: 404 });
    }

    if (equipment.user.email !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, brand, model } = await request.json();

    const updatedEquipment = await prisma.equipment.update({
      where: { id: params.id },
      data: {
        type,
        brand,
        model,
      },
    });

    return NextResponse.json(updatedEquipment);
  } catch (error) {
    console.error('Error updating equipment:', error);
    return NextResponse.json(
      { error: 'Failed to update equipment' },
      { status: 500 }
    );
  }
} 