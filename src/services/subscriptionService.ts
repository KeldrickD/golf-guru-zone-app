import WalletService from './walletService';
import AnalyticsService from './analyticsService';

// Define subscription tiers
export enum SubscriptionTier {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
  PRO = 'PRO',
}

// Define subscription features by tier
export interface TierFeatures {
  maxBets: number;
  analytics: boolean;
  courseAnalytics: boolean;
  playerAnalytics: boolean;
  customBets: boolean;
  aiRecommendations: boolean;
  priority: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  price: number; // in USD
  features: TierFeatures;
  description: string;
}

export interface SubscriptionDetails {
  tier: SubscriptionTier;
  expiresAt: Date | null;
  features: string[];
  price: number;
}

class SubscriptionService {
  private static instance: SubscriptionService;
  private walletService: WalletService;
  private analyticsService: AnalyticsService;
  private currentTier: SubscriptionTier | null = null;
  
  // Define subscription plans
  public readonly plans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Free',
      tier: SubscriptionTier.FREE,
      price: 0,
      features: {
        maxBets: 5,
        analytics: false,
        courseAnalytics: false,
        playerAnalytics: false,
        customBets: false,
        aiRecommendations: false,
        priority: false
      },
      description: 'Basic betting functionality with limited features.'
    },
    {
      id: 'premium',
      name: 'Premium',
      tier: SubscriptionTier.PREMIUM,
      price: 9.99,
      features: {
        maxBets: 20,
        analytics: true,
        courseAnalytics: true,
        playerAnalytics: false,
        customBets: true,
        aiRecommendations: false,
        priority: false
      },
      description: 'Enhanced betting experience with analytics and custom bets.'
    },
    {
      id: 'pro',
      name: 'Pro',
      tier: SubscriptionTier.PRO,
      price: 19.99,
      features: {
        maxBets: 100,
        analytics: true,
        courseAnalytics: true,
        playerAnalytics: true,
        customBets: true,
        aiRecommendations: true,
        priority: true
      },
      description: 'Complete access to all features including AI recommendations and player analytics.'
    }
  ];
  
  // Mock data for subscription tiers
  private readonly subscriptionTiers: Record<SubscriptionTier, SubscriptionDetails> = {
    [SubscriptionTier.FREE]: {
      tier: SubscriptionTier.FREE,
      expiresAt: null,
      features: [
        'Basic golf rules assistance',
        '5 queries per month',
        'Access to popular questions',
      ],
      price: 0,
    },
    [SubscriptionTier.PREMIUM]: {
      tier: SubscriptionTier.PREMIUM,
      expiresAt: null,
      features: [
        'Advanced golf rules assistance',
        '25 queries per month',
        'Access to popular questions',
        'Detailed rule explanations',
        'Rule illustrations',
      ],
      price: 9.99,
    },
    [SubscriptionTier.PRO]: {
      tier: SubscriptionTier.PRO,
      expiresAt: null,
      features: [
        'Premium golf rules assistance',
        'Unlimited queries',
        'Access to popular questions',
        'Detailed rule explanations',
        'Rule illustrations',
        'Tournament rules access',
        'Priority support',
      ],
      price: 19.99,
    },
  };
  
  // Mock data for user subscriptions
  private userSubscriptions: Map<string, SubscriptionDetails> = new Map();
  
  private constructor() {
    this.walletService = WalletService.getInstance();
    this.analyticsService = AnalyticsService.getInstance();
  }
  
  static getInstance(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService();
    }
    return SubscriptionService.instance;
  }
  
  /**
   * Get the current user's subscription tier
   */
  async getUserTier(): Promise<SubscriptionTier> {
    try {
      const address = await this.walletService.getAddress();
      if (!address) {
        return SubscriptionTier.FREE;
      }
      
      const subscription = this.userSubscriptions.get(address);
      if (!subscription) {
        return SubscriptionTier.FREE;
      }
      
      // Check if subscription has expired
      if (subscription.expiresAt && subscription.expiresAt < new Date()) {
        this.userSubscriptions.delete(address);
        return SubscriptionTier.FREE;
      }
      
      return subscription.tier;
    } catch (error) {
      console.error('Error getting user tier:', error);
      this.analyticsService.trackError('get_user_tier_error', error as Error);
      return SubscriptionTier.FREE;
    }
  }
  
  /**
   * Get subscription details by tier
   * @param tier The subscription tier
   */
  async getSubscriptionDetails(tier: SubscriptionTier): Promise<SubscriptionDetails> {
    return this.subscriptionTiers[tier];
  }
  
  /**
   * Upgrade user to a new subscription tier
   * @param tier The tier to upgrade to
   */
  async upgradeTier(tier: SubscriptionTier): Promise<boolean> {
    try {
      const address = await this.walletService.getAddress();
      if (!address) {
        throw new Error('Wallet not connected');
      }
      
      // In a real implementation, this would handle payment processing
      // For demo purposes, we'll simulate a successful upgrade
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const subscription = { 
        ...this.subscriptionTiers[tier],
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      };
      
      this.userSubscriptions.set(address, subscription);
      
      this.analyticsService.trackSubscriptionEvent('upgrade', tier, {
        address,
        price: subscription.price,
      });
      
      return true;
    } catch (error) {
      console.error('Error upgrading tier:', error);
      this.analyticsService.trackError('upgrade_tier_error', error as Error);
      throw error;
    }
  }
  
  /**
   * Cancel the current user's subscription
   */
  async cancelSubscription(): Promise<boolean> {
    try {
      const address = await this.walletService.getAddress();
      if (!address) {
        throw new Error('Wallet not connected');
      }
      
      const subscription = this.userSubscriptions.get(address);
      if (!subscription) {
        throw new Error('No active subscription');
      }
      
      // In a real implementation, this would handle subscription cancellation
      // For demo purposes, we'll simulate a successful cancellation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.userSubscriptions.delete(address);
      
      this.analyticsService.trackSubscriptionEvent('cancel', subscription.tier, {
        address,
      });
      
      return true;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      this.analyticsService.trackError('cancel_subscription_error', error as Error);
      throw error;
    }
  }
  
  /**
   * Get the remaining number of queries for the current user
   */
  async getRemainingQueries(): Promise<number> {
    try {
      const tier = await this.getUserTier();
      const address = await this.walletService.getAddress();
      
      if (!address) {
        return 0;
      }
      
      // In a real implementation, this would query a database
      // For demo purposes, we'll return a random number based on the tier
      switch (tier) {
        case SubscriptionTier.FREE:
          return Math.floor(Math.random() * 6); // 0-5 queries
        case SubscriptionTier.PREMIUM:
          return Math.floor(Math.random() * 16) + 10; // 10-25 queries
        case SubscriptionTier.PRO:
          return 100; // Unlimited (represented as 100)
        default:
          return 0;
      }
    } catch (error) {
      console.error('Error getting remaining queries:', error);
      this.analyticsService.trackError('get_remaining_queries_error', error as Error);
      return 0;
    }
  }
  
  /**
   * Check if user has access to a specific feature
   * @param feature The feature to check access for
   */
  async checkFeatureAccess(feature: string): Promise<boolean> {
    try {
      const tier = await this.getUserTier();
      const subscription = this.subscriptionTiers[tier];
      
      return subscription.features.includes(feature);
    } catch (error) {
      console.error('Error checking feature access:', error);
      this.analyticsService.trackError('check_feature_access_error', error as Error);
      return false;
    }
  }
  
  /**
   * Get plan details by subscription tier
   * @param tier The subscription tier
   */
  getPlanByTier(tier: SubscriptionTier): SubscriptionPlan | undefined {
    return this.plans.find(plan => plan.tier === tier);
  }
  
  /**
   * Check if user is on a paid plan
   */
  async isOnPaidPlan(): Promise<boolean> {
    const tier = await this.getUserTier();
    return tier !== SubscriptionTier.FREE;
  }
  
  /**
   * Get the maximum number of bets allowed for current user
   */
  async getMaxBets(): Promise<number> {
    const tier = await this.getUserTier();
    const plan = this.plans.find(p => p.tier === tier);
    
    if (!plan) {
      return 5; // Default to FREE tier limit
    }
    
    return plan.features.maxBets;
  }

  async getTransactionFeePercentage(): Promise<number> {
    const tier = await this.getUserTier();
    switch (tier) {
      case SubscriptionTier.PRO:
        return 1.0;
      case SubscriptionTier.PREMIUM:
        return 2.0;
      default:
        return 3.0;
    }
  }

  getTierDetails(tier: SubscriptionTier): TierFeatures {
    const plan = this.plans.find(p => p.tier === tier);
    if (!plan) {
      // Return free tier features as default
      return this.plans[0].features;
    }
    return plan.features;
  }
}

export default SubscriptionService; 