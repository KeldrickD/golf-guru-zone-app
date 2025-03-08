import WalletService from './walletService';
import SubscriptionService, { SubscriptionTier } from './subscriptionService';
import AnalyticsService from './analyticsService';
import ContractService from './contractService';

// Player round stats interface
export interface RoundStats {
  id: string;
  date: string;
  courseName: string;
  coursePar: number;
  totalScore: number;
  totalFairways: number;
  fairwaysHit: number;
  greensInRegulation: number;
  totalPutts: number;
  avgDriveDistance: number;
  notes: string;
}

// Analysis results interface
export interface PerformanceAnalysis {
  summary: string;
  weaknesses: string[];
  strengths: string[];
  improvementAreas: {
    area: string;
    description: string;
    drills: string[];
  }[];
  courseTips: string[];
  equipmentSuggestions: string[];
  comparisonToAverage: {
    category: string;
    playerValue: number;
    averageValue: number;
    difference: number;
    interpretation: string;
  }[];
}

// Practice plan interface
export interface PracticePlan {
  id: string;
  title: string;
  description: string;
  focusArea: string;
  drills: {
    name: string;
    description: string;
    duration: string;
    videoUrl?: string;
  }[];
  goals: string[];
  expectedTimeframe: string;
}

export interface ImprovementArea {
  area: string;
  description: string;
}

export interface MetricComparison {
  category: string;
  difference: number;
}

class PerformanceAnalysisService {
  private static instance: PerformanceAnalysisService;
  private walletService: WalletService;
  private subscriptionService: SubscriptionService;
  private analyticsService: AnalyticsService;
  
  // Mock data for demo purposes
  private mockRoundStats: Map<string, RoundStats[]> = new Map();
  private mockAnalysis: Map<string, PerformanceAnalysis> = new Map();
  private mockPracticePlans: Map<string, PracticePlan[]> = new Map();
  
  private constructor() {
    this.walletService = WalletService.getInstance();
    this.subscriptionService = SubscriptionService.getInstance();
    this.analyticsService = AnalyticsService.getInstance();
    
    // Initialize with sample data for demo
    this.initializeSampleData();
  }
  
  static getInstance(): PerformanceAnalysisService {
    if (!PerformanceAnalysisService.instance) {
      PerformanceAnalysisService.instance = new PerformanceAnalysisService();
    }
    return PerformanceAnalysisService.instance;
  }
  
