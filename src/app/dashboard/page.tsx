'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useToast } from '@/hooks/use-toast';
import { format, subMonths } from 'date-fns';

interface Round {
  id: string;
  course: string;
  date: string;
  totalScore: number;
  putts: number | null;
  fairwaysHit: number | null;
  totalFairways: number | null;
  greensInRegulation: number | null;
  totalGreens: number | null;
  notes: string | null;
}

interface Stats {
  averageScore: number;
  bestScore: number;
  worstScore: number;
  totalRounds: number;
  averagePutts: number;
  fairwayPercentage: number;
  girPercentage: number;
  recentRounds: Round[];
}

export default function Dashboard() {
  const { data: session } = useSession();
  const { addToast } = useToast();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/rounds');
      if (!response.ok) {
        throw new Error('Failed to fetch rounds');
      }
      const rounds: Round[] = await response.json();
      
      // Calculate statistics
      const totalRounds = rounds.length;
      const scores = rounds.map(r => r.totalScore);
      const averageScore = scores.reduce((a, b) => a + b, 0) / totalRounds;
      const bestScore = Math.min(...scores);
      const worstScore = Math.max(...scores);
      
      // Calculate average putts
      const totalPutts = rounds.reduce((sum, r) => sum + (r.putts || 0), 0);
      const roundsWithPutts = rounds.filter(r => r.putts !== null).length;
      const averagePutts = roundsWithPutts > 0 ? totalPutts / roundsWithPutts : 0;
      
      // Calculate fairway percentage
      const totalFairwaysHit = rounds.reduce((sum, r) => sum + (r.fairwaysHit || 0), 0);
      const totalFairways = rounds.reduce((sum, r) => sum + (r.totalFairways || 0), 0);
      const fairwayPercentage = totalFairways > 0 ? (totalFairwaysHit / totalFairways) * 100 : 0;
      
      // Calculate GIR percentage
      const totalGIR = rounds.reduce((sum, r) => sum + (r.greensInRegulation || 0), 0);
      const totalGreens = rounds.reduce((sum, r) => sum + (r.totalGreens || 0), 0);
      const girPercentage = totalGreens > 0 ? (totalGIR / totalGreens) * 100 : 0;
      
      // Get recent rounds (last 3 months)
      const threeMonthsAgo = subMonths(new Date(), 3);
      const recentRounds = rounds
        .filter(r => new Date(r.date) >= threeMonthsAgo)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setStats({
        averageScore,
        bestScore,
        worstScore,
        totalRounds,
        averagePutts,
        fairwayPercentage,
        girPercentage,
        recentRounds,
      });
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to fetch statistics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">No rounds recorded yet</h2>
          <p className="text-gray-500 mt-2">Start recording your rounds to see your statistics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Rounds</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalRounds}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.averageScore.toFixed(1)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Best Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.bestScore}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Worst Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.worstScore}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Average Putts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.averagePutts.toFixed(1)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fairway Percentage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.fairwayPercentage.toFixed(1)}%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>GIR Percentage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.girPercentage.toFixed(1)}%</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Rounds</CardTitle>
            <CardDescription>Your rounds from the last 3 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentRounds.map((round) => (
                <div
                  key={round.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{round.course}</h3>
                    <p className="text-sm text-gray-500">
                      {format(new Date(round.date), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Score: {round.totalScore}</p>
                    {round.putts && (
                      <p className="text-sm text-gray-500">Putts: {round.putts}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 