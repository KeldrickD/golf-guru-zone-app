'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { SwingAnalysis } from '@/components/features/SwingAnalysis';
import { TournamentTracker } from '@/components/features/TournamentTracker';
import { LessonBooking } from '@/components/features/LessonBooking';
import { WeatherConditions } from '@/components/features/WeatherConditions';
import { SocialSharing } from '@/components/features/SocialSharing';
import { StatTracking } from '@/components/features/StatTracking';
import { FitnessTraining } from '@/components/features/FitnessTraining';
import EquipmentReview from '@/components/features/EquipmentReview';
import CourseRating from '@/components/features/CourseRating';
import GolfRules from '@/components/features/GolfRules';
import Community from '@/components/features/Community';
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
  Share2,
  BarChart3,
  Dumbbell,
  ShoppingBag,
  Flag,
  Book,
  Users,
} from 'lucide-react';

export default function FeaturesPage() {
  const params = useParams();
  const locale = params?.locale as string || 'en';
  
  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Golf Features</h1>
        <p className="text-muted-foreground">
          Explore our comprehensive set of golf features designed to enhance your game
        </p>
      </div>

      <Tabs defaultValue="swing" className="space-y-4">
        <TabsList className="grid grid-cols-11 gap-4 h-auto sm:h-12">
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
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Social Sharing</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Stat Tracking</span>
          </TabsTrigger>
          <TabsTrigger value="fitness" className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4" />
            <span className="hidden sm:inline">Fitness & Training</span>
          </TabsTrigger>
          <TabsTrigger value="equipment" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Equipment</span>
          </TabsTrigger>
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <Flag className="h-4 w-4" />
            <span className="hidden sm:inline">Courses</span>
          </TabsTrigger>
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            <span className="hidden sm:inline">Rules</span>
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Community</span>
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
        
        <TabsContent value="social" className="space-y-4">
          <SocialSharing />
        </TabsContent>
        
        <TabsContent value="stats" className="space-y-4">
          <StatTracking />
        </TabsContent>
        
        <TabsContent value="fitness" className="space-y-4">
          <FitnessTraining />
        </TabsContent>
        
        <TabsContent value="equipment" className="space-y-4">
          <EquipmentReview />
        </TabsContent>
        
        <TabsContent value="courses" className="space-y-4">
          <CourseRating />
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <GolfRules />
        </TabsContent>

        <TabsContent value="community" className="space-y-4">
          <Community />
        </TabsContent>
      </Tabs>
    </div>
  );
} 