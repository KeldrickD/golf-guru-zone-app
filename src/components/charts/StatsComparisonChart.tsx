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
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { PersonStanding, Users } from 'lucide-react';
import useSWR from 'swr';
import { FilterControls, FilterOptions } from '../FilterControls';

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

// Custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 shadow-md rounded-md border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            ></div>
            <span>{entry.name}: {entry.value}</span> 
            {entry.dataKey === 'fairwayHitPercentage' || entry.dataKey === 'girPercentage' ? '%' : ''}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

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
                  <span>Hide Comparison</span>
                </>
              ) : (
                <>
                  <Users className="h-4 w-4" />
                  <span>Show Comparison</span>
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
      
      <CardContent className="p-4 sm:p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-80">
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
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="user" 
                    name="Your Stats" 
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]}
                  />
                  {showComparison && (
                    <Bar 
                      dataKey="global" 
                      name="Average Golfer" 
                      fill="#9ca3af" 
                      radius={[4, 4, 0, 0]}
                    />
                  )}
                  {/* Add reference lines for the first two metrics (lower is better) */}
                  {showComparison && chartData.map((entry, index) => (
                    entry.lowerIsBetter && userIsBetter(entry) && (
                      <ReferenceLine 
                        key={`ref-${index}`}
                        x={entry.name} 
                        stroke="#22c55e" 
                        strokeDasharray="3 3"
                        isFront={true}
                      />
                    )
                  ))}
                  {/* Add reference lines for the last two metrics (higher is better) */}
                  {showComparison && chartData.map((entry, index) => (
                    !entry.lowerIsBetter && userIsBetter(entry) && (
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
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <h4 className="font-medium mb-2">Performance Insights:</h4>
                <ul className="space-y-2 pl-5 list-disc">
                  {chartData.map((stat, index) => {
                    if (!showComparison || !stat.global) return null;
                    
                    const isBetter = userIsBetter(stat);
                    const difference = stat.lowerIsBetter 
                      ? stat.global - stat.user 
                      : stat.user - stat.global;
                    
                    const percentDiff = Math.abs(Math.round(difference * 100) / 100);
                    
                    return (
                      <li key={index} className={isBetter ? 'text-green-500 dark:text-green-400' : 'text-amber-500 dark:text-amber-400'}>
                        <span className="font-medium">{stat.name}:</span> {isBetter 
                          ? `You're outperforming the average by ${percentDiff}${stat.unit}` 
                          : `You're ${percentDiff}${stat.unit} behind the average`}
                      </li>
                    );
                  })}
                </ul>
              </div>
              
              {data?.isDefault && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-md text-sm">
                  <p className="font-medium">Sample Data</p>
                  <p className="mt-1">This is sample comparison data. Add your rounds in the Analytics page to see your actual performance comparison.</p>
                </div>
              )}
              
              <div className="mt-4 text-xs text-gray-500">
                Based on {showComparison && (
                  <span>comparison between your {data?.userStats.roundCount} rounds and {data?.globalStats.roundCount} rounds from all users</span>
                )}
                {!showComparison && (
                  <span>your {data?.userStats.roundCount} rounds</span>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
} 