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

// Sample data for club distances
const clubDistanceData = [
  { club: 'Driver', avgDistance: 265, minDistance: 240, maxDistance: 290 },
  { club: '3-Wood', avgDistance: 235, minDistance: 220, maxDistance: 250 },
  { club: '5-Wood', avgDistance: 215, minDistance: 200, maxDistance: 230 },
  { club: '4-Iron', avgDistance: 195, minDistance: 180, maxDistance: 210 },
  { club: '5-Iron', avgDistance: 185, minDistance: 170, maxDistance: 200 },
  { club: '6-Iron', avgDistance: 175, minDistance: 160, maxDistance: 190 },
  { club: '7-Iron', avgDistance: 165, minDistance: 150, maxDistance: 180 },
  { club: '8-Iron', avgDistance: 155, minDistance: 140, maxDistance: 170 },
  { club: '9-Iron', avgDistance: 145, minDistance: 130, maxDistance: 160 },
  { club: 'PW', avgDistance: 135, minDistance: 120, maxDistance: 150 },
  { club: 'GW', avgDistance: 120, minDistance: 105, maxDistance: 135 },
  { club: 'SW', avgDistance: 100, minDistance: 85, maxDistance: 115 },
  { club: 'LW', avgDistance: 80, minDistance: 65, maxDistance: 95 },
];

// Scoring breakdown data
const scoringBreakdownData = [
  { name: 'Eagles', value: 1, color: '#4ade80' },
  { name: 'Birdies', value: 8, color: '#22c55e' },
  { name: 'Pars', value: 32, color: '#3b82f6' },
  { name: 'Bogeys', value: 45, color: '#f97316' },
  { name: 'Double Bogeys', value: 12, color: '#ef4444' },
  { name: 'Triple+', value: 2, color: '#b91c1c' },
];

// Performance radar chart data
const performanceRadarData = [
  { metric: 'Driving Distance', value: 70, fullMark: 100 },
  { metric: 'Driving Accuracy', value: 50, fullMark: 100 },
  { metric: 'GIR', value: 40, fullMark: 100 },
  { metric: 'Scrambling', value: 60, fullMark: 100 },
  { metric: 'Putts per Round', value: 65, fullMark: 100 },
  { metric: 'Sand Saves', value: 35, fullMark: 100 },
];

type ChartType = 'clubDistances' | 'scoringBreakdown' | 'performanceRadar';

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

const ClubDistancesChart = () => {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={clubDistanceData}
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
                    <p className="text-sm text-gray-500">Range: {data.minDistance} - {data.maxDistance} yards</p>
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

const ScoringBreakdownChart = () => {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={scoringBreakdownData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {scoringBreakdownData.map((entry, index) => (
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
                    <p className="text-sm">Percentage: {((data.value / scoringBreakdownData.reduce((acc, curr) => acc + curr.value, 0)) * 100).toFixed(1)}%</p>
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

const PerformanceRadarChart = () => {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceRadarData}>
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
  const [activeChart, setActiveChart] = useState<ChartType>('clubDistances');
  
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
        {activeChart === 'clubDistances' && <ClubDistancesChart />}
        {activeChart === 'scoringBreakdown' && <ScoringBreakdownChart />}
        {activeChart === 'performanceRadar' && <PerformanceRadarChart />}
        
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          {activeChart === 'clubDistances' && (
            <p>Club distances based on your last 20 rounds. This data helps you make more informed club selections on the course.</p>
          )}
          {activeChart === 'scoringBreakdown' && (
            <p>Your scoring breakdown from the last 20 rounds (100 holes). Focus on reducing doubles and maximizing par opportunities.</p>
          )}
          {activeChart === 'performanceRadar' && (
            <p>Performance radar showing your strengths and weaknesses compared to your target handicap. Scrambling and putting are your current strengths.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 