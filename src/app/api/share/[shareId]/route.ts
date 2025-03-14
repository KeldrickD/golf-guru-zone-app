import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET endpoint to fetch a specific shared content by shareId
export async function GET(
  req: NextRequest,
  { params }: { params: { shareId: string } }
) {
  try {
    const { shareId } = params;
    
    if (!shareId) {
      return NextResponse.json(
        { error: "Missing share ID" },
        { status: 400 }
      );
    }
    
    // Find the shared content
    const sharedContent = await prisma.sharedContent.findUnique({
      where: {
        shareId,
        // Only return public content or check authorization otherwise
        isPublic: true,
        // Only return non-expired content
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            handicap: true,
          }
        },
        round: {
          include: {
            course: true,
            // Include hole data if available
            holes: {
              include: {
                tee: true
              }
            }
          }
        },
        goal: true
      }
    });
    
    if (!sharedContent) {
      return NextResponse.json(
        { error: "Shared content not found or not accessible" },
        { status: 404 }
      );
    }
    
    // Increment view count
    await prisma.sharedContent.update({
      where: {
        id: sharedContent.id
      },
      data: {
        viewCount: {
          increment: 1
        }
      }
    });
    
    // If this is stats type, fetch relevant user stats
    if (sharedContent.contentType === "stats") {
      // Get user rounds for calculating stats
      const userRounds = await prisma.round.findMany({
        where: {
          userId: sharedContent.userId,
          // Filter by date - last 90 days by default
          date: {
            gte: new Date(new Date().setDate(new Date().getDate() - 90))
          }
        },
        include: {
          holes: true,
          course: true
        },
        orderBy: {
          date: 'desc'
        }
      });
      
      // Calculate stats
      const stats = calculateUserStats(userRounds);
      
      // Return shared content with stats
      return NextResponse.json({
        ...sharedContent,
        stats
      });
    }
    
    // Return the shared content
    return NextResponse.json(sharedContent);
    
  } catch (error) {
    console.error("Error fetching shared content:", error);
    return NextResponse.json(
      { error: "Failed to fetch shared content" },
      { status: 500 }
    );
  }
}

// Helper function to calculate user stats
function calculateUserStats(rounds: any[]) {
  if (!rounds || rounds.length === 0) {
    return {
      roundsPlayed: 0,
      averageScore: 0,
      bestScore: 0,
      handicapTrend: [],
      scoreDistribution: [],
      recentRounds: []
    };
  }
  
  // Simple stats calculations
  const roundsPlayed = rounds.length;
  const scores = rounds.map(r => r.totalScore).filter(Boolean);
  const averageScore = scores.length > 0 
    ? (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1) 
    : 0;
  const bestScore = scores.length > 0 ? Math.min(...scores) : 0;
  
  // Get recent rounds for display
  const recentRounds = rounds.slice(0, 5).map(round => ({
    id: round.id,
    date: round.date,
    course: round.course?.name || "Unknown Course",
    score: round.totalScore || 0,
    par: round.course?.par || 72
  }));
  
  // Calculate handicap trend (simplified)
  const handicapTrend = rounds.slice(0, 10).map(round => ({
    date: round.date,
    handicap: round.handicapDifferential || 0
  })).reverse();
  
  // Calculate score distribution
  const scoreDistribution = calculateScoreDistribution(rounds);
  
  return {
    roundsPlayed,
    averageScore,
    bestScore,
    handicapTrend,
    scoreDistribution,
    recentRounds
  };
}

// Helper function to calculate score distribution
function calculateScoreDistribution(rounds: any[]) {
  // Count occurrences of each score type across all holes in all rounds
  const distribution = {
    eagles: 0,
    birdies: 0,
    pars: 0,
    bogeys: 0,
    doubleBogeys: 0,
    worse: 0
  };
  
  rounds.forEach(round => {
    if (round.holes && round.holes.length > 0) {
      round.holes.forEach((hole: any) => {
        if (hole.score && hole.tee?.par) {
          const par = hole.tee.par;
          const score = hole.score;
          const diff = score - par;
          
          if (diff <= -2) distribution.eagles++;
          else if (diff === -1) distribution.birdies++;
          else if (diff === 0) distribution.pars++;
          else if (diff === 1) distribution.bogeys++;
          else if (diff === 2) distribution.doubleBogeys++;
          else if (diff > 2) distribution.worse++;
        }
      });
    }
  });
  
  return distribution;
} 