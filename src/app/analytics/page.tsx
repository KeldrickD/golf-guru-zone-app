'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { BarChart, Activity, TrendingUp, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import { cn } from '@/lib/utils';
import PerformanceHistoryChart from '@/components/charts/PerformanceHistoryChart';
import CourseHeatmapChart from '@/components/charts/CourseHeatmapChart';
import MetricDetailChart from '@/components/charts/MetricDetailChart';

interface RoundStats {
  totalScore: number;
  putts: number;
  fairwaysHit: number;
  greensInRegulation: number;
  totalFairways?: number;
  totalGreens?: number;
  date?: string;
}

// Performance insights for different stat levels
const performanceInsights = {
  putts: [
    { range: [0, 30], label: 'Excellent', color: 'text-green-500 dark:text-green-400' },
    { range: [31, 36], label: 'Good', color: 'text-blue-500 dark:text-blue-400' },
    { range: [37, 42], label: 'Average', color: 'text-amber-500 dark:text-amber-400' },
    { range: [43, 100], label: 'Needs Improvement', color: 'text-red-500 dark:text-red-400' },
  ],
  fairwaysPercentage: [
    { range: [0, 30], label: 'Needs Improvement', color: 'text-red-500 dark:text-red-400' },
    { range: [31, 50], label: 'Average', color: 'text-amber-500 dark:text-amber-400' },
    { range: [51, 70], label: 'Good', color: 'text-blue-500 dark:text-blue-400' },
    { range: [71, 100], label: 'Excellent', color: 'text-green-500 dark:text-green-400' },
  ],
  girPercentage: [
    { range: [0, 20], label: 'Needs Improvement', color: 'text-red-500 dark:text-red-400' },
    { range: [21, 40], label: 'Average', color: 'text-amber-500 dark:text-amber-400' },
    { range: [41, 65], label: 'Good', color: 'text-blue-500 dark:text-blue-400' },
    { range: [66, 100], label: 'Excellent', color: 'text-green-500 dark:text-green-400' },
  ],
};

