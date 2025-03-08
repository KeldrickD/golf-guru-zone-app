import WalletService from './walletService';
import SubscriptionService, { SubscriptionTier } from './subscriptionService';
import { ethers } from 'ethers';
import ContractService from './contractService';

// Analytics data interfaces
export interface PerformanceStats {
  totalBets: number;
  wonBets: number;
  lostBets: number;
  pendingBets: number;
  winRate: number;
  totalWagered: number;
  totalWon: number;
  netProfit: number;
}

export interface CoursePerformance {
  courseId: string;
  courseName: string;
  betsPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  averageScore: number | null;
}

export interface PlayerPerformance {
  playerAddress: string;
  displayName: string | null;
  betsPlayed: number;
  winsAgainstYou: number;
  lossesAgainstYou: number;
  winRateVsYou: number;
}

export interface BetHistoryItem {
  betId: string;
  betType: string;
  amount: string;
  date: string;
  opponent: string;
  result: 'win' | 'loss' | 'pending';
  courseName?: string;
}

export interface AnalyticsPeriod {
  label: string;
  value: number; // days
}

// Define time periods
export const ANALYTICS_PERIODS: AnalyticsPeriod[] = [
  { label: 'Last 30 Days', value: 30 },
  { label: 'Last 90 Days', value: 90 },
  { label: 'Last 6 Months', value: 180 },
  { label: 'Last Year', value: 365 },
  { label: 'All Time', value: 3650 }, // ~10 years
];

class AnalyticsService {
  private static instance: AnalyticsService;
  private walletService: WalletService;
  private subscriptionService: SubscriptionService;
  private contractService: ContractService;
  
  // Mock data for demo
  private mockBetHistory: BetHistoryItem[] = [
    {
      betId: 'bet123',
      betType: 'Nassau',
      amount: '25',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      opponent: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      result: 'win',
      courseName: 'Pine Valley Golf Club'
    },
    {
      betId: 'bet456',
      betType: 'Match Play',
      amount: '50',
      date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      opponent: '0x8902Ab45Cc6789D0532925a3bBCa454e4438f123',
      result: 'loss',
      courseName: 'Augusta National'
    },
    {
      betId: 'bet789',
      betType: 'Skins',
      amount: '10',
      date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      opponent: '0x9012Cd45Cc6634C0532925a3b844Bc454e4438f44',
      result: 'win',
      courseName: 'Pebble Beach'
    },
    {
      betId: 'bet101',
      betType: 'Stroke Play',
      amount: '100',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      opponent: '0x1234Ab45Cc6634C0532925a3bBCa454e4438f123',
      result: 'pending',
      courseName: 'St Andrews'
    }
  ];
  
  private mockCoursePerformance: CoursePerformance[] = [
    {
      courseId: 'course1',
      courseName: 'Pine Valley Golf Club',
      betsPlayed: 8,
      wins: 6,
      losses: 2,
      winRate: 0.75,
      averageScore: 74
    },
    {
      courseId: 'course2',
      courseName: 'Augusta National',
      betsPlayed: 5,
      wins: 2,
      losses: 3,
      winRate: 0.4,
      averageScore: 78
    },
    {
      courseId: 'course3',
      courseName: 'Pebble Beach',
      betsPlayed: 10,
      wins: 7,
      losses: 3,
      winRate: 0.7,
      averageScore: 76
    },
    {
      courseId: 'course4',
      courseName: 'St Andrews',
      betsPlayed: 3,
      wins: 1,
      losses: 2,
      winRate: 0.33,
      averageScore: 80
    }
  ];
  
  private mockPlayerPerformance: PlayerPerformance[] = [
    {
      playerAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      displayName: 'Tiger Woods',
      betsPlayed: 12,
      winsAgainstYou: 5,
      lossesAgainstYou: 7,
      winRateVsYou: 0.42
    },
    {
      playerAddress: '0x8902Ab45Cc6789D0532925a3bBCa454e4438f123',
      displayName: 'Phil Mickelson',
      betsPlayed: 8,
      winsAgainstYou: 3,
      lossesAgainstYou: 5,
      winRateVsYou: 0.38
    },
    {
      playerAddress: '0x9012Cd45Cc6634C0532925a3b844Bc454e4438f44',
      displayName: 'Rory McIlroy',
      betsPlayed: 6,
      winsAgainstYou: 4,
      lossesAgainstYou: 2,
      winRateVsYou: 0.67
    }
  ];
  
