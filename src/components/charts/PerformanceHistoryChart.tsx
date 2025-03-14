'use client';

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart,
  Bar
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

// Sample historical data
const last10Rounds = [
  { date: '2023-10-01', score: 89, putts: 36, fairwaysHitPercent: 45, girPercent: 28 },
  { date: '2023-10-15', score: 87, putts: 35, fairwaysHitPercent: 50, girPercent: 33 },
  { date: '2023-10-30', score: 86, putts: 34, fairwaysHitPercent: 48, girPercent: 33 },
  { date: '2023-11-12', score: 84, putts: 33, fairwaysHitPercent: 51, girPercent: 39 },
  { date: '2023-12-05', score: 83, putts: 32, fairwaysHitPercent: 53, girPercent: 44 },
  { date: '2024-01-20', score: 85, putts: 33, fairwaysHitPercent: 52, girPercent: 39 },
  { date: '2024-02-10', score: 82, putts: 31, fairwaysHitPercent: 57, girPercent: 44 },
  { date: '2024-03-15', score: 80, putts: 30, fairwaysHitPercent: 60, girPercent: 50 },
  { date: '2024-04-02', score: 81, putts: 31, fairwaysHitPercent: 58, girPercent: 44 },
  { date: '2024-04-20', score: 79, putts: 29, fairwaysHitPercent: 64, girPercent: 56 }
];

// Format date to be more readable
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

type MetricType = 'score' | 'putts' | 'fairwaysHitPercent' | 'girPercent';

const metricConfig = {
  score: {
    name: 'Total Score',
    color: '#8884d8',
    strokeWidth: 2,
    domain: [70, 95] as [number, number],
    description: 'Your overall score for each round'
  },
  putts: {
    name: 'Putts per Round',
    color: '#82ca9d',
    strokeWidth: 2,
    domain: [25, 40] as [number, number],
    description: 'Total putts taken in each round'
  },
  fairwaysHitPercent: {
    name: 'Fairways Hit %',
    color: '#ffc658',
    strokeWidth: 2,
    domain: [30, 80] as [number, number],
    description: 'Percentage of fairways hit in regulation'
  },
  girPercent: {
    name: 'Greens in Regulation %',
    color: '#ff7300',
    strokeWidth: 2,
    domain: [20, 70] as [number, number],
    description: 'Percentage of greens hit in regulation'
  }
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  metric: MetricType;
}

const CustomTooltip = ({ active, payload, label, metric }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 shadow-md rounded-md border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium">{formatDate(label || '')}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {metricConfig[metric].name}: <span className="font-medium" style={{ color: metricConfig[metric].color }}>
            {data[metric]}
          </span>
        </p>
      </div>
    );
  }

  return null;
};

// Combined chart that shows multiple metrics
const CombinedPerformanceChart = () => {
  const formattedData = last10Rounds.map(round => ({
    ...round,
    date: formatDate(round.date)
  }));

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={formattedData}
          margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }} 
            tickMargin={10}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis 
            yAxisId="score"
            orientation="left"
            domain={[70, 95]} 
            tick={{ fontSize: 12 }}
            tickMargin={10}
            axisLine={{ stroke: '#E5E7EB' }}
            label={{ value: 'Score', angle: -90, position: 'insideLeft', dy: 50, fontSize: 12, fill: '#8884d8' }}
          />
          <YAxis 
            yAxisId="putts"
            orientation="right"
            domain={[20, 40]} 
            tick={{ fontSize: 12 }}
            tickMargin={10}
            axisLine={{ stroke: '#E5E7EB' }}
            label={{ value: 'Putts', angle: 90, position: 'insideRight', dy: 50, fontSize: 12, fill: '#82ca9d' }}
          />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white dark:bg-gray-800 p-3 shadow-md rounded-md border border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium">{label}</p>
                    {payload.map((entry) => (
                      <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
                        {entry.name}: {entry.value}
                      </p>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend verticalAlign="top" height={36} />
          <Line 
            yAxisId="score"
            type="monotone" 
            dataKey="score" 
            name="Score" 
            stroke="#8884d8" 
            strokeWidth={2} 
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
          <Line 
            yAxisId="putts"
            type="monotone" 
            dataKey="putts" 
            name="Putts" 
            stroke="#82ca9d" 
            strokeWidth={2} 
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

// Single metric line chart with area fill
const SingleMetricChart = ({ metric }: { metric: MetricType }) => {
  const formattedData = last10Rounds.map(round => ({
    ...round,
    date: formatDate(round.date)
  }));

  const config = metricConfig[metric];

  return (
    <div className="h-60 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={formattedData}
          margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }} 
            tickMargin={10}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis 
            domain={config.domain} 
            tick={{ fontSize: 12 }}
            tickMargin={10}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <Tooltip content={(props) => <CustomTooltip {...props} metric={metric} />} />
          <Area 
            type="monotone" 
            dataKey={metric} 
            name={config.name} 
            stroke={config.color} 
            strokeWidth={config.strokeWidth} 
            fillOpacity={0.2}
            fill={config.color}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

interface PerformanceHistoryChartProps {
  className?: string;
}

export default function PerformanceHistoryChart({ className }: PerformanceHistoryChartProps) {
  const [activeChart, setActiveChart] = useState<'combined' | MetricType>('combined');
  
  return (
    <Card className={`shadow-md border-gray-100 dark:border-gray-800 overflow-hidden ${className}`}>
      <CardHeader className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/80 dark:to-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 sm:px-6 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.div 
              initial={{ rotate: 0 }} 
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: 0 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </motion.div>
            <CardTitle className="text-lg sm:text-xl font-bold">Performance History</CardTitle>
          </div>
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Last 10 Rounds
          </div>
        </div>
        <CardDescription className="text-sm sm:text-base">
          Track your progress over time to identify trends and improvements
        </CardDescription>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <Button 
            variant={activeChart === 'combined' ? 'default' : 'outline'} 
            onClick={() => setActiveChart('combined')}
            size="sm" 
            className="text-xs rounded-full"
          >
            Combined View
          </Button>
          <Button 
            variant={activeChart === 'score' ? 'default' : 'outline'} 
            onClick={() => setActiveChart('score')}
            size="sm" 
            className="text-xs rounded-full"
          >
            Scores
          </Button>
          <Button 
            variant={activeChart === 'putts' ? 'default' : 'outline'} 
            onClick={() => setActiveChart('putts')}
            size="sm" 
            className="text-xs rounded-full"
          >
            Putts
          </Button>
          <Button 
            variant={activeChart === 'fairwaysHitPercent' ? 'default' : 'outline'} 
            onClick={() => setActiveChart('fairwaysHitPercent')}
            size="sm" 
            className="text-xs rounded-full"
          >
            Fairways
          </Button>
          <Button 
            variant={activeChart === 'girPercent' ? 'default' : 'outline'} 
            onClick={() => setActiveChart('girPercent')}
            size="sm" 
            className="text-xs rounded-full"
          >
            Greens
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {activeChart === 'combined' ? (
          <CombinedPerformanceChart />
        ) : (
          <SingleMetricChart metric={activeChart} />
        )}
        
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          {activeChart === 'combined' ? (
            <p>The chart shows your score and putts per round over time. Lower scores and fewer putts indicate improvement.</p>
          ) : (
            <p>{metricConfig[activeChart].description}. {activeChart === 'score' ? 'Lower values' : 'Higher values'} indicate improvement.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 