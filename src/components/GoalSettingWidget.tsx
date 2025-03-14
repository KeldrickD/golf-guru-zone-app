'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { Progress } from '@/components/ui/Progress';
import { Calendar as CalendarIcon, Target, Plus, Edit, Trash2, Check, X, Calendar, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/useToast';
import useSWR from 'swr';

// API fetcher function for SWR
const fetcher = (url: string) => fetch(url).then(res => res.json());

interface Goal {
  id: string;
  type: string;
  targetValue: number;
  startValue: number | null;
  deadline: string | null;
  isCompleted: boolean;
  progress: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

const goalTypes = [
  { value: 'handicap', label: 'Handicap', lowerIsBetter: true, format: '0.0' },
  { value: 'score', label: 'Average Score', lowerIsBetter: true, format: '0' },
  { value: 'putts', label: 'Putts per Round', lowerIsBetter: true, format: '0.0' },
  { value: 'fairways', label: 'Fairways Hit %', lowerIsBetter: false, format: '0.0%' },
  { value: 'gir', label: 'Greens in Regulation %', lowerIsBetter: false, format: '0.0%' },
];

export function GoalSettingWidget() {
  const { toast } = useToast();
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [goalType, setGoalType] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [deadline, setDeadline] = useState('');
  const [notes, setNotes] = useState('');
  
  // Fetch goals
  const { data, error, isLoading, mutate } = useSWR('/api/goals', fetcher);
  const goals: Goal[] = data?.goals || [];
  
  // Reset form
  const resetForm = () => {
    setGoalType('');
    setTargetValue('');
    setDeadline('');
    setNotes('');
    setIsAddingGoal(false);
    setEditingGoalId(null);
  };
  
  // Create new goal
  const handleCreateGoal = async () => {
    if (!goalType || !targetValue) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: goalType,
          targetValue: parseFloat(targetValue),
          deadline: deadline || undefined,
          notes: notes || undefined,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create goal');
      }
      
      toast({
        title: "Success",
        description: "Goal created successfully",
      });
      
      resetForm();
      mutate(); // Refresh goals
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create goal",
        variant: "destructive",
      });
    }
  };
  
  // Update goal
  const handleUpdateGoal = async () => {
    if (!editingGoalId || !goalType || !targetValue) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const response = await fetch(`/api/goals/${editingGoalId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetValue: parseFloat(targetValue),
          deadline: deadline || undefined,
          notes: notes || undefined,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update goal');
      }
      
      toast({
        title: "Success",
        description: "Goal updated successfully",
      });
      
      resetForm();
      mutate(); // Refresh goals
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update goal",
        variant: "destructive",
      });
    }
  };
  
  // Delete goal
  const handleDeleteGoal = async (goalId: string) => {
    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete goal');
      }
      
      toast({
        title: "Success",
        description: "Goal deleted successfully",
      });
      
      mutate(); // Refresh goals
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete goal",
        variant: "destructive",
      });
    }
  };
  
  // Mark goal as completed
  const handleToggleCompleted = async (goal: Goal) => {
    try {
      const response = await fetch(`/api/goals/${goal.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isCompleted: !goal.isCompleted,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update goal');
      }
      
      toast({
        title: "Success",
        description: goal.isCompleted 
          ? "Goal marked as in progress" 
          : "Goal marked as completed",
      });
      
      mutate(); // Refresh goals
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update goal",
        variant: "destructive",
      });
    }
  };
  
  // Edit goal
  const handleEditGoal = (goal: Goal) => {
    setEditingGoalId(goal.id);
    setGoalType(goal.type);
    setTargetValue(goal.targetValue.toString());
    setDeadline(goal.deadline || '');
    setNotes(goal.notes || '');
    setIsAddingGoal(true);
  };
  
  // Format goal value based on type
  const formatGoalValue = (type: string, value: number) => {
    const goalType = goalTypes.find(gt => gt.value === type);
    if (!goalType) return value.toString();
    
    switch (goalType.format) {
      case '0.0':
        return value.toFixed(1);
      case '0.0%':
        return `${value.toFixed(1)}%`;
      case '0':
        return Math.round(value).toString();
      default:
        return value.toString();
    }
  };
  
  // Get deadline status
  const getDeadlineStatus = (deadline: string | null) => {
    if (!deadline) return null;
    
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const daysRemaining = Math.floor((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining < 0) {
      return { label: 'Overdue', color: 'text-red-500' };
    } else if (daysRemaining < 7) {
      return { label: `${daysRemaining} days left`, color: 'text-amber-500' };
    } else {
      return { label: `${daysRemaining} days left`, color: 'text-green-500' };
    }
  };
  
  return (
    <Card className="shadow-md border-gray-100 dark:border-gray-800 overflow-hidden">
      <CardHeader className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/80 dark:to-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 sm:px-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Target className="h-5 w-5 text-primary" />
            </motion.div>
            <CardTitle className="text-lg sm:text-xl font-bold">Your Golf Goals</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={() => setIsAddingGoal(!isAddingGoal)}
          >
            {isAddingGoal ? (
              <>
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Add Goal</span>
              </>
            )}
          </Button>
        </div>
        <CardDescription className="text-sm sm:text-base">
          Set and track your golf improvement targets
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 sm:p-6">
        {isAddingGoal && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
          >
            <h3 className="text-base font-medium mb-3">
              {editingGoalId ? 'Edit Goal' : 'New Goal'}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="goal-type">Goal Type</Label>
                  <Select 
                    value={goalType} 
                    onValueChange={setGoalType}
                    disabled={!!editingGoalId}
                  >
                    <SelectTrigger id="goal-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {goalTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label} {type.lowerIsBetter ? '(Lower is Better)' : '(Higher is Better)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="target-value">Target Value</Label>
                  <Input
                    id="target-value"
                    type="number"
                    step="0.1"
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    placeholder="Enter target"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="deadline">Deadline (Optional)</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional notes"
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button onClick={editingGoalId ? handleUpdateGoal : handleCreateGoal}>
                  {editingGoalId ? 'Update Goal' : 'Create Goal'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 dark:text-red-400">Error loading goals</p>
            <Button 
              onClick={() => mutate()}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <Target className="h-12 w-12 mx-auto text-gray-400" />
            <div>
              <p className="text-gray-600 dark:text-gray-300 mb-2">You haven't set any goals yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Set goals to track your progress and improve your golf game
              </p>
              <Button onClick={() => setIsAddingGoal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Goal
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const goalTypeInfo = goalTypes.find(gt => gt.value === goal.type);
              const deadlineStatus = getDeadlineStatus(goal.deadline);
              
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-4 rounded-lg border ${
                    goal.isCompleted 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/30' 
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium flex items-center">
                        {goalTypeInfo?.label || goal.type}
                        {goal.isCompleted && (
                          <Check className="h-4 w-4 text-green-500 ml-2" />
                        )}
                      </h4>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <div className="text-gray-700 dark:text-gray-300 text-sm">
                          <span className="font-medium">Target:</span> {formatGoalValue(goal.type, goal.targetValue)}
                        </div>
                        
                        {goal.startValue !== null && (
                          <div className="text-gray-700 dark:text-gray-300 text-sm">
                            <span className="font-medium">Start:</span> {formatGoalValue(goal.type, goal.startValue)}
                          </div>
                        )}
                        
                        {goal.deadline && (
                          <div className={`text-sm flex items-center gap-1 ${deadlineStatus?.color}`}>
                            <Calendar className="h-3 w-3" />
                            <span>{deadlineStatus?.label}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleToggleCompleted(goal)}
                      >
                        {goal.isCompleted ? (
                          <X className="h-4 w-4" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditGoal(goal)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteGoal(goal.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {goal.progress !== null && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500 dark:text-gray-400">Progress</span>
                        <span className={goal.progress >= 100 ? 'text-green-500' : 'text-blue-500'}>
                          {Math.round(goal.progress)}%
                        </span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                  )}
                  
                  {goal.notes && (
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 italic">
                      {goal.notes}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500">
        {goals.length > 0 && (
          <div className="w-full">
            <div className="flex justify-between items-center">
              <span>{goals.filter(g => g.isCompleted).length} / {goals.length} goals completed</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingGoal(true)}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Goal
              </Button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
} 