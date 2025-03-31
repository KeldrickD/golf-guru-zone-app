'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

interface Round {
  id: string;
  course: string;
  date: string;
  score: number;
  notes: string;
  weather: string;
}

export default function ModernUIPage() {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [newRound, setNewRound] = useState({
    course: '',
    date: '',
    score: '',
    notes: '',
    weather: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const round: Round = {
      id: Date.now().toString(),
      course: newRound.course,
      date: newRound.date,
      score: parseInt(newRound.score),
      notes: newRound.notes,
      weather: newRound.weather,
    };
    setRounds([...rounds, round]);
    setNewRound({ course: '', date: '', score: '', notes: '', weather: '' });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Modern UI Demo</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add New Round</CardTitle>
            <CardDescription>Record your latest golf round</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="course">Course Name</Label>
                <Input
                  id="course"
                  value={newRound.course}
                  onChange={(e) => setNewRound({ ...newRound, course: e.target.value })}
                  placeholder="Enter course name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newRound.date}
                  onChange={(e) => setNewRound({ ...newRound, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="score">Score</Label>
                <Input
                  id="score"
                  type="number"
                  value={newRound.score}
                  onChange={(e) => setNewRound({ ...newRound, score: e.target.value })}
                  placeholder="Enter your score"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weather">Weather Conditions</Label>
                <Input
                  id="weather"
                  value={newRound.weather}
                  onChange={(e) => setNewRound({ ...newRound, weather: e.target.value })}
                  placeholder="e.g., Sunny, 75°F"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={newRound.notes}
                  onChange={(e) => setNewRound({ ...newRound, notes: e.target.value })}
                  placeholder="Any additional notes about the round"
                />
              </div>
              <Button type="submit" className="w-full">
                Add Round
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Recent Rounds</h2>
          {rounds.map((round) => (
            <Card key={round.id}>
              <CardHeader>
                <CardTitle>{round.course}</CardTitle>
                <CardDescription>{round.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Score</p>
                    <p className="font-medium">{round.score}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Weather</p>
                    <p className="font-medium">{round.weather}</p>
                  </div>
                  {round.notes && (
                    <div className="col-span-2 mt-4">
                      <p className="text-sm text-gray-500">Notes</p>
                      <p className="font-medium">{round.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 