'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';

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

export default function RoundDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { addToast } = useToast();
  const [round, setRound] = useState<Round | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRound();
  }, [params.id]);

  const fetchRound = async () => {
    try {
      const response = await fetch(`/api/rounds/${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch round');
      }
      const data = await response.json();
      setRound(data);
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to fetch round details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this round?')) {
      return;
    }

    try {
      const response = await fetch(`/api/rounds/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete round');
      }

      addToast({
        title: 'Success',
        description: 'Round deleted successfully',
      });

      router.push('/rounds');
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to delete round',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!round) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Round not found</h2>
          <Button
            onClick={() => router.push('/rounds')}
            className="mt-4"
          >
            Back to Rounds
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/rounds')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Rounds
          </Button>
          <div className="flex-1" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/rounds/${params.id}/edit`)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{round.course}</CardTitle>
            <CardDescription>
              {format(new Date(round.date), 'MMMM d, yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Total Score</h3>
                  <p className="text-2xl font-bold mt-1">{round.totalScore}</p>
                </div>
                {round.putts && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Putts</h3>
                    <p className="text-2xl font-bold mt-1">{round.putts}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {round.fairwaysHit && round.totalFairways && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Fairways Hit</h3>
                    <p className="text-2xl font-bold mt-1">
                      {round.fairwaysHit}/{round.totalFairways}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {Math.round((round.fairwaysHit / round.totalFairways) * 100)}%
                    </p>
                  </div>
                )}
                {round.greensInRegulation && round.totalGreens && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Greens in Regulation</h3>
                    <p className="text-2xl font-bold mt-1">
                      {round.greensInRegulation}/{round.totalGreens}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {Math.round((round.greensInRegulation / round.totalGreens) * 100)}%
                    </p>
                  </div>
                )}
              </div>

              {round.notes && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                  <p className="mt-2 text-gray-700 whitespace-pre-wrap">{round.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 