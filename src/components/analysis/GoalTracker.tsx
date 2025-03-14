'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Slider } from '@/components/ui/Slider';
import { Progress } from '@/components/ui/Progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose,
} from '@/components/ui/Dialog';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/Select';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { ResponsiveChartContainer } from '../charts/ResponsiveChartContainer';
import { ResponsiveTooltip } from '@/components/ui/ResponsiveTooltip';

import { 
  PlusCircle, 
  Award, 
  Trash2, 
  Calendar, 
  CheckCircle2, 
  Target, 
  TrendingUp, 
  Edit,
  CheckSquare,
  XCircle,
  Clock,
  ArrowRight,
  Flag,
  Pencil,
} from 'lucide-react';

// Types
interface Goal {
  id: string;
  title: string;
  category: GoalCategory;
  targetValue: number;
  currentValue: number;
  startDate: string;
  targetDate: string;
  unit: string;
  completed: boolean;
  milestones: Milestone[];
  notes: string;
  history: ProgressPoint[];
}

interface Milestone {
  id: string;
  value: number;
  achieved: boolean;
  achievedDate?: string;
}

interface ProgressPoint {
  date: string;
  value: number;
}

type GoalCategory = 'score' | 'putts' | 'fairways' | 'greens' | 'upAndDown' | 'handicap' | 'practice' | 'custom';

// Mock data
const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Lower handicap',
    category: 'handicap',
    targetValue: 10,
    currentValue: 14.2,
    startDate: '2023-06-01',
    targetDate: '2023-12-31',
    unit: 'handicap',
    completed: false,
    milestones: [
      { id: 'm1', value: 16, achieved: true, achievedDate: '2023-07-15' },
      { id: 'm2', value: 14, achieved: true, achievedDate: '2023-09-20' },
      { id: 'm3', value: 12, achieved: false },
      { id: 'm4', value: 10, achieved: false },
    ],
    notes: 'Focus on short game and putting to reduce strokes',
    history: [
      { date: '2023-06-01', value: 18 },
      { date: '2023-07-01', value: 17.2 },
      { date: '2023-07-15', value: 16 },
      { date: '2023-08-10', value: 15.5 },
      { date: '2023-09-01', value: 14.8 },
      { date: '2023-09-20', value: 14.2 },
    ]
  },
  {
    id: '2',
    title: 'Improve putting average',
    category: 'putts',
    targetValue: 28,
    currentValue: 31,
    startDate: '2023-07-01',
    targetDate: '2023-11-30',
    unit: 'putts per round',
    completed: false,
    milestones: [
      { id: 'm1', value: 34, achieved: true, achievedDate: '2023-07-20' },
      { id: 'm2', value: 32, achieved: true, achievedDate: '2023-08-15' },
      { id: 'm3', value: 30, achieved: false },
      { id: 'm4', value: 28, achieved: false },
    ],
    notes: 'Work on speed control and reading greens better',
    history: [
      { date: '2023-07-01', value: 36 },
      { date: '2023-07-20', value: 34 },
      { date: '2023-08-15', value: 32 },
      { date: '2023-09-10', value: 31 },
    ]
  },
  {
    id: '3',
    title: 'Break 80',
    category: 'score',
    targetValue: 79,
    currentValue: 85,
    startDate: '2023-05-15',
    targetDate: '2023-10-15',
    unit: 'strokes',
    completed: false,
    milestones: [
      { id: 'm1', value: 90, achieved: true, achievedDate: '2023-06-10' },
      { id: 'm2', value: 85, achieved: true, achievedDate: '2023-08-05' },
      { id: 'm3', value: 82, achieved: false },
      { id: 'm4', value: 79, achieved: false },
    ],
    notes: 'Focus on course management and avoiding big numbers',
    history: [
      { date: '2023-05-15', value: 94 },
      { date: '2023-06-10', value: 90 },
      { date: '2023-07-05', value: 88 },
      { date: '2023-08-05', value: 85 },
      { date: '2023-09-15', value: 85 },
    ]
  },
  {
    id: '4',
    title: 'Practice routine',
    category: 'practice',
    targetValue: 120,
    currentValue: 60,
    startDate: '2023-08-01',
    targetDate: '2023-10-31',
    unit: 'minutes per week',
    completed: false,
    milestones: [
      { id: 'm1', value: 30, achieved: true, achievedDate: '2023-08-10' },
      { id: 'm2', value: 60, achieved: true, achievedDate: '2023-09-01' },
      { id: 'm3', value: 90, achieved: false },
      { id: 'm4', value: 120, achieved: false },
    ],
    notes: 'Structured practice focusing on weak areas',
    history: [
      { date: '2023-08-01', value: 0 },
      { date: '2023-08-10', value: 30 },
      { date: '2023-09-01', value: 60 },
    ]
  },
];

