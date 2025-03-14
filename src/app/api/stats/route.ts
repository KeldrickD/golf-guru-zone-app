import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// Mock stats data
const mockStats = {
  handicap: 12.4,
  roundsPlayed: 24,
  averageScore: 86.2,
  fairwaysHitPercentage: 62,
  greensInRegulationPercentage: 48,
  puttsPerRound: 32.1,
  drivingDistance: 245.8,
  scoringBreakdown: {
    eagles: 1,
    birdies: 32,
    pars: 156,
    bogeys: 198,
    doubleBogeys: 87,
    others: 34
  },
  recentRounds: [
    { date: '2023-10-15', score: 84, course: 'Pebble Beach' },
    { date: '2023-10-01', score: 87, course: 'Oak Ridge Country Club' },
    { date: '2023-09-20', score: 82, course: 'Pine Valley Golf Club' },
    { date: '2023-09-05', score: 86, course: 'Augusta National' }
  ],
  trending: {
    handicap: 'decreasing',
    putts: 'stable',
    fairways: 'increasing',
    greens: 'increasing'
  }
};

// GET /api/stats - Retrieve user stats for charts and visualizations
export async function GET() {
  return NextResponse.json(mockStats);
} 