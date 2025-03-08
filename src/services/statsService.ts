import WalletService from './walletService';
import ContractService from './contractService';
import SubscriptionService, { SubscriptionTier } from './subscriptionService';

export interface BetStats {
  totalBets: number;
  wonBets: number;
  lostBets: number;
  pendingBets: number;
  totalWagered: number;
  totalWon: number;
  netProfit: number;
  winRate: number;
}

export interface CourseStats {
  courseName: string;
  betsPlayed: number;
  winRate: number;
}

export interface PlayerStats {
  playerAddress: string;
  displayName?: string; // Could be ENS name or user-provided
  gamesPlayed: number;
  wins: number;
  losses: number;
  winRateVsYou: number;
}

class StatsService {
  private static instance: StatsService;
  private walletService: WalletService;
  private contractService: ContractService;
  private subscriptionService: SubscriptionService;
  
  // Mock storage for stats data (in a real app, this would come from a database)
  private mockCourseStats: CourseStats[] = [
    { courseName: 'Pine Valley Golf Club', betsPlayed: 12, winRate: 0.75 },
    { courseName: 'Augusta National', betsPlayed: 8, winRate: 0.62 },
    { courseName: 'Pebble Beach', betsPlayed: 5, winRate: 0.40 },
    { courseName: 'St Andrews', betsPlayed: 3, winRate: 0.67 },
  ];
  
  private mockPlayerStats: PlayerStats[] = [
    { playerAddress: '0x1234...', displayName: 'TigerWoods.eth', gamesPlayed: 15, wins: 9, losses: 6, winRateVsYou: 0.6 },
    { playerAddress: '0x2345...', displayName: 'PhilMickelson', gamesPlayed: 8, wins: 3, losses: 5, winRateVsYou: 0.375 },
    { playerAddress: '0x3456...', displayName: 'RoryMcIlroy', gamesPlayed: 6, wins: 4, losses: 2, winRateVsYou: 0.667 },
  ];

  private constructor() {
    this.walletService = WalletService.getInstance();
    this.contractService = ContractService.getInstance();
    this.subscriptionService = SubscriptionService.getInstance();
  }

  static getInstance(): StatsService {
    if (!StatsService.instance) {
      StatsService.instance = new StatsService();
    }
    return StatsService.instance;
  }

  /**
   * Get overall betting statistics for the current user
   */
  public async getBetStats(): Promise<BetStats | null> {
    try {
      // Check if user has required subscription tier for stats
      const tier = await this.subscriptionService.getUserTier();
      if (tier === SubscriptionTier.FREE) {
        throw new Error('You need a Premium or Pro subscription to access statistics');
      }
      
      // In a real implementation, this would fetch data from the blockchain/database
      // For now, we'll return mock data
      return {
        totalBets: 25,
        wonBets: 15,
        lostBets: 8,
        pendingBets: 2,
        totalWagered: 450,
        totalWon: 600,
        netProfit: 150,
        winRate: 0.65
      };
    } catch (error) {
      console.error('Error fetching bet stats:', error);
      return null;
    }
  }

  /**
   * Get statistics for the user's performance at different courses
   */
  public async getCourseStats(): Promise<CourseStats[] | null> {
    try {
      // Check if user has required subscription tier for stats
      const tier = await this.subscriptionService.getUserTier();
      if (tier === SubscriptionTier.FREE) {
        throw new Error('You need a Premium or Pro subscription to access course statistics');
      }
      
      // In a real implementation, this would fetch data from the blockchain/database
      return this.mockCourseStats;
    } catch (error) {
      console.error('Error fetching course stats:', error);
      return null;
    }
  }

  /**
   * Get statistics for the user's performance against specific players
   */
  public async getPlayerStats(): Promise<PlayerStats[] | null> {
    try {
      // Check if user has required subscription tier
      const tier = await this.subscriptionService.getUserTier();
      if (tier !== SubscriptionTier.PRO) {
        throw new Error('You need a Pro subscription to access advanced player statistics');
      }
      
      // In a real implementation, this would fetch data from the blockchain/database
      return this.mockPlayerStats;
    } catch (error) {
      console.error('Error fetching player stats:', error);
      return null;
    }
  }

  /**
   * Record a new bet for statistics
   * This would be called when bets are created
   */
  public async recordBet(betId: string): Promise<void> {
    try {
      // In a real implementation, this would store the bet in a database for stats tracking
      console.log(`Recording bet ${betId} for statistics`);
    } catch (error) {
      console.error('Error recording bet stats:', error);
    }
  }

  /**
   * Update statistics when a bet is settled
   * This would be called when bets are completed
   */
  public async updateBetResult(betId: string, isWinner: boolean): Promise<void> {
    try {
      // In a real implementation, this would update the bet status in a database
      console.log(`Updating bet ${betId} result: ${isWinner ? 'Won' : 'Lost'}`);
    } catch (error) {
      console.error('Error updating bet stats:', error);
    }
  }
}

export default StatsService; 