'use client';

import { useState, useEffect } from 'react';
import { Calendar, Filter, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';

interface Course {
  id: string;
  name: string;
  location: string;
}

export interface FilterOptions {
  fromDate?: string;
  toDate?: string;
  courseId?: string;
  limit?: number;
}

interface FilterControlsProps {
  onFilterChange: (filters: FilterOptions) => void;
  className?: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function FilterControls({ onFilterChange, className = '' }: FilterControlsProps) {
  // Calculate default dates (last 30 days)
  const defaultToDate = new Date().toISOString().split('T')[0];
  const defaultFromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  const [isOpen, setIsOpen] = useState(false);
  const [fromDate, setFromDate] = useState<string>(defaultFromDate);
  const [toDate, setToDate] = useState<string>(defaultToDate);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [limit, setLimit] = useState<number>(10);
  
  // Fetch courses for the dropdown
  const { data: coursesData } = useSWR('/api/courses', fetcher);
  const courses: Course[] = coursesData?.courses || [];
  
  // Apply filters when values change
  useEffect(() => {
    if (isOpen) return; // Don't apply filters while popover is open
    
    onFilterChange({
      fromDate,
      toDate,
      courseId: selectedCourseId || undefined,
      limit
    });
  }, [fromDate, toDate, selectedCourseId, limit, isOpen, onFilterChange]);
  
  const handleReset = () => {
    setFromDate(defaultFromDate);
    setToDate(defaultToDate);
    setSelectedCourseId("");
    setLimit(10);
    setIsOpen(false);
  };
  
  const handleApply = () => {
    setIsOpen(false);
  };
  
  return (
    <div className={`flex items-center gap-2 mb-4 ${className}`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-3.5 w-3.5" />
            <span>Filter</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <h3 className="font-medium mb-3">Filter Data</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">From</label>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="h-8"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">To</label>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="h-8"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Course</label>
              <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                <SelectTrigger>
                  <SelectValue placeholder="All Courses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Courses</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Display Limit</label>
              <Select 
                value={limit.toString()} 
                onValueChange={(value) => setLimit(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="10 Rounds" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 Rounds</SelectItem>
                  <SelectItem value="10">10 Rounds</SelectItem>
                  <SelectItem value="20">20 Rounds</SelectItem>
                  <SelectItem value="50">50 Rounds</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-between pt-2">
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RefreshCw className="mr-2 h-3.5 w-3.5" />
                Reset
              </Button>
              <Button size="sm" onClick={handleApply}>
                Apply Filters
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      <AnimatePresence>
        {(fromDate !== defaultFromDate || 
         toDate !== defaultToDate || 
         selectedCourseId || 
         limit !== 10) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center"
          >
            <Card className="bg-primary/5 px-3 py-1 text-xs flex items-center gap-2">
              <span>Filtered:</span>
              {fromDate !== defaultFromDate && (
                <span>From {new Date(fromDate).toLocaleDateString()}</span>
              )}
              {toDate !== defaultToDate && (
                <span>To {new Date(toDate).toLocaleDateString()}</span>
              )}
              {selectedCourseId && (
                <span>Course: {courses.find(c => c.id === selectedCourseId)?.name || 'Selected'}</span>
              )}
              {limit !== 10 && (
                <span>Limit: {limit}</span>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5" 
                onClick={handleReset}
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 