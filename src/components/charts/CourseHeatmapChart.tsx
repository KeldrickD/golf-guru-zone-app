'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Target, Map } from 'lucide-react';
import useSWR from 'swr';

// Define hole data type
interface HoleData {
  hole: number;
  par: number;
  length: number;
  fairwayMisses: { 
    left: number; 
    right: number; 
    center: number;
  };
  greenMisses: { 
    short: number;
    long: number;
    left: number;
    right: number;
    hit: number;
  };
}

// API fetcher function for SWR
const fetcher = (url: string) => fetch(url).then(res => res.json());

const generateHeatmapColorClass = (percentage: number) => {
  if (percentage >= 50) return 'bg-red-500';
  if (percentage >= 40) return 'bg-red-400';
  if (percentage >= 30) return 'bg-orange-400';
  if (percentage >= 20) return 'bg-yellow-400';
  if (percentage >= 10) return 'bg-green-300';
  return 'bg-green-200';
};

interface HeatmapCellProps {
  label: string;
  percentage: number;
  isActive: boolean;
}

const HeatmapCell: React.FC<HeatmapCellProps> = ({ label, percentage, isActive }) => {
  const colorClass = generateHeatmapColorClass(percentage);
  
  return (
    <div className={`relative p-1 rounded-md ${isActive ? 'ring-2 ring-primary/70' : ''}`}>
      <div className={`${colorClass} h-full w-full absolute top-0 left-0 rounded opacity-60`} style={{ opacity: percentage / 100 }}></div>
      <div className="relative z-10 flex flex-col items-center justify-center p-2 text-center h-full">
        <span className="text-xs font-medium text-gray-800 dark:text-white">{label}</span>
        <span className="text-sm font-bold">{percentage}%</span>
      </div>
    </div>
  );
};

interface CourseHeatmapChartProps {
  className?: string;
}

