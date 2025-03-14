import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET /api/stats - Retrieve user stats for charts and visualizations
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse query parameters
    const url = new URL(request.url);
    const chart = url.searchParams.get('chart');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    // Get user rounds for performance history
    const userRounds = await prisma.round.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        date: 'desc',
      },
      take: limit,
    });
    
    // If no chart specified or performance history requested
    if (!chart || chart === 'performance') {
      // Calculate metrics for each round
      const performanceData = userRounds.map(round => {
        const fairwaysHitPercent = round.totalFairways 
          ? Math.round((round.fairwaysHit || 0) / round.totalFairways * 100) 
          : 0;
        
        const girPercent = round.totalGreens 
          ? Math.round((round.greensInRegulation || 0) / round.totalGreens * 100) 
          : 0;
        
        return {
          date: round.date.toISOString().split('T')[0],
          score: round.totalScore,
          putts: round.putts || 0,
          fairwaysHitPercent,
          girPercent,
        };
      }).reverse(); // Reverse to get chronological order
      
      // If user has no rounds, return sample data
      if (performanceData.length === 0) {
        return NextResponse.json({
          performanceData: [
            { date: '2023-10-01', score: 89, putts: 36, fairwaysHitPercent: 45, girPercent: 28 },
            { date: '2023-10-15', score: 87, putts: 35, fairwaysHitPercent: 50, girPercent: 33 },
            { date: '2023-10-30', score: 86, putts: 34, fairwaysHitPercent: 48, girPercent: 33 },
            { date: '2023-11-12', score: 84, putts: 33, fairwaysHitPercent: 51, girPercent: 39 },
            { date: '2023-12-05', score: 83, putts: 32, fairwaysHitPercent: 53, girPercent: 44 },
            { date: '2024-01-20', score: 85, putts: 33, fairwaysHitPercent: 52, girPercent: 39 },
            { date: '2024-02-10', score: 82, putts: 31, fairwaysHitPercent: 57, girPercent: 44 },
            { date: '2024-03-15', score: 80, putts: 30, fairwaysHitPercent: 60, girPercent: 50 },
            { date: '2024-04-02', score: 81, putts: 31, fairwaysHitPercent: 58, girPercent: 44 },
            { date: '2024-04-20', score: 79, putts: 29, fairwaysHitPercent: 64, girPercent: 56 }
          ],
          isDefault: true
        });
      }
      
      return NextResponse.json({
        performanceData,
        isDefault: false
      });
    }
    
    // If scoring breakdown requested
    if (chart === 'scoring') {
      // Calculate scores relative to par
      // We would need to get the course par for each round
      // For now, let's use a default par of 72
      
      // Sample data if no rounds
      if (userRounds.length === 0) {
        return NextResponse.json({
          scoringBreakdown: [
            { name: 'Eagles', value: 1, color: '#4ade80' },
            { name: 'Birdies', value: 8, color: '#22c55e' },
            { name: 'Pars', value: 32, color: '#3b82f6' },
            { name: 'Bogeys', value: 45, color: '#f97316' },
            { name: 'Double Bogeys', value: 12, color: '#ef4444' },
            { name: 'Triple+', value: 2, color: '#b91c1c' },
          ],
          isDefault: true
        });
      }
      
      // If real scoring data exists, we would calculate it here
      // This would require hole-by-hole scores which we don't have in our current schema
      
      return NextResponse.json({
        scoringBreakdown: [
          { name: 'Eagles', value: 1, color: '#4ade80' },
          { name: 'Birdies', value: 8, color: '#22c55e' },
          { name: 'Pars', value: 32, color: '#3b82f6' },
          { name: 'Bogeys', value: 45, color: '#f97316' },
          { name: 'Double Bogeys', value: 12, color: '#ef4444' },
          { name: 'Triple+', value: 2, color: '#b91c1c' },
        ],
        isDefault: true
      });
    }
    
    // If performance radar requested
    if (chart === 'radar') {
      // Calculate performance metrics
      // The numbers below are just a placeholder
      // In a real implementation, we would calculate these from the user's rounds
      
      return NextResponse.json({
        performanceRadar: [
          { metric: 'Driving Distance', value: 70, fullMark: 100 },
          { metric: 'Driving Accuracy', value: 50, fullMark: 100 },
          { metric: 'GIR', value: 40, fullMark: 100 },
          { metric: 'Scrambling', value: 60, fullMark: 100 },
          { metric: 'Putts per Round', value: 65, fullMark: 100 },
          { metric: 'Sand Saves', value: 35, fullMark: 100 },
        ],
        isDefault: userRounds.length === 0
      });
    }
    
    // If heatmap data requested
    if (chart === 'heatmap') {
      // In a real implementation, we would calculate shot patterns from the shots table
      // For now, return sample data
      
      const holeData = [...Array(18)].map((_, i) => {
        const hole = i + 1;
        const par = hole % 3 === 0 ? 3 : (hole % 5 === 0 ? 5 : 4);
        const length = par === 3 ? 165 + Math.floor(Math.random() * 40) :
                     par === 5 ? 510 + Math.floor(Math.random() * 40) :
                     380 + Math.floor(Math.random() * 40);
                     
        return {
          hole,
          par,
          length,
          fairwayMisses: par === 3 ? 
            { left: 0, right: 0, center: 100 } : 
            { 
              left: 10 + Math.floor(Math.random() * 40), 
              right: 10 + Math.floor(Math.random() * 40),
              center: 30 + Math.floor(Math.random() * 30)
            },
          greenMisses: { 
            short: 10 + Math.floor(Math.random() * 40),
            long: 5 + Math.floor(Math.random() * 20),
            left: 10 + Math.floor(Math.random() * 25),
            right: 10 + Math.floor(Math.random() * 25),
            hit: 10 + Math.floor(Math.random() * 20)
          }
        };
      });
      
      return NextResponse.json({
        holeData,
        isDefault: true
      });
    }
    
    return NextResponse.json({
      error: 'Invalid chart type'
    }, { status: 400 });
    
  } catch (error) {
    console.error('Error in /api/stats GET:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve stats' },
      { status: 500 }
    );
  }
} 