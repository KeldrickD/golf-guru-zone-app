import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import OfflineRoundForm from '@/components/OfflineRoundForm';
import OfflineIndicator from '@/components/OfflineIndicator';

export const metadata = {
  title: 'Add Round | Golf Guru Zone',
  description: 'Record your latest golf round performance',
};

export default async function AddRoundPage() {
  const session = await auth();
  
  // Redirect if not authenticated
  if (!session || !session.user) {
    redirect('/api/auth/signin');
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href="/rounds">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Rounds
          </Button>
        </Link>
      </div>
      
      <div className="flex flex-col items-center justify-center w-full">
        <h1 className="text-3xl font-bold mb-8 text-center">Record New Round</h1>
        
        {/* The OfflineRoundForm component handles both online and offline submissions */}
        <OfflineRoundForm userId={session.user.id} />
      </div>
      
      {/* Offline indicator shows when user is offline or has pending offline rounds */}
      <OfflineIndicator />
    </div>
  );
} 