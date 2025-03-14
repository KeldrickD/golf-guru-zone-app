'use client';

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { PieChart as PieChartIcon, BarChart3, Activity } from 'lucide-react';
import useSWR from 'swr';
import { ResponsiveChartContainer } from './ResponsiveChartContainer';
import { ResponsiveTooltip } from '@/components/ui/ResponsiveTooltip';

// Define types for our data
interface ClubDistance {
  club: string;
  avgDistance: number;
  minDistance: number | null;
  maxDistance: number | null;
}

interface ScoringBreakdown {
  name: string;
  value: number;
  color: string;
}

interface PerformanceRadar {
  metric: string;
  value: number;
  fullMark: number;
}

// API fetcher function for SWR
const fetcher = (url: string) => fetch(url).then(res => res.json());

const ClubDistancesChart = ({ data }: { data: ClubDistance[] }) => {
  return (
    <ResponsiveChartContainer
      aspectRatio={{ desktop: 2, tablet: 1.5, mobile: 0.8 }}
      minHeight={300}
      maxHeight={500}
    >
      <BarChart
        data={data}
        margin={{ top: 20, right: 10, left: 10, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis 
          dataKey="club" 
          tick={{ fontSize: 10 }} 
          angle={-45} 
          textAnchor="end"
          height={60}
          tickLine={false}
        />
        <YAxis 
          label={{ 
            value: 'Yards', 
            angle: -90, 
            position: 'insideLeft', 
            dy: 50, 
            fontSize: 12,
            offset: -5
          }}
          domain={[0, 'auto']}
          tick={{ fontSize: 10 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip 
          content={(props) => {
            if (props.active && props.payload && props.payload.length) {
              const data = props.payload[0].payload;
              return (
                <ResponsiveTooltip
                  {...props}
                  labelFormatter={() => data.club}
                  contentFormatter={() => (
                    <>
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="font-medium text-blue-500">Avg:</span>
                        <span>{data.avgDistance} yards</span>
                      </div>
                      {(data.minDistance || data.maxDistance) && (
                        <div className="flex items-center justify-between text-xs sm:text-sm mt-1">
                          <span className="font-medium text-gray-500">Range:</span>
                          <span>{data.minDistance || '-'} - {data.maxDistance || '-'} yards</span>
                        </div>
                      )}
                    </>
                  )}
                />
              );
            }
            return null;
          }}
        />
        <Legend 
          wrapperStyle={{ paddingTop: 10, fontSize: '0.75rem' }}
          iconSize={8}
        />
        <Bar
          dataKey="avgDistance"
          fill="#3b82f6"
          barSize={20}
          radius={[4, 4, 0, 0]}
          name="Avg Distance (yards)"
        />
      </BarChart>
    </ResponsiveChartContainer>
  );
};

const ScoringBreakdownChart = ({ data }: { data: ScoringBreakdown[] }) => {
  return (
    <ResponsiveChartContainer
      aspectRatio={{ desktop: 1.5, tablet: 1.2, mobile: 1 }}
      minHeight={300}
      maxHeight={400}
    >
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius="70%"
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => 
            window.innerWidth < 640 
              ? `${(percent * 100).toFixed(0)}%` 
              : `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          content={(props) => {
            if (props.active && props.payload && props.payload.length) {
              const data = props.payload[0].payload;
              const total = props.payload.reduce((sum, entry) => sum + entry.payload.value, 0);
              const percentage = ((data.value / total) * 100).toFixed(1);
              
              return (
                <ResponsiveTooltip
                  {...props}
                  labelFormatter={() => data.name}
                  contentFormatter={() => (
                    <>
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="font-medium">Count:</span>
                        <span>{data.value}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs sm:text-sm mt-1">
                        <span className="font-medium">Percentage:</span>
                        <span>{percentage}%</span>
                      </div>
                    </>
                  )}
                  wrapperClassName="border-l-4"
                  labelClassName="font-bold"
                  style={{ borderLeftColor: data.color }}
                />
              );
            }
            return null;
          }}
        />
        <Legend 
          layout="horizontal" 
          verticalAlign="bottom" 
          align="center"
          wrapperStyle={{ paddingTop: 10, fontSize: '0.75rem' }}
          iconSize={8}
        />
      </PieChart>
    </ResponsiveChartContainer>
  );
};

const PerformanceRadarChart = ({ data }: { data: PerformanceRadar[] }) => {
  return (
    <ResponsiveChartContainer
      aspectRatio={{ desktop: 1.5, tablet: 1.2, mobile: 1 }}
      minHeight={300}
      maxHeight={400}
    >
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid strokeDasharray="3 3" />
        <PolarAngleAxis 
          dataKey="metric" 
          tick={{ fontSize: 10 }}
        />
        <PolarRadiusAxis 
          angle={30} 
          domain={[0, 100]} 
          tick={{ fontSize: 10 }}
        />
        <Radar
          name="Your Performance"
          dataKey="value"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
        <Tooltip 
          content={(props) => {
            if (props.active && props.payload && props.payload.length) {
              const data = props.payload[0].payload;
              return (
                <ResponsiveTooltip
                  {...props}
                  labelFormatter={() => data.metric}
                  contentFormatter={() => (
                    <>
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="font-medium text-purple-500">Score:</span>
                        <span>{data.value}/100</span>
                      </div>
                    </>
                  )}
                />
              );
            }
            return null;
          }}
        />
        <Legend 
          wrapperStyle={{ paddingTop: 10, fontSize: '0.75rem' }}
          iconSize={8}
        />
      </RadarChart>
    </ResponsiveChartContainer>
  );
};

interface MetricDetailChartProps {
  className?: string;
}

export default function MetricDetailChart({ className }: MetricDetailChartProps) {
  const [activeChart, setActiveChart] = useState<'clubDistances' | 'scoringBreakdown' | 'performanceRadar'>('clubDistances');
  
  // Fetch club distances
  const { data: clubsData, error: clubsError, isLoading: clubsLoading } = useSWR('/api/clubs', fetcher);
  
  // Fetch scoring data
  const { data: scoringData, error: scoringError, isLoading: scoringLoading } = useSWR('/api/stats?chart=scoring', fetcher);
  
  // Fetch radar data
  const { data: radarData, error: radarError, isLoading: radarLoading } = useSWR('/api/stats?chart=radar', fetcher);
  
  // Determine if we're loading based on which chart is active
  const isLoading = 
    (activeChart === 'clubDistances' && clubsLoading) ||
    (activeChart === 'scoringBreakdown' && scoringLoading) ||
    (activeChart === 'performanceRadar' && radarLoading);
  
  // Determine if there's an error based on which chart is active
  const hasError = 
    (activeChart === 'clubDistances' && clubsError) ||
    (activeChart === 'scoringBreakdown' && scoringError) ||
    (activeChart === 'performanceRadar' && radarError);
  
  return (
    <Card className={`shadow-md border-gray-100 dark:border-gray-800 overflow-hidden ${className}`}>
      <CardHeader className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/80 dark:to-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 sm:px-6 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Activity className="h-5 w-5 text-primary" />
            </motion.div>
            <CardTitle className="text-lg sm:text-xl font-bold">Advanced Performance Metrics</CardTitle>
          </div>
        </div>
        
        <CardDescription className="text-sm sm:text-base">
          Detailed breakdown of your golf game statistics
        </CardDescription>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <Button 
            variant={activeChart === 'clubDistances' ? 'default' : 'outline'} 
            onClick={() => setActiveChart('clubDistances')}
            size="sm" 
            className="text-xs rounded-full flex items-center gap-1"
          >
            <BarChart3 className="h-3 w-3" />
            <span>Club Distances</span>
          </Button>
          <Button 
            variant={activeChart === 'scoringBreakdown' ? 'default' : 'outline'} 
            onClick={() => setActiveChart('scoringBreakdown')}
            size="sm" 
            className="text-xs rounded-full flex items-center gap-1"
          >
            <PieChartIcon className="h-3 w-3" />
            <span>Scoring Breakdown</span>
          </Button>
          <Button 
            variant={activeChart === 'performanceRadar' ? 'default' : 'outline'} 
            onClick={() => setActiveChart('performanceRadar')}
            size="sm" 
            className="text-xs rounded-full flex items-center gap-1"
          >
            <Activity className="h-3 w-3" />
            <span>Performance Radar</span>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-2 sm:p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-60 sm:h-80">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : hasError ? (
          <div className="text-center py-10">
            <p className="text-red-500 dark:text-red-400">Error loading data</p>
            <Button 
              onClick={() => {
                if (activeChart === 'clubDistances') {
                  // @ts-ignore
                  clubsData.mutate();
                } else if (activeChart === 'scoringBreakdown') {
                  // @ts-ignore
                  scoringData.mutate();
                } else {
                  // @ts-ignore
                  radarData.mutate();
                }
              }}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <div className="mt-2">
            {activeChart === 'clubDistances' && clubsData && (
              <ClubDistancesChart data={clubsData.clubDistances} />
            )}
            {activeChart === 'scoringBreakdown' && scoringData && (
              <ScoringBreakdownChart data={scoringData.scoringBreakdown} />
            )}
            {activeChart === 'performanceRadar' && radarData && (
              <PerformanceRadarChart data={radarData.performance} />
            )}
            
            <div className="mt-4 space-y-2 text-sm">
              {activeChart === 'clubDistances' && (
                <p className="text-gray-600 dark:text-gray-300">
                  This chart shows your average distances with each club. Use this data to make better club selections on the course.
                </p>
              )}
              {activeChart === 'scoringBreakdown' && (
                <p className="text-gray-600 dark:text-gray-300">
                  This chart breaks down your scoring patterns. Understanding where your strokes are coming from can help you focus practice time.
                </p>
              )}
              {activeChart === 'performanceRadar' && (
                <p className="text-gray-600 dark:text-gray-300">
                  The radar chart shows your performance across key metrics compared to your potential. Higher scores indicate stronger areas of your game.
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 