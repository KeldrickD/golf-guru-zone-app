'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertCircle, Save, WifiOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { saveOfflineRound, registerBackgroundSync } from '@/lib/indexedDb';

// Form validation schema
const roundFormSchema = z.object({
  courseName: z.string().min(2, { message: 'Course name must be at least 2 characters' }),
  date: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Please provide a valid date' }),
  score: z.coerce.number().int().positive({ message: 'Score must be a positive number' }),
  par: z.coerce.number().int().positive({ message: 'Par must be a positive number' }),
  notes: z.string().optional(),
  weather: z.string().optional(),
  courseRating: z.coerce.number().positive().optional(),
  slopeRating: z.coerce.number().int().positive().optional(),
  fairwaysHit: z.coerce.number().int().min(0).optional(),
  greensInRegulation: z.coerce.number().int().min(0).optional(),
  putts: z.coerce.number().int().min(0).optional(),
  holesPlayed: z.coerce.number().int().min(1).max(18).default(18),
});

// Types based on the schema
type RoundFormValues = z.infer<typeof roundFormSchema>;

// Default values for the form
const defaultValues: Partial<RoundFormValues> = {
  date: new Date().toISOString().split('T')[0],
  holesPlayed: 18,
  par: 72,
};

// Props for the component
interface OfflineRoundFormProps {
  userId: string;
}

const OfflineRoundForm = ({ userId }: OfflineRoundFormProps) => {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // Initialize form
  const form = useForm<RoundFormValues>({
    resolver: zodResolver(roundFormSchema),
    defaultValues,
  });

  // Check online status when component mounts
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Form submission handler
  const onSubmit = async (data: RoundFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      if (isOnline) {
        // Online submission - send directly to API
        const response = await fetch('/api/rounds', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            userId,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to submit round data');
        }

        // Redirect to rounds page on success
        router.push('/rounds');
        router.refresh();
      } else {
        // Offline submission - save to IndexedDB
        await saveOfflineRound({
          ...data,
          userId,
        });

        // Try to register for background sync
        await registerBackgroundSync();

        // Show success message
        setSubmitSuccess(true);
        
        // Reset form
        form.reset(defaultValues);
      }
    } catch (error) {
      console.error('Error submitting round:', error);
      setSubmitError('Failed to save round data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center">
          {!isOnline && <WifiOff className="h-5 w-5 mr-2 text-amber-600" />}
          Add Round {!isOnline && "(Offline Mode)"}
        </CardTitle>
        <CardDescription>
          {isOnline
            ? "Record your latest golf round performance"
            : "You're offline. The round will be saved locally and synced when you're back online."}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="courseName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Augusta National" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Score</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="85" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="par"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Par</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="72" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="holesPlayed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Holes Played</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select holes" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="9">9 Holes</SelectItem>
                        <SelectItem value="18">18 Holes</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="courseRating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Rating</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="71.2" {...field} />
                    </FormControl>
                    <FormDescription>Optional</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="slopeRating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slope Rating</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="125" {...field} />
                    </FormControl>
                    <FormDescription>Optional</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="weather"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weather</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select weather" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sunny">Sunny</SelectItem>
                        <SelectItem value="cloudy">Cloudy</SelectItem>
                        <SelectItem value="rainy">Rainy</SelectItem>
                        <SelectItem value="windy">Windy</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Optional</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="fairwaysHit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fairways Hit</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="8" {...field} />
                    </FormControl>
                    <FormDescription>Optional</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="greensInRegulation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Greens in Regulation</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="9" {...field} />
                    </FormControl>
                    <FormDescription>Optional</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="putts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Putts</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="32" {...field} />
                    </FormControl>
                    <FormDescription>Optional</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any thoughts about your round?" 
                      className="resize-none" 
                      rows={4} 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>Optional</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {submitError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}
            
            {submitSuccess && (
              <Alert className="bg-green-50 border-green-200">
                <AlertTitle className="text-green-800">Success</AlertTitle>
                <AlertDescription className="text-green-700">
                  Round saved locally. It will be synced when you're back online.
                </AlertDescription>
              </Alert>
            )}

            {!isOnline && !submitSuccess && (
              <Alert className="bg-amber-50 border-amber-200">
                <WifiOff className="h-4 w-4 text-amber-800" />
                <AlertTitle className="text-amber-800">Offline Mode</AlertTitle>
                <AlertDescription className="text-amber-700">
                  You're working offline. Your round will be saved locally and uploaded when you reconnect.
                </AlertDescription>
              </Alert>
            )}
            
            <CardFooter className="px-0 pt-2">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isOnline ? 'Save Round' : 'Save Round Offline'}
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default OfflineRoundForm; 