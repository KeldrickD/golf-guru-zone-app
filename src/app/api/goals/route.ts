import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET /api/goals - Get all goals for the user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const goals = await prisma.userGoal.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    // If the user doesn't have any goals, return an empty array
    return NextResponse.json({ goals });
    
  } catch (error) {
    console.error('Error in /api/goals GET:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve goals' },
      { status: 500 }
    );
  }
}

// POST /api/goals - Create a new goal
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    
    // Basic validation
    if (!data.type || typeof data.targetValue !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get current value for the goal type to set as startValue
    let startValue: number | null = null;
    
    if (data.type === 'handicap') {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { handicap: true },
      });
      startValue = user?.handicap || null;
    } else {
      // For other goal types, calculate from recent rounds
      const recentRounds = await prisma.round.findMany({
        where: {
          userId: session.user.id,
        },
        orderBy: {
          date: 'desc',
        },
        take: 5, // Use last 5 rounds for average
      });
      
      if (recentRounds.length > 0) {
        switch (data.type) {
          case 'score':
            startValue = recentRounds.reduce((sum, round) => sum + round.totalScore, 0) / recentRounds.length;
            break;
          case 'putts':
            const validPuttsRounds = recentRounds.filter(r => r.putts !== null);
            if (validPuttsRounds.length > 0) {
              startValue = validPuttsRounds.reduce((sum, round) => sum + (round.putts || 0), 0) / validPuttsRounds.length;
            }
            break;
          case 'fairways':
            const validFairwayRounds = recentRounds.filter(r => 
              r.fairwaysHit !== null && r.totalFairways !== null && r.totalFairways > 0
            );
            if (validFairwayRounds.length > 0) {
              startValue = validFairwayRounds.reduce((sum, r) => 
                sum + ((r.fairwaysHit || 0) / (r.totalFairways || 1) * 100), 0
              ) / validFairwayRounds.length;
            }
            break;
          case 'gir':
            const validGirRounds = recentRounds.filter(r => 
              r.greensInRegulation !== null && r.totalGreens !== null && r.totalGreens > 0
            );
            if (validGirRounds.length > 0) {
              startValue = validGirRounds.reduce((sum, r) => 
                sum + ((r.greensInRegulation || 0) / (r.totalGreens || 1) * 100), 0
              ) / validGirRounds.length;
            }
            break;
        }
      }
    }
    
    // Calculate initial progress if we have a startValue
    let progress: number | null = null;
    if (startValue !== null) {
      // For metrics where lower is better (score, putts, handicap)
      if (['score', 'putts', 'handicap'].includes(data.type)) {
        // If target is already achieved
        if (startValue <= data.targetValue) {
          progress = 100;
        } else {
          // How much needs to be improved
          const improvementNeeded = startValue - data.targetValue;
          // Current improvement
          const currentImprovement = startValue - startValue; // Always 0 for new goal
          // Progress as percentage of needed improvement
          progress = Math.min(100, Math.max(0, (currentImprovement / improvementNeeded) * 100));
        }
      } 
      // For metrics where higher is better (fairways, gir)
      else {
        // If target is already achieved
        if (startValue >= data.targetValue) {
          progress = 100;
        } else {
          // How much needs to be improved
          const improvementNeeded = data.targetValue - startValue;
          // Current improvement
          const currentImprovement = startValue - startValue; // Always 0 for new goal
          // Progress as percentage of needed improvement
          progress = Math.min(100, Math.max(0, (currentImprovement / improvementNeeded) * 100));
        }
      }
    }
    
    // Set deadline if provided
    const deadline = data.deadline ? new Date(data.deadline) : null;
    
    // Create the goal
    const goal = await prisma.userGoal.create({
      data: {
        userId: session.user.id,
        type: data.type,
        targetValue: data.targetValue,
        startValue: startValue !== null ? startValue : undefined,
        deadline: deadline,
        progress: progress !== null ? progress : undefined,
        notes: data.notes || undefined,
      },
    });
    
    return NextResponse.json({ goal });
    
  } catch (error) {
    console.error('Error in /api/goals POST:', error);
    return NextResponse.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    );
  }
}

