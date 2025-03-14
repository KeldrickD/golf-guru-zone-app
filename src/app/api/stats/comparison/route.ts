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

// GET /api/stats/comparison - Compare user stats with average stats
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse query parameters
    const url = new URL(request.url);
    const metric = url.searchParams.get('metric') || 'all';
    const fromDate = url.searchParams.get('fromDate');
    const toDate = url.searchParams.get('toDate');
    
    // Build date filter if provided
    const dateFilter: { gte?: Date; lte?: Date } = {};
    if (fromDate) {
      dateFilter.gte = new Date(fromDate);
    }
    if (toDate) {
      dateFilter.lte = new Date(toDate);
    }
    
    const dateWhere = Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {};
    
    // Get user's rounds
    const userRounds = await prisma.round.findMany({
      where: {
        userId: session.user.id,
        ...dateWhere,
      },
      orderBy: {
        date: 'desc',
      },
    });
    
    // Calculate user's average stats
    let userStats = {
      avgScore: 0,
      avgPutts: 0,
      fairwayHitPercentage: 0,
      girPercentage: 0,
      roundCount: userRounds.length,
    };
    
    if (userRounds.length > 0) {
      const totalScore = userRounds.reduce((sum: number, round: RoundWithStats) => sum + round.totalScore, 0);
      const totalPutts = userRounds.reduce((sum: number, round: RoundWithStats) => sum + (round.putts || 0), 0);
      const validFairwayRounds = userRounds.filter((r: RoundWithStats) => r.fairwaysHit !== null && r.totalFairways !== null && r.totalFairways > 0);
      const validGirRounds = userRounds.filter((r: RoundWithStats) => r.greensInRegulation !== null && r.totalGreens !== null && r.totalGreens > 0);
      
      const fairwayHitPercentage = validFairwayRounds.length > 0
        ? validFairwayRounds.reduce((sum: number, r: RoundWithStats) => sum + ((r.fairwaysHit || 0) / (r.totalFairways || 1) * 100), 0) / validFairwayRounds.length
        : 0;
        
      const girPercentage = validGirRounds.length > 0
        ? validGirRounds.reduce((sum: number, r: RoundWithStats) => sum + ((r.greensInRegulation || 0) / (r.totalGreens || 1) * 100), 0) / validGirRounds.length
        : 0;
      
      userStats = {
        avgScore: Math.round((totalScore / userRounds.length) * 10) / 10,
        avgPutts: Math.round((totalPutts / userRounds.length) * 10) / 10,
        fairwayHitPercentage: Math.round(fairwayHitPercentage * 10) / 10,
        girPercentage: Math.round(girPercentage * 10) / 10,
        roundCount: userRounds.length,
      };
    }
    
    // Get global stats from all users
    // Get total rounds that match date criteria
    const totalRounds = await prisma.round.count({
      where: dateWhere,
    });
    
    // Calculate global average stats
    const globalScoreAvg = totalRounds > 0
      ? await prisma.round.aggregate({
          _avg: { totalScore: true },
          where: dateWhere,
        })
      : { _avg: { totalScore: null } };
      
    const globalPuttsAvg = totalRounds > 0
      ? await prisma.round.aggregate({
          _avg: { putts: true },
          where: dateWhere,
        })
      : { _avg: { putts: null } };
    
    // For fairways and greens, need to calculate average percentage
    // This is more complex and would be better handled with raw SQL
    // For now, use a simpler approach with aggregation
    const allRounds = await prisma.round.findMany({
      where: {
        ...dateWhere,
        fairwaysHit: { not: null },
        totalFairways: { not: null },
        greensInRegulation: { not: null },
        totalGreens: { not: null },
      },
      select: {
        fairwaysHit: true,
        totalFairways: true,
        greensInRegulation: true,
        totalGreens: true,
      }
    });
    
    let globalFairwayHitPercentage = 0;
    let globalGirPercentage = 0;
    
    if (allRounds.length > 0) {
      const validFairwayRounds = allRounds.filter((r: StatsRecord) => 
        r.fairwaysHit !== null && r.totalFairways !== null && r.totalFairways > 0
      );
      
      const validGirRounds = allRounds.filter((r: StatsRecord) => 
        r.greensInRegulation !== null && r.totalGreens !== null && r.totalGreens > 0
      );
      
      if (validFairwayRounds.length > 0) {
        globalFairwayHitPercentage = validFairwayRounds.reduce((sum: number, r: StatsRecord) => 
          sum + ((r.fairwaysHit || 0) / (r.totalFairways || 1) * 100), 0
        ) / validFairwayRounds.length;
      }
      
      if (validGirRounds.length > 0) {
        globalGirPercentage = validGirRounds.reduce((sum: number, r: StatsRecord) => 
          sum + ((r.greensInRegulation || 0) / (r.totalGreens || 1) * 100), 0
        ) / validGirRounds.length;
      }
    }
    
    const globalStats = {
      avgScore: globalScoreAvg._avg.totalScore ? Math.round(globalScoreAvg._avg.totalScore * 10) / 10 : null,
      avgPutts: globalPuttsAvg._avg.putts ? Math.round(globalPuttsAvg._avg.putts * 10) / 10 : null,
      fairwayHitPercentage: Math.round(globalFairwayHitPercentage * 10) / 10,
      girPercentage: Math.round(globalGirPercentage * 10) / 10,
      roundCount: totalRounds,
    };
    
    // Check if we have data, otherwise return sample data
    if (userStats.roundCount === 0 || globalStats.roundCount === 0) {
      return NextResponse.json({
        userStats: {
          avgScore: 85.7,
          avgPutts: 32.4,
          fairwayHitPercentage: 52.8,
          girPercentage: 41.5,
          roundCount: 12,
        },
        globalStats: {
          avgScore: 89.3,
          avgPutts: 34.1,
          fairwayHitPercentage: 48.2,
          girPercentage: 38.7,
          roundCount: 1457,
        },
        isDefault: true
      });
    }
    
    return NextResponse.json({
      userStats,
      globalStats,
      isDefault: false
    });
    
  } catch (error) {
    console.error('Error in /api/stats/comparison GET:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve comparison stats' },
      { status: 500 }
    );
  }
} 