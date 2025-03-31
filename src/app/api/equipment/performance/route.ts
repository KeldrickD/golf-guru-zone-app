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
  maintenanceHistory: {
    date: Date;
    type: string;
    notes: string;
  }[];
  user: {
    email: string;
  };
}

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const equipment = await prisma.equipment.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },
      include: {
        user: true,
        rounds: {
          include: {
            shots: true,
          },
        },
        maintenanceHistory: true,
      },
    }) as Equipment[];

    const performance = equipment.map(item => {
      const totalRounds = item.rounds.length;
      const totalShots = item.rounds.reduce((acc: number, round: Round) => acc + round.shots.length, 0);
      const totalDistance = item.rounds.reduce((acc: number, round: Round) => {
        return acc + round.shots.reduce((shotAcc: number, shot: Shot) => shotAcc + (shot.distance || 0), 0);
      }, 0);
      const averageDistance = totalRounds > 0 ? totalDistance / totalShots : 0;

      // Calculate accuracy based on shot results
      const accurateShots = item.rounds.reduce((acc: number, round: Round) => {
        return acc + round.shots.filter((shot: Shot) => shot.result === 'fairway' || shot.result === 'green').length;
      }, 0);
      const accuracy = totalShots > 0 ? (accurateShots / totalShots) * 100 : 0;

      // Calculate consistency (standard deviation of distances)
      const distances = item.rounds.flatMap((round: Round) =>
        round.shots.map((shot: Shot) => shot.distance || 0)
      );
      const avgDistance = distances.reduce((a: number, b: number) => a + b, 0) / distances.length;
      const variance = distances.reduce((acc: number, dist: number) => acc + Math.pow(dist - avgDistance, 2), 0) / distances.length;
      const consistency = 100 - (Math.sqrt(variance) / avgDistance) * 100;

      return {
        id: item.id,
        type: item.type,
        brand: item.brand,
        model: item.model,
        totalRounds,
        averageDistance: Math.round(averageDistance),
        accuracy: Math.round(accuracy),
        consistency: Math.round(consistency),
        lastUsed: item.rounds[0]?.date || item.createdAt,
        maintenanceHistory: item.maintenanceHistory.map(record => ({
          date: record.date,
          type: record.type,
          notes: record.notes,
        })),
      };
    });

    return NextResponse.json(performance);
  } catch (error) {
    console.error('Error fetching equipment performance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch equipment performance' },
      { status: 500 }
    );
  }
} 