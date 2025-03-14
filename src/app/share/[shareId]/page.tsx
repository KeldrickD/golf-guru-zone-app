'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/Alert';
import { Download, Clock, Flag, Calendar, Share2, Trophy, User } from 'lucide-react';
import GolfPerformanceReport from '@/components/pdf/GolfPerformanceReport';
import PerformanceHistoryChart from '@/components/charts/PerformanceHistoryChart';
import CourseHeatmapChart from '@/components/charts/CourseHeatmapChart';
import StatsComparisonChart from '@/components/charts/StatsComparisonChart';
import MetricDetailChart from '@/components/charts/MetricDetailChart';
import { formatDate } from '@/lib/utils';

// Define the shared content interface
interface SharedContent {
  id: string;
  shareId: string;
  contentType: 'round' | 'stats' | 'goal';
  title: string;
  description?: string;
  createdAt: string;
  viewCount: number;
  isPublic: boolean;
  expiresAt?: string;
  user: {
    id: string;
    name: string;
    image?: string;
    handicap?: number;
  };
  round?: {
    id: string;
    date: string;
    totalScore: number;
    course: {
      id: string;
      name: string;
      location?: string;
      par: number;
    };
    holes?: Array<{
      id: string;
      number: number;
      score: number;
      putts?: number;
      fairwayHit?: boolean;
      greenInRegulation?: boolean;
      tee: {
        id: string;
        par: number;
        distance: number;
      };
    }>;
  };
  goal?: {
    id: string;
    type: string;
    targetValue: number;
    progress: number;
    isCompleted: boolean;
    deadline?: string;
    notes?: string;
  };
  stats?: {
    averageScore: number;
    roundsPlayed: number;
    fairwaysHit: number;
    greensInRegulation: number;
    averagePutts: number;
    bestScore: number;
    handicapTrend: Array<{
      date: string;
      handicap: number;
    }>;
    scoreDistribution: {
      eagles: number;
      birdies: number;
      pars: number;
      bogeys: number;
      doubleBogeys: number;
      worse: number;
    };
  };
}

