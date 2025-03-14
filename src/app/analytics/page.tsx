'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { BarChart, Activity, TrendingUp, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import { cn } from '@/lib/utils';
import PerformanceHistoryChart from '@/components/charts/PerformanceHistoryChart';
import CourseHeatmapChart from '@/components/charts/CourseHeatmapChart';
import MetricDetailChart from '@/components/charts/MetricDetailChart';
import StatsComparisonChart from '@/components/charts/StatsComparisonChart';
import { GoalSettingWidget } from '@/components/GoalSettingWidget';
import { useToast } from '@/components/ui/useToast';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

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
  const { toast } = useToast();
  const router = useRouter();
  const { data: session, status } = useSession();
  const formRef = useRef<HTMLFormElement>(null);

  const [stats, setStats] = useState<RoundStats>({
    totalScore: 0,
    putts: 0,
    fairwaysHit: 0,
    greensInRegulation: 0,
    totalFairways: 14,
    totalGreens: 18,
    date: today,
  });
  
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStats(prev => ({
      ...prev,
      [name]: value === '' ? '' : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stats.totalScore || !stats.date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    setIsSubmitting(true);

    try {
      // First, save the round data
      const roundResponse = await fetch('/api/rounds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stats),
      });

      if (!roundResponse.ok) {
        throw new Error('Failed to save round data');
      }

      // Then, get AI analysis
      const analysisResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stats),
      });

      if (!analysisResponse.ok) {
        throw new Error('Failed to analyze round data');
      }

      const data = await analysisResponse.json();
      setAnalysis(data.analysis);
      
      // Show success toast
      toast({
        title: 'Round saved successfully',
        description: 'Your round data has been saved and analyzed.',
        variant: 'default',
      });
      
      // Reset form
      if (formRef.current) {
        formRef.current.reset();
      }
      
      setStats({
        totalScore: 0,
        putts: 0,
        fairwaysHit: 0,
        greensInRegulation: 0,
        totalFairways: 14,
        totalGreens: 18,
        date: today,
      });
      
      // Refresh the data on the page to show the new round
      router.refresh();
    } catch (error) {
      console.error('Error processing stats:', error);
      setAnalysis('Error analyzing your golf stats. Please try again.');
      
      // Show error toast
      toast({
        title: 'Error saving round',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  // Calculate percentages for fairways and greens
  const fairwaysPercentage = stats.totalFairways ? 
    Math.round((stats.fairwaysHit / stats.totalFairways) * 100) : 0;
  
  const girPercentage = stats.totalGreens ? 
    Math.round((stats.greensInRegulation / stats.totalGreens) * 100) : 0;

  // Determine performance levels
  const getPerformanceLevel = (value: number, category: 'putts' | 'fairwaysPercentage' | 'girPercentage') => {
    if (category === 'putts') {
      if (value <= 28) return { level: 'excellent', text: 'Excellent', color: 'text-green-500' };
      if (value <= 32) return { level: 'good', text: 'Good', color: 'text-blue-500' };
      if (value <= 36) return { level: 'average', text: 'Average', color: 'text-yellow-500' };
      return { level: 'needsWork', text: 'Needs Work', color: 'text-red-500' };
    }
    
    if (category === 'fairwaysPercentage') {
      if (value >= 70) return { level: 'excellent', text: 'Excellent', color: 'text-green-500' };
      if (value >= 55) return { level: 'good', text: 'Good', color: 'text-blue-500' };
      if (value >= 40) return { level: 'average', text: 'Average', color: 'text-yellow-500' };
      return { level: 'needsWork', text: 'Needs Work', color: 'text-red-500' };
    }
    
    if (category === 'girPercentage') {
      if (value >= 65) return { level: 'excellent', text: 'Excellent', color: 'text-green-500' };
      if (value >= 50) return { level: 'good', text: 'Good', color: 'text-blue-500' };
      if (value >= 35) return { level: 'average', text: 'Average', color: 'text-yellow-500' };
      return { level: 'needsWork', text: 'Needs Work', color: 'text-red-500' };
    }
    
    return { level: 'unknown', text: 'Unknown', color: 'text-gray-500' };
  };

  const puttsLevel = getPerformanceLevel(stats.putts, 'putts');
  const fairwaysLevel = getPerformanceLevel(fairwaysPercentage, 'fairwaysPercentage');
  const girLevel = getPerformanceLevel(girPercentage, 'girPercentage');

  if (status === 'unauthenticated') {
    return (
      <>
        <PageHeader
          title="Golf Performance Analytics"
          description="Track, analyze and improve your game with data-driven insights"
          icon={BarChart}
          gradient
        />
        
        <Section>
          <Card className="max-w-md mx-auto text-center p-6">
            <CardHeader>
              <CardTitle>Sign In Required</CardTitle>
              <CardDescription>
                Please sign in to access your golf analytics and track your performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push('/signin')}>
                Sign In
              </Button>
            </CardContent>
          </Card>
        </Section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Golf Performance Analytics"
        description="Track, analyze and improve your game with data-driven insights"
        icon={BarChart}
        gradient
      />
      
      <Section>
        <Tabs defaultValue="visualizations" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
            <TabsTrigger value="input">Enter Round Stats</TabsTrigger>
            <TabsTrigger value="goals">Goals & Progress</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visualizations" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PerformanceHistoryChart className="md:col-span-2" />
              <CourseHeatmapChart />
              <MetricDetailChart />
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <StatsComparisonChart />
            </div>
          </TabsContent>
          
          <TabsContent value="input">
            <Card className="w-full max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Enter Round Statistics</CardTitle>
                <CardDescription>
                  Record your latest round to track your progress over time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="date">Round Date</Label>
                      <Input 
                        id="date"
                        name="date"
                        type="date" 
                        value={stats.date || ''}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="totalScore">Total Score</Label>
                      <Input 
                        id="totalScore"
                        name="totalScore"
                        type="number" 
                        value={stats.totalScore || ''}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="putts">Putts</Label>
                      <Input 
                        id="putts"
                        name="putts"
                        type="number" 
                        value={stats.putts || ''}
                        onChange={handleChange}
                      />
                      <p className={`text-xs ${puttsLevel.color}`}>
                        {stats.putts > 0 ? puttsLevel.text : 'Enter value'}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <Label htmlFor="fairwaysHit">Fairways Hit</Label>
                          <Input 
                            id="fairwaysHit"
                            name="fairwaysHit"
                            type="number" 
                            value={stats.fairwaysHit || ''}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="flex-1">
                          <Label htmlFor="totalFairways">Total Fairways</Label>
                          <Input 
                            id="totalFairways"
                            name="totalFairways"
                            type="number" 
                            value={stats.totalFairways || ''}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <p className={`text-xs ${fairwaysLevel.color}`}>
                        {stats.fairwaysHit > 0 ? `${fairwaysPercentage}% - ${fairwaysLevel.text}` : 'Enter values'}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <Label htmlFor="greensInRegulation">Greens in Regulation</Label>
                          <Input 
                            id="greensInRegulation"
                            name="greensInRegulation"
                            type="number" 
                            value={stats.greensInRegulation || ''}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="flex-1">
                          <Label htmlFor="totalGreens">Total Greens</Label>
                          <Input 
                            id="totalGreens"
                            name="totalGreens"
                            type="number" 
                            value={stats.totalGreens || ''}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <p className={`text-xs ${girLevel.color}`}>
                        {stats.greensInRegulation > 0 ? `${girPercentage}% - ${girLevel.text}` : 'Enter values'}
                      </p>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => formRef.current?.reset()}>Reset</Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Round'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="goals">
            <GoalSettingWidget />
          </TabsContent>
        </Tabs>
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