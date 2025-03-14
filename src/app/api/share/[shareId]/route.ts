import { NextRequest, NextResponse } from "next/server";

// Mock shared content data
const mockSharedContent = {
  id: '123',
  shareId: 'abc123',
  contentType: 'round',
  title: 'Great Round at Pebble Beach',
  description: 'Shot my best score ever!',
  createdAt: new Date().toISOString(),
  viewCount: 42,
  user: {
    id: '1',
    name: 'Demo User',
    image: 'https://via.placeholder.com/150',
  },
  round: {
    id: '456',
    date: new Date().toISOString(),
    score: 82,
    course: {
      id: '789',
      name: 'Pebble Beach Golf Links',
      location: 'Pebble Beach, CA',
      par: 72,
      holes: [
        { number: 1, par: 4, distance: 380, score: 5 },
        { number: 2, par: 5, distance: 502, score: 6 },
        { number: 3, par: 4, distance: 390, score: 4 },
        // More holes...
      ]
    }
  }
};

// GET endpoint to fetch a specific shared content by shareId
export async function GET(
  request: NextRequest,
  { params }: { params: { shareId: string } }
) {
  const { shareId } = params;

  // In a real app, we would fetch from the database
  // For now, just return mock data if the shareId matches
  if (shareId === 'abc123') {
    // Increment view count (would be done in the database in a real app)
    const updatedContent = {
      ...mockSharedContent,
      viewCount: mockSharedContent.viewCount + 1
    };

    return NextResponse.json(updatedContent);
  }

  // Return 404 if not found
  return NextResponse.json({ error: 'Shared content not found' }, { status: 404 });
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