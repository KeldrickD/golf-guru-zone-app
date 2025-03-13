import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export type SubscriptionTier = 'FREE' | 'PREMIUM' | 'PRO';

export const useSubscription = () => {
  const { data: session } = useSession();
  const [tier, setTier] = useState<SubscriptionTier>('FREE');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      loadSubscriptionTier();
    } else {
      setTier('FREE');
      setIsLoading(false);
    }
  }, [session]);

  const loadSubscriptionTier = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // In a real implementation, this would call an API endpoint
      // For demo purposes, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Here we would fetch the user's subscription from the database
      // For now, we'll use a mock implementation
      const tiers: SubscriptionTier[] = ['FREE', 'PREMIUM', 'PRO'];
      const randomTier = tiers[Math.floor(Math.random() * tiers.length)];
      setTier(randomTier);

    } catch (error) {
      console.error('Error loading subscription tier:', error);
      setError('Failed to load subscription tier');
      setTier('FREE');
    } finally {
      setIsLoading(false);
    }
  };

  const upgradeTier = async (newTier: SubscriptionTier) => {
    try {
      if (!session?.user) {
        throw new Error('Please sign in to upgrade');
      }

      setIsLoading(true);
      setError(null);

      // In a real implementation, this would call a payment API and update the database
      // For demo purposes, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1500));

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