  /**
   * Initialize sample data for demonstration purposes
   */
  private initializeSampleData(): void {
    // Sample user address
    const sampleAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    
    // Sample round stats
    const sampleRounds: RoundStats[] = [
      {
        id: 'round1',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        courseName: 'Pine Valley Golf Club',
        coursePar: 72,
        totalScore: 82,
        totalFairways: 14,
        fairwaysHit: 8,
        greensInRegulation: 9,
        totalPutts: 32,
        avgDriveDistance: 245,
        notes: 'Struggled with bunker shots and had difficulty on par 3s.'
      },
      {
        id: 'round2',
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        courseName: 'Augusta National',
        coursePar: 72,
        totalScore: 85,
        totalFairways: 14,
        fairwaysHit: 7,
        greensInRegulation: 7,
        totalPutts: 34,
        avgDriveDistance: 240,
        notes: 'Windy conditions affected drives. Putting was inconsistent.'
      },
      {
        id: 'round3',
        date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        courseName: 'Pebble Beach',
        coursePar: 72,
        totalScore: 79,
        totalFairways: 14,
        fairwaysHit: 10,
        greensInRegulation: 11,
        totalPutts: 31,
        avgDriveDistance: 250,
        notes: 'Best round in a while. Approach shots were very accurate.'
      }
    ];
    
    // Sample analysis
    const sampleAnalysis: PerformanceAnalysis = {
      summary: "Based on your recent rounds, you're showing consistent performance with scores averaging 82. Your greens in regulation (GIR) percentage is above average for your handicap range, but your putting and bunker play need improvement. Your driving accuracy is inconsistent, which is affecting your overall scoring potential.",
      weaknesses: [
        "Higher than average putts per round (32-34)",
        "Bunker play (averaging 3.7 strokes after finding bunkers)",
        "Inconsistent driving accuracy (57% fairways hit)"
      ],
      strengths: [
        "Approach shots (solid GIR percentage of 50%)",
        "Par 4 scoring (averaging 4.6)",
        "Course management (limited penalty strokes)"
      ],
      improvementAreas: [
        {
          area: "Putting",
          description: "Your 3-putt frequency is above average, particularly on putts between 10-25 feet.",
          drills: [
            "Gate Drill: Place two tees just wider than your putter head 6 inches in front of ball and putt through them",
            "Clock Drill: Place 8 balls in circle around hole at 3-foot distance and try to make all consecutively",
            "Distance Control Exercise: Practice lag putting to different targets focusing on getting within 3 feet"
          ]
        },
        {
          area: "Bunker Play",
          description: "You're struggling with sand consistency and often leaving shots in the bunker or blading them across the green.",
          drills: [
            "Draw a Line: Draw a line in the sand and practice hitting just behind it",
            "Splash Drill: Focus on splashing sand out without a ball to develop feel",
            "Half-Buried Lies: Practice with ball half-buried to improve difficult lie technique"
          ]
        }
      ],
      courseTips: [
        "Focus on positioning your tee shots for better approach angles rather than maximum distance",
        "On Augusta, aim for the middle of the greens rather than hunting pins",
        "At Pine Valley, consider club selection carefully as the course plays longer than the yardage suggests"
      ],
      equipmentSuggestions: [
        "Based on your bunker performance, consider a sand wedge with more bounce (12-14°)",
        "Your putting stats suggest a mallet-style putter might improve consistency over your blade",
        "For your swing speed, a slightly more forgiving driver would help with your dispersion"
      ],
      comparisonToAverage: [
        {
          category: "Putts per Round",
          playerValue: 32.3,
          averageValue: 29.8,
          difference: 2.5,
          interpretation: "Above average (opportunity to save 2-3 strokes)"
        },
        {
          category: "Greens in Regulation",
          playerValue: 9,
          averageValue: 8.2,
          difference: 0.8,
          interpretation: "Better than average (strength)"
        },
        {
          category: "Fairways Hit Percentage",
          playerValue: 57,
          averageValue: 62,
          difference: -5,
          interpretation: "Below average (opportunity to improve)"
        }
      ]
    };
    
    // Sample practice plans
    const samplePracticePlans: PracticePlan[] = [
      {
        id: 'plan1',
        title: 'Putting Improvement Plan',
        description: 'A 3-week plan to reduce your putts per round by focusing on distance control and short putt consistency.',
        focusArea: 'Putting',
        drills: [
          {
            name: 'Ladder Drill',
            description: 'Place balls at 10, 20, 30, and 40 feet and practice distance control, trying to stop each putt within 3 feet of the hole.',
            duration: '15 minutes, 3x per week',
            videoUrl: 'https://www.youtube.com/watch?v=GhzY7TIMnMU'
          },
          {
            name: '3-Foot Circle Drill',
            description: 'Place 8 balls in a circle around the hole at 3 feet and try to make all consecutively.',
            duration: '10 minutes, daily',
            videoUrl: 'https://www.youtube.com/watch?v=VBkMQSGJ9QM'
          },
          {
            name: 'Clock Drill',
            description: 'Place balls at 4, 5, and 6 feet at different points around the hole (like a clock) and work on making consecutive putts.',
            duration: '20 minutes, 2x per week'
          }
        ],
        goals: [
          'Reduce 3-putts to fewer than one per round',
          'Improve make percentage on putts under 6 feet to 80%',
          'Develop consistent pre-putt routine'
        ],
        expectedTimeframe: '3 weeks'
      },
      {
        id: 'plan2',
        title: 'Bunker Play Mastery',
        description: 'A focused training program to improve your sand save percentage.',
        focusArea: 'Bunker Play',
        drills: [
          {
            name: 'Line in the Sand',
            description: 'Draw a line in the sand and practice hitting just behind it to develop consistent strike point.',
            duration: '15 minutes, 2x per week',
            videoUrl: 'https://www.youtube.com/watch?v=vZWPee66M1s'
          },
          {
            name: 'Ball Position Practice',
            description: 'Practice with different ball positions in your stance to see how it affects trajectory and roll.',
            duration: '20 minutes, 1x per week'
          },
          {
            name: 'Buried Lie Challenge',
            description: 'Practice increasingly difficult lies from fluffy to partially buried to develop versatility.',
            duration: '15 minutes, 1x per week'
          }
        ],
        goals: [
          'Increase sand save percentage to 40%',
          'Develop confidence in different types of bunkers',
          'Eliminate chunks and bladed bunker shots'
        ],
        expectedTimeframe: '4 weeks'
      }
    ];
    
    // Store mock data
    this.mockRoundStats.set(sampleAddress, sampleRounds);
    this.mockAnalysis.set(sampleAddress, sampleAnalysis);
    this.mockPracticePlans.set(sampleAddress, samplePracticePlans);
  }
  
  /**
   * Add a new round of golf stats
   * @param stats Round stats to add
   */
  async addRoundStats(stats: Omit<RoundStats, 'id'>): Promise<RoundStats | null> {
    try {
      // Check subscription tier - At least Basic can add limited rounds
      const tier = await this.subscriptionService.getUserTier();
      
      const userAddress = await this.walletService.getAddress();
      if (!userAddress) {
        throw new Error('Wallet not connected');
      }
      
      // Check if user has reached their limit on the Free tier
      if (tier === SubscriptionTier.FREE) {
        const existingRounds = this.mockRoundStats.get(userAddress) || [];
        if (existingRounds.length >= 2) { // Limit Free tier to 2 rounds
          throw new Error('Free tier limited to 2 round entries. Upgrade for unlimited rounds.');
        }
      }
      
      // Create new round with ID
      const newRound: RoundStats = {
        ...stats,
        id: `round-${Date.now()}`
      };
      
      // Save round
      const existingRounds = this.mockRoundStats.get(userAddress) || [];
      this.mockRoundStats.set(userAddress, [...existingRounds, newRound]);
      
      // Track event
      this.analyticsService.trackEvent('round_stats_added', {
        course: stats.courseName,
        score: stats.totalScore,
        tier
      });
      
      return newRound;
      
    } catch (error) {
      console.error('Error adding round stats:', error);
      return null;
    }
  }
  
