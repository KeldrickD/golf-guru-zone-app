'use client';

import { useState, useEffect } from 'react';
import SubscriptionService, { SubscriptionTier } from '../services/subscriptionService';
import WalletService from '../services/walletService';

const SubscriptionPlans = () => {
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>(SubscriptionTier.FREE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const subscriptionService = SubscriptionService.getInstance();
  const walletService = WalletService.getInstance();
  const tiers = subscriptionService.getAllTiers();

  useEffect(() => {
    const checkConnection = async () => {
      const connected = await walletService.isConnected();
      setIsConnected(connected);

      if (connected) {
        const tier = await subscriptionService.getUserTier();
        setCurrentTier(tier);
      }
    };

    checkConnection();

    window.addEventListener('walletConnected', () => {
      setIsConnected(true);
      checkConnection();
    });

    window.addEventListener('walletDisconnected', () => {
      setIsConnected(false);
      setCurrentTier(SubscriptionTier.FREE);
    });

    return () => {
      window.removeEventListener('walletConnected', () => setIsConnected(true));
      window.removeEventListener('walletDisconnected', () => setIsConnected(false));
    };
  }, []);

  const handleSubscribe = async (tier: SubscriptionTier) => {
    if (tier === currentTier) {
      setError('You are already subscribed to this plan');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const success = await subscriptionService.subscribe(tier);
      
      if (success) {
        setCurrentTier(tier);
        setSuccess(`Successfully subscribed to ${tiers[tier].name} plan!`);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Failed to process subscription. Please try again.');
      }
    } catch (err) {
      console.error('Subscription error:', err);
      setError('An error occurred while processing your subscription');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Subscription Plans</h2>
        <p className="text-gray-600 mb-4">Please connect your wallet to view and subscribe to plans.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-green-800 mb-4">Subscription Plans</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-700">{success}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(tiers).map(([tierKey, tierDetails]) => {
          const tier = tierKey as SubscriptionTier;
          const isCurrentPlan = tier === currentTier;
          
          return (
            <div 
              key={tier} 
              className={`border rounded-lg p-4 flex flex-col ${
                isCurrentPlan 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="flex-grow">
                <h3 className="text-xl font-bold mb-2">{tierDetails.name}</h3>
                <p className="text-2xl font-bold text-green-700 mb-4">
                  ${tierDetails.price.toFixed(2)}<span className="text-sm text-gray-500">/month</span>
                </p>
                
                <ul className="space-y-2 mb-4">
                  {tierDetails.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <button
                onClick={() => handleSubscribe(tier)}
                disabled={loading || isCurrentPlan}
                className={`w-full py-2 px-4 rounded-md font-medium transition ${
                  isCurrentPlan
                    ? 'bg-green-700 text-white cursor-default'
                    : loading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isCurrentPlan 
                  ? 'Current Plan' 
                  : loading 
                    ? 'Processing...' 
                    : 'Subscribe'}
              </button>
            </div>
          );
        })}
      </div>
      
      <p className="mt-4 text-sm text-gray-500 italic">
        Note: Subscription payments are processed via Stripe. You can cancel anytime.
      </p>
    </div>
  );
};

export default SubscriptionPlans; 