export default function AnalyticsPage() {
  const today = new Date().toISOString().split('T')[0];

  const [stats, setStats] = useState<RoundStats>({
    totalScore: 85,
    putts: 34,
    fairwaysHit: 7,
    greensInRegulation: 6,
    totalFairways: 14,
    totalGreens: 18,
    date: today,
  });
  
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stats),
      });

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Error analyzing stats:', error);
      setAnalysis('Error analyzing your golf stats. Please try again.');
    }

    setLoading(false);
  };

  // Calculate percentages for fairways and greens
  const fairwaysPercentage = stats.totalFairways ? 
    Math.round((stats.fairwaysHit / stats.totalFairways) * 100) : 0;
  
  const girPercentage = stats.totalGreens ? 
    Math.round((stats.greensInRegulation / stats.totalGreens) * 100) : 0;

  // Determine performance levels
  const getPerformanceLevel = (value: number, category: 'putts' | 'fairwaysPercentage' | 'girPercentage') => {
    return performanceInsights[category].find(
      level => value >= level.range[0] && value <= level.range[1]
    ) || { label: 'Unknown', color: 'text-gray-500' };
  };

  const puttsPerformance = getPerformanceLevel(stats.putts, 'putts');
  const fairwaysPerformance = getPerformanceLevel(fairwaysPercentage, 'fairwaysPercentage');
  const girPerformance = getPerformanceLevel(girPercentage, 'girPercentage');

  return (
    <>
      <PageHeader
        title="Golf Performance Analytics"
        description="Track, analyze and improve your game with data-driven insights"
        icon={BarChart}
        gradient
      />
      
      <Section>
        <div className="w-full">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
            {/* Left side - Input form */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <Card className="shadow-md border-gray-100 dark:border-gray-800 overflow-hidden">
                <CardHeader className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/80 dark:to-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 sm:px-6">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg sm:text-xl font-bold">Round Statistics</CardTitle>
                  </div>
                  <CardDescription className="text-sm sm:text-base">
                    Enter your latest round details for analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-5 sm:space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        Round Date
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={stats.date}
                        onChange={(e) => setStats({ ...stats, date: e.target.value })}
                        max={today}
                        className="focus:ring-primary"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="totalScore" className="text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        Total Score
                      </Label>
                      <Input
                        id="totalScore"
                        type="number"
                        value={stats.totalScore || ''}
                        onChange={(e) => setStats({ ...stats, totalScore: parseInt(e.target.value) || 0 })}
                        min="0"
                        required
                        className="focus:ring-primary"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="putts" className="text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        Total Putts
                      </Label>
                      <Input
                        id="putts"
                        type="number"
                        value={stats.putts || ''}
                        onChange={(e) => setStats({ ...stats, putts: parseInt(e.target.value) || 0 })}
                        min="0"
                        required
                        className="focus:ring-primary"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>&lt;30: Excellent</span>
                        <span>31-36: Good</span>
                        <span>&gt;36: Work Needed</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fairwaysHit" className="text-gray-700 dark:text-gray-300 flex items-center gap-1.5 text-sm sm:text-base">
                          Fairways Hit
                        </Label>
                        <Input
                          id="fairwaysHit"
                          type="number"
                          value={stats.fairwaysHit || ''}
                          onChange={(e) => setStats({ ...stats, fairwaysHit: parseInt(e.target.value) || 0 })}
                          min="0"
                          max={stats.totalFairways}
                          required
                          className="focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="totalFairways" className="text-gray-700 dark:text-gray-300 flex items-center gap-1.5 text-sm sm:text-base">
                          Total Fairways
                        </Label>
                        <Input
                          id="totalFairways"
                          type="number"
                          value={stats.totalFairways || ''}
                          onChange={(e) => setStats({ ...stats, totalFairways: parseInt(e.target.value) || 0 })}
                          min="0"
                          className="focus:ring-primary"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="greensInRegulation" className="text-gray-700 dark:text-gray-300 flex items-center gap-1.5 text-sm sm:text-base">
                          Greens in Reg
                        </Label>
                        <Input
                          id="greensInRegulation"
                          type="number"
                          value={stats.greensInRegulation || ''}
                          onChange={(e) => setStats({ ...stats, greensInRegulation: parseInt(e.target.value) || 0 })}
                          min="0"
                          max={stats.totalGreens}
                          required
                          className="focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="totalGreens" className="text-gray-700 dark:text-gray-300 flex items-center gap-1.5 text-sm sm:text-base">
                          Total Greens
                        </Label>
                        <Input
                          id="totalGreens"
                          type="number"
                          value={stats.totalGreens || ''}
                          onChange={(e) => setStats({ ...stats, totalGreens: parseInt(e.target.value) || 0 })}
                          min="0"
                          className="focus:ring-primary"
                        />
                      </div>
                    </div>
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="pt-2"
                    >
                      <Button type="submit" className="w-full py-5 sm:py-6 text-base" disabled={loading}>
                        {loading ? 'Analyzing Your Round...' : 'Analyze My Game'}
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
              
              {/* Quick Tips Card */}
              <Card className="mt-6 bg-primary/5 dark:bg-primary/10 border-primary/20 shadow-md">
                <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6">
                  <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
                    <PieChart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    Stat Benchmarks
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 py-3 sm:p-4 text-xs sm:text-sm">
                  <ul className="space-y-2 sm:space-y-3">
                    <li className="flex items-center justify-between">
                      <span>Pro Tour Putting Average:</span>
                      <span className="font-medium text-primary">28.5 putts</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Pro Fairways Hit Average:</span>
                      <span className="font-medium text-primary">62%</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Pro GIR Average:</span>
                      <span className="font-medium text-primary">67%</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Average Amateur Score:</span>
                      <span className="font-medium text-primary">95</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            {/* Right side - Performance Metrics & Analysis */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              {/* Performance Metrics */}
              <Card className="shadow-md border-gray-100 dark:border-gray-800 overflow-hidden mb-6">
                <CardHeader className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/80 dark:to-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 sm:px-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg sm:text-xl font-bold">Performance Metrics</CardTitle>
                  </div>
                  <CardDescription className="text-sm sm:text-base">
                    Visual breakdown of your round statistics
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    {/* Putts Performance */}
                    <Card className="shadow-sm">
                      <CardHeader className="py-2 px-3 sm:py-3 sm:px-4">
                        <CardTitle className="text-xs sm:text-sm font-medium">Putting</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 sm:p-4 text-center">
                        <div className="flex flex-col items-center justify-center h-20 sm:h-24">
                          <span className="text-2xl sm:text-3xl font-bold">{stats.putts}</span>
                          <span className="text-2xs sm:text-xs uppercase mt-0.5 sm:mt-1">Total Putts</span>
                          <span className={cn("text-xs sm:text-sm font-medium mt-1 sm:mt-2", puttsPerformance.color)}>
                            {puttsPerformance.label}
                          </span>
                        </div>
                        <div className="mt-2 sm:mt-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 sm:h-2.5">
                          <motion.div 
                            className={cn("h-2 sm:h-2.5 rounded-full", {
                              "bg-red-500": stats.putts > 42,
                              "bg-amber-500": stats.putts > 36 && stats.putts <= 42,
                              "bg-blue-500": stats.putts > 30 && stats.putts <= 36,
                              "bg-green-500": stats.putts <= 30,
                            })}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (stats.putts / 50) * 100)}%` }}
                            transition={{ duration: 1 }}
                          ></motion.div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Fairways Hit Performance */}
                    <Card className="shadow-sm">
                      <CardHeader className="py-2 px-3 sm:py-3 sm:px-4">
                        <CardTitle className="text-xs sm:text-sm font-medium">Fairways Hit</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 sm:p-4 text-center">
                        <div className="flex flex-col items-center justify-center h-20 sm:h-24">
                          <div className="flex items-baseline">
                            <span className="text-2xl sm:text-3xl font-bold">{stats.fairwaysHit}</span>
                            <span className="text-base sm:text-lg text-gray-400 dark:text-gray-500 ml-1">/ {stats.totalFairways}</span>
                          </div>
                          <span className="text-2xs sm:text-xs uppercase mt-0.5 sm:mt-1">{fairwaysPercentage}% Accuracy</span>
                          <span className={cn("text-xs sm:text-sm font-medium mt-1 sm:mt-2", fairwaysPerformance.color)}>
                            {fairwaysPerformance.label}
                          </span>
                        </div>
                        <div className="mt-2 sm:mt-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 sm:h-2.5">
                          <motion.div 
                            className={cn("h-2 sm:h-2.5 rounded-full", {
                              "bg-red-500": fairwaysPercentage < 30,
                              "bg-amber-500": fairwaysPercentage >= 30 && fairwaysPercentage < 50,
                              "bg-blue-500": fairwaysPercentage >= 50 && fairwaysPercentage < 70,
                              "bg-green-500": fairwaysPercentage >= 70,
                            })}
                            initial={{ width: 0 }}
                            animate={{ width: `${fairwaysPercentage}%` }}
                            transition={{ duration: 1 }}
                          ></motion.div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* GIR Performance */}
                    <Card className="shadow-sm sm:col-span-2 md:col-span-1">
                      <CardHeader className="py-2 px-3 sm:py-3 sm:px-4">
                        <CardTitle className="text-xs sm:text-sm font-medium">Greens in Regulation</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 sm:p-4 text-center">
                        <div className="flex flex-col items-center justify-center h-20 sm:h-24">
                          <div className="flex items-baseline">
                            <span className="text-2xl sm:text-3xl font-bold">{stats.greensInRegulation}</span>
                            <span className="text-base sm:text-lg text-gray-400 dark:text-gray-500 ml-1">/ {stats.totalGreens}</span>
                          </div>
                          <span className="text-2xs sm:text-xs uppercase mt-0.5 sm:mt-1">{girPercentage}% Success</span>
                          <span className={cn("text-xs sm:text-sm font-medium mt-1 sm:mt-2", girPerformance.color)}>
                            {girPerformance.label}
                          </span>
                        </div>
                        <div className="mt-2 sm:mt-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 sm:h-2.5">
                          <motion.div 
                            className={cn("h-2 sm:h-2.5 rounded-full", {
                              "bg-red-500": girPercentage < 20,
                              "bg-amber-500": girPercentage >= 20 && girPercentage < 40,
                              "bg-blue-500": girPercentage >= 40 && girPercentage < 65,
                              "bg-green-500": girPercentage >= 65,
                            })}
                            initial={{ width: 0 }}
                            animate={{ width: `${girPercentage}%` }}
                            transition={{ duration: 1 }}
                          ></motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="mt-5 pt-5 sm:mt-6 sm:pt-6 border-t border-gray-100 dark:border-gray-800">
                    <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Score Breakdown</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                      <Card className="shadow-sm bg-gray-50 dark:bg-gray-800/50 text-center p-2.5 sm:p-3">
                        <p className="text-2xs sm:text-xs text-gray-500 dark:text-gray-400">Score</p>
                        <p className="text-xl sm:text-2xl font-bold">{stats.totalScore}</p>
                      </Card>
                      
                      <Card className="shadow-sm bg-gray-50 dark:bg-gray-800/50 text-center p-2.5 sm:p-3">
                        <p className="text-2xs sm:text-xs text-gray-500 dark:text-gray-400">Putts Per Hole</p>
                        <p className="text-xl sm:text-2xl font-bold">{(stats.putts / 18).toFixed(1)}</p>
                      </Card>
                      
                      <Card className="shadow-sm bg-gray-50 dark:bg-gray-800/50 text-center p-2.5 sm:p-3">
                        <p className="text-2xs sm:text-xs text-gray-500 dark:text-gray-400">Non-Putting Strokes</p>
                        <p className="text-xl sm:text-2xl font-bold">{stats.totalScore - stats.putts}</p>
                      </Card>
                      
                      <Card className="shadow-sm bg-gray-50 dark:bg-gray-800/50 text-center p-2.5 sm:p-3">
                        <p className="text-2xs sm:text-xs text-gray-500 dark:text-gray-400">Date</p>
                        <p className="text-base sm:text-lg font-bold">{stats.date ? new Date(stats.date).toLocaleDateString() : "-"}</p>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* AI Analysis Card */}
              {analysis ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="shadow-md border-gray-100 dark:border-gray-800 overflow-hidden">
                    <CardHeader className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/80 dark:to-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 sm:px-6">
                      <div className="flex items-center gap-2">
                        <BarChart className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg sm:text-xl font-bold">AI Game Analysis</CardTitle>
                      </div>
                      <CardDescription className="text-sm sm:text-base">
                        Personalized insights and recommendations
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                      <div className="prose dark:prose-invert prose-sm sm:prose-base max-w-none">
                        <p className="whitespace-pre-line">{analysis}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <Card className="bg-gray-50 dark:bg-gray-900/20 shadow-md border-gray-100 dark:border-gray-800">
                  <CardContent className="p-6 sm:p-10 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 text-gray-500 dark:text-gray-400">
                      <BarChart className="h-12 w-12 sm:h-16 sm:w-16 mb-1 sm:mb-2 text-gray-300 dark:text-gray-600" />
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">
                        Enter your round details
                      </h3>
                      <p className="max-w-md text-sm sm:text-base">
                        Fill out the form with your latest round statistics and click "Analyze My Game" to receive detailed AI-powered insights and improvement tips.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </Section>
      
      {/* New Advanced Visualizations Section */}
      <Section
        title="Advanced Performance Analytics"
        description="Dive deeper into your game with detailed visualizations and trends"
        darkBackground
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PerformanceHistoryChart className="h-full" />
          </div>
          <div>
            <MetricDetailChart className="h-full" />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <CourseHeatmapChart />
          </div>
        </div>
      </Section>
    </>
  );
} 