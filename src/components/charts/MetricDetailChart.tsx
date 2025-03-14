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
  ResponsiveContainer,
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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 shadow-md rounded-md border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value} {entry.unit}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

const ClubDistancesChart = ({ data }: { data: ClubDistance[] }) => {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="club" 
            tick={{ fontSize: 12 }} 
            angle={-45} 
            textAnchor="end"
            height={60}
          />
          <YAxis 
            label={{ value: 'Distance (yards)', angle: -90, position: 'insideLeft', dy: 50, fontSize: 12 }}
            domain={[0, 300]}
          />
          <Tooltip 
            content={(props) => {
              if (props.active && props.payload && props.payload.length) {
                const data = props.payload[0].payload;
                return (
                  <div className="bg-white dark:bg-gray-800 p-3 shadow-md rounded-md border border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium">{data.club}</p>
                    <p className="text-sm text-blue-500">Avg: {data.avgDistance} yards</p>
                    <p className="text-sm text-gray-500">Range: {data.minDistance || '-'} - {data.maxDistance || '-'} yards</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="avgDistance"
            fill="#3b82f6"
            barSize={30}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const ScoringBreakdownChart = ({ data }: { data: ScoringBreakdown[] }) => {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            content={(props) => {
              if (props.active && props.payload && props.payload.length) {
                const data = props.payload[0].payload;
                return (
                  <div className="bg-white dark:bg-gray-800 p-3 shadow-md rounded-md border border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium" style={{ color: data.color }}>{data.name}</p>
                    <p className="text-sm">Count: {data.value}</p>
                    <p className="text-sm">Percentage: {((data.value / data.reduce((acc: number, curr: ScoringBreakdown) => acc + curr.value, 0)) * 100).toFixed(1)}%</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend layout="horizontal" verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const PerformanceRadarChart = ({ data }: { data: PerformanceRadar[] }) => {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid strokeDasharray="3 3" />
          <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
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
                  <div className="bg-white dark:bg-gray-800 p-3 shadow-md rounded-md border border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium">{data.metric}</p>
                    <p className="text-sm text-purple-500">Score: {data.value}/100</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
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
      
      <CardContent className="p-4 sm:p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : hasError ? (
          <div className="text-center py-10">
            <p className="text-red-500 dark:text-red-400">Error loading data</p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <>
            {activeChart === 'clubDistances' && clubsData && (
              <ClubDistancesChart data={clubsData.clubDistances} />
            )}
            {activeChart === 'scoringBreakdown' && scoringData && (
              <ScoringBreakdownChart data={scoringData.scoringBreakdown} />
            )}
            {activeChart === 'performanceRadar' && radarData && (
              <PerformanceRadarChart data={radarData.performanceRadar} />
            )}
            
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              {activeChart === 'clubDistances' && (
                <p>Club distances based on your recorded shots. This data helps you make more informed club selections on the course.
                  {clubsData?.isDefault && (
                    <span className="block mt-2 text-amber-500 dark:text-amber-400">
                      This is sample data. Add your club distances to see personalized data.
                    </span>
                  )}
                </p>
              )}
              {activeChart === 'scoringBreakdown' && (
                <p>Your scoring breakdown from your recent rounds. Focus on reducing doubles and maximizing par opportunities.
                  {scoringData?.isDefault && (
                    <span className="block mt-2 text-amber-500 dark:text-amber-400">
                      This is sample data. Add detailed round information to see your personal scoring breakdown.
                    </span>
                  )}
                </p>
              )}
              {activeChart === 'performanceRadar' && (
                <p>Performance radar showing your strengths and weaknesses compared to your target handicap. Scrambling and putting are your current strengths.
                  {radarData?.isDefault && (
                    <span className="block mt-2 text-amber-500 dark:text-amber-400">
                      This is sample data. Add rounds to see your actual performance metrics.
                    </span>
                  )}
                </p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
} 