// PATCH /api/goals/:id - Update a goal
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    const url = new URL(request.url);
    const goalId = url.pathname.split('/').pop();
    
    if (!goalId) {
      return NextResponse.json(
        { error: 'Missing goal ID' },
        { status: 400 }
      );
    }
    
    // Check if the goal exists and belongs to the user
    const existingGoal = await prisma.userGoal.findFirst({
      where: {
        id: goalId,
        userId: session.user.id,
      },
    });
    
    if (!existingGoal) {
      return NextResponse.json(
        { error: 'Goal not found or unauthorized' },
        { status: 404 }
      );
    }
    
    // Calculate current progress
    let progress = existingGoal.progress;
    let currentValue: number | null = null;
    
    if (data.currentValue) {
      currentValue = data.currentValue;
    } else {
      // Get current value for the goal type
      if (existingGoal.type === 'handicap') {
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { handicap: true },
        });
        currentValue = user?.handicap || null;
      } else {
        // For other goal types, calculate from recent rounds
        const recentRounds = await prisma.round.findMany({
          where: {
            userId: session.user.id,
          },
          orderBy: {
            date: 'desc',
          },
          take: 5, // Use last 5 rounds for average
        });
        
        if (recentRounds.length > 0) {
          switch (existingGoal.type) {
            case 'score':
              currentValue = recentRounds.reduce((sum, round) => sum + round.totalScore, 0) / recentRounds.length;
              break;
            case 'putts':
              const validPuttsRounds = recentRounds.filter(r => r.putts !== null);
              if (validPuttsRounds.length > 0) {
                currentValue = validPuttsRounds.reduce((sum, round) => sum + (round.putts || 0), 0) / validPuttsRounds.length;
              }
              break;
            case 'fairways':
              const validFairwayRounds = recentRounds.filter(r => 
                r.fairwaysHit !== null && r.totalFairways !== null && r.totalFairways > 0
              );
              if (validFairwayRounds.length > 0) {
                currentValue = validFairwayRounds.reduce((sum, r) => 
                  sum + ((r.fairwaysHit || 0) / (r.totalFairways || 1) * 100), 0
                ) / validFairwayRounds.length;
              }
              break;
            case 'gir':
              const validGirRounds = recentRounds.filter(r => 
                r.greensInRegulation !== null && r.totalGreens !== null && r.totalGreens > 0
              );
              if (validGirRounds.length > 0) {
                currentValue = validGirRounds.reduce((sum, r) => 
                  sum + ((r.greensInRegulation || 0) / (r.totalGreens || 1) * 100), 0
                ) / validGirRounds.length;
              }
              break;
          }
        }
      }
    }
    
    // If we have both start and current values, calculate progress
    if (existingGoal.startValue !== null && currentValue !== null) {
      // For metrics where lower is better (score, putts, handicap)
      if (['score', 'putts', 'handicap'].includes(existingGoal.type)) {
        if (currentValue <= existingGoal.targetValue) {
          progress = 100;
        } else if (existingGoal.startValue <= existingGoal.targetValue) {
          // Edge case: goal was already achieved when created
          progress = 100;
        } else {
          // How much needs to be improved
          const improvementNeeded = existingGoal.startValue - existingGoal.targetValue;
          // Current improvement
          const currentImprovement = existingGoal.startValue - currentValue;
          // Progress as percentage of needed improvement
          progress = Math.min(100, Math.max(0, (currentImprovement / improvementNeeded) * 100));
        }
      } 
      // For metrics where higher is better (fairways, gir)
      else {
        if (currentValue >= existingGoal.targetValue) {
          progress = 100;
        } else if (existingGoal.startValue >= existingGoal.targetValue) {
          // Edge case: goal was already achieved when created
          progress = 100;
        } else {
          // How much needs to be improved
          const improvementNeeded = existingGoal.targetValue - existingGoal.startValue;
          // Current improvement
          const currentImprovement = currentValue - existingGoal.startValue;
          // Progress as percentage of needed improvement
          progress = Math.min(100, Math.max(0, (currentImprovement / improvementNeeded) * 100));
        }
      }
    }
    
    // Update isCompleted status if progress is 100%
    const isCompleted = progress === 100 ? true : data.isCompleted;
    
    // Update the goal
    const updatedGoal = await prisma.userGoal.update({
      where: { id: goalId },
      data: {
        targetValue: data.targetValue !== undefined ? data.targetValue : undefined,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
        isCompleted: isCompleted !== undefined ? isCompleted : undefined,
        progress: progress !== null ? progress : undefined,
        notes: data.notes !== undefined ? data.notes : undefined,
      },
    });
    
    return NextResponse.json({ goal: updatedGoal });
    
  } catch (error) {
    console.error('Error in /api/goals PATCH:', error);
    return NextResponse.json(
      { error: 'Failed to update goal' },
      { status: 500 }
    );
  }
}

// DELETE /api/goals/:id - Delete a goal
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const url = new URL(request.url);
    const goalId = url.pathname.split('/').pop();
    
    if (!goalId) {
      return NextResponse.json(
        { error: 'Missing goal ID' },
        { status: 400 }
      );
    }
    
    // Check if the goal exists and belongs to the user
    const existingGoal = await prisma.userGoal.findFirst({
      where: {
        id: goalId,
        userId: session.user.id,
      },
    });
    
    if (!existingGoal) {
      return NextResponse.json(
        { error: 'Goal not found or unauthorized' },
        { status: 404 }
      );
    }
    
    // Delete the goal
    await prisma.userGoal.delete({
      where: { id: goalId },
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error in /api/goals DELETE:', error);
    return NextResponse.json(
      { error: 'Failed to delete goal' },
      { status: 500 }
    );
  }
} 