export default function SharedContentPage() {
  const params = useParams();
  const shareId = params?.shareId as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<SharedContent | null>(null);
  
  useEffect(() => {
    const fetchSharedContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/share/${shareId}`);
        
        if (!response.ok) {
          throw new Error('Failed to load shared content');
        }
        
        const data = await response.json();
        setContent(data);
      } catch (err) {
        console.error('Error fetching shared content:', err);
        setError('The shared content could not be loaded or may have expired');
      } finally {
        setLoading(false);
      }
    };
    
    if (shareId) {
      fetchSharedContent();
    }
  }, [shareId]);
  
  // Function to prepare data for PDF report
  const getPdfReportData = () => {
    if (!content) return null;
    
    const playerData = {
      name: content.user.name,
      handicap: content.user.handicap,
      image: content.user.image,
    };
    
    let roundData;
    if (content.round) {
      roundData = {
        id: content.round.id,
        date: content.round.date,
        courseName: content.round.course.name,
        totalScore: content.round.totalScore,
        par: content.round.course.par,
        holeDetails: content.round.holes?.map(hole => ({
          number: hole.number,
          par: hole.tee.par,
          score: hole.score,
          putts: hole.putts,
          fairwayHit: hole.fairwayHit,
          gir: hole.greenInRegulation,
        })),
      };
    }
    
    let comparisonData;
    if (content.stats) {
      comparisonData = {
        userAverageScore: content.stats.averageScore,
        averageScore: content.stats.averageScore + 5, // Sample comparison value
        userFairwayHitPercentage: content.stats.fairwaysHit,
        fairwayHitPercentage: 60, // Sample average value
        userGirPercentage: content.stats.greensInRegulation,
        girPercentage: 50, // Sample average value
        userAveragePutts: content.stats.averagePutts,
        averagePutts: 1.9, // Sample average value
      };
    }
    
    let goalsData;
    if (content.goal) {
      goalsData = [{
        type: content.goal.type,
        targetValue: content.goal.targetValue,
        progress: content.goal.progress,
        isCompleted: content.goal.isCompleted,
        deadline: content.goal.deadline,
      }];
    }
    
    return {
      player: playerData,
      round: roundData,
      comparison: comparisonData,
      goals: goalsData,
    };
  };
  
  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (!content) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Alert>
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>The requested content could not be found.</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{content.title}</CardTitle>
              <CardDescription>{content.description}</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Viewed {content.viewCount} times</span>
              </Badge>
              {content.expiresAt && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Expires {formatDate(new Date(content.expiresAt))}</span>
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <Avatar>
              {content.user.image ? (
                <AvatarImage src={content.user.image} alt={content.user.name} />
              ) : (
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <div className="font-medium">{content.user.name}</div>
              {content.user.handicap !== undefined && (
                <div className="text-sm text-muted-foreground">
                  Handicap: {content.user.handicap}
                </div>
              )}
            </div>
          </div>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              {content.contentType === 'round' && content.round && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-card rounded-lg p-4 border">
                      <div className="text-sm font-medium mb-1">Course</div>
                      <div className="text-lg font-bold">{content.round.course.name}</div>
                    </div>
                    <div className="bg-card rounded-lg p-4 border">
                      <div className="text-sm font-medium mb-1">Date</div>
                      <div className="text-lg font-bold">{formatDate(new Date(content.round.date))}</div>
                    </div>
                    <div className="bg-card rounded-lg p-4 border">
                      <div className="text-sm font-medium mb-1">Score</div>
                      <div className="text-lg font-bold">
                        {content.round.totalScore} {content.round.totalScore > content.round.course.par ? 
                          `(+${content.round.totalScore - content.round.course.par})` : 
                          content.round.totalScore < content.round.course.par ? 
                          `(-${content.round.course.par - content.round.totalScore})` : 
                          '(E)'}
                      </div>
                    </div>
                  </div>
                  
                  {content.round.holes && content.round.holes.length > 0 && (
                    <div className="bg-card rounded-lg p-4 border overflow-x-auto">
                      <div className="text-sm font-medium mb-2">Hole by Hole</div>
                      <div className="min-w-max">
                        <div className="grid grid-cols-19 gap-1">
                          {/* Header */}
                          <div className="col-span-1 text-xs font-medium text-center">Hole</div>
                          {content.round.holes.map(hole => (
                            <div key={`hole-${hole.number}`} className="col-span-1 text-xs font-medium text-center">
                              {hole.number}
                            </div>
                          ))}
                          
                          {/* Par row */}
                          <div className="col-span-1 text-xs font-medium text-center">Par</div>
                          {content.round.holes.map(hole => (
                            <div key={`par-${hole.number}`} className="col-span-1 text-xs text-center">
                              {hole.tee.par}
                            </div>
                          ))}
                          
                          {/* Score row */}
                          <div className="col-span-1 text-xs font-medium text-center">Score</div>
                          {content.round.holes.map(hole => (
                            <div 
                              key={`score-${hole.number}`} 
                              className={`col-span-1 text-xs text-center font-medium ${
                                hole.score < hole.tee.par ? 'text-green-600' : 
                                hole.score > hole.tee.par ? 'text-red-600' : ''
                              }`}
                            >
                              {hole.score}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {content.contentType === 'goal' && content.goal && (
                <div className="space-y-4">
                  <div className="bg-card rounded-lg p-6 border">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <div className="text-xl font-bold mb-1">{content.goal.type} Goal</div>
                        <div className="text-muted-foreground">
                          Target: {content.goal.targetValue}
                          {content.goal.deadline && ` • Deadline: ${formatDate(new Date(content.goal.deadline))}`}
                        </div>
                      </div>
                      {content.goal.isCompleted && (
                        <Badge className="bg-green-600">
                          <Trophy className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{content.goal.progress} / {content.goal.targetValue} ({Math.round((content.goal.progress / content.goal.targetValue) * 100)}%)</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${content.goal.isCompleted ? 'bg-green-600' : 'bg-blue-600'}`}
                          style={{ width: `${Math.min((content.goal.progress / content.goal.targetValue) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {content.goal.notes && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="text-sm font-medium mb-1">Notes</div>
                        <div className="text-sm">{content.goal.notes}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {content.contentType === 'stats' && content.stats && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-card rounded-lg p-4 border">
                      <div className="text-sm font-medium mb-1">Rounds Played</div>
                      <div className="text-2xl font-bold">{content.stats.roundsPlayed}</div>
                    </div>
                    <div className="bg-card rounded-lg p-4 border">
                      <div className="text-sm font-medium mb-1">Avg. Score</div>
                      <div className="text-2xl font-bold">{content.stats.averageScore.toFixed(1)}</div>
                    </div>
                    <div className="bg-card rounded-lg p-4 border">
                      <div className="text-sm font-medium mb-1">Best Score</div>
                      <div className="text-2xl font-bold">{content.stats.bestScore}</div>
                    </div>
                    <div className="bg-card rounded-lg p-4 border">
                      <div className="text-sm font-medium mb-1">Avg. Putts</div>
                      <div className="text-2xl font-bold">{content.stats.averagePutts.toFixed(1)}</div>
                    </div>
                  </div>
                  
                  <div className="bg-card rounded-lg p-4 border">
                    <div className="text-sm font-medium mb-2">Score Distribution</div>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                      <div className="bg-muted rounded p-2 text-center">
                        <div className="text-xs text-muted-foreground">Eagles+</div>
                        <div className="text-lg font-bold">{content.stats.scoreDistribution.eagles}</div>
                      </div>
                      <div className="bg-muted rounded p-2 text-center">
                        <div className="text-xs text-muted-foreground">Birdies</div>
                        <div className="text-lg font-bold">{content.stats.scoreDistribution.birdies}</div>
                      </div>
                      <div className="bg-muted rounded p-2 text-center">
                        <div className="text-xs text-muted-foreground">Pars</div>
                        <div className="text-lg font-bold">{content.stats.scoreDistribution.pars}</div>
                      </div>
                      <div className="bg-muted rounded p-2 text-center">
                        <div className="text-xs text-muted-foreground">Bogeys</div>
                        <div className="text-lg font-bold">{content.stats.scoreDistribution.bogeys}</div>
                      </div>
                      <div className="bg-muted rounded p-2 text-center">
                        <div className="text-xs text-muted-foreground">Doubles</div>
                        <div className="text-lg font-bold">{content.stats.scoreDistribution.doubleBogeys}</div>
                      </div>
                      <div className="bg-muted rounded p-2 text-center">
                        <div className="text-xs text-muted-foreground">Worse</div>
                        <div className="text-lg font-bold">{content.stats.scoreDistribution.worse}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="details" className="space-y-6">
              {content.contentType === 'round' && content.round && (
                <div className="space-y-6">
                  {/* PDF Report Preview */}
                  <div className="mt-4">
                    <GolfPerformanceReport {...getPdfReportData()} />
                  </div>
                </div>
              )}
              
              {content.contentType === 'stats' && content.stats && (
                <div className="space-y-6">
                  <PerformanceHistoryChart timeframe="90days" />
                  <CourseHeatmapChart />
                </div>
              )}
              
              {content.contentType === 'goal' && content.goal && (
                <div className="space-y-6">
                  <div className="bg-card rounded-lg p-6 border">
                    <div className="text-lg font-medium mb-4">Goal Details</div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-medium mb-1">Goal Type</div>
                          <div className="text-base">{content.goal.type}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium mb-1">Target Value</div>
                          <div className="text-base">{content.goal.targetValue}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium mb-1">Current Progress</div>
                          <div className="text-base">{content.goal.progress}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium mb-1">Completion Status</div>
                          <div className="text-base">
                            {content.goal.isCompleted ? (
                              <Badge className="bg-green-600">Completed</Badge>
                            ) : (
                              <Badge variant="outline">In Progress</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {content.goal.deadline && (
                        <div>
                          <div className="text-sm font-medium mb-1">Deadline</div>
                          <div className="text-base">{formatDate(new Date(content.goal.deadline))}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="stats" className="space-y-6">
              {content.contentType === 'round' && content.round && (
                <div className="space-y-6">
                  <MetricDetailChart metric="score" />
                  <MetricDetailChart metric="putts" />
                </div>
              )}
              
              {content.contentType === 'stats' && content.stats && (
                <div className="space-y-6">
                  <StatsComparisonChart />
                  <MetricDetailChart metric="fairways" />
                  <MetricDetailChart metric="greens" />
                </div>
              )}
              
              {content.contentType === 'goal' && content.goal && (
                <div className="space-y-6">
                  <PerformanceHistoryChart timeframe="90days" />
                  <div className="bg-card rounded-lg p-6 border">
                    <div className="text-lg font-medium mb-4">Related Statistics</div>
                    <div className="text-sm text-muted-foreground">
                      Performance statistics related to this goal will appear here when available.
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Shared on {formatDate(new Date(content.createdAt))}
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </Button>
            <Button variant="default" size="sm" className="flex items-center gap-1">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 