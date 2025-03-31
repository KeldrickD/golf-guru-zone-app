import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export type SubscriptionTier = 'FREE' | 'PREMIUM' | 'PRO';

export const useSubscription = () => {
  const { data: session } = useSession();
  const [tier, setTier] = useState<SubscriptionTier>('PREMIUM'); // Default to PREMIUM for testing
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // No need for useEffect since we're using a static value

  const upgradeTier = async (newTier: SubscriptionTier) => {
    try {
      if (!session?.user) {
        throw new Error('Please sign in to upgrade');
      }

      setIsLoading(true);
      setError(null);

      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500));

      setTier(newTier);

    } catch (error) {
      console.error('Error upgrading subscription:', error);
      setError('Failed to upgrade subscription');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    tier,
    isLoading,
    error,
    upgradeTier,
  };
}; 