'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/Tabs";
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  Target,
  Flag,
  Save,
  List,
  Plus,
  Edit2,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

interface RoundStat {
  id: string;
  date: string;
  course: string;
  score: number;
  putts: number;
  fairwaysHit: number;
  fairways: number;
  greensInRegulation: number;
  holes: number;
  upAndDowns: number;
  upAndDownAttempts: number;
  sandSaves: number;
  sandSaveAttempts: number;
  penalties: number;
}

interface StatValue {
  value: number;
  trend: 'up' | 'down' | 'neutral';
  change: number;
}

interface StatSummary {
  scoringAverage: StatValue;
  puttsPerRound: StatValue;
  fairwayPercentage: StatValue;
  greenInRegulationPercentage: StatValue;
  upAndDownPercentage: StatValue;
  sandSavePercentage: StatValue;
}

// Mock data
const mockRounds: RoundStat[] = [
  {
    id: '1',
    date: '2023-11-15',
    course: 'Pine Valley Golf Club',
    score: 82,
    putts: 32,
    fairwaysHit: 8,
    fairways: 14,
    greensInRegulation: 10,
    holes: 18,
    upAndDowns: 4,
    upAndDownAttempts: 6,
    sandSaves: 1,
    sandSaveAttempts: 2,
    penalties: 2,
  },
  {
    id: '2',
    date: '2023-11-07',
    course: 'Augusta National',
    score: 85,
    putts: 33,
    fairwaysHit: 6,
    fairways: 14,
    greensInRegulation: 9,
    holes: 18,
    upAndDowns: 3,
    upAndDownAttempts: 7,
    sandSaves: 1,
    sandSaveAttempts: 3,
    penalties: 3,
  },
  {
    id: '3',
    date: '2023-10-28',
    course: 'Pebble Beach Golf Links',
    score: 88,
    putts: 35,
    fairwaysHit: 7,
    fairways: 14,
    greensInRegulation: 8,
    holes: 18,
    upAndDowns: 2,
    upAndDownAttempts: 8,
    sandSaves: 0,
    sandSaveAttempts: 4,
    penalties: 4,
  },
];

