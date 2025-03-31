'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useToast } from '@/hooks/use-toast';

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

export default function EditRound({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Round | null>(null);

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
      setFormData(data);
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to fetch round details',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/rounds/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update round');
      }

      addToast({
        title: 'Success',
        description: 'Round updated successfully',
      });

      router.push(`/rounds/${params.id}`);
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to update round',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!formData) return;
    
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev!,
      [name]: value,
    }));
  };

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Edit Round</CardTitle>
            <CardDescription>
              Update the details of your round
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Input
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date.split('T')[0]}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalScore">Total Score</Label>
                <Input
                  id="totalScore"
                  name="totalScore"
                  type="number"
                  value={formData.totalScore}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="putts">Putts</Label>
                  <Input
                    id="putts"
                    name="putts"
                    type="number"
                    value={formData.putts || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fairwaysHit">Fairways Hit</Label>
                  <Input
                    id="fairwaysHit"
                    name="fairwaysHit"
                    type="number"
                    value={formData.fairwaysHit || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalFairways">Total Fairways</Label>
                  <Input
                    id="totalFairways"
                    name="totalFairways"
                    type="number"
                    value={formData.totalFairways || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="greensInRegulation">Greens in Regulation</Label>
                  <Input
                    id="greensInRegulation"
                    name="greensInRegulation"
                    type="number"
                    value={formData.greensInRegulation || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalGreens">Total Greens</Label>
                <Input
                  id="totalGreens"
                  name="totalGreens"
                  type="number"
                  value={formData.totalGreens || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes || ''}
                  onChange={handleChange}
                  className="w-full min-h-[100px] p-2 border rounded-md"
                  placeholder="Any additional notes about your round..."
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/rounds/${params.id}`)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 