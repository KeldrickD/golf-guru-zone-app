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
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
  ReferenceArea,
  ReferenceLine,
} from "recharts";
import { CustomTooltip } from "@/components/ui/CustomTooltip";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { StatisticalInsights } from "./StatisticalInsights";
import DrilldownModal from "@/components/DrilldownModal";

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

  const renderChart = () => {
    switch (selectedChart) {
      case "score":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                yAxisId="left"
                orientation="left"
                domain={['dataMin - 2', 'dataMax + 2']}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="score"
                stroke="#2563eb"
                name="Total Score"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6, onMouseEnter: () => {} }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="scoreToPar"
                stroke="#22c55e"
                name="Score to Par"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              {hoveredRound && (
                <ReferenceLine
                  x={new Date(hoveredRound.date).toLocaleDateString()}
                  stroke="#888"
                  strokeDasharray="3 3"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );

      case "accuracy":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip valueFormatter={(value) => `${value.toFixed(1)}%`} />} />
              <Legend />
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
          </ResponsiveContainer>
        );

      case "putting":
        const puttingAverage = movingAverage(
          chartData.map(d => d.puttsPerRound),
          3
        );
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                orientation="left"
                domain={['dataMin - 1', 'dataMax + 1']}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="puttsPerRound"
                name="Putts"
                stroke="#d946ef"
                strokeWidth={2}
                dot={{ r: 4 }}
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
          </ResponsiveContainer>
        );

      case "driving":
        const trendLine = calculateTrendLine(chartData, "avgDriveDistance");
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                domain={['dataMin - 10', 'dataMax + 10']}
              />
              <Tooltip content={<CustomTooltip valueFormatter={(value) => `${value} yds`} />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="avgDriveDistance"
                name="Driving Distance"
                stroke="#f97316"
                fill="#f97316"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              {trendLine && (
                <Line
                  type="monotone"
                  data={chartData.map((d, i) => ({
                    name: d.name,
                    value: trendLine[i].trend
                  }))}
                  dataKey="value"
                  name="Trend"
                  stroke="#94a3b8"
                  strokeDasharray="5 5"
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
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Tabs value={selectedChart} onValueChange={(value) => setSelectedChart(value as ChartType)}>
          <TabsList>
            <TabsTrigger value="score">Scoring</TabsTrigger>
            <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
            <TabsTrigger value="putting">Putting</TabsTrigger>
            <TabsTrigger value="driving">Driving</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex gap-2">
          <Button
            variant={chartPeriod === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setChartPeriod("all")}
          >
            All Rounds
          </Button>
          <Button
            variant={chartPeriod === "last10" ? "default" : "outline"}
            size="sm"
            onClick={() => setChartPeriod("last10")}
          >
            Last 10
          </Button>
          <Button
            variant={chartPeriod === "last5" ? "default" : "outline"}
            size="sm"
            onClick={() => setChartPeriod("last5")}
          >
            Last 5
          </Button>
        </div>
      </div>

      <div className="h-[400px]">
        {renderChart()}
      </div>

      <StatisticalInsights
        roundStats={roundStats}
        selectedMetric={selectedChart}
      />

      <DrilldownModal
        round={selectedRound!}
        isOpen={!!selectedRound}
        onClose={() => setSelectedRound(null)}
      />
    </div>
  );
} 