  /**
   * Get all round stats for the current user
   */
  async getRoundStats(): Promise<RoundStats[]> {
    try {
      // All tiers can access their own round stats
      const userAddress = await this.walletService.getAddress();
      if (!userAddress) {
        throw new Error('Wallet not connected');
      }
      
      return this.mockRoundStats.get(userAddress) || [];
      
    } catch (error) {
      console.error('Error getting round stats:', error);
      return [];
    }
  }
  
  /**
   * Get performance analysis based on the user's round stats
   */
  async getPerformanceAnalysis(): Promise<PerformanceAnalysis | null> {
    try {
      // Check subscription tier - Premium or Pro required
      const tier = await this.subscriptionService.getUserTier();
      if (tier === SubscriptionTier.FREE) {
        throw new Error('Performance analysis requires Premium or Pro subscription');
      }
      
      const userAddress = await this.walletService.getAddress();
      if (!userAddress) {
        throw new Error('Wallet not connected');
      }
      
      // Get existing rounds to check if there's enough data
      const existingRounds = this.mockRoundStats.get(userAddress) || [];
      if (existingRounds.length < 1) {
        throw new Error('Need at least one round to generate performance analysis');
      }
      
      // In a real implementation, this would generate a new analysis based on recent rounds
      // For demo, return the mock analysis
      
      // Track the analysis request
      this.analyticsService.trackEvent('performance_analysis_viewed', {
        roundCount: existingRounds.length,
        tier
      });
      
      return this.mockAnalysis.get(userAddress) || null;
      
    } catch (error) {
      console.error('Error getting performance analysis:', error);
      return null;
    }
  }
  
  /**
   * Get personalized practice plans based on the performance analysis
   */
  async getPracticePlans(): Promise<PracticePlan[]> {
    try {
      // Check subscription tier - Pro only
      const tier = await this.subscriptionService.getUserTier();
      if (tier !== SubscriptionTier.PRO) {
        throw new Error('Personalized practice plans require Pro subscription');
      }
      
      const userAddress = await this.walletService.getAddress();
      if (!userAddress) {
        throw new Error('Wallet not connected');
      }
      
      // In a real implementation, this would generate plans based on analysis
      // For demo, return the mock plans
      
      // Track the plans request
      this.analyticsService.trackEvent('practice_plans_viewed', {
        tier
      });
      
      return this.mockPracticePlans.get(userAddress) || [];
      
    } catch (error) {
      console.error('Error getting practice plans:', error);
      return [];
    }
  }
  
  /**
   * Generate a new performance analysis based on recent rounds
   */
  async generateNewAnalysis(): Promise<PerformanceAnalysis | null> {
    try {
      // Check subscription tier - Premium or Pro required
      const tier = await this.subscriptionService.getUserTier();
      if (tier === SubscriptionTier.FREE) {
        throw new Error('Performance analysis requires Premium or Pro subscription');
      }
      
      const userAddress = await this.walletService.getAddress();
      if (!userAddress) {
        throw new Error('Wallet not connected');
      }
      
      // Get existing rounds
      const existingRounds = this.mockRoundStats.get(userAddress) || [];
      if (existingRounds.length < 1) {
        throw new Error('Need at least one round to generate performance analysis');
      }
      
      // In a real implementation, this would call the OpenAI API to generate a new analysis
      // For demo, we'll pretend we're generating a new one and return the mock
      
      // Track generation
      this.analyticsService.trackEvent('performance_analysis_generated', {
        roundCount: existingRounds.length,
        tier
      });
      
      // Add a bit of delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return this.mockAnalysis.get(userAddress) || null;
      
    } catch (error) {
      console.error('Error generating new analysis:', error);
      return null;
    }
  }
  
  /**
   * Generate new practice plans based on performance analysis
   */
  async generateNewPracticePlans(): Promise<PracticePlan[]> {
    try {
      // Check subscription tier - Pro only
      const tier = await this.subscriptionService.getUserTier();
      if (tier !== SubscriptionTier.PRO) {
        throw new Error('Personalized practice plans require Pro subscription');
      }
      
      const userAddress = await this.walletService.getAddress();
      if (!userAddress) {
        throw new Error('Wallet not connected');
      }
      
      // In a real implementation, this would call the OpenAI API to generate new plans
      // For demo, we'll pretend we're generating new ones and return the mock plans
      
      // Track generation
      this.analyticsService.trackEvent('practice_plans_generated', {
        tier
      });
      
      // Add a bit of delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return this.mockPracticePlans.get(userAddress) || [];
      
    } catch (error) {
      console.error('Error generating new practice plans:', error);
      return [];
    }
  }
}

export default PerformanceAnalysisService; 