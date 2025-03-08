import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import WalletService from '../services/walletService';
import SubscriptionService, { SubscriptionTier, SubscriptionPlan } from '../services/subscriptionService';
import AnalyticsService from '../services/analyticsService';

const SubscriptionPage: React.FC = () => {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentTier, setCurrentTier] = useState<SubscriptionTier | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isUpgrading, setIsUpgrading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const walletService = WalletService.getInstance();
  const subscriptionService = SubscriptionService.getInstance();
  const analyticsService = AnalyticsService.getInstance();
  
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        
        // Check wallet connection
        const address = await walletService.getAddress();
        setIsConnected(!!address);
        
        if (address) {
          // Get current tier
          const tier = await subscriptionService.getUserTier();
          setCurrentTier(tier);
          
          // Get available plans
          setPlans(subscriptionService.plans);
          
          // Track page view
          analyticsService.trackEvent('subscription_page_view', {
            currentTier: tier
          });
        }
        
      } catch (error) {
        console.error('Error initializing subscription page:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initialize();
  }, []);
  
  const handleConnect = async () => {
    try {
      setIsLoading(true);
      await walletService.connect();
      
      // After connection, refresh the page state
      const address = await walletService.getAddress();
      setIsConnected(!!address);
      
      if (address) {
        const tier = await subscriptionService.getUserTier();
        setCurrentTier(tier);
        setPlans(subscriptionService.plans);
      }
      
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError('Failed to connect wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpgrade = async (tier: SubscriptionTier) => {
    try {
      setIsUpgrading(true);
      setError(null);
      setSuccess(null);
      
      // Clear previous messages
      setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      
      // In a real implementation, this would integrate with a payment processor
      // For demo, we'll just update the subscription tier
      const success = await subscriptionService.upgradeTier(tier);
      
      if (success) {
        setCurrentTier(tier);
        setSuccess(`Successfully upgraded to ${tier === SubscriptionTier.PREMIUM ? 'Premium' : 'Pro'} plan!`);
        
        // Track successful upgrade
        analyticsService.trackEvent('subscription_upgrade', {
          previousTier: currentTier,
          newTier: tier
        });
        
        // After a short delay, redirect to analytics
        setTimeout(() => {
          router.push('/analytics');
        }, 3000);
      } else {
        throw new Error('Upgrade failed');
      }
      
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      setError('Failed to upgrade. Please try again later.');
      
      // Track failed upgrade
      analyticsService.trackEvent('subscription_upgrade_failed', {
        currentTier,
        targetTier: tier,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsUpgrading(false);
    }
  };
  
  const renderFeatureCheck = (isIncluded: boolean) => {
    return isIncluded ? (
      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
      </svg>
    ) : (
      <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    );
  };
  
  const isPlanDisabled = (tier: SubscriptionTier) => {
    // Free tier is always available
    if (tier === SubscriptionTier.FREE) return false;
    
    // Can't downgrade
    if (currentTier === SubscriptionTier.PRO && tier === SubscriptionTier.PREMIUM) return true;
    
    // Can't upgrade to current tier
    return currentTier === tier;
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>Subscription Plans | Golf Guru Zone</title>
        <meta name="description" content="Upgrade your subscription to access premium features and analytics." />
      </Head>
      
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Subscription Plans</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose the plan that works best for you and take your golf betting to the next level.
            </p>
            
            {!isConnected && (
              <div className="mt-8">
                <button 
                  onClick={handleConnect} 
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                >
                  Connect Wallet to Subscribe
                </button>
              </div>
            )}
            
            {error && (
              <div className="mt-8 p-4 bg-red-100 text-red-800 rounded-lg">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mt-8 p-4 bg-green-100 text-green-800 rounded-lg">
                {success}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 ${
                  currentTier === plan.tier ? 'ring-2 ring-green-500 transform scale-105' : ''
                }`}
              >
                <div className={`p-8 ${
                  plan.tier === SubscriptionTier.FREE 
                    ? 'bg-gray-100 dark:bg-gray-800' 
                    : plan.tier === SubscriptionTier.PREMIUM 
                      ? 'bg-green-100 dark:bg-green-900' 
                      : 'bg-blue-100 dark:bg-blue-900'
                }`}>
                  <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{plan.description}</p>
                  
                  <div className="flex items-baseline mb-4">
                    <span className="text-5xl font-extrabold">${plan.price}</span>
                    <span className="text-xl text-gray-500 dark:text-gray-400 ml-2">/month</span>
                  </div>
                  
                  <button
                    onClick={() => handleUpgrade(plan.tier)}
                    disabled={isPlanDisabled(plan.tier) || isUpgrading || !isConnected}
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                      isPlanDisabled(plan.tier) || !isConnected
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : plan.tier === SubscriptionTier.FREE
                          ? 'bg-gray-600 hover:bg-gray-700 text-white'
                          : plan.tier === SubscriptionTier.PREMIUM
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {currentTier === plan.tier 
                      ? 'Current Plan' 
                      : isUpgrading 
                        ? 'Processing...' 
                        : `Upgrade to ${plan.name}`}
                  </button>
                </div>
                
                <div className="p-8 bg-white dark:bg-gray-900">
                  <h3 className="font-semibold text-lg mb-4">Features</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      {renderFeatureCheck(true)}
                      <span className="ml-2">Up to {plan.features.maxBets} active bets</span>
                    </li>
                    <li className="flex items-center">
                      {renderFeatureCheck(plan.features.analytics)}
                      <span className="ml-2">Performance Statistics</span>
                    </li>
                    <li className="flex items-center">
                      {renderFeatureCheck(plan.features.courseAnalytics)}
                      <span className="ml-2">Course Analytics</span>
                    </li>
                    <li className="flex items-center">
                      {renderFeatureCheck(plan.features.playerAnalytics)}
                      <span className="ml-2">Player Analytics</span>
                    </li>
                    <li className="flex items-center">
                      {renderFeatureCheck(plan.features.customBets)}
                      <span className="ml-2">Custom Bet Types</span>
                    </li>
                    <li className="flex items-center">
                      {renderFeatureCheck(plan.features.aiRecommendations)}
                      <span className="ml-2">AI Recommendations</span>
                    </li>
                    <li className="flex items-center">
                      {renderFeatureCheck(plan.features.priority)}
                      <span className="ml-2">Priority Support</span>
                    </li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16 text-gray-600 dark:text-gray-300">
            <p>Have questions about our subscription plans?</p>
            <p>Contact us at <a href="mailto:support@golfguruzone.com" className="text-green-600 hover:underline">support@golfguruzone.com</a></p>
          </div>
        </div>
      </main>
    </>
  );
};

export default SubscriptionPage; 