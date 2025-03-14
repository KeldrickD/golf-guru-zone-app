import { Suspense } from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import OfflineIndicator from '@/components/OfflineIndicator';

export const metadata = {
  title: 'Golf Rounds | Golf Guru Zone',
  description: 'View and manage your golf rounds history',
};

// Loading component for Suspense
function RoundsLoading() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="h-24 rounded-lg bg-muted animate-pulse"></div>
      <div className="h-24 rounded-lg bg-muted animate-pulse"></div>
      <div className="h-24 rounded-lg bg-muted animate-pulse"></div>
    </div>
  );
}

export default async function RoundsPage() {
  const session = await auth();
  
  // Redirect if not authenticated
  if (!session || !session.user) {
    redirect('/api/auth/signin');
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Rounds</h1>
        <Link href="/rounds/add">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Round
          </Button>
        </Link>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Rounds</TabsTrigger>
          <TabsTrigger value="recent">Recent Rounds</TabsTrigger>
          <TabsTrigger value="best">Best Scores</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Rounds</CardTitle>
              <CardDescription>
                View all your recorded golf rounds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<RoundsLoading />}>
                {/* @ts-expect-error Async Component */}
                <RoundsTable userId={session.user.id} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Rounds</CardTitle>
              <CardDescription>
                Your most recent golf rounds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<RoundsLoading />}>
                {/* @ts-expect-error Async Component */}
                <RoundsTable userId={session.user.id} filter="recent" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="best">
          <Card>
            <CardHeader>
              <CardTitle>Best Scores</CardTitle>
              <CardDescription>
                Your best performing rounds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<RoundsLoading />}>
                {/* @ts-expect-error Async Component */}
                <RoundsTable userId={session.user.id} filter="best" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Offline indicator shows when user is offline or has pending offline rounds */}
      <OfflineIndicator />
    </div>
  );
}

// Async component to fetch and display rounds
async function RoundsTable({
  userId,
  filter = 'all'
}: {
  userId: string;
  filter?: 'all' | 'recent' | 'best';
}) {
  // TODO: Replace with your actual data fetching
  // For now, using a placeholder fetch with dummy data
  const rounds = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/rounds?userId=${userId}&filter=${filter}`, {
    cache: 'no-store',
  }).then(res => res.json()).catch(() => []);
  
  if (!rounds || rounds.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">No rounds recorded yet.</p>
        <Link href="/rounds/add">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Your First Round
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="py-3 px-2 text-left">Date</th>
            <th className="py-3 px-2 text-left">Course</th>
            <th className="py-3 px-2 text-center">Score</th>
            <th className="py-3 px-2 text-center">Par</th>
            <th className="py-3 px-2 text-center">+/-</th>
            <th className="py-3 px-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rounds.map((round: any) => (
            <tr key={round.id} className="border-b hover:bg-muted/50">
              <td className="py-3 px-2">
                {new Date(round.date).toLocaleDateString()}
              </td>
              <td className="py-3 px-2">{round.courseName}</td>
              <td className="py-3 px-2 text-center">{round.score}</td>
              <td className="py-3 px-2 text-center">{round.par}</td>
              <td className="py-3 px-2 text-center">
                <span className={`font-medium ${round.score > round.par ? 'text-red-500' : round.score < round.par ? 'text-green-500' : ''}`}>
                  {round.score === round.par ? 'E' : round.score > round.par ? `+${round.score - round.par}` : round.score - round.par}
                </span>
              </td>
              <td className="py-3 px-2 text-center">
                <Link href={`/rounds/${round.id}`}>
                  <Button variant="ghost" size="sm">View</Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 