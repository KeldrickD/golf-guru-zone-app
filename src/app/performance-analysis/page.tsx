'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { StrokesGainedAnalysis } from '@/components/analysis/StrokesGainedAnalysis';
import { SwingAnalyzer } from '@/components/analysis/SwingAnalyzer';
import { GoalTracker } from '@/components/analysis/GoalTracker';
import { 
  ChartBar, 
  Video, 
  Target, 
  Users, 
  Award
} from 'lucide-react';

export default function PerformanceAnalysisPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('strokes-gained');
  
  // Handle tab selection from URL query parameter
  useEffect(() => {
    if (searchParams) {
      const tab = searchParams.get('tab');
      if (tab && ['strokes-gained', 'swing-analyzer', 'goal-tracker', 'benchmarks'].includes(tab)) {
        setActiveTab(tab);
      }
    }
  }, [searchParams]);

  return (
    <div className="container py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Performance Analysis</h1>
        <p className="text-muted-foreground mt-2">
          Analyze your golf game with advanced metrics and tools
        </p>
      </div>
      
      <Tabs 
        defaultValue="strokes-gained" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="border-b mb-6">
          <TabsList className="mb-0 bg-transparent h-auto p-0">
            <TabsTrigger 
              value="strokes-gained" 
              className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary pb-3 pt-2 px-4 -mb-px"
            >
              <ChartBar className="h-4 w-4" />
              <span>Strokes Gained</span>
            </TabsTrigger>
            <TabsTrigger 
              value="swing-analyzer" 
              className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary pb-3 pt-2 px-4 -mb-px"
            >
              <Video className="h-4 w-4" />
              <span>Swing Analyzer</span>
            </TabsTrigger>
            <TabsTrigger 
              value="goal-tracker" 
              className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary pb-3 pt-2 px-4 -mb-px"
            >
              <Target className="h-4 w-4" />
              <span>Goal Tracker</span>
            </TabsTrigger>
            <TabsTrigger 
              value="benchmarks" 
              className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary pb-3 pt-2 px-4 -mb-px"
            >
              <Users className="h-4 w-4" />
              <span>Benchmarks</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* Strokes Gained Tab */}
        <TabsContent value="strokes-gained" className="mt-0">
          <StrokesGainedAnalysis />
        </TabsContent>
        
        {/* Swing Analyzer Tab */}
        <TabsContent value="swing-analyzer" className="mt-0">
          <SwingAnalyzer />
        </TabsContent>
        
        {/* Goal Tracker Tab */}
        <TabsContent value="goal-tracker" className="mt-0">
          <GoalTracker />
        </TabsContent>
        
        {/* Benchmarks Tab - Coming Soon */}
        <TabsContent value="benchmarks" className="mt-0">
          <div className="rounded-lg border border-dashed p-12 text-center">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Benchmarks Coming Soon</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
              Compare your performance against players of similar handicaps to identify areas for improvement.
              This feature will be available in the next update.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 