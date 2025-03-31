'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useToast } from '@/hooks/use-toast';
import { format, subMonths, subYears } from 'date-fns';
import { localizeUrl } from '@/lib/route-utils';
import { Button } from '@/components/ui/Button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  Title,
  Text,
  Tab,
  TabList,
  TabGroup,
  TabPanels,
  TabPanel,
} from '@tremor/react';

interface Round {
  id: string;
  course: string;
  date: string;
  totalScore: number;
  putts: number | null;
  fairwaysHit: number | null;
  totalFairways: number | null;
  greensInRegulation: number | null;
  totalGreens: number | null;
  notes: string | null;
}

interface Stats {
  averageScore: number;
  bestScore: number;
  worstScore: number;
  totalRounds: number;
  averagePutts: number;
  fairwayPercentage: number;
  girPercentage: number;
  recentRounds: Round[];
  monthlyAverages: {
    month: string;
    roundsPlayed: number;
    averageScore: number;
    averagePutts: number;
    fairwayPercentage: number;
    girPercentage: number;
  }[];
  courseStats: {
    course: string;
    roundsPlayed: number;
    averageScore: number;
    bestScore: number;
    worstScore: number;
  }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Simulated rounds data for demo purposes
const generateSimulatedRounds = (): Round[] => {
  const courses = [
    'Pine Valley Golf Club',
    'Augusta National',
    'St. Andrews Links',
    'Pebble Beach',
    'Oakmont Country Club'
  ];
  
  const rounds: Round[] = [];
  const now = new Date();
  
  // Generate 30 rounds over the past year
  for (let i = 0; i < 30; i++) {
    const daysAgo = Math.floor(Math.random() * 365);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    
    const totalScore = Math.floor(Math.random() * 20) + 70; // Scores between 70-90
    const putts = Math.floor(Math.random() * 10) + 25; // Putts between 25-35
    const totalFairways = 14;
    const fairwaysHit = Math.floor(Math.random() * 10) + 5; // Between 5-14 fairways
    const totalGreens = 18;
    const gir = Math.floor(Math.random() * 10) + 5; // Between 5-14 greens
    
    rounds.push({
      id: `round-${i}`,
      course: courses[Math.floor(Math.random() * courses.length)],
      date: date.toISOString().split('T')[0],
      totalScore,
      putts,
      fairwaysHit,
      totalFairways,
      greensInRegulation: gir,
      totalGreens,
      notes: i % 5 === 0 ? 'Great round!' : null
    });
  }
  
  // Sort by date descending
  return rounds.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

export default function StatisticsPage() {
  const { data: session } = useSession();
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const { addToast } = useToast();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  // Add new state for advanced analytics
  const [timeframe, setTimeframe] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('score');

  useEffect(() => {
    if (session) {
      calculateStats();
    } else {
      setLoading(false);
    }
  }, [session]);

  const calculateStats = async () => {
    try {
      // Use simulated data instead of API call
      const rounds = generateSimulatedRounds();
      
      // Calculate overall statistics
      const totalRounds = rounds.length;
      const scores = rounds.map(r => r.totalScore);
      const averageScore = scores.reduce((a, b) => a + b, 0) / totalRounds;
      const bestScore = Math.min(...scores);
      const worstScore = Math.max(...scores);
      
      // Calculate average putts
      const totalPutts = rounds.reduce((sum, r) => sum + (r.putts || 0), 0);
      const roundsWithPutts = rounds.filter(r => r.putts !== null).length;
      const averagePutts = roundsWithPutts > 0 ? totalPutts / roundsWithPutts : 0;
      
      // Calculate fairway percentage
      const totalFairwaysHit = rounds.reduce((sum, r) => sum + (r.fairwaysHit || 0), 0);
      const totalFairways = rounds.reduce((sum, r) => sum + (r.totalFairways || 0), 0);
      const fairwayPercentage = totalFairways > 0 ? (totalFairwaysHit / totalFairways) * 100 : 0;
      
      // Calculate GIR percentage
      const totalGIR = rounds.reduce((sum, r) => sum + (r.greensInRegulation || 0), 0);
      const totalGreens = rounds.reduce((sum, r) => sum + (r.totalGreens || 0), 0);
      const girPercentage = totalGreens > 0 ? (totalGIR / totalGreens) * 100 : 0;
      
      // Get recent rounds (last 3 months)
      const threeMonthsAgo = subMonths(new Date(), 3);
      const recentRounds = rounds
        .filter(r => new Date(r.date) >= threeMonthsAgo)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // Calculate monthly averages
      const monthlyAverages = Array.from({ length: 12 }, (_, i) => {
        const monthStart = subMonths(new Date(), i);
        const monthEnd = subMonths(new Date(), i - 1);
        const monthRounds = rounds.filter(r => {
          const roundDate = new Date(r.date);
          return roundDate >= monthStart && roundDate < monthEnd;
        });

        if (monthRounds.length === 0) {
          return {
            month: format(monthStart, 'MMM yyyy'),
            roundsPlayed: 0,
            averageScore: 0,
            averagePutts: 0,
            fairwayPercentage: 0,
            girPercentage: 0,
          };
        }

        const monthScores = monthRounds.map(r => r.totalScore);
        const monthPutts = monthRounds.map(r => r.putts || 0);
        const monthFairwaysHit = monthRounds.reduce((sum, r) => sum + (r.fairwaysHit || 0), 0);
        const monthTotalFairways = monthRounds.reduce((sum, r) => sum + (r.totalFairways || 0), 0);
        const monthGIR = monthRounds.reduce((sum, r) => sum + (r.greensInRegulation || 0), 0);
        const monthTotalGreens = monthRounds.reduce((sum, r) => sum + (r.totalGreens || 0), 0);

        return {
          month: format(monthStart, 'MMM yyyy'),
          roundsPlayed: monthRounds.length,
          averageScore: monthScores.reduce((a, b) => a + b, 0) / monthScores.length,
          averagePutts: monthPutts.reduce((a, b) => a + b, 0) / monthPutts.length,
          fairwayPercentage: monthTotalFairways > 0 ? (monthFairwaysHit / monthTotalFairways) * 100 : 0,
          girPercentage: monthTotalGreens > 0 ? (monthGIR / monthTotalGreens) * 100 : 0,
        };
      });

      // Calculate course statistics
      const courseStats = Object.entries(
        rounds.reduce((acc, round) => {
          if (!acc[round.course]) {
            acc[round.course] = [];
          }
          acc[round.course].push(round);
          return acc;
        }, {} as Record<string, Round[]>)
      ).map(([course, courseRounds]) => {
        const courseScores = courseRounds.map(r => r.totalScore);
        return {
          course,
          roundsPlayed: courseRounds.length,
          averageScore: courseScores.reduce((a, b) => a + b, 0) / courseScores.length,
          bestScore: Math.min(...courseScores),
          worstScore: Math.max(...courseScores),
        };
      });

      setStats({
        averageScore,
        bestScore,
        worstScore,
        totalRounds,
        averagePutts,
        fairwayPercentage,
        girPercentage,
        recentRounds,
        monthlyAverages,
        courseStats,
      });
      
      addToast({
        title: 'Demo Mode',
        description: 'Showing simulated statistics data',
        variant: 'default',
      });
      
    } catch (error) {
      console.error('Error calculating statistics:', error);
      addToast({
        title: 'Error',
        description: 'Failed to generate statistics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Add new functions for advanced analytics
  const getTrendData = () => {
    if (!stats) return [];
    return stats.monthlyAverages.map(month => ({
      month: month.month,
      score: month.averageScore,
      putts: month.averagePutts,
      fairways: month.fairwayPercentage,
      gir: month.girPercentage,
    }));
  };

  const getCourseComparisonData = () => {
    if (!stats) return [];
    return stats.courseStats.map(course => ({
      name: course.course,
      average: course.averageScore,
      best: course.bestScore,
      worst: course.worstScore,
    }));
  };

  const getPerformanceDistribution = () => {
    if (!stats) return [];
    const ranges = [
      { name: 'Excellent', range: [stats.bestScore, stats.averageScore - 5] },
      { name: 'Good', range: [stats.averageScore - 5, stats.averageScore] },
      { name: 'Average', range: [stats.averageScore, stats.averageScore + 5] },
      { name: 'Poor', range: [stats.averageScore + 5, stats.worstScore] },
    ];

    return ranges.map(range => ({
      name: range.name,
      value: stats.recentRounds.filter(round => 
        round.totalScore >= range.range[0] && round.totalScore < range.range[1]
      ).length,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Please sign in to view your statistics</h1>
        <Button asChild>
          <a href={localizeUrl('/login', locale)}>Sign In</a>
        </Button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Statistics</h1>
        <p className="mb-4">No statistics available yet. Start recording your rounds to see your stats.</p>
        <Button onClick={calculateStats}>View Demo Stats</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold">Your Golf Statistics</h1>
        <div className="mt-2 md:mt-0 text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          Demo Mode: Sample Data
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              From {stats.totalRounds} rounds
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Best Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bestScore}</div>
            <p className="text-xs text-muted-foreground">
              {stats.averageScore - stats.bestScore > 0
                ? `${(stats.averageScore - stats.bestScore).toFixed(1)} below your average`
                : 'Same as your average'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Putts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averagePutts.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Per round</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Fairways & Greens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.fairwayPercentage.toFixed(1)}% / {stats.girPercentage.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Fairways hit / GIR</p>
          </CardContent>
        </Card>
      </div>

      <TabGroup className="mb-8">
        <TabList>
          <Tab>Performance Trends</Tab>
          <Tab>Course Comparison</Tab>
          <Tab>Shot Distribution</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Card className="p-4">
              <Title>Score & Statistics Trends</Title>
              <Text>Your performance over the last 12 months</Text>
              <div className="h-80 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getTrendData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="score"
                      name="Average Score"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                    <Line type="monotone" dataKey="putts" name="Putts per Round" stroke="#82ca9d" />
                    <Line
                      type="monotone"
                      dataKey="fairways"
                      name="Fairway Hit %"
                      stroke="#ffc658"
                    />
                    <Line type="monotone" dataKey="gir" name="GIR %" stroke="#ff8042" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabPanel>
          <TabPanel>
            <Card className="p-4">
              <Title>Course Performance</Title>
              <Text>How you perform at different courses</Text>
              <div className="h-80 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getCourseComparisonData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="average" name="Average Score" fill="#8884d8" />
                    <Bar dataKey="best" name="Best Score" fill="#82ca9d" />
                    <Bar dataKey="worst" name="Worst Score" fill="#ff8042" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabPanel>
          <TabPanel>
            <Card className="p-4">
              <Title>Performance Distribution</Title>
              <Text>How your scores are distributed</Text>
              <div className="h-80 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getPerformanceDistribution()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {getPerformanceDistribution().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabPanel>
        </TabPanels>
      </TabGroup>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recent Rounds</CardTitle>
          <CardDescription>Your last {stats.recentRounds.length} rounds</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stats.recentRounds.map(round => ({
                  date: format(new Date(round.date), 'MMM d'),
                  score: round.totalScore,
                }))}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 