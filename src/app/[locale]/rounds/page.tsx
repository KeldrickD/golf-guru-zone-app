'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

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

export default function RoundsList() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const { data: session } = useSession();
  const { addToast } = useToast();
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRounds();
  }, []);

  const fetchRounds = async () => {
    try {
      const response = await fetch('/api/rounds');
      if (!response.ok) {
        throw new Error('Failed to fetch rounds');
      }
      const data = await response.json();
      setRounds(data);
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to fetch rounds',
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Rounds</h1>
          <Button onClick={() => router.push(`/${locale}/rounds/new`)}>
            Record New Round
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rounds.map((round) => (
            <Card 
              key={round.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/${locale}/rounds/${round.id}`)}
            >
              <CardHeader>
                <CardTitle>{round.course}</CardTitle>
                <CardDescription>
                  {format(new Date(round.date), 'MMMM d, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Score:</span>
                    <span className="font-semibold">{round.totalScore}</span>
                  </div>
                  {round.putts && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Putts:</span>
                      <span className="font-semibold">{round.putts}</span>
                    </div>
                  )}
                  {round.fairwaysHit && round.totalFairways && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fairways:</span>
                      <span className="font-semibold">
                        {round.fairwaysHit}/{round.totalFairways}
                      </span>
                    </div>
                  )}
                  {round.greensInRegulation && round.totalGreens && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">GIR:</span>
                      <span className="font-semibold">
                        {round.greensInRegulation}/{round.totalGreens}
                      </span>
                    </div>
                  )}
                  {round.notes && (
                    <div className="mt-4">
                      <span className="text-gray-600">Notes:</span>
                      <p className="text-sm mt-1">{round.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {rounds.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500 mb-4">No rounds recorded yet</p>
              <Button onClick={() => router.push(`/${locale}/rounds/new`)}>
                Record Your First Round
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 