const GreenHeatmap = ({ holeData, activeHole }: { holeData: HoleData[], activeHole: number }) => {
  const currentHole = holeData.find(h => h.hole === activeHole) || holeData[0];
  
  return (
    <div className="relative w-full aspect-square max-w-xs mx-auto">
      {/* Green representation */}
      <div className="absolute inset-0 bg-green-600 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-white border border-gray-400 z-10"></div>
        </div>
        
        {/* Miss patterns */}
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Short misses (bottom) */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 flex items-end justify-center p-2">
            <HeatmapCell
              label="Short"
              percentage={currentHole.greenMisses.short}
              isActive={currentHole.greenMisses.short >= 40}
            />
          </div>
          
          {/* Long misses (top) */}
          <div className="absolute top-0 left-0 right-0 h-1/2 flex items-start justify-center p-2">
            <HeatmapCell
              label="Long"
              percentage={currentHole.greenMisses.long}
              isActive={currentHole.greenMisses.long >= 40}
            />
          </div>
          
          {/* Left misses */}
          <div className="absolute top-0 bottom-0 left-0 w-1/2 flex items-center justify-start p-2">
            <HeatmapCell
              label="Left"
              percentage={currentHole.greenMisses.left}
              isActive={currentHole.greenMisses.left >= 40}
            />
          </div>
          
          {/* Right misses */}
          <div className="absolute top-0 bottom-0 right-0 w-1/2 flex items-center justify-end p-2">
            <HeatmapCell
              label="Right"
              percentage={currentHole.greenMisses.right}
              isActive={currentHole.greenMisses.right >= 40}
            />
          </div>
          
          {/* Center hit percentage */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-white dark:bg-gray-800 px-2 py-1 text-xs font-medium">
            <span className="text-primary">{currentHole.greenMisses.hit}%</span> hits
          </div>
        </div>
      </div>
    </div>
  );
};

const FairwayHeatmap = ({ holeData, activeHole }: { holeData: HoleData[], activeHole: number }) => {
  const currentHole = holeData.find(h => h.hole === activeHole) || holeData[0];
  const isPar3 = currentHole.par === 3;
  
  if (isPar3) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">Par 3</p>
          <p className="text-lg font-medium mt-1">No fairway data available</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative w-full h-56 max-w-md mx-auto bg-green-400 dark:bg-green-500/70 rounded-lg border-2 border-white dark:border-gray-800 overflow-hidden">
      {/* Fairway representation */}
      <div className="absolute inset-x-[30%] inset-y-0 bg-green-300 dark:bg-green-400"></div>
      
      {/* Tee box */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-gray-300 dark:bg-gray-600 rounded-sm border border-gray-500"></div>
      
      {/* Miss patterns */}
      <div className="absolute top-0 left-0 w-full h-full">
        {/* Left misses */}
        <div className="absolute inset-y-0 left-0 w-[30%] flex items-center justify-center">
          <HeatmapCell
            label="Left"
            percentage={currentHole.fairwayMisses.left}
            isActive={currentHole.fairwayMisses.left >= 40}
          />
        </div>
        
        {/* Center hits */}
        <div className="absolute inset-y-0 left-[30%] right-[30%] flex items-center justify-center">
          <HeatmapCell
            label="Center"
            percentage={currentHole.fairwayMisses.center}
            isActive={false}
          />
        </div>
        
        {/* Right misses */}
        <div className="absolute inset-y-0 right-0 w-[30%] flex items-center justify-center">
          <HeatmapCell
            label="Right"
            percentage={currentHole.fairwayMisses.right}
            isActive={currentHole.fairwayMisses.right >= 40}
          />
        </div>
      </div>
    </div>
  );
};

export default function CourseHeatmapChart({ className }: CourseHeatmapChartProps) {
  const [activeHole, setActiveHole] = useState<number>(1);
  const [activeView, setActiveView] = useState<'green' | 'fairway'>('green');
  
  // Fetch heatmap data
  const { data, error, isLoading } = useSWR('/api/stats?chart=heatmap', fetcher);
  
  // Use heatmap data from API or empty array if not available
  const holeData: HoleData[] = data?.holeData || [];
  const currentHole = holeData.find(h => h.hole === activeHole) || holeData[0];
  
  const hasNoData = isLoading || error || holeData.length === 0;
  
  return (
    <Card className={`shadow-md border-gray-100 dark:border-gray-800 overflow-hidden ${className}`}>
      <CardHeader className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/80 dark:to-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 sm:px-6 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Target className="h-5 w-5 text-primary" />
            </motion.div>
            <CardTitle className="text-lg sm:text-xl font-bold">Shot Pattern Analysis</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant={activeView === 'green' ? 'default' : 'outline'}
              size="sm"
              className="text-xs"
              onClick={() => setActiveView('green')}
            >
              Green
            </Button>
            <Button
              variant={activeView === 'fairway' ? 'default' : 'outline'}
              size="sm"
              className="text-xs"
              onClick={() => setActiveView('fairway')}
            >
              Fairway
            </Button>
          </div>
        </div>
        
        <CardDescription className="text-sm sm:text-base">
          Visualize your tendencies to miss fairways and greens
        </CardDescription>
        
        {!hasNoData && (
          <>
            <div className="mt-3 grid grid-cols-5 sm:grid-cols-9 gap-1 text-xs">
              {holeData.slice(0, 9).map((hole) => (
                <Button
                  key={`front-${hole.hole}`}
                  variant={activeHole === hole.hole ? 'default' : 'outline'}
                  className="h-8 w-8 p-0 text-xs"
                  onClick={() => setActiveHole(hole.hole)}
                >
                  {hole.hole}
                </Button>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-5 sm:grid-cols-9 gap-1 text-xs">
              {holeData.slice(9).map((hole) => (
                <Button
                  key={`back-${hole.hole}`}
                  variant={activeHole === hole.hole ? 'default' : 'outline'}
                  className="h-8 w-8 p-0 text-xs"
                  onClick={() => setActiveHole(hole.hole)}
                >
                  {hole.hole}
                </Button>
              ))}
            </div>
            
            <div className="mt-4 flex items-center justify-center">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <span className="text-xs text-gray-500">Hole</span>
                  <p className="text-xl font-bold">{currentHole.hole}</p>
                </div>
                <div className="text-center">
                  <span className="text-xs text-gray-500">Par</span>
                  <p className="text-xl font-bold">{currentHole.par}</p>
                </div>
                <div className="text-center">
                  <span className="text-xs text-gray-500">Length</span>
                  <p className="text-xl font-bold">{currentHole.length} <span className="text-xs">yd</span></p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardHeader>
      
      <CardContent className="p-4 sm:p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 dark:text-red-400">Error loading shot pattern data</p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        ) : holeData.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">No shot pattern data available</p>
            <Button 
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Add Shot Data
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {activeView === 'green' ? (
              <>
                <GreenHeatmap holeData={holeData} activeHole={activeHole} />
                <div className="mt-6 text-sm text-center max-w-md mx-auto">
                  {currentHole.greenMisses.hit < 20 ? (
                    <p className="text-red-500 dark:text-red-400 font-medium">
                      You're only hitting this green {currentHole.greenMisses.hit}% of the time. Try focusing on your approach shots.
                    </p>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300">
                      You tend to miss this green {(() => {
                        const misses = currentHole.greenMisses;
                        const maxMiss = Math.max(misses.short, misses.long, misses.left, misses.right);
                        if (maxMiss === misses.short) return 'short';
                        if (maxMiss === misses.long) return 'long';
                        if (maxMiss === misses.left) return 'to the left';
                        return 'to the right';
                      })()} most frequently.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <FairwayHeatmap holeData={holeData} activeHole={activeHole} />
                <div className="mt-6 text-sm text-center max-w-md mx-auto">
                  {currentHole.par === 3 ? (
                    <p className="text-gray-600 dark:text-gray-300">
                      This is a par 3 hole. Focus on your tee shot accuracy to hit the green.
                    </p>
                  ) : currentHole.fairwayMisses.center < 50 ? (
                    <p className="text-amber-500 dark:text-amber-400 font-medium">
                      You're only hitting this fairway {currentHole.fairwayMisses.center}% of the time. Consider using a more accurate club off the tee.
                    </p>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300">
                      You have a tendency to miss this fairway {currentHole.fairwayMisses.left > currentHole.fairwayMisses.right ? 'to the left' : 'to the right'}.
                    </p>
                  )}
                </div>
              </>
            )}
            
            <div className="mt-8 w-full">
              <div className="text-xs text-gray-500 mb-2">Color legend (miss frequency)</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-200 rounded"></div>
                  <span className="text-xs">Low</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-300 rounded"></div>
                  <span className="text-xs">10%+</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                  <span className="text-xs">20%+</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-orange-400 rounded"></div>
                  <span className="text-xs">30%+</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-400 rounded"></div>
                  <span className="text-xs">40%+</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-xs">50%+</span>
                </div>
              </div>
            </div>
            
            {data?.isDefault && (
              <div className="mt-6 text-center">
                <p className="text-amber-500 dark:text-amber-400 text-sm">
                  This is sample data. Track your actual shots to see your personal miss patterns.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 