// Calculate mock summary stats
const calculateSummary = (rounds: RoundStat[]): StatSummary => {
  if (rounds.length === 0) {
    return {
      scoringAverage: { value: 0, trend: 'neutral', change: 0 },
      puttsPerRound: { value: 0, trend: 'neutral', change: 0 },
      fairwayPercentage: { value: 0, trend: 'neutral', change: 0 },
      greenInRegulationPercentage: { value: 0, trend: 'neutral', change: 0 },
      upAndDownPercentage: { value: 0, trend: 'neutral', change: 0 },
      sandSavePercentage: { value: 0, trend: 'neutral', change: 0 },
    };
  }

  // Sort rounds by date (newest first)
  const sortedRounds = [...rounds].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Calculate current averages (last 3 rounds)
  const currentRounds = sortedRounds.slice(0, Math.min(3, sortedRounds.length));
  const prevRounds = sortedRounds.slice(
    Math.min(3, sortedRounds.length), 
    Math.min(6, sortedRounds.length)
  );

  // Current averages
  const scoringAvg = currentRounds.reduce((sum, r) => sum + r.score, 0) / currentRounds.length;
  const puttsAvg = currentRounds.reduce((sum, r) => sum + r.putts, 0) / currentRounds.length;
  
  const fairwaysTotal = currentRounds.reduce((sum, r) => sum + r.fairwaysHit, 0);
  const fairwaysAttempts = currentRounds.reduce((sum, r) => sum + r.fairways, 0);
  const fairwayPct = (fairwaysTotal / fairwaysAttempts) * 100;
  
  const girTotal = currentRounds.reduce((sum, r) => sum + r.greensInRegulation, 0);
  const girAttempts = currentRounds.reduce((sum, r) => sum + r.holes, 0);
  const girPct = (girTotal / girAttempts) * 100;
  
  const upDownTotal = currentRounds.reduce((sum, r) => sum + r.upAndDowns, 0);
  const upDownAttempts = currentRounds.reduce((sum, r) => sum + r.upAndDownAttempts, 0);
  const upDownPct = (upDownTotal / upDownAttempts) * 100;
  
  const sandTotal = currentRounds.reduce((sum, r) => sum + r.sandSaves, 0);
  const sandAttempts = currentRounds.reduce((sum, r) => sum + r.sandSaveAttempts, 0);
  const sandPct = (sandTotal / sandAttempts) * 100;

  // If we have previous rounds to compare with
  let prevScoringAvg = 0;
  let prevPuttsAvg = 0;
  let prevFairwayPct = 0;
  let prevGirPct = 0;
  let prevUpDownPct = 0;
  let prevSandPct = 0;

  if (prevRounds.length > 0) {
    prevScoringAvg = prevRounds.reduce((sum, r) => sum + r.score, 0) / prevRounds.length;
    prevPuttsAvg = prevRounds.reduce((sum, r) => sum + r.putts, 0) / prevRounds.length;
    
    const prevFairwaysTotal = prevRounds.reduce((sum, r) => sum + r.fairwaysHit, 0);
    const prevFairwaysAttempts = prevRounds.reduce((sum, r) => sum + r.fairways, 0);
    prevFairwayPct = (prevFairwaysTotal / prevFairwaysAttempts) * 100;
    
    const prevGirTotal = prevRounds.reduce((sum, r) => sum + r.greensInRegulation, 0);
    const prevGirAttempts = prevRounds.reduce((sum, r) => sum + r.holes, 0);
    prevGirPct = (prevGirTotal / prevGirAttempts) * 100;
    
    const prevUpDownTotal = prevRounds.reduce((sum, r) => sum + r.upAndDowns, 0);
    const prevUpDownAttempts = prevRounds.reduce((sum, r) => sum + r.upAndDownAttempts, 0);
    prevUpDownPct = (prevUpDownTotal / prevUpDownAttempts) * 100;
    
    const prevSandTotal = prevRounds.reduce((sum, r) => sum + r.sandSaves, 0);
    const prevSandAttempts = prevRounds.reduce((sum, r) => sum + r.sandSaveAttempts, 0);
    prevSandPct = (prevSandTotal / prevSandAttempts) * 100;
  }

  // Calculate trends and changes
  return {
    scoringAverage: {
      value: Math.round(scoringAvg * 10) / 10,
      trend: prevRounds.length ? (scoringAvg < prevScoringAvg ? 'down' : 'up') : 'neutral',
      change: prevRounds.length ? Math.abs(Math.round((scoringAvg - prevScoringAvg) * 10) / 10) : 0,
    },
    puttsPerRound: {
      value: Math.round(puttsAvg * 10) / 10,
      trend: prevRounds.length ? (puttsAvg < prevPuttsAvg ? 'down' : 'up') : 'neutral',
      change: prevRounds.length ? Math.abs(Math.round((puttsAvg - prevPuttsAvg) * 10) / 10) : 0,
    },
    fairwayPercentage: {
      value: Math.round(fairwayPct),
      trend: prevRounds.length ? (fairwayPct > prevFairwayPct ? 'up' : 'down') : 'neutral',
      change: prevRounds.length ? Math.abs(Math.round(fairwayPct - prevFairwayPct)) : 0,
    },
    greenInRegulationPercentage: {
      value: Math.round(girPct),
      trend: prevRounds.length ? (girPct > prevGirPct ? 'up' : 'down') : 'neutral',
      change: prevRounds.length ? Math.abs(Math.round(girPct - prevGirPct)) : 0,
    },
    upAndDownPercentage: {
      value: Math.round(upDownPct),
      trend: prevRounds.length ? (upDownPct > prevUpDownPct ? 'up' : 'down') : 'neutral',
      change: prevRounds.length ? Math.abs(Math.round(upDownPct - prevUpDownPct)) : 0,
    },
    sandSavePercentage: {
      value: Math.round(sandPct),
      trend: prevRounds.length ? (sandPct > prevSandPct ? 'up' : 'down') : 'neutral',
      change: prevRounds.length ? Math.abs(Math.round(sandPct - prevSandPct)) : 0,
    },
  };
};

