'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/components/SessionProvider';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Loader2, Calendar, BarChart4, LineChart, PieChart } from 'lucide-react';
import { faker } from '@faker-js/faker';
import { PerformanceTrends } from './PerformanceTrends';

const STAT_CATEGORIES = ['driving', 'approach', 'shortGame', 'putting'];

// Generate some random stats for demo
const generateStats = () => {
  const roundCount = faker.number.int({ min: 15, max: 50 });
  const handicap = faker.number.float({ min: 2, max: 24, precision: 0.1 });
  const avgScore = faker.number.float({ min: 70, max: 95, precision: 0.1 });
  const bestScore = faker.number.int({ min: 65, max: avgScore - 2 });
  
  const catStats = {};
  STAT_CATEGORIES.forEach(cat => {
    catStats[cat] = {
      accuracy: faker.number.float({ min: 30, max: 80, precision: 0.1 }),
      distance: faker.number.int({ min: 200, max: 300 }),
      improvement: faker.number.float({ min: -10, max: 15, precision: 0.1 }),
    };
  });

  return {
    roundCount,
    handicap,
    avgScore,
    bestScore,
    categories: catStats,
    lastRoundDate: faker.date.recent({ days: 14 }),
  };
};

export function StatsDashboard() {
  const { status } = useSession();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to get user stats
    const fetchStats = async () => {
      setIsLoading(true);
      // Simulate network request
      setTimeout(() => {
        setStats(generateStats());
        setIsLoading(false);
      }, 1500);
    };

    // Only fetch stats when user is authenticated
    if (status === 'authenticated') {
      fetchStats();
    } else if (status !== 'loading') {
      setIsLoading(false);
    }
  }, [status]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <p>Loading your golf stats...</p>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Golf Stats</CardTitle>
          <CardDescription>
            Sign in to view your personal golf statistics and analytics
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
          <p className="text-muted-foreground text-center max-w-lg">
            Track your rounds, analyze your performance, and get personalized recommendations to improve your game.
          </p>
          <Button asChild>
            <a href="/signin">Sign In to View Stats</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Stats Available</CardTitle>
          <CardDescription>
            You haven't recorded any rounds yet
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
          <p className="text-muted-foreground text-center max-w-lg">
            Start by adding your first round to see statistics and performance analytics.
          </p>
          <Button>Record a Round</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Your Golf Stats</CardTitle>
            <CardDescription>
              Track your performance and see your progress over time
            </CardDescription>
          </div>
          <div className="flex items-center text-muted-foreground text-sm">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Last round: {stats.lastRoundDate.toLocaleDateString()}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0 space-y-6">
        {/* Key Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="py-4">
              <CardDescription>Handicap</CardDescription>
            </CardHeader>
            <CardContent className="py-0">
              <div className="text-2xl font-bold">{stats.handicap.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Last 20 rounds
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardDescription>Average Score</CardDescription>
            </CardHeader>
            <CardContent className="py-0">
              <div className="text-2xl font-bold">{stats.avgScore.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground mt-1">
                All rounds ({stats.roundCount})
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardDescription>Best Score</CardDescription>
            </CardHeader>
            <CardContent className="py-0">
              <div className="text-2xl font-bold">{stats.bestScore}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Season best
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardDescription>Rounds Played</CardDescription>
            </CardHeader>
            <CardContent className="py-0">
              <div className="text-2xl font-bold">{stats.roundCount}</div>
              <div className="text-xs text-muted-foreground mt-1">
                This season
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Trends */}
        <Tabs defaultValue="trends">
          <TabsList className="mb-4">
            <TabsTrigger value="trends" className="gap-1">
              <LineChart className="h-4 w-4" />
              <span>Trends</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-1">
              <BarChart4 className="h-4 w-4" />
              <span>Categories</span>
            </TabsTrigger>
            <TabsTrigger value="breakdown" className="gap-1">
              <PieChart className="h-4 w-4" />
              <span>Breakdown</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="trends" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>
                  Your progress over the last 10 rounds
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <PerformanceTrends />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="categories" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Category</CardTitle>
                <CardDescription>
                  Breakdown of your game by area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(stats.categories).map(([category, data]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium capitalize">{category}</h4>
                        <span className={`text-xs ${data.improvement > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {data.improvement > 0 ? '+' : ''}{data.improvement}%
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${data.accuracy}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Accuracy: {data.accuracy}%</span>
                        {category === 'driving' && (
                          <span>Avg. Distance: {data.distance} yds</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="breakdown" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Score Breakdown</CardTitle>
                <CardDescription>
                  Distribution of scoring elements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-6">
                      This chart shows the proportion of strokes gained or lost in each category
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                        <span>Driving: 32%</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                        <span>Approach: 28%</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
                        <span>Short Game: 15%</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                        <span>Putting: 25%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 