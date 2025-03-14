'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { InfoIcon, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
  TooltipProps
} from 'recharts';
import { ResponsiveChartContainer } from '../charts/ResponsiveChartContainer';
import { ResponsiveTooltip } from '@/components/ui/ResponsiveTooltip';

// Types for strokes gained data
interface StrokesGainedData {
  category: string;
  value: number;
  benchmark: number;
  potential: number;
}

interface RoundData {
  id: string;
  date: string;
  course: string;
  totalScore: number;
  strokesGained: {
    total: number;
    driving: number;
    approach: number;
    shortGame: number;
    putting: number;
  };
}

// Mock data for strokes gained
const mockStrokesGainedData: StrokesGainedData[] = [
  { 
    category: 'Driving', 
    value: -0.2, 
    benchmark: 0, 
    potential: 0.8 
  },
  { 
    category: 'Approach', 
    value: 0.5, 
    benchmark: 0, 
    potential: 1.2 
  },
  { 
    category: 'Short Game', 
    value: -0.7, 
    benchmark: 0, 
    potential: 0.5 
  },
  { 
    category: 'Putting', 
    value: 0.3, 
    benchmark: 0, 
    potential: 0.9 
  },
];

// Mock data for round history
const mockRoundHistory: RoundData[] = [
  {
    id: '1',
    date: '2023-09-10',
    course: 'Pebble Beach',
    totalScore: 82,
    strokesGained: {
      total: -0.1,
      driving: -0.2,
      approach: 0.5,
      shortGame: -0.7,
      putting: 0.3,
    }
  },
  {
    id: '2',
    date: '2023-09-03',
    course: 'Pine Valley',
    totalScore: 85,
    strokesGained: {
      total: -1.2,
      driving: -0.5,
      approach: 0.1,
      shortGame: -1.1,
      putting: 0.3,
    }
  },
  {
    id: '3',
    date: '2023-08-27',
    course: 'Augusta National',
    totalScore: 78,
    strokesGained: {
      total: 1.8,
      driving: 0.3,
      approach: 0.7,
      shortGame: 0.2,
      putting: 0.6,
    }
  },
  {
    id: '4',
    date: '2023-08-20',
    course: 'St Andrews',
    totalScore: 81,
    strokesGained: {
      total: 0.2,
      driving: 0.1,
      approach: 0.3,
      shortGame: -0.5,
      putting: 0.3,
    }
  },
  {
    id: '5',
    date: '2023-08-13',
    course: 'Shinnecock Hills',
    totalScore: 84,
    strokesGained: {
      total: -0.9,
      driving: -0.4,
      approach: -0.2,
      shortGame: -0.6,
      putting: 0.3,
    }
  },
];

