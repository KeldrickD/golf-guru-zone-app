'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export default function AchievementsPage() {
  const { data: session } = useSession();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchAchievements();
    }
  }, [session]);

  const fetchAchievements = async () => {
    try {
      const response = await fetch('/api/achievements');
      const data = await response.json();
      setAchievements(data);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return <div>Please sign in to view your achievements.</div>;
  }

  if (loading) {
    return <div>Loading achievements...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Your Achievements</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement) => (
          <Card key={achievement.id} className={achievement.isUnlocked ? 'border-green-500' : ''}>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{achievement.icon}</div>
                <div>
                  <CardTitle>{achievement.title}</CardTitle>
                  <CardDescription>{achievement.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Progress</span>
                  <span className="text-sm font-medium">
                    {achievement.progress} / {achievement.target}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                  />
                </div>
                {achievement.isUnlocked && achievement.unlockedAt && (
                  <div className="text-sm text-green-500">
                    Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 