export const StatTracking = () => {
  const [rounds, setRounds] = useState<RoundStat[]>(mockRounds);
  const [selectedRound, setSelectedRound] = useState<RoundStat | null>(null);
  const [isAddingRound, setIsAddingRound] = useState(false);
  const [newRound, setNewRound] = useState<Partial<RoundStat>>({
    date: new Date().toISOString().split('T')[0],
    course: '',
    score: 0,
    putts: 0,
    fairwaysHit: 0,
    fairways: 14,
    greensInRegulation: 0,
    holes: 18,
    upAndDowns: 0,
    upAndDownAttempts: 0,
    sandSaves: 0,
    sandSaveAttempts: 0,
    penalties: 0,
  });
  const [statSummary, setStatSummary] = useState<StatSummary>(calculateSummary(rounds));

  useEffect(() => {
    setStatSummary(calculateSummary(rounds));
  }, [rounds]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRound({
      ...newRound,
      [name]: name === 'course' ? value : Number(value),
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewRound({
      ...newRound,
      [name]: Number(value),
    });
  };

  const handleAddRound = () => {
    const roundToAdd = {
      ...newRound,
      id: Date.now().toString(),
    } as RoundStat;

    setRounds([roundToAdd, ...rounds]);
    setIsAddingRound(false);
    setNewRound({
      date: new Date().toISOString().split('T')[0],
      course: '',
      score: 0,
      putts: 0,
      fairwaysHit: 0,
      fairways: 14,
      greensInRegulation: 0,
      holes: 18,
      upAndDowns: 0,
      upAndDownAttempts: 0,
      sandSaves: 0,
      sandSaveAttempts: 0,
      penalties: 0,
    });
  };

  const handleDeleteRound = (id: string) => {
    setRounds(rounds.filter(round => round.id !== id));
    if (selectedRound?.id === id) {
      setSelectedRound(null);
    }
  };

  const renderStatCard = (
    title: string,
    value: number,
    trend: 'up' | 'down' | 'neutral',
    change: number,
    icon: React.ReactNode,
    goodTrend: 'up' | 'down',
    unit: string = ''
  ) => {
    const isGood = trend === goodTrend || trend === 'neutral';
    const trendIcon = trend === 'up' ? (
      <ArrowUpRight className={`h-4 w-4 ${isGood ? 'text-green-500' : 'text-red-500'}`} />
    ) : trend === 'down' ? (
      <ArrowDownRight className={`h-4 w-4 ${isGood ? 'text-green-500' : 'text-red-500'}`} />
    ) : null;

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{title}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold">{value}{unit}</h3>
                {trend !== 'neutral' && (
                  <div className="flex items-center text-sm font-medium">
                    {trendIcon}
                    <span className={isGood ? 'text-green-500' : 'text-red-500'}>
                      {change}{unit}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          Golf Stat Tracking
        </CardTitle>
        <CardDescription>
          Track and analyze your golf statistics to identify areas for improvement
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="summary">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Summary</span>
            </TabsTrigger>
            <TabsTrigger value="rounds" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              <span>Rounds</span>
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Round</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="pt-4 space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {renderStatCard(
                'Scoring Average',
                statSummary.scoringAverage.value,
                statSummary.scoringAverage.trend,
                statSummary.scoringAverage.change,
                <BarChart3 className="h-5 w-5" />,
                'down'
              )}
              {renderStatCard(
                'Putts Per Round',
                statSummary.puttsPerRound.value,
                statSummary.puttsPerRound.trend,
                statSummary.puttsPerRound.change,
                <Target className="h-5 w-5" />,
                'down'
              )}
              {renderStatCard(
                'Fairways Hit',
                statSummary.fairwayPercentage.value,
                statSummary.fairwayPercentage.trend,
                statSummary.fairwayPercentage.change,
                <Flag className="h-5 w-5" />,
                'up',
                '%'
              )}
              {renderStatCard(
                'Greens in Regulation',
                statSummary.greenInRegulationPercentage.value,
                statSummary.greenInRegulationPercentage.trend,
                statSummary.greenInRegulationPercentage.change,
                <Target className="h-5 w-5" />,
                'up',
                '%'
              )}
              {renderStatCard(
                'Up & Down %',
                statSummary.upAndDownPercentage.value,
                statSummary.upAndDownPercentage.trend,
                statSummary.upAndDownPercentage.change,
                <TrendingUp className="h-5 w-5" />,
                'up',
                '%'
              )}
              {renderStatCard(
                'Sand Save %',
                statSummary.sandSavePercentage.value,
                statSummary.sandSavePercentage.trend,
                statSummary.sandSavePercentage.change,
                <TrendingUp className="h-5 w-5" />,
                'up',
                '%'
              )}
            </div>
            
            <div className="pt-4">
              <h3 className="text-lg font-medium mb-4">Recent Rounds</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-medium p-2">Date</th>
                      <th className="text-left font-medium p-2">Course</th>
                      <th className="text-right font-medium p-2">Score</th>
                      <th className="text-right font-medium p-2">Putts</th>
                      <th className="text-right font-medium p-2">FIR %</th>
                      <th className="text-right font-medium p-2">GIR %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rounds.slice(0, 5).map((round) => (
                      <tr key={round.id} className="hover:bg-muted/50">
                        <td className="p-2">{new Date(round.date).toLocaleDateString()}</td>
                        <td className="p-2">{round.course}</td>
                        <td className="text-right p-2">{round.score}</td>
                        <td className="text-right p-2">{round.putts}</td>
                        <td className="text-right p-2">
                          {Math.round((round.fairwaysHit / round.fairways) * 100)}%
                        </td>
                        <td className="text-right p-2">
                          {Math.round((round.greensInRegulation / round.holes) * 100)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="rounds" className="pt-4 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-medium p-2">Date</th>
                    <th className="text-left font-medium p-2">Course</th>
                    <th className="text-right font-medium p-2">Score</th>
                    <th className="text-right font-medium p-2">Putts</th>
                    <th className="text-right font-medium p-2">FIR</th>
                    <th className="text-right font-medium p-2">GIR</th>
                    <th className="text-right font-medium p-2">Up & Down</th>
                    <th className="text-right font-medium p-2">Sand Save</th>
                    <th className="text-right font-medium p-2">Penalties</th>
                    <th className="text-center font-medium p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rounds.map((round) => (
                    <tr key={round.id} className="hover:bg-muted/50">
                      <td className="p-2">{new Date(round.date).toLocaleDateString()}</td>
                      <td className="p-2">{round.course}</td>
                      <td className="text-right p-2">{round.score}</td>
                      <td className="text-right p-2">{round.putts}</td>
                      <td className="text-right p-2">
                        {round.fairwaysHit}/{round.fairways}
                      </td>
                      <td className="text-right p-2">
                        {round.greensInRegulation}/{round.holes}
                      </td>
                      <td className="text-right p-2">
                        {round.upAndDowns}/{round.upAndDownAttempts}
                      </td>
                      <td className="text-right p-2">
                        {round.sandSaves}/{round.sandSaveAttempts}
                      </td>
                      <td className="text-right p-2">{round.penalties}</td>
                      <td className="p-2 text-center">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground"
                          onClick={() => handleDeleteRound(round.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="add" className="pt-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={newRound.date}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="course">Course</Label>
                    <Input
                      id="course"
                      name="course"
                      placeholder="Course name"
                      value={newRound.course}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="score">Score</Label>
                    <Input
                      id="score"
                      name="score"
                      type="number"
                      value={newRound.score}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="putts">Putts</Label>
                    <Input
                      id="putts"
                      name="putts"
                      type="number"
                      value={newRound.putts}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="penalties">Penalties</Label>
                    <Input
                      id="penalties"
                      name="penalties"
                      type="number"
                      value={newRound.penalties}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fairwaysHit">Fairways Hit</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="fairwaysHit"
                        name="fairwaysHit"
                        type="number"
                        value={newRound.fairwaysHit}
                        onChange={handleInputChange}
                      />
                      <span className="text-sm text-muted-foreground">/</span>
                      <Select 
                        value={newRound.fairways?.toString()} 
                        onValueChange={(value) => handleSelectChange('fairways', value)}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue placeholder="14" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="12">12</SelectItem>
                          <SelectItem value="14">14</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="greensInRegulation">Greens in Regulation</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="greensInRegulation"
                        name="greensInRegulation"
                        type="number"
                        value={newRound.greensInRegulation}
                        onChange={handleInputChange}
                      />
                      <span className="text-sm text-muted-foreground">/</span>
                      <Select 
                        value={newRound.holes?.toString()} 
                        onValueChange={(value) => handleSelectChange('holes', value)}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue placeholder="18" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9">9</SelectItem>
                          <SelectItem value="18">18</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="upAndDowns">Up & Downs</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="upAndDowns"
                        name="upAndDowns"
                        type="number"
                        value={newRound.upAndDowns}
                        onChange={handleInputChange}
                      />
                      <span className="text-sm text-muted-foreground">/</span>
                      <Input
                        id="upAndDownAttempts"
                        name="upAndDownAttempts"
                        type="number"
                        value={newRound.upAndDownAttempts}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sandSaves">Sand Saves</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="sandSaves"
                        name="sandSaves"
                        type="number"
                        value={newRound.sandSaves}
                        onChange={handleInputChange}
                      />
                      <span className="text-sm text-muted-foreground">/</span>
                      <Input
                        id="sandSaveAttempts"
                        name="sandSaveAttempts"
                        type="number"
                        value={newRound.sandSaveAttempts}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button 
                    onClick={handleAddRound} 
                    disabled={!newRound.course}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Round
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}; 