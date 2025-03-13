'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

interface RoundStats {
  totalScore: number;
  putts: number;
  fairwaysHit: number;
  greensInRegulation: number;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<RoundStats>({
    totalScore: 0,
    putts: 0,
    fairwaysHit: 0,
    greensInRegulation: 0,
  });
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stats),
      });

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Error analyzing stats:', error);
      setAnalysis('Error analyzing your golf stats. Please try again.');
    }

    setLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold mb-8">Golf Performance Analysis</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Enter Your Round Statistics</CardTitle>
            <CardDescription>
              Input your latest round stats to receive AI-powered insights and improvement tips.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalScore">Total Score</Label>
                  <Input
                    id="totalScore"
                    type="number"
                    value={stats.totalScore}
                    onChange={(e) => setStats({ ...stats, totalScore: parseInt(e.target.value) })}
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="putts">Total Putts</Label>
                  <Input
                    id="putts"
                    type="number"
                    value={stats.putts}
                    onChange={(e) => setStats({ ...stats, putts: parseInt(e.target.value) })}
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fairwaysHit">Fairways Hit</Label>
                  <Input
                    id="fairwaysHit"
                    type="number"
                    value={stats.fairwaysHit}
                    onChange={(e) => setStats({ ...stats, fairwaysHit: parseInt(e.target.value) })}
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="greensInRegulation">Greens in Regulation</Label>
                  <Input
                    id="greensInRegulation"
                    type="number"
                    value={stats.greensInRegulation}
                    onChange={(e) => setStats({ ...stats, greensInRegulation: parseInt(e.target.value) })}
                    min="0"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Analyzing...' : 'Analyze My Game'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {analysis && (
          <Card>
            <CardHeader>
              <CardTitle>Analysis & Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{analysis}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
} 