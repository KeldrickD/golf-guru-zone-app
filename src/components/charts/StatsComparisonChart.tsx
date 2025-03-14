'use client';

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { PersonStanding, Users } from 'lucide-react';
import useSWR from 'swr';
import { FilterControls, FilterOptions } from '../FilterControls';
import { ResponsiveChartContainer } from './ResponsiveChartContainer';
import { ResponsiveTooltip } from '@/components/ui/ResponsiveTooltip';

// Types for stats
interface UserStats {
  avgScore: number;
  avgPutts: number;
  fairwayHitPercentage: number;
  girPercentage: number;
  roundCount: number;
}

interface ComparisonData {
  userStats: UserStats;
  globalStats: UserStats;
  isDefault: boolean;
}

// API fetcher function for SWR
const fetcher = (url: string) => fetch(url).then(res => res.json());

interface StatsComparisonChartProps {
  className?: string;
}

export default function StatsComparisonChart({ className }: StatsComparisonChartProps) {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showComparison, setShowComparison] = useState(true);
  
  // Construct URL with filters
  const getFilteredUrl = () => {
    const baseUrl = '/api/stats/comparison';
    const params = new URLSearchParams();
    
    if (filters.fromDate) params.append('fromDate', filters.fromDate);
    if (filters.toDate) params.append('toDate', filters.toDate);
    
    return `${baseUrl}${params.toString() ? `?${params.toString()}` : ''}`;
  };
  
  // Fetch comparison data
  const { data, error, isLoading, mutate } = useSWR<ComparisonData>(getFilteredUrl(), fetcher);
  
  // Handle filter changes
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    mutate(); // Refresh data with new filters
  };
  
  // Prepare data for the bar chart
  const prepareData = () => {
    if (!data) return [];
    
    const { userStats, globalStats } = data;
    
    return [
      {
        name: 'Avg Score',
        user: userStats.avgScore,
        global: showComparison ? globalStats.avgScore : null,
        unit: '',
        lowerIsBetter: true,
      },
      {
        name: 'Avg Putts',
        user: userStats.avgPutts,
        global: showComparison ? globalStats.avgPutts : null,
        unit: '',
        lowerIsBetter: true,
      },
      {
        name: 'Fairways Hit',
        user: userStats.fairwayHitPercentage,
        global: showComparison ? globalStats.fairwayHitPercentage : null,
        unit: '%',
        lowerIsBetter: false,
      },
      {
        name: 'Greens in Regulation',
        user: userStats.girPercentage,
        global: showComparison ? globalStats.girPercentage : null,
        unit: '%',
        lowerIsBetter: false,
      },
    ];
  };
  
  const chartData = prepareData();
  
  const userIsBetter = (metric: { user: number, global: number | null, lowerIsBetter: boolean }) => {
    if (!metric.global) return false;
    return metric.lowerIsBetter 
      ? metric.user < metric.global
      : metric.user > metric.global;
  };

  // Format value for display in tooltip
  const formatValue = (value: number, dataKey: string) => {
    if (dataKey === 'fairwayHitPercentage' || dataKey === 'girPercentage') {
      return `${value.toFixed(1)}%`;
    }
    return value.toFixed(1);
  };
  
  return (
    <Card className={`shadow-md border-gray-100 dark:border-gray-800 overflow-hidden ${className}`}>
      <CardHeader className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/80 dark:to-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 sm:px-6 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Users className="h-5 w-5 text-primary" />
            </motion.div>
            <CardTitle className="text-lg sm:text-xl font-bold">Performance Comparison</CardTitle>
          </div>
          <div>
            <Button 
              variant="outline" 
              size="sm"
              className="gap-1"
              onClick={() => setShowComparison(!showComparison)}
            >
              {showComparison ? (
                <>
                  <PersonStanding className="h-4 w-4" />
                  <span className="hidden sm:inline">Hide Comparison</span>
                  <span className="sm:hidden">Hide</span>
                </>
              ) : (
                <>
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Show Comparison</span>
                  <span className="sm:hidden">Compare</span>
                </>
              )}
            </Button>
          </div>
        </div>
        
        <CardDescription className="text-sm sm:text-base">
          See how your stats compare with the average golfer
        </CardDescription>
        
        <FilterControls onFilterChange={handleFilterChange} className="mt-4" />
      </CardHeader>
      
      <CardContent className="p-2 sm:p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-60 sm:h-80">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 dark:text-red-400">Error loading comparison data</p>
            <Button 
              onClick={() => mutate()}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <>
            {/* Replace ResponsiveContainer with our custom ResponsiveChartContainer */}
            <ResponsiveChartContainer
              aspectRatio={{ desktop: 2, tablet: 1.5, mobile: 0.8 }}
              minHeight={300}
              maxHeight={500}
            >
              <BarChart
                data={chartData}
                margin={{ 
                  top: 20, 
                  right: 10, 
                  left: 10, 
                  bottom: 40 
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="name" 
                  height={60}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickCount={5}
                />
                <Tooltip 
                  content={(props) => (
                    <ResponsiveTooltip 
                      {...props}
                      labelFormatter={(label) => `${label}`}
                      contentFormatter={(entry) => (
                        <div className="flex items-center justify-between w-full text-xs sm:text-sm">
                          <span className="font-medium" style={{ color: entry.color }}>
                            {entry.name}:
                          </span>
                          <span className="ml-2">
                            {formatValue(entry.value, entry.dataKey)}
                          </span>
                        </div>
                      )}
                    />
                  )} 
                />
                <Legend 
                  wrapperStyle={{ 
                    paddingTop: 10,
                    fontSize: '0.875rem'
                  }}
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
                <Bar 
                  dataKey="user" 
                  name="Your Stats" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                />
                {showComparison && (
                  <Bar 
                    dataKey="global" 
                    name="Average Golfer" 
                    fill="#9ca3af" 
                    radius={[4, 4, 0, 0]}
                    maxBarSize={50}
                  />
                )}
                {/* Add reference lines for metrics where user is better */}
                {showComparison && chartData.map((entry, index) => (
                  userIsBetter(entry) && (
                    <ReferenceLine 
                      key={`ref-${index}`}
                      x={entry.name} 
                      stroke="#22c55e" 
                      strokeDasharray="3 3"
                      isFront={true}
                    />
                  )
                ))}
              </BarChart>
            </ResponsiveChartContainer>
            
            {/* Legend */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
              {chartData.map((stat, index) => {
                const isBetter = userIsBetter(stat);
                return (
                  <div 
                    key={index} 
                    className={`
                      p-2 rounded-md 
                      flex items-center justify-between
                      ${isBetter ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-800/30'}
                    `}
                  >
                    <div className="font-medium">{stat.name}</div>
                    <div className="flex items-center">
                      <span className={`text-blue-600 dark:text-blue-400 font-semibold`}>
                        {stat.user.toFixed(1)}{stat.unit}
                      </span>
                      {showComparison && (
                        <>
                          <span className="mx-1 text-gray-500">vs</span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {stat.global?.toFixed(1)}{stat.unit}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
} 