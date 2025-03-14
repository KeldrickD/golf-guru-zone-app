'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Trophy, Award, Medal, Star, TrendingUp, ChevronLeft } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import Section from '@/components/Section';
import Link from 'next/link';

// Mock achievement data fetch function
const fetchAchievement = (id: string) => {
  // In a real app, you would fetch this from an API
  const mockAchievements = [
    {
      id: '1',
      title: 'First Sub-80 Round',
      description: 'Shot a 79 at Pine Valley Golf Club',
      date: new Date('2023-12-15'),
      type: 'personal_best',
      metrics: [
        { label: 'Score', value: 79 },
        { label: 'Putts', value: 28 },
        { label: 'GIR', value: '67%' }
      ],
      player: {
        name: 'Thomas Wilson',
        image: 'https://via.placeholder.com/150',
        handicap: 8.2
      }
    },
    {
      id: '2',
      title: 'Drive Distance Record',
      description: 'Hit a 305-yard drive on hole 7',
      date: new Date('2024-01-20'),
      type: 'milestone',
      metrics: [
        { label: 'Distance', value: '305 yds' },
        { label: 'Club', value: 'Driver' },
        { label: 'Wind', value: 'Tailwind' }
      ],
      player: {
        name: 'Mike Johnson',
        image: 'https://via.placeholder.com/150',
        handicap: 12.5
      }
    }
  ];

  // Find by ID or title (since we're using title in the URL)
  return mockAchievements.find(a => a.id === id || a.title.toLowerCase().includes(id.toLowerCase())) || mockAchievements[0];
};

// Achievement type icons
const achievementIcons = {
  personal_best: <Star className="h-6 w-6 text-amber-500" />,
  milestone: <Medal className="h-6 w-6 text-blue-500" />,
  badge: <Award className="h-6 w-6 text-purple-500" />,
  improvement: <TrendingUp className="h-6 w-6 text-green-500" />
};

export default function SharedAchievementPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [achievement, setAchievement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const id = searchParams?.get('id') || '';
  
  useEffect(() => {
    if (id) {
      // In a real app, this would be an API fetch
      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
        const achievementData = fetchAchievement(id);
        setAchievement(achievementData);
        setLoading(false);
      }, 1000);
    } else {
      router.push('/achievements');
    }
  }, [id, router]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!achievement) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <Award className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Achievement Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The achievement you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/achievements">
              View All Achievements
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/achievements">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Achievements
          </Link>
        </Button>
      </div>
      
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-emerald-100 to-sky-100 dark:from-emerald-900/30 dark:to-sky-900/30 mb-4">
          <Trophy className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">{achievement.title}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {achievement.description}
        </p>
      </div>
      
      <Section>
        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {achievementIcons[achievement.type as keyof typeof achievementIcons]}
              </div>
              <div>
                <CardTitle>Achievement Details</CardTitle>
                <CardDescription>
                  {new Date(achievement.date).toLocaleDateString(undefined, { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="grid grid-cols-3 gap-6">
                {achievement.metrics?.map((metric: any, i: number) => (
                  <div key={i} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{metric.label}</div>
                    <div className="text-2xl font-bold">{metric.value}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <img 
                      src={achievement.player.image} 
                      alt={achievement.player.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <div className="font-medium text-lg">{achievement.player.name}</div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Handicap: {achievement.player.handicap}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="w-full text-center py-3 bg-primary/10 rounded-lg">
              <span className="text-primary font-medium">Shared from Golf Guru Zone</span>
            </div>
            <div className="w-full flex justify-center gap-4">
              <Button asChild variant="default">
                <Link href="/">
                  Try Golf Guru Zone
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/achievements">
                  See More Achievements
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </Section>
    </div>
  );
} 