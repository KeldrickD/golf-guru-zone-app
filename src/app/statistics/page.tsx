'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useToast } from '@/hooks/use-toast';
import { format, subMonths, subYears } from 'date-fns';
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

export default function StatisticsPage() {
  const { data: session } = useSession();
  const { addToast } = useToast();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  // Add new state for advanced analytics
  const [timeframe, setTimeframe] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('score');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/rounds');
      if (!response.ok) {
        throw new Error('Failed to fetch rounds');
      }
      const rounds: Round[] = await response.json();
      
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
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to fetch statistics',
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

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">No rounds recorded yet</h2>
          <p className="text-gray-500 mt-2">Start recording your rounds to see your statistics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Statistics</h1>

        <TabGroup>
          <TabList className="mb-8">
            <Tab>Overview</Tab>
            <Tab>Performance Trends</Tab>
            <Tab>Course Analysis</Tab>
            <Tab>Advanced Analytics</Tab>
          </TabList>

          <TabPanels>
            {/* Overview Tab */}
            <TabPanel>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Rounds</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{stats?.totalRounds}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Average Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{stats?.averageScore.toFixed(1)}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Best Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{stats?.bestScore}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Worst Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{stats?.worstScore}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Average Putts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{stats?.averagePutts.toFixed(1)}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Fairway Percentage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{stats?.fairwayPercentage.toFixed(1)}%</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>GIR Percentage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{stats?.girPercentage.toFixed(1)}%</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Score Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getPerformanceDistribution()}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                          >
                            {getPerformanceDistribution().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Course Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getCourseComparisonData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="average" name="Average Score" fill="#8884d8" />
                          <Bar dataKey="best" name="Best Score" fill="#82ca9d" />
                          <Bar dataKey="worst" name="Worst Score" fill="#ffc658" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabPanel>

            {/* Performance Trends Tab */}
            <TabPanel>
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>Track your progress over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={getTrendData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="score" name="Average Score" stroke="#8884d8" />
                        <Line type="monotone" dataKey="putts" name="Average Putts" stroke="#82ca9d" />
                        <Line type="monotone" dataKey="fairways" name="Fairway %" stroke="#ffc658" />
                        <Line type="monotone" dataKey="gir" name="GIR %" stroke="#ff7300" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabPanel>

            {/* Course Analysis Tab */}
            <TabPanel>
              <Card>
                <CardHeader>
                  <CardTitle>Course Analysis</CardTitle>
                  <CardDescription>Detailed breakdown by course</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {stats?.courseStats.map((course) => (
                      <div key={course.course} className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-medium mb-2">{course.course}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Rounds Played</p>
                            <p className="text-xl font-bold">{course.roundsPlayed}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Average Score</p>
                            <p className="text-xl font-bold">{course.averageScore.toFixed(1)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Best Score</p>
                            <p className="text-xl font-bold">{course.bestScore}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Worst Score</p>
                            <p className="text-xl font-bold">{course.worstScore}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabPanel>

            {/* Advanced Analytics Tab */}
            <TabPanel>
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Analytics</CardTitle>
                  <CardDescription>Detailed performance metrics and insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <select
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="all">All Time</option>
                        <option value="year">Last Year</option>
                        <option value="6months">Last 6 Months</option>
                        <option value="3months">Last 3 Months</option>
                      </select>

                      <select
                        value={selectedMetric}
                        onChange={(e) => setSelectedMetric(e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="score">Score</option>
                        <option value="putts">Putts</option>
                        <option value="fairways">Fairways</option>
                        <option value="gir">GIR</option>
                      </select>
                    </div>

                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={getTrendData()}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey={selectedMetric}
                            stroke="#8884d8"
                            fillOpacity={1}
                            fill="url(#colorValue)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Performance Insights</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            <li>• Your average score has {stats?.averageScore > 0 ? 'improved' : 'declined'} by X strokes</li>
                            <li>• You're hitting {stats?.fairwayPercentage.toFixed(1)}% of fairways</li>
                            <li>• Your GIR percentage is {stats?.girPercentage.toFixed(1)}%</li>
                            <li>• You're averaging {stats?.averagePutts.toFixed(1)} putts per round</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Trend Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            <li>• Best performing month: {stats?.monthlyAverages.reduce((a, b) => a.averageScore < b.averageScore ? a : b).month}</li>
                            <li>• Most consistent course: {stats?.courseStats.reduce((a, b) => (a.worstScore - a.bestScore) < (b.worstScore - b.bestScore) ? a : b).course}</li>
                            <li>• Improvement trend: {stats?.monthlyAverages[0].averageScore > stats?.monthlyAverages[stats.monthlyAverages.length - 1].averageScore ? 'Positive' : 'Negative'}</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
} 