"use client"

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { RoundStats } from "@/services/performanceAnalysisService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
  ReferenceArea,
  ReferenceLine,
} from "recharts";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { StatisticalInsights } from "./StatisticalInsights";
import DrilldownModal from "@/components/DrilldownModal";
import { ResponsiveChartContainer } from "./charts/ResponsiveChartContainer";
import { ResponsiveTooltip } from "./ui/ResponsiveTooltip";

interface PerformanceTrendsProps {
  roundStats: RoundStats[];
}

type ChartType = "score" | "accuracy" | "putting" | "driving";
type ChartPeriod = "all" | "last5" | "last10";

export function PerformanceTrends({ roundStats }: PerformanceTrendsProps) {
  const [selectedChart, setSelectedChart] = useState<ChartType>("score");
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("all");
  const [hoveredRound, setHoveredRound] = useState<RoundStats | null>(null);
  const [selectedRound, setSelectedRound] = useState<RoundStats | null>(null);

  // Sort rounds by date
  const sortedRounds = [...roundStats].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Filter rounds based on selected period
  const filteredRounds = (() => {
    switch (chartPeriod) {
      case "last5":
        return sortedRounds.slice(-5);
      case "last10":
        return sortedRounds.slice(-10);
      default:
        return sortedRounds;
    }
  })();

  // Calculate trend lines and averages
  const calculateTrendLine = (data: any[], key: string) => {
    const n = data.length;
    if (n < 2) return null;

    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    data.forEach((point, i) => {
      sumX += i;
      sumY += point[key];
      sumXY += i * point[key];
      sumXX += i * i;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return data.map((_, i) => ({
      ...data[i],
      trend: slope * i + intercept,
    }));
  };

  // Prepare data for charts
  const chartData = filteredRounds.map((round, index) => ({
    name: new Date(round.date).toLocaleDateString(),
    score: round.totalScore,
    scoreToPar: round.totalScore - round.coursePar,
    fairwayPercentage: (round.fairwaysHit / round.totalFairways) * 100,
    girPercentage: (round.greensInRegulation / 18) * 100,
    puttsPerRound: round.totalPutts,
    avgDriveDistance: round.avgDriveDistance,
    round,
    index,
  }));

  // Calculate moving averages
  const movingAverage = (data: number[], window: number) => {
    return data.map((_, index) => {
      const start = Math.max(0, index - window + 1);
      const values = data.slice(start, index + 1);
      return values.reduce((sum, val) => sum + val, 0) / values.length;
    });
  };

  // Format tooltip values
  const formatValue = (value: number, dataKey: string) => {
    if (dataKey === 'fairwayPercentage' || dataKey === 'girPercentage') {
      return `${value.toFixed(1)}%`;
    }
    return value.toFixed(1);
  };

  const renderChart = () => {
    switch (selectedChart) {
      case "score":
        return (
          <ResponsiveChartContainer
            aspectRatio={{ desktop: 2, tablet: 1.7, mobile: 0.9 }}
            minHeight={300}
            maxHeight={500}
          >
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="name"
                tick={{ fontSize: 10 }}
                interval={chartData.length > 10 ? 'preserveStart' : 0}
                angle={-45}
                textAnchor="end"
                height={60}
                tickLine={false}
              />
              <YAxis 
                yAxisId="left"
                orientation="left"
                domain={['dataMin - 2', 'dataMax + 2']}
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickCount={5}
              />
              <Tooltip 
                content={(props) => (
                  <ResponsiveTooltip 
                    {...props}
                    labelFormatter={(label) => `Date: ${label}`}
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
                  fontSize: '0.75rem'
                }}
                iconSize={8}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="score"
                stroke="#2563eb"
                name="Total Score"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="scoreToPar"
                stroke="#22c55e"
                name="Score to Par"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              {hoveredRound && (
                <ReferenceLine
                  x={new Date(hoveredRound.date).toLocaleDateString()}
                  stroke="#888"
                  strokeDasharray="3 3"
                />
              )}
            </LineChart>
          </ResponsiveChartContainer>
        );

      case "accuracy":
        return (
          <ResponsiveChartContainer
            aspectRatio={{ desktop: 2, tablet: 1.7, mobile: 0.9 }}
            minHeight={300}
            maxHeight={500}
          >
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="name"
                tick={{ fontSize: 10 }}
                interval={chartData.length > 10 ? 'preserveStart' : 0}
                angle={-45}
                textAnchor="end"
                height={60}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 10 }}
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                tickCount={5}
              />
              <Tooltip 
                content={(props) => (
                  <ResponsiveTooltip 
                    {...props}
                    labelFormatter={(label) => `Date: ${label}`}
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
                  fontSize: '0.75rem'
                }}
                iconSize={8}
              />
              <Area
                type="monotone"
                dataKey="fairwayPercentage"
                name="Fairways Hit %"
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="girPercentage"
                name="GIR %"
                stroke="#eab308"
                fill="#eab308"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              {hoveredRound && (
                <ReferenceLine
                  x={new Date(hoveredRound.date).toLocaleDateString()}
                  stroke="#888"
                  strokeDasharray="3 3"
                />
              )}
            </AreaChart>
          </ResponsiveChartContainer>
        );

      case "putting":
        const puttingAverage = movingAverage(
          chartData.map(d => d.puttsPerRound),
          3
        );
        return (
          <ResponsiveChartContainer
            aspectRatio={{ desktop: 2, tablet: 1.7, mobile: 0.9 }}
            minHeight={300}
            maxHeight={500}
          >
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="name"
                tick={{ fontSize: 10 }}
                interval={chartData.length > 10 ? 'preserveStart' : 0}
                angle={-45}
                textAnchor="end"
                height={60}
                tickLine={false}
              />
              <YAxis 
                orientation="left"
                domain={['dataMin - 1', 'dataMax + 1']}
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickCount={5}
              />
              <Tooltip 
                content={(props) => (
                  <ResponsiveTooltip 
                    {...props}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentFormatter={(entry) => (
                      <div className="flex items-center justify-between w-full text-xs sm:text-sm">
                        <span className="font-medium" style={{ color: entry.color }}>
                          {entry.name}:
                        </span>
                        <span className="ml-2">
                          {entry.dataKey === 'value' 
                            ? Number(entry.value).toFixed(1) 
                            : entry.value}
                        </span>
                      </div>
                    )}
                  />
                )}
              />
              <Legend 
                wrapperStyle={{ 
                  paddingTop: 10,
                  fontSize: '0.75rem'
                }}
                iconSize={8}
              />
              <Line
                type="monotone"
                dataKey="puttsPerRound"
                name="Putts"
                stroke="#d946ef"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                data={chartData.map((d, i) => ({
                  name: d.name,
                  value: puttingAverage[i]
                }))}
                dataKey="value"
                name="3-Round Average"
                stroke="#94a3b8"
                strokeDasharray="5 5"
                dot={false}
              />
              {hoveredRound && (
                <ReferenceLine
                  x={new Date(hoveredRound.date).toLocaleDateString()}
                  stroke="#888"
                  strokeDasharray="3 3"
                />
              )}
            </LineChart>
          </ResponsiveChartContainer>
        );

      case "driving":
        const trendLine = calculateTrendLine(chartData, "avgDriveDistance");
        return (
          <ResponsiveChartContainer
            aspectRatio={{ desktop: 2, tablet: 1.7, mobile: 0.9 }}
            minHeight={300}
            maxHeight={500}
          >
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="name"
                tick={{ fontSize: 10 }}
                interval={chartData.length > 10 ? 'preserveStart' : 0}
                angle={-45}
                textAnchor="end"
                height={60}
                tickLine={false}
              />
              <YAxis 
                orientation="left"
                domain={['auto', 'auto']}
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickCount={5}
              />
              <Tooltip 
                content={(props) => (
                  <ResponsiveTooltip 
                    {...props}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentFormatter={(entry) => (
                      <div className="flex items-center justify-between w-full text-xs sm:text-sm">
                        <span className="font-medium" style={{ color: entry.color }}>
                          {entry.name}:
                        </span>
                        <span className="ml-2">
                          {entry.value.toFixed(1)} {entry.name.includes('Distance') ? 'yds' : ''}
                        </span>
                      </div>
                    )}
                  />
                )}
              />
              <Legend 
                wrapperStyle={{ 
                  paddingTop: 10,
                  fontSize: '0.75rem'
                }}
                iconSize={8}
              />
              <Area
                type="monotone"
                dataKey="avgDriveDistance"
                name="Drive Distance (yds)"
                stroke="#0ea5e9"
                fill="#0ea5e9"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              {trendLine && (
                <Line
                  type="monotone"
                  data={trendLine.map((d, i) => ({
                    name: d.name,
                    value: d.trend
                  }))}
                  dataKey="value"
                  name="Trend"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={false}
                />
              )}
              {hoveredRound && (
                <ReferenceLine
                  x={new Date(hoveredRound.date).toLocaleDateString()}
                  stroke="#888"
                  strokeDasharray="3 3"
                />
              )}
            </AreaChart>
          </ResponsiveChartContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="shadow-md border-gray-100 dark:border-gray-800">
      <CardHeader className="pb-4">
        <CardTitle>Performance Trends</CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:px-4 pb-4">
        <Tabs value={selectedChart} onValueChange={(value) => setSelectedChart(value as ChartType)}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="score">Score</TabsTrigger>
              <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
              <TabsTrigger value="putting">Putting</TabsTrigger>
              <TabsTrigger value="driving">Driving</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2 justify-end">
              <Button 
                variant={chartPeriod === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartPeriod("all")}
                className="text-xs sm:text-sm"
              >
                All Rounds
              </Button>
              <Button 
                variant={chartPeriod === "last10" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartPeriod("last10")}
                className="text-xs sm:text-sm"
              >
                Last 10 
              </Button>
              <Button 
                variant={chartPeriod === "last5" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartPeriod("last5")}
                className="text-xs sm:text-sm"
              >
                Last 5
              </Button>
            </div>
          </div>
          
          <div className="mt-2">
            {renderChart()}
          </div>
        </Tabs>
        
        <StatisticalInsights 
          roundStats={filteredRounds} 
          selectedMetric={selectedChart}
        />
      </CardContent>

      {selectedRound && (
        <DrilldownModal 
          round={selectedRound} 
          onClose={() => setSelectedRound(null)} 
          isOpen={!!selectedRound}
        />
      )}
    </Card>
  );
} 