// Category information
const goalCategories = [
  { value: 'score', label: 'Scoring Average', icon: <Target className="h-4 w-4" />, direction: 'lower' },
  { value: 'putts', label: 'Putting', icon: <Target className="h-4 w-4" />, direction: 'lower' },
  { value: 'fairways', label: 'Fairways Hit', icon: <Target className="h-4 w-4" />, direction: 'higher' },
  { value: 'greens', label: 'Greens in Regulation', icon: <Target className="h-4 w-4" />, direction: 'higher' },
  { value: 'upAndDown', label: 'Up and Down %', icon: <TrendingUp className="h-4 w-4" />, direction: 'higher' },
  { value: 'handicap', label: 'Handicap', icon: <Award className="h-4 w-4" />, direction: 'lower' },
  { value: 'practice', label: 'Practice Time', icon: <Clock className="h-4 w-4" />, direction: 'higher' },
  { value: 'custom', label: 'Custom Goal', icon: <Flag className="h-4 w-4" />, direction: 'custom' },
];

export function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [newGoalOpen, setNewGoalOpen] = useState(false);
  
  // Calculate days remaining for a goal
  const getDaysRemaining = (targetDate: string) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = Math.abs(target.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return target > today ? diffDays : 0;
  };
  
  // Calculate progress percentage
  const calculateProgress = (goal: Goal) => {
    if (goal.completed) return 100;
    
    // Get the category info
    const category = goalCategories.find(cat => cat.value === goal.category);
    const isLowerBetter = category?.direction === 'lower';
    
    // Calculate relative progress
    const totalChange = Math.abs(goal.targetValue - parseFloat(goal.history[0].value.toString()));
    const currentChange = Math.abs(goal.currentValue - parseFloat(goal.history[0].value.toString()));
    
    if (totalChange === 0) return 0;
    
    let progress = (currentChange / totalChange) * 100;
    
    // If the current value has gone past the target (in the right direction), cap at 100%
    if (isLowerBetter && goal.currentValue <= goal.targetValue) {
      progress = 100;
    } else if (!isLowerBetter && goal.currentValue >= goal.targetValue) {
      progress = 100;
    }
    
    return Math.min(Math.max(progress, 0), 100);
  };
  
  // Mark goal as complete
  const completeGoal = (goalId: string) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, completed: true } 
        : goal
    ));
  };
  
  // Delete a goal
  const deleteGoal = (goalId: string) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };
  
  // Get active goals
  const activeGoals = goals.filter(goal => !goal.completed);
  
  // Get completed goals
  const completedGoals = goals.filter(goal => goal.completed);
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <ResponsiveTooltip
          labelFormatter={() => new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          contentFormatter={() => (
            <>
              {payload.map((entry, index) => (
                <div key={`item-${index}`} className="flex items-center justify-between text-xs sm:text-sm mt-1">
                  <span className="font-medium" style={{ color: entry.color }}>
                    Value:
                  </span>
                  <span className="ml-2">{entry.value}</span>
                </div>
              ))}
            </>
          )}
        />
      );
    }
    return null;
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle>Goal Tracker</CardTitle>
            <CardDescription>
              Set, track, and achieve your golf improvement goals
            </CardDescription>
          </div>
          <Button onClick={() => setNewGoalOpen(true)} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>Add New Goal</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Goal stats summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div className="text-2xl font-bold">{activeGoals.length}</div>
              <p className="text-xs text-muted-foreground">Active Goals</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-2xl font-bold">{completedGoals.length}</div>
              <p className="text-xs text-muted-foreground">Completed Goals</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center mb-2">
                <Calendar className="h-5 w-5 text-amber-500" />
              </div>
              <div className="text-2xl font-bold">
                {activeGoals.length > 0 
                  ? Math.min(...activeGoals.map(goal => getDaysRemaining(goal.targetDate))) 
                  : 0}
              </div>
              <p className="text-xs text-muted-foreground">Days to Next Deadline</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
              <div className="text-2xl font-bold">
                {activeGoals.length > 0 
                  ? Math.round(activeGoals.reduce((sum, goal) => sum + calculateProgress(goal), 0) / activeGoals.length) 
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Average Completion</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Goals list with tabs */}
        <Tabs 
          defaultValue="active" 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as 'active' | 'completed')}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-[300px] mb-4">
            <TabsTrigger value="active" className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span>Active Goals ({activeGoals.length})</span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              <span>Completed ({completedGoals.length})</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Active Goals Tab */}
          <TabsContent value="active" className="space-y-4 mt-2">
            {activeGoals.length === 0 ? (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No active goals</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Set new goals to track your progress and improve your game
                </p>
                <Button onClick={() => setNewGoalOpen(true)}>
                  Create Your First Goal
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {activeGoals.map(goal => (
                  <Card key={goal.id} className="overflow-hidden">
                    <div className="border-l-4 border-primary">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <div>
                            <CardTitle className="text-base flex items-center gap-2">
                              {goalCategories.find(cat => cat.value === goal.category)?.icon}
                              {goal.title}
                            </CardTitle>
                            <CardDescription className="text-xs mt-1">
                              Started: {new Date(goal.startDate).toLocaleDateString()}
                              <span className="mx-2">•</span>
                              Target: {new Date(goal.targetDate).toLocaleDateString()}
                              <span className="mx-2">•</span>
                              {getDaysRemaining(goal.targetDate)} days remaining
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-8">
                              <Pencil className="h-3.5 w-3.5 mr-1" />
                              Update
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 text-red-500 hover:text-red-600"
                              onClick={() => deleteGoal(goal.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        {/* Progress bar */}
                        <div className="mb-4">
                          <div className="flex justify-between mb-1">
                            <div className="text-sm font-medium">
                              Progress: {Math.round(calculateProgress(goal))}%
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <span>Current: {goal.currentValue} {goal.unit}</span>
                              <ArrowRight className="h-3 w-3" />
                              <span>Target: {goal.targetValue} {goal.unit}</span>
                            </div>
                          </div>
                          <Progress value={calculateProgress(goal)} className="h-2" />
                        </div>
                        
                        {/* Chart */}
                        <div className="h-[160px] max-w-full mx-auto">
                          <ResponsiveChartContainer
                            aspectRatio={{ desktop: 2.5, tablet: 2, mobile: 1.5 }}
                            minHeight={160}
                            maxHeight={160}
                          >
                            <LineChart
                              data={goal.history}
                              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                              <XAxis 
                                dataKey="date" 
                                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                tick={{ fontSize: 10 }}
                                tickLine={false}
                              />
                              <YAxis 
                                domain={
                                  [
                                    Math.min(goal.targetValue, ...goal.history.map(p => p.value)) * 0.9,
                                    Math.max(goal.targetValue, ...goal.history.map(p => p.value)) * 1.1
                                  ]
                                }
                                tick={{ fontSize: 10 }}
                                tickLine={false}
                              />
                              <Tooltip content={CustomTooltip as any} />
                              <Line 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#3b82f6" 
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                activeDot={{ r: 5 }}
                              />
                              {/* Reference line for target */}
                              <line
                                x1={0}
                                y1={goal.targetValue}
                                x2="100%"
                                y2={goal.targetValue}
                                stroke="#ef4444"
                                strokeWidth={1}
                                strokeDasharray="3 3"
                              />
                            </LineChart>
                          </ResponsiveChartContainer>
                        </div>
                        
                        {/* Milestones */}
                        <div className="mt-4">
                          <div className="flex justify-between mb-2">
                            <h4 className="text-sm font-medium">Milestones</h4>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 px-2 text-primary"
                              onClick={() => completeGoal(goal.id)}
                            >
                              Mark as Complete
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                            {goal.milestones.map(milestone => (
                              <div 
                                key={milestone.id} 
                                className={`flex items-center justify-between rounded-md border p-2 text-sm
                                  ${milestone.achieved ? 'bg-primary/5 border-primary/20' : 'bg-muted/20'}
                                `}
                              >
                                <div className="flex items-center gap-2">
                                  {milestone.achieved ? (
                                    <CheckSquare className="h-4 w-4 text-primary" />
                                  ) : (
                                    <div className="h-4 w-4 border rounded-sm" />
                                  )}
                                  <span>{milestone.value} {goal.unit}</span>
                                </div>
                                {milestone.achieved && milestone.achievedDate && (
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(milestone.achievedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Notes */}
                        {goal.notes && (
                          <div className="mt-3 text-xs text-muted-foreground italic border-t pt-2">
                            {goal.notes}
                          </div>
                        )}
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Completed Goals Tab */}
          <TabsContent value="completed" className="space-y-4 mt-2">
            {completedGoals.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No completed goals yet</h3>
                <p className="text-sm text-muted-foreground">
                  Complete your active goals to see them here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedGoals.map(goal => (
                  <Card key={goal.id} className="overflow-hidden opacity-80">
                    <div className="border-l-4 border-green-500">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              {goal.title}
                            </CardTitle>
                            <CardDescription className="text-xs mt-1">
                              Completed on: {new Date().toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 text-red-500 hover:text-red-600"
                            onClick={() => deleteGoal(goal.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex justify-between mb-1">
                          <div className="text-sm font-medium">
                            Final: {goal.currentValue} {goal.unit}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Target: {goal.targetValue} {goal.unit}
                          </div>
                        </div>
                        <Progress value={100} className="h-2 bg-green-200">
                          <div className="h-full bg-green-500" style={{ width: '100%' }} />
                        </Progress>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* Add New Goal Dialog */}
      <Dialog open={newGoalOpen} onOpenChange={setNewGoalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Goal</DialogTitle>
            <DialogDescription>
              Set a new golf improvement goal and track your progress over time.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="title">Goal Title</Label>
              <Input id="title" placeholder="e.g., Lower my handicap" />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {goalCategories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center gap-2">
                          {category.icon}
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="current-value">Current Value</Label>
                <Input id="current-value" type="number" placeholder="18" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="target-value">Target Value</Label>
                <Input id="target-value" type="number" placeholder="12" />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label>Target Date</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input type="date" />
                </div>
                <div className="flex items-center text-muted-foreground text-sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>3 months from now</span>
                </div>
              </div>
            </div>
            
            <div className="grid gap-2">
              <div className="flex justify-between">
                <Label>Generate Milestones</Label>
                <span className="text-sm text-muted-foreground">4 steps</span>
              </div>
              <Slider defaultValue={[4]} min={2} max={6} step={1} />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input id="notes" placeholder="Additional notes or strategies" />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setNewGoalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={() => setNewGoalOpen(false)}>
              Create Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
} 