  private constructor() {
    this.walletService = WalletService.getInstance();
    this.subscriptionService = SubscriptionService.getInstance();
    this.contractService = ContractService.getInstance();
  }
  
  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }
  
  /**
   * Get user's performance statistics
   * @param days Number of days to look back
   */
  async getPerformanceStats(days: number): Promise<PerformanceStats | null> {
    try {
      // Check subscription tier
      const tier = await this.subscriptionService.getUserTier();
      if (tier === SubscriptionTier.FREE) {
        throw new Error('You need a Premium or Pro subscription to access analytics');
      }
      
      // In a real implementation, this would query the blockchain
      // For demo, calculate from mock data
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      const relevantBets = this.mockBetHistory.filter(bet => 
        new Date(bet.date) >= cutoffDate
      );
      
      const wonBets = relevantBets.filter(bet => bet.result === 'win').length;
      const lostBets = relevantBets.filter(bet => bet.result === 'loss').length;
      const pendingBets = relevantBets.filter(bet => bet.result === 'pending').length;
      
      const totalWagered = relevantBets.reduce((total, bet) => 
        total + parseFloat(bet.amount), 0
      );
      
      const totalWon = relevantBets
        .filter(bet => bet.result === 'win')
        .reduce((total, bet) => total + parseFloat(bet.amount) * 2, 0);
      
      return {
        totalBets: relevantBets.length,
        wonBets,
        lostBets,
        pendingBets,
        winRate: relevantBets.length > 0 ? wonBets / (wonBets + lostBets) : 0,
        totalWagered,
        totalWon,
        netProfit: totalWon - totalWagered
      };
      
    } catch (error) {
      console.error('Error fetching performance stats:', error);
      return null;
    }
  }
  
  /**
   * Get user's performance by course
   * @param days Number of days to look back
   */
  async getCoursePerformance(days: number): Promise<CoursePerformance[] | null> {
    try {
      // Check subscription tier
      const tier = await this.subscriptionService.getUserTier();
      if (tier === SubscriptionTier.FREE) {
        throw new Error('You need a Premium or Pro subscription to access course analytics');
      }
      
      // In a real implementation, this would query the blockchain
      // For demo, return mock data
      return this.mockCoursePerformance;
      
    } catch (error) {
      console.error('Error fetching course performance:', error);
      return null;
    }
  }
  
  /**
   * Get user's performance against specific players
   * @param days Number of days to look back
   */
  async getPlayerPerformance(days: number): Promise<PlayerPerformance[] | null> {
    try {
      // Check subscription tier - only available for Pro tier
      const tier = await this.subscriptionService.getUserTier();
      if (tier !== SubscriptionTier.PRO) {
        throw new Error('You need a Pro subscription to access player analytics');
      }
      
      // In a real implementation, this would query the blockchain
      // For demo, return mock data
      return this.mockPlayerPerformance;
      
    } catch (error) {
      console.error('Error fetching player performance:', error);
      return null;
    }
  }
  
  /**
   * Get user's bet history
   * @param days Number of days to look back
   */
  async getBetHistory(days: number): Promise<BetHistoryItem[] | null> {
    try {
      // Check subscription tier
      const tier = await this.subscriptionService.getUserTier();
      if (tier === SubscriptionTier.FREE) {
        throw new Error('You need a Premium or Pro subscription to access bet history');
      }
      
      // In a real implementation, this would query the blockchain
      // For demo, filter mock data by date
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      return this.mockBetHistory.filter(bet => 
        new Date(bet.date) >= cutoffDate
      );
      
    } catch (error) {
      console.error('Error fetching bet history:', error);
      return null;
    }
  }
  
  /**
   * Track an event with optional properties
   * @param eventName The name of the event to track
   * @param properties Optional properties to include with the event
   */
  trackEvent(eventName: string, properties: Record<string, any> = {}) {
    // In a real implementation, this would send the event to your analytics service
    console.log('Analytics Event:', {
      event: eventName,
      properties,
      timestamp: new Date().toISOString(),
    });
  }
  
  /**
   * Track a page view
   * @param pageName The name of the page being viewed
   * @param properties Optional properties to include with the page view
   */
  trackPageView(pageName: string, properties: Record<string, any> = {}) {
    this.trackEvent('page_view', {
      page: pageName,
      ...properties,
    });
  }
  
  /**
   * Track a user action
   * @param actionName The name of the action being performed
   * @param properties Optional properties to include with the action
   */
  trackAction(actionName: string, properties: Record<string, any> = {}) {
    this.trackEvent('user_action', {
      action: actionName,
      ...properties,
    });
  }
  
  /**
   * Track an error
   * @param errorName The name or type of error
   * @param error The error object or message
   * @param properties Optional additional properties
   */
  trackError(errorName: string, error: Error | string, properties: Record<string, any> = {}) {
    this.trackEvent('error', {
      name: errorName,
      message: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      ...properties,
    });
  }
  
  /**
   * Track a conversion event
   * @param conversionName The name of the conversion event
   * @param value The value associated with the conversion
   * @param properties Optional additional properties
   */
  trackConversion(conversionName: string, value: number, properties: Record<string, any> = {}) {
    this.trackEvent('conversion', {
      name: conversionName,
      value,
      ...properties,
    });
  }
  
  /**
   * Track a feature usage
   * @param featureName The name of the feature being used
   * @param properties Optional additional properties
   */
  trackFeatureUsage(featureName: string, properties: Record<string, any> = {}) {
    this.trackEvent('feature_usage', {
      feature: featureName,
      ...properties,
    });
  }
  
  /**
   * Track a subscription event
   * @param eventType The type of subscription event (e.g., 'upgrade', 'downgrade', 'cancel')
   * @param tier The subscription tier
   * @param properties Optional additional properties
   */
  trackSubscriptionEvent(eventType: string, tier: string, properties: Record<string, any> = {}) {
    this.trackEvent('subscription', {
      type: eventType,
      tier,
      ...properties,
    });
  }
  
  /**
   * Track user engagement metrics
   * @param metricName The name of the engagement metric
   * @param value The value of the metric
   * @param properties Optional additional properties
   */
  trackEngagement(metricName: string, value: number, properties: Record<string, any> = {}) {
    this.trackEvent('engagement', {
      metric: metricName,
      value,
      ...properties,
    });
  }
  
  /**
   * Track performance metrics
   * @param metricName The name of the performance metric
   * @param value The value of the metric (usually in milliseconds)
   * @param properties Optional additional properties
   */
  trackPerformance(metricName: string, value: number, properties: Record<string, any> = {}) {
    this.trackEvent('performance', {
      metric: metricName,
      value,
      ...properties,
    });
  }
}

export default AnalyticsService; 