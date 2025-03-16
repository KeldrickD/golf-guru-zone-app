'use client';

import React from 'react';
import { SwingAnalysis } from '@/components/features/SwingAnalysis';
import { TournamentTracker } from '@/components/features/TournamentTracker';
import { LessonBooking } from '@/components/features/LessonBooking';
import { WeatherConditions } from '@/components/features/WeatherConditions';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/Tabs";
import {
  Video,
  Trophy,
  BookOpen,
  Cloud,
} from 'lucide-react';

export default function FeaturesPage() {
  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Golf Features</h1>
        <p className="text-muted-foreground">
          Explore our comprehensive set of golf features designed to enhance your game
        </p>
      </div>

      <Tabs defaultValue="swing" className="space-y-4">
        <TabsList className="grid grid-cols-4 gap-4 h-auto sm:h-12">
          <TabsTrigger value="swing" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span className="hidden sm:inline">Swing Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="tournament" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Tournament Tracker</span>
          </TabsTrigger>
          <TabsTrigger value="lessons" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Book Lessons</span>
          </TabsTrigger>
          <TabsTrigger value="weather" className="flex items-center gap-2">
            <Cloud className="h-4 w-4" />
            <span className="hidden sm:inline">Weather</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="swing" className="space-y-4">
          <SwingAnalysis />
        </TabsContent>

        <TabsContent value="tournament" className="space-y-4">
          <TournamentTracker />
        </TabsContent>

        <TabsContent value="lessons" className="space-y-4">
          <LessonBooking />
        </TabsContent>

        <TabsContent value="weather" className="space-y-4">
          <WeatherConditions />
        </TabsContent>
      </Tabs>
    </div>
  );
} 