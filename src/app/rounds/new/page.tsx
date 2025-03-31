'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { useToast } from '@/hooks/use-toast';

export default function NewRound() {
  const router = useRouter();
  const { data: session } = useSession();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    course: '',
    date: new Date().toISOString().split('T')[0],
    totalScore: '',
    putts: '',
    fairwaysHit: '',
    totalFairways: '',
    greensInRegulation: '',
    totalGreens: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/rounds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: session?.user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create round');
      }

      addToast({
        title: 'Success',
        description: 'Round recorded successfully',
      });

      router.push('/rounds');
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to record round',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Record New Round</CardTitle>
            <CardDescription>
              Enter the details of your latest round
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
                  value={formData.date}
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
                    value={formData.putts}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fairwaysHit">Fairways Hit</Label>
                  <Input
                    id="fairwaysHit"
                    name="fairwaysHit"
                    type="number"
                    value={formData.fairwaysHit}
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
                    value={formData.totalFairways}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="greensInRegulation">Greens in Regulation</Label>
                  <Input
                    id="greensInRegulation"
                    name="greensInRegulation"
                    type="number"
                    value={formData.greensInRegulation}
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
                  value={formData.totalGreens}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full min-h-[100px] p-2 border rounded-md"
                  placeholder="Any additional notes about your round..."
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Round'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 