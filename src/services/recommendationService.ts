import WalletService from './walletService';
import SubscriptionService, { SubscriptionTier } from './subscriptionService';
import AnalyticsService from './analyticsService';
import ContractService from './contractService';

export interface BetRecommendation {
  type: string;
  courseId: string;
  courseName: string;
  confidence: number; // 0-1 confidence score
  potentialProfit: number;
  recommendedAmount: number;
  recommendedOpponents: string[];
  reasoning: string[];
}

export interface CourseRecommendation {
  courseId: string;
  courseName: string;
  recommendationStrength: 'high' | 'medium' | 'low';
  averageScorePrediction: number;
  weatherConditions: string;
  bestTimeToPlay: string;
  reasoning: string[];
}

export interface PlayerMatchupRecommendation {
  playerAddress: string;
  playerName: string | null;
  recommendedBetType: string;
  winProbability: number;
  recommendedAmount: number;
  reasoning: string[];
}

// Define a type for bet types
export type BetType = 'MATCH_PLAY' | 'STROKE_PLAY' | 'NASSAU' | 'SKINS' | 'STABLEFORD' | 'BEST_BALL';

// Bet types with descriptions
export const BET_TYPES: Record<BetType, { name: string; description: string }> = {
  MATCH_PLAY: {
    name: 'Match Play',
    description: 'Play against an opponent where each hole is a separate competition',
  },
  STROKE_PLAY: {
    name: 'Stroke Play',
    description: 'Standard golf where the total number of strokes determines the winner',
  },
  NASSAU: {
    name: 'Nassau',
    description: 'Three separate bets on the front 9, back 9, and overall 18 holes',
  },
  SKINS: {
    name: 'Skins',
    description: 'Each hole is worth a set amount, tied holes carry over to next hole',
  },
  STABLEFORD: {
    name: 'Stableford',
    description: 'Points-based system with scoring relative to par on each hole',
  },
  BEST_BALL: {
    name: 'Best Ball',
    description: 'Team format where the best score from each team is used on each hole',
  },
};

class RecommendationService {
  private static instance: RecommendationService;
  private walletService: WalletService;
  private subscriptionService: SubscriptionService;
  private analyticsService: AnalyticsService;
  private contractService: ContractService;
  
  // Mock data for popular courses
  private popularCourses = [
    { id: 'course1', name: 'Pine Valley Golf Club', difficulty: 'hard', popularity: 0.9 },
    { id: 'course2', name: 'Augusta National', difficulty: 'hard', popularity: 0.95 },
    { id: 'course3', name: 'Pebble Beach', difficulty: 'medium', popularity: 0.85 },
    { id: 'course4', name: 'St Andrews', difficulty: 'medium', popularity: 0.8 },
    { id: 'course5', name: 'Torrey Pines', difficulty: 'medium', popularity: 0.75 },
    { id: 'course6', name: 'Bethpage Black', difficulty: 'hard', popularity: 0.7 },
    { id: 'course7', name: 'TPC Sawgrass', difficulty: 'medium', popularity: 0.8 },
    { id: 'course8', name: 'Whistling Straits', difficulty: 'hard', popularity: 0.75 },
  ];
  
  // Mock data for current weather conditions
  private weatherConditions = [
    'Sunny with light breeze',
    'Partly cloudy',
    'Clear skies',
    'Light rain expected in afternoon',
    'Morning fog clearing to sunshine',
    'Windy conditions',
    'Perfect golf weather',
    'Hot and humid',
  ];
  
  private constructor() {
    this.walletService = WalletService.getInstance();
    this.subscriptionService = SubscriptionService.getInstance();
    this.analyticsService = AnalyticsService.getInstance();
    this.contractService = ContractService.getInstance();
  }
  
  static getInstance(): RecommendationService {
    if (!RecommendationService.instance) {
      RecommendationService.instance = new RecommendationService();
    }
    return RecommendationService.instance;
  }
  
