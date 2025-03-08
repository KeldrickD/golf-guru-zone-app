import { useState, useEffect } from 'react';
import { useWallet } from './useWallet';

export type SubscriptionTier = 'FREE' | 'PREMIUM' | 'PRO';

export const useSubscription = () => {
  const { isConnected, address } = useWallet();
  const [tier, setTier] = useState<SubscriptionTier>('FREE');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      loadSubscriptionTier();
    } else {
      setTier('FREE');
      setIsLoading(false);
    }
  }, [isConnected, address]);

  const loadSubscriptionTier = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // In a real implementation, this would call a contract or API
      // For demo purposes, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock implementation - randomly assign a tier
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
      if (!isConnected) {
        throw new Error('Please connect your wallet');
      }

      setIsLoading(true);
      setError(null);

      // In a real implementation, this would call a contract or API
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