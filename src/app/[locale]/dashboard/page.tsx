'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { localizeUrl } from '@/lib/route-utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { BarChart, LineChart, Calendar, Clock, Award, Club } from 'lucide-react';

// Simulated dashboard data
const DEMO_DATA = {
  recentRounds: [
    { id: '1', date: '2023-11-12', course: 'Pine Valley Golf Club', score: 82, par: 72 },
    { id: '2', date: '2023-10-28', course: 'Augusta National', score: 85, par: 72 },
    { id: '3', date: '2023-10-15', course: 'St. Andrews Links', score: 79, par: 72 }
  ],
  stats: {
    handicap: 12.4,
    roundsPlayed: 12,
    averageScore: 83.5,
    bestScore: 76,
    fairwaysHit: '64%',
    greensInRegulation: '52%',
    puttsPerRound: 31.2
  },
  upcomingTeeTime: {
    date: '2023-12-02',
    time: '10:30 AM',
    course: 'Pebble Beach Golf Links',
    players: ['You', 'John Smith', 'Maria Garcia']
  },
  achievements: [
    { id: '1', title: 'Breaking 80', date: '2023-10-15', description: 'Shot a 79 at St. Andrews Links' },
    { id: '2', title: 'Birdie Streak', date: '2023-11-12', description: 'Made 3 consecutive birdies' }
  ]
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const { t } = useLanguage();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(DEMO_DATA);

  useEffect(() => {
    // Check if user is authenticated
    if (status === 'unauthenticated') {
      router.push(localizeUrl('/login', locale));
      return;
    }

    // Simulate data loading
    setTimeout(() => {
      setDashboardData(DEMO_DATA);
      setLoading(false);
      
      addToast({
        title: 'Demo Mode',
        description: 'Showing simulated dashboard data',
        variant: 'default',
      });
    }, 1000);
  }, [status, router, locale, addToast]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="mt-2 md:mt-0 text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          Demo Mode: Sample Data
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Handicap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.stats.handicap}</div>
            <p className="text-xs text-muted-foreground">
              Last updated: Yesterday
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.stats.averageScore}</div>
            <p className="text-xs text-muted-foreground">
              From {dashboardData.stats.roundsPlayed} rounds
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Fairways Hit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.stats.fairwaysHit}</div>
            <p className="text-xs text-muted-foreground">
              Average per round
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Greens in Regulation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.stats.greensInRegulation}</div>
            <p className="text-xs text-muted-foreground">
              Average per round
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Rounds & Upcoming Tee Times */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Rounds</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <a href={localizeUrl('/rounds', locale)}>View All</a>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentRounds.map((round) => (
                <div key={round.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <Club className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">{round.course}</p>
                      <p className="text-sm text-muted-foreground">{round.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">{round.score}</span>
                    <span className="text-sm text-muted-foreground">/ {round.par}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Tee Time</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <a href={localizeUrl('/tee-times', locale)}>Book More</a>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-blue-500 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium">{dashboardData.upcomingTeeTime.course}</p>
                  <div className="flex space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      {dashboardData.upcomingTeeTime.date}
                    </span>
                    <span className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {dashboardData.upcomingTeeTime.time}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Playing With</p>
                <div className="flex flex-wrap gap-2">
                  {dashboardData.upcomingTeeTime.players.map((player, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-white rounded border text-xs"
                    >
                      {player}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Achievements</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <a href={localizeUrl('/achievements', locale)}>View All</a>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardData.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="bg-yellow-500 p-2 rounded-full">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium">{achievement.title}</p>
                  <p className="text-sm text-muted-foreground mb-1">{achievement.date}</p>
                  <p className="text-sm">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 