export function StrokesGainedAnalysis() {
  const [benchmarkType, setBenchmarkType] = useState<'scratch' | 'handicap' | 'tour'>('handicap');
  const [roundsToShow, setRoundsToShow] = useState<number>(5);
  const [categoryView, setCategoryView] = useState<'all' | 'driving' | 'approach' | 'shortGame' | 'putting'>('all');

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <ResponsiveTooltip
          labelFormatter={() => label}
          contentFormatter={() => (
            <>
              {payload.map((entry, index) => (
                <div key={`item-${index}`} className="flex items-center justify-between text-xs sm:text-sm mt-1">
                  <span className="font-medium" style={{ color: entry.color }}>
                    {entry.name}:
                  </span>
                  <span className="ml-2">{entry.value?.toFixed(2)}</span>
                </div>
              ))}
              <div className="mt-2 pt-1 border-t border-gray-200 dark:border-gray-700 text-xs">
                {categoryView === 'all' 
                  ? 'Positive values indicate strokes gained relative to benchmark'
                  : `${label}: ${payload[0]?.value?.toFixed(2)} strokes gained`}
              </div>
            </>
          )}
        />
      );
    }
    return null;
  };

  // Filter data based on selected category
  const getCategoryData = () => {
    if (categoryView === 'all') {
      return mockStrokesGainedData;
    }
    
    return mockStrokesGainedData.filter(item => 
      item.category.toLowerCase() === categoryView.toLowerCase()
    );
  };

  // Transform round history for the trend chart
  const getTrendData = () => {
    return mockRoundHistory.slice(0, roundsToShow).reverse().map(round => {
      const { date, course, strokesGained, totalScore } = round;
      
      // If a specific category is selected, only return that data
      if (categoryView !== 'all') {
        return {
          name: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          [categoryView]: strokesGained[categoryView as keyof typeof strokesGained],
          course,
          totalScore
        };
      }
      
      // Otherwise return all categories
      return {
        name: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        driving: strokesGained.driving,
        approach: strokesGained.approach,
        shortGame: strokesGained.shortGame,
        putting: strokesGained.putting,
        course,
        totalScore
      };
    });
  };

  // Get description based on benchmark type
  const getBenchmarkDescription = () => {
    switch (benchmarkType) {
      case 'scratch':
        return 'Comparing to scratch golfers (0 handicap)';
      case 'handicap':
        return 'Comparing to golfers of similar handicap (10-12)';
      case 'tour':
        return 'Comparing to PGA Tour averages';
      default:
        return '';
    }
  };

  // Get insights from the data
  const getInsights = () => {
    // Find the best and worst categories
    const sortedData = [...mockStrokesGainedData].sort((a, b) => b.value - a.value);
    const bestCategory = sortedData[0];
    const worstCategory = sortedData[sortedData.length - 1];
    
    // Calculate total strokes gained/lost
    const totalStrokesGained = mockStrokesGainedData.reduce((sum, item) => sum + item.value, 0);
    
    return {
      bestCategory,
      worstCategory,
      totalStrokesGained
    };
  };

  const insights = getInsights();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Strokes Gained Analysis</CardTitle>
            <CardDescription>
              {getBenchmarkDescription()}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select 
              value={benchmarkType} 
              onValueChange={(value) => setBenchmarkType(value as 'scratch' | 'handicap' | 'tour')}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Benchmark" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scratch">Scratch Golfers</SelectItem>
                <SelectItem value="handicap">Similar Handicap</SelectItem>
                <SelectItem value="tour">Tour Players</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="ml-2">
              <InfoIcon className="h-4 w-4" />
              <span className="sr-only">Info</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="py-3">
              <CardDescription>Total Strokes Gained</CardDescription>
            </CardHeader>
            <CardContent className="py-1">
              <div className={`text-2xl font-bold ${insights.totalStrokesGained >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {insights.totalStrokesGained.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                vs {benchmarkType === 'handicap' ? 'similar players' : benchmarkType === 'scratch' ? 'scratch golfers' : 'tour average'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-3">
              <CardDescription>Strength</CardDescription>
            </CardHeader>
            <CardContent className="py-1">
              <div className="text-2xl font-bold text-green-600">
                {insights.bestCategory.category}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {insights.bestCategory.value.toFixed(2)} strokes gained per round
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-3">
              <CardDescription>Improvement Area</CardDescription>
            </CardHeader>
            <CardContent className="py-1">
              <div className="text-2xl font-bold text-amber-600">
                {insights.worstCategory.category}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {insights.worstCategory.value.toFixed(2)} strokes gained per round
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category filter tabs */}
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-muted-foreground">Filter:</span>
          <div className="flex overflow-auto py-1 hide-scrollbar">
            <Button 
              variant={categoryView === 'all' ? 'default' : 'outline'} 
              onClick={() => setCategoryView('all')}
              size="sm"
              className="rounded-full text-xs"
            >
              All Categories
            </Button>
            <Button 
              variant={categoryView === 'driving' ? 'default' : 'outline'} 
              onClick={() => setCategoryView('driving')}
              size="sm"
              className="ml-2 rounded-full text-xs"
            >
              Driving
            </Button>
            <Button 
              variant={categoryView === 'approach' ? 'default' : 'outline'} 
              onClick={() => setCategoryView('approach')}
              size="sm"
              className="ml-2 rounded-full text-xs"
            >
              Approach
            </Button>
            <Button 
              variant={categoryView === 'shortGame' ? 'default' : 'outline'} 
              onClick={() => setCategoryView('shortGame')}
              size="sm"
              className="ml-2 rounded-full text-xs"
            >
              Short Game
            </Button>
            <Button 
              variant={categoryView === 'putting' ? 'default' : 'outline'} 
              onClick={() => setCategoryView('putting')}
              size="sm"
              className="ml-2 rounded-full text-xs"
            >
              Putting
            </Button>
          </div>
        </div>

        {/* Main charts */}
        <Tabs defaultValue="category">
          <TabsList className="mb-4">
            <TabsTrigger value="category" className="gap-1">
              <BarChart3 className="h-4 w-4" />
              <span>Categories</span>
            </TabsTrigger>
            <TabsTrigger value="trend" className="gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>Trends</span>
            </TabsTrigger>
            <TabsTrigger value="distribution" className="gap-1">
              <PieChart className="h-4 w-4" />
              <span>Distribution</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Category comparison chart */}
          <TabsContent value="category" className="mt-0">
            <div className="h-[300px] max-w-full mx-auto">
              <ResponsiveChartContainer
                aspectRatio={{ desktop: 2, tablet: 1.6, mobile: 1.2 }}
                minHeight={300}
                maxHeight={400}
              >
                <BarChart
                  data={getCategoryData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="category" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis 
                    tickFormatter={(value) => value.toFixed(1)}
                    tick={{ fontSize: 12 }}
                    domain={[-2, 2]}
                    tickLine={false}
                  />
                  <Tooltip content={CustomTooltip as any} />
                  <Legend />
                  <ReferenceLine y={0} stroke="#666" />
                  <Bar 
                    dataKey="value" 
                    name="Your Performance" 
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="potential" 
                    name="Potential Improvement" 
                    fill="#93c5fd" 
                    radius={[4, 4, 0, 0]} 
                    fillOpacity={0.4}
                  />
                </BarChart>
              </ResponsiveChartContainer>
            </div>
            <div className="text-center mt-2 text-sm text-muted-foreground">
              <p>Strokes gained relative to {benchmarkType === 'handicap' ? 'similar handicap players' : benchmarkType === 'scratch' ? 'scratch golfers' : 'PGA Tour average'}</p>
            </div>
          </TabsContent>
          
          {/* Trend chart */}
          <TabsContent value="trend" className="mt-0">
            <div className="flex items-center justify-end mb-2">
              <Select 
                value={roundsToShow.toString()} 
                onValueChange={(value) => setRoundsToShow(parseInt(value))}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Rounds to show" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">Last 5 Rounds</SelectItem>
                  <SelectItem value="10">Last 10 Rounds</SelectItem>
                  <SelectItem value="20">Last 20 Rounds</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="h-[300px] max-w-full mx-auto">
              <ResponsiveChartContainer
                aspectRatio={{ desktop: 2, tablet: 1.6, mobile: 1.2 }}
                minHeight={300}
                maxHeight={400}
              >
                <BarChart
                  data={getTrendData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tickFormatter={(value) => value.toFixed(1)}
                    tick={{ fontSize: 12 }}
                    domain={[-2, 2]}
                    tickLine={false}
                  />
                  <Tooltip content={CustomTooltip as any} />
                  <Legend />
                  <ReferenceLine y={0} stroke="#666" />
                  {categoryView === 'all' ? (
                    <>
                      <Bar dataKey="driving" name="Driving" stackId="a" fill="#3b82f6" />
                      <Bar dataKey="approach" name="Approach" stackId="a" fill="#10b981" />
                      <Bar dataKey="shortGame" name="Short Game" stackId="a" fill="#f59e0b" />
                      <Bar dataKey="putting" name="Putting" stackId="a" fill="#ef4444" />
                    </>
                  ) : (
                    <Bar 
                      dataKey={categoryView} 
                      name={categoryView.charAt(0).toUpperCase() + categoryView.slice(1)} 
                      fill="#3b82f6"
                    />
                  )}
                </BarChart>
              </ResponsiveChartContainer>
            </div>
            <div className="text-center mt-2 text-sm text-muted-foreground">
              <p>Strokes gained trend over your last {roundsToShow} rounds</p>
            </div>
          </TabsContent>
          
          {/* Distribution chart */}
          <TabsContent value="distribution" className="mt-0">
            <div className="h-[300px] max-w-full mx-auto text-center py-4">
              <p className="text-muted-foreground text-sm mb-4">Coming soon: Detailed distribution of your strokes gained by shot type and distance</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-2xl mx-auto">
                <div className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-2">
                    <span className="text-blue-600 dark:text-blue-300 font-medium">D</span>
                  </div>
                  <div className="text-sm font-medium">Driving</div>
                  <div className="text-xl font-bold">{mockStrokesGainedData[0].value.toFixed(1)}</div>
                </div>
                <div className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-2">
                    <span className="text-green-600 dark:text-green-300 font-medium">A</span>
                  </div>
                  <div className="text-sm font-medium">Approach</div>
                  <div className="text-xl font-bold">{mockStrokesGainedData[1].value.toFixed(1)}</div>
                </div>
                <div className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mb-2">
                    <span className="text-yellow-600 dark:text-yellow-300 font-medium">S</span>
                  </div>
                  <div className="text-sm font-medium">Short Game</div>
                  <div className="text-xl font-bold">{mockStrokesGainedData[2].value.toFixed(1)}</div>
                </div>
                <div className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-2">
                    <span className="text-red-600 dark:text-red-300 font-medium">P</span>
                  </div>
                  <div className="text-sm font-medium">Putting</div>
                  <div className="text-xl font-bold">{mockStrokesGainedData[3].value.toFixed(1)}</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Learning resources */}
        <div className="mt-4 bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Understanding Strokes Gained</h4>
          <p className="text-sm text-muted-foreground mb-2">
            Strokes Gained measures your performance relative to a benchmark, showing how many strokes you gain or lose in each area of your game.
          </p>
          <Button variant="link" className="text-xs h-auto p-0 text-primary">
            Learn more about Strokes Gained
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 