  /**
   * Get personalized bet recommendations for the user
   */
  async getBetRecommendations(): Promise<BetRecommendation[] | null> {
    try {
      // Check subscription tier
      const tier = await this.subscriptionService.getUserTier();
      if (tier !== SubscriptionTier.PRO) {
        throw new Error('AI recommendations are only available with a Pro subscription');
      }
      
      // Get user analytics to inform recommendations
      const stats = await this.analyticsService.getPerformanceStats(90); // Last 90 days
      const coursePerformance = await this.analyticsService.getCoursePerformance(90);
      
      if (!stats || !coursePerformance) {
        throw new Error('Not enough data to generate recommendations');
      }
      
      // Generate recommendations based on user performance
      const recommendations: BetRecommendation[] = [];
      
      // Find courses where user performs well
      const strongCourses = coursePerformance
        .filter(course => course.winRate > 0.6)
        .sort((a, b) => b.winRate - a.winRate);
      
      // Find courses where user could improve
      const challengeCourses = coursePerformance
        .filter(course => course.winRate < 0.5 && course.winRate > 0)
        .sort((a, b) => a.winRate - b.winRate);
      
      // Add recommendation for course user performs well at
      if (strongCourses.length > 0) {
        const course = strongCourses[0];
        const recommendedAmount = Math.round(stats.netProfit > 0 
          ? Math.min(stats.netProfit * 0.1, 100) 
          : 20);
        
        recommendations.push({
          type: 'MATCH_PLAY',
          courseId: course.courseId,
          courseName: course.courseName,
          confidence: 0.85,
          potentialProfit: recommendedAmount * 1.8,
          recommendedAmount,
          recommendedOpponents: [],
          reasoning: [
            `You have a strong ${Math.round(course.winRate * 100)}% win rate at ${course.courseName}`,
            `Your average score of ${course.averageScore} is competitive for this course`,
            `Match play format suits your consistent performance on this course`
          ]
        });
      }
      
      // Add "stretch goal" recommendation
      if (challengeCourses.length > 0) {
        const course = challengeCourses[0];
        const recommendedAmount = Math.round(stats.netProfit > 0 
          ? Math.min(stats.netProfit * 0.05, 50) 
          : 10);
        
        recommendations.push({
          type: 'NASSAU',
          courseId: course.courseId,
          courseName: course.courseName,
          confidence: 0.6,
          potentialProfit: recommendedAmount * 2.5,
          recommendedAmount,
          recommendedOpponents: [],
          reasoning: [
            `Nassau format gives you multiple chances to win even at ${course.courseName} where you've struggled`,
            `Your win rate of ${Math.round(course.winRate * 100)}% can be improved with focused play`,
            `This bet type limits risk while providing upside potential`
          ]
        });
      }
      
      // Add recommendation for a new course
      const playedCourseIds = coursePerformance.map(c => c.courseId);
      const newCourses = this.popularCourses
        .filter(c => !playedCourseIds.includes(c.id))
        .sort((a, b) => b.popularity - a.popularity);
      
      if (newCourses.length > 0) {
        const course = newCourses[0];
        const recommendedAmount = Math.round(stats.netProfit > 0 
          ? Math.min(stats.netProfit * 0.07, 75) 
          : 15);
        
        recommendations.push({
          type: 'SKINS',
          courseId: course.id,
          courseName: course.name,
          confidence: 0.7,
          potentialProfit: recommendedAmount * 2.2,
          recommendedAmount,
          recommendedOpponents: [],
          reasoning: [
            `${course.name} is a highly rated course that matches your playing style`,
            `Skins format allows you to capitalize on your strengths on individual holes`,
            `New courses often level the playing field between competitors`
          ]
        });
      }
      
      // Track recommendation generation
      this.analyticsService.trackEvent('recommendations_generated', {
        count: recommendations.length,
        basedOn: {
          days: 90,
          performanceStats: true,
          coursePerformance: true
        }
      });
      
      return recommendations;
      
    } catch (error) {
      console.error('Error generating bet recommendations:', error);
      return null;
    }
  }
  
