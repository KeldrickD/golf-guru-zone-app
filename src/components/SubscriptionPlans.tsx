'use client';

import { useEffect, useState } from 'react';
import SubscriptionService, { SubscriptionTier, SubscriptionPlan } from '../services/subscriptionService';
import WalletService from '../services/walletService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Check } from 'lucide-react';

interface SubscriptionPlansProps {
  onUpgrade?: () => void;
}

export function SubscriptionPlans({ onUpgrade }: SubscriptionPlansProps) {
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>(SubscriptionTier.FREE);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const subscriptionService = SubscriptionService.getInstance();
  const walletService = WalletService.getInstance();
  const plans = subscriptionService.plans;

  useEffect(() => {
    const checkConnection = async () => {
      const connected = await walletService.isConnected();
      setIsWalletConnected(connected);
      if (connected) {
        const tier = await subscriptionService.getUserTier();
        setCurrentTier(tier);
      }
    };

    checkConnection();
  }, []);

  const handleUpgrade = async (plan: SubscriptionPlan) => {
    try {
      await subscriptionService.upgradeTier(plan.tier);
      setCurrentTier(plan.tier);
      if (onUpgrade) {
        onUpgrade();
      }
    } catch (error) {
      console.error('Error upgrading subscription:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <Card key={plan.id} className={`relative ${currentTier === plan.tier ? 'border-2 border-primary' : ''}`}>
          {currentTier === plan.tier && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                Current Plan
              </span>
            </div>
          )}
          <CardHeader>
            <CardTitle className="flex justify-between items-baseline">
              <span>{plan.name}</span>
              <span className="text-2xl font-bold">
                ${plan.price}
                <span className="text-sm font-normal text-muted-foreground">/mo</span>
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
            <ul className="space-y-2 mb-6">
              {Object.entries(plan.features).map(([key, value]) => (
                <li key={key} className="flex items-center">
                  {value ? (
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <span className="h-4 w-4 text-gray-300 mr-2">-</span>
                  )}
                  <span className="text-sm">
                    {key === 'maxBets' ? `${value} active bets` : key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </span>
                </li>
              ))}
            </ul>
            <Button
              className="w-full"
              variant={currentTier === plan.tier ? 'outline' : 'default'}
              disabled={!isWalletConnected || currentTier === plan.tier}
              onClick={() => handleUpgrade(plan)}
            >
              {!isWalletConnected
                ? 'Connect Wallet'
                : currentTier === plan.tier
                ? 'Current Plan'
                : `Upgrade to ${plan.name}`}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 