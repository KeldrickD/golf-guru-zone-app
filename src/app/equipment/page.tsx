'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

interface PlayerProfile {
  handicap: number;
  swingSpeed: number;
  budget: number;
  primaryConcern: string;
  clubType: string;
}

export default function EquipmentPage() {
  const [profile, setProfile] = useState<PlayerProfile>({
    handicap: 0,
    swingSpeed: 0,
    budget: 0,
    primaryConcern: '',
    clubType: '',
  });
  const [recommendations, setRecommendations] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/equipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error('Error getting equipment recommendations:', error);
      setRecommendations('Error getting recommendations. Please try again.');
    }

    setLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold mb-8">Golf Equipment Recommender</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Golf Profile</CardTitle>
            <CardDescription>
              Tell us about your game to receive personalized equipment recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="handicap">Handicap</Label>
                  <Input
                    id="handicap"
                    type="number"
                    value={profile.handicap}
                    onChange={(e) => setProfile({ ...profile, handicap: parseInt(e.target.value) })}
                    min="0"
                    max="54"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="swingSpeed">Average Driver Swing Speed (mph)</Label>
                  <Input
                    id="swingSpeed"
                    type="number"
                    value={profile.swingSpeed}
                    onChange={(e) => setProfile({ ...profile, swingSpeed: parseInt(e.target.value) })}
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget ($)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={profile.budget}
                    onChange={(e) => setProfile({ ...profile, budget: parseInt(e.target.value) })}
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clubType">Club Type Needed</Label>
                  <select
                    id="clubType"
                    value={profile.clubType}
                    onChange={(e) => setProfile({ ...profile, clubType: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                  >
                    <option value="">Select club type...</option>
                    <option value="driver">Driver</option>
                    <option value="irons">Irons</option>
                    <option value="wedges">Wedges</option>
                    <option value="putter">Putter</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="primaryConcern">Primary Concern</Label>
                  <select
                    id="primaryConcern"
                    value={profile.primaryConcern}
                    onChange={(e) => setProfile({ ...profile, primaryConcern: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                  >
                    <option value="">Select your main concern...</option>
                    <option value="distance">More Distance</option>
                    <option value="accuracy">Better Accuracy</option>
                    <option value="forgiveness">More Forgiveness</option>
                    <option value="control">Better Control</option>
                    <option value="consistency">More Consistency</option>
                  </select>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Finding Best Equipment...' : 'Get Recommendations'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {recommendations && (
          <Card>
            <CardHeader>
              <CardTitle>Your Equipment Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose">
                <p className="whitespace-pre-line">{recommendations}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
} 