  /**
   * Get recommended courses based on user performance and preferences
   */
  async getCourseRecommendations(): Promise<CourseRecommendation[] | null> {
    try {
      // Check subscription tier
      const tier = await this.subscriptionService.getUserTier();
      if (tier !== SubscriptionTier.PRO) {
        throw new Error('AI recommendations are only available with a Pro subscription');
      }
      
      // Get user analytics
      const coursePerformance = await this.analyticsService.getCoursePerformance(180); // Last 6 months
      
      if (!coursePerformance) {
        throw new Error('Not enough data to generate recommendations');
      }
      
      // Generate course recommendations
      const recommendations: CourseRecommendation[] = [];
      
      // Recommend courses user hasn't played yet
      const playedCourseIds = coursePerformance.map(c => c.courseId);
      const newCourses = this.popularCourses
        .filter(c => !playedCourseIds.includes(c.id))
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 3);
      
      newCourses.forEach((course, index) => {
        const weatherIndex = Math.floor(Math.random() * this.weatherConditions.length);
        const scorePrediction = course.difficulty === 'hard' ? 82 + Math.floor(Math.random() * 6) : 76 + Math.floor(Math.random() * 6);
        
        recommendations.push({
          courseId: course.id,
          courseName: course.name,
          recommendationStrength: index === 0 ? 'high' : index === 1 ? 'medium' : 'low',
          averageScorePrediction: scorePrediction,
          weatherConditions: this.weatherConditions[weatherIndex],
          bestTimeToPlay: 'Morning tee times available this weekend',
          reasoning: [
            `${course.name} is a ${course.difficulty} difficulty course that would challenge your abilities`,
            `Based on your performance stats, we predict you'd score around ${scorePrediction}`,
            `This course is highly rated among golfers with your skill profile`,
            `Current weather conditions are optimal for your playing style`
          ]
        });
      });
      
      // Track recommendation generation
      this.analyticsService.trackEvent('course_recommendations_generated', {
        count: recommendations.length
      });
      
      return recommendations;
      
    } catch (error) {
      console.error('Error generating course recommendations:', error);
      return null;
    }
  }
  
  /**
   * Get recommended player matchups based on historical performance
   */
  async getPlayerMatchupRecommendations(): Promise<PlayerMatchupRecommendation[] | null> {
    try {
      // Check subscription tier
      const tier = await this.subscriptionService.getUserTier();
      if (tier !== SubscriptionTier.PRO) {
        throw new Error('AI recommendations are only available with a Pro subscription');
      }
      
      // Get user analytics
      const playerPerformance = await this.analyticsService.getPlayerPerformance(180); // Last 6 months
      const stats = await this.analyticsService.getPerformanceStats(90);
      
      if (!playerPerformance || !stats) {
        throw new Error('Not enough data to generate recommendations');
      }
      
      // Generate player matchup recommendations
      const recommendations: PlayerMatchupRecommendation[] = [];
      
      // Find players where user has strong winning record
      const favorablePlayers = playerPerformance
        .filter(player => player.winRateVsYou < 0.4) // You win more than 60% against them
        .sort((a, b) => a.winRateVsYou - b.winRateVsYou);
      
      // Find competitive matchups
      const competitivePlayers = playerPerformance
        .filter(player => player.winRateVsYou >= 0.4 && player.winRateVsYou <= 0.6)
        .sort((a, b) => Math.abs(0.5 - a.winRateVsYou) - Math.abs(0.5 - b.winRateVsYou));
      
      // Add recommendations for favorable matchups
      if (favorablePlayers.length > 0) {
        const player = favorablePlayers[0];
        const winRate = 1 - player.winRateVsYou;
        const recommendedAmount = Math.round(stats.netProfit > 0 
          ? Math.min(stats.netProfit * 0.15, 150) 
          : 25);
        
        const betTypeKeys = Object.keys(BET_TYPES) as BetType[];
        const recommendedBetType = betTypeKeys[Math.floor(Math.random() * betTypeKeys.length)];
        
        recommendations.push({
          playerAddress: player.playerAddress,
          playerName: player.displayName,
          recommendedBetType,
          winProbability: winRate,
          recommendedAmount,
          reasoning: [
            `You have a strong ${Math.round(winRate * 100)}% win rate against this player`,
            `${BET_TYPES[recommendedBetType].name} format plays to your strengths`,
            `Historical performance suggests a high probability of success`
          ]
        });
      }
      
      // Add recommendations for competitive matchups
      if (competitivePlayers.length > 0) {
        const player = competitivePlayers[0];
        const winRate = 1 - player.winRateVsYou;
        const recommendedAmount = Math.round(stats.netProfit > 0 
          ? Math.min(stats.netProfit * 0.08, 80) 
          : 15);
        
        const betTypeKeys = Object.keys(BET_TYPES) as BetType[];
        const recommendedBetType = betTypeKeys[Math.floor(Math.random() * betTypeKeys.length)];
        
        recommendations.push({
          playerAddress: player.playerAddress,
          playerName: player.displayName,
          recommendedBetType,
          winProbability: winRate,
          recommendedAmount,
          reasoning: [
            `Your matchups with this player are typically close (${Math.round(winRate * 100)}% win rate)`,
            `${BET_TYPES[recommendedBetType].name} bet type could give you an edge in this competitive matchup`,
            `Recent performance trends suggest an opportunity`
          ]
        });
      }
      
      // Track recommendation generation
      this.analyticsService.trackEvent('player_matchup_recommendations_generated', {
        count: recommendations.length
      });
      
      return recommendations;
      
    } catch (error) {
      console.error('Error generating player matchup recommendations:', error);
      return null;
    }
  }
}

export default RecommendationService; 