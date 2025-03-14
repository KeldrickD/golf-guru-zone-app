import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// Type for round with optional fields
interface RoundWithStats {
  totalScore: number;
  putts: number | null;
  fairwaysHit: number | null;
  totalFairways: number | null;
  greensInRegulation: number | null;
  totalGreens: number | null;
}

// Type for fairway and green stats
interface StatsRecord {
  fairwaysHit: number | null;
  totalFairways: number | null;
  greensInRegulation: number | null;
  totalGreens: number | null;
}

// Mock comparison data
const mockComparisonData = {
  handicap: {
    user: 12.4,
    average: 15.2,
    percentile: 72
  },
  scoring: {
    user: 86.2,
    average: 91.4,
    percentile: 65
  },
  fairways: {
    user: 62,
    average: 48,
    percentile: 78
  },
  greens: {
    user: 48,
    average: 41,
    percentile: 60
  },
  puttsPerRound: {
    user: 32.1,
    average: 34.5,
    percentile: 70
  },
  drivingDistance: {
    user: 245.8,
    average: 230.5,
    percentile: 68
  }
};

// GET /api/stats/comparison - Compare user stats with average stats
export async function GET() {
  return NextResponse.json(mockComparisonData);
} 