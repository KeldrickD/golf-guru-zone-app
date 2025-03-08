import WalletService from './walletService';
import SubscriptionService, { SubscriptionTier } from './subscriptionService';
import AnalyticsService from './analyticsService';

// Rule query interface
export interface RuleQuery {
  id: string;
  query: string;
  category: RuleCategory;
  timestamp: string;
}

// Rule response interface
export interface RuleResponse {
  id: string;
  queryId: string;
  response: string;
  officialRuleReferences: {
    ruleNumber: string;
    ruleTitle: string;
    link: string;
  }[];
  relatedQueries: string[];
  illustrationUrl?: string;
}

// Rule category enum
export enum RuleCategory {
  GENERAL = 'general',
  TEEING = 'teeing',
  FAIRWAY = 'fairway',
  BUNKER = 'bunker',
  WATER_HAZARD = 'water_hazard',
  GREEN = 'green',
  EQUIPMENT = 'equipment',
  PENALTIES = 'penalties',
  SCORING = 'scoring',
  ETIQUETTE = 'etiquette',
  COMPETITION = 'competition'
}

// Popular rule queries
export interface PopularQuery {
  id: string;
  query: string;
  category: RuleCategory;
  previewText: string;
}

class RulesAssistantService {
  private static instance: RulesAssistantService;
  private walletService: WalletService;
  private subscriptionService: SubscriptionService;
  private analyticsService: AnalyticsService;
  
  // Mock data for demo purposes
  private mockQueries: Map<string, RuleQuery[]> = new Map();
  private mockResponses: Map<string, RuleResponse> = new Map();
  private mockPopularQueries: PopularQuery[] = [];
  
  // Monthly query limits by tier
  private readonly queryLimits = {
    [SubscriptionTier.FREE]: 5,
    [SubscriptionTier.PREMIUM]: 25,
    [SubscriptionTier.PRO]: 100
  };
  
  private constructor() {
    this.walletService = WalletService.getInstance();
    this.subscriptionService = SubscriptionService.getInstance();
    this.analyticsService = AnalyticsService.getInstance();
    
    // Initialize with sample data for demo
    this.initializeSampleData();
  }
  
  static getInstance(): RulesAssistantService {
    if (!RulesAssistantService.instance) {
      RulesAssistantService.instance = new RulesAssistantService();
    }
    return RulesAssistantService.instance;
  }
  
  /**
   * Initialize sample data for demonstration purposes
   */
  private initializeSampleData(): void {
    // Sample user address
    const sampleAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    
    // Sample rule queries
    const sampleQueries: RuleQuery[] = [
      {
        id: 'query1',
        query: 'My ball is in a bunker partially filled with water. What are my options?',
        category: RuleCategory.BUNKER,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'query2',
        query: 'I accidentally moved my ball while searching for it in the rough. What\'s the penalty?',
        category: RuleCategory.PENALTIES,
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    // Sample responses
    this.mockResponses.set('query1', {
      id: 'response1',
      queryId: 'query1',
      response: "When your ball is in a bunker that is partially filled with water (temporary water), you have several options: 1) Play the ball as it lies without penalty. 2) Take free relief within the bunker by placing your ball at the nearest point of complete relief from the temporary water, no nearer the hole. 3) Take relief outside the bunker with a one-stroke penalty, keeping the point where the ball lay directly between the hole and the spot where you drop the ball, going back as far as you want. 4) For a two-stroke penalty, you may drop outside the bunker on a line from the hole through where your ball was, going back as far as you wish.",
      officialRuleReferences: [
        {
          ruleNumber: "16.1c",
          ruleTitle: "Relief from Abnormal Course Condition in Bunker",
          link: "https://www.randa.org/en/rog/2019/rules/the-rules-of-golf/rule-16#16-1c"
        },
        {
          ruleNumber: "16.1d",
          ruleTitle: "Relief from Abnormal Course Condition in Bunker",
          link: "https://www.randa.org/en/rog/2019/rules/the-rules-of-golf/rule-16#16-1d"
        }
      ],
      relatedQueries: [
        "What is considered temporary water on the course?",
        "Can I test the bunker surface to see if there's water underneath the sand?",
        "If I take relief from water in a bunker, where exactly do I place my ball?"
      ],
      illustrationUrl: "https://www.randa.org/en/rog/2019/rules/the-rules-of-golf/rule-16#diagram-16-1c"
    });
    
    this.mockResponses.set('query2', {
      id: 'response2',
      queryId: 'query2',
      response: "Under the current Rules of Golf (effective January 2019), if you accidentally move your ball while searching for it, there is NO PENALTY. You must simply replace the ball in its original position (or estimated position if the exact spot is not known). This is a significant change from the pre-2019 rules, which did penalize a player for accidentally moving their ball during search. Make sure to announce to your playing partners that you are searching for your ball to make it clear your actions are part of a search.",
      officialRuleReferences: [
        {
          ruleNumber: "7.4",
          ruleTitle: "Ball Accidentally Moved in Trying to Find or Identify It",
          link: "https://www.randa.org/en/rog/2019/rules/the-rules-of-golf/rule-7#7-4"
        },
        {
          ruleNumber: "9.4",
          ruleTitle: "Ball Lifted or Moved by Player",
          link: "https://www.randa.org/en/rog/2019/rules/the-rules-of-golf/rule-9#9-4"
        }
      ],
      relatedQueries: [
        "How do I properly search for my ball without penalty?",
        "What if I'm not sure if I caused the ball to move during search?",
        "Can I mark my ball's position before searching in deep rough?"
      ]
    });
    
    // Sample popular queries
    this.mockPopularQueries = [
      {
        id: 'popular1',
        query: 'What relief options do I have when my ball is in a water hazard?',
        category: RuleCategory.WATER_HAZARD,
        previewText: 'Learn about your options when your ball enters a water hazard, including penalty relief procedures and drop zones.'
      },
      {
        id: 'popular2',
        query: 'My ball hit another player\'s ball on the green. What happens now?',
        category: RuleCategory.GREEN,
        previewText: 'Understand the rules when balls collide on the putting green, including when penalties apply and how to proceed.'
      },
      {
        id: 'popular3',
        query: 'Can I remove loose impediments in a bunker?',
        category: RuleCategory.BUNKER,
        previewText: 'Find out what you can and cannot move in a bunker under the current Rules of Golf.'
      },
      {
        id: 'popular4',
        query: 'What is the proper drop procedure?',
        category: RuleCategory.GENERAL,
        previewText: 'Learn the correct height, area, and process for dropping a ball when taking relief.'
      },
      {
        id: 'popular5',
        query: 'When can I declare a ball unplayable?',
        category: RuleCategory.PENALTIES,
        previewText: 'Understand when and how to take unplayable ball relief and the associated one-stroke penalty options.'
      }
    ];
    
    // Store mock data
    this.mockQueries.set(sampleAddress, sampleQueries);
  }
  
  /**
   * Get popular rule queries
   */
  async getPopularQueries(): Promise<PopularQuery[]> {
    // All tiers can access popular queries
    
    // Track the request
    this.analyticsService.trackEvent('popular_rule_queries_viewed', {});
    
    return this.mockPopularQueries;
  }
  
  /**
   * Get user's query history
   */
  async getQueryHistory(): Promise<RuleQuery[]> {
    try {
      const userAddress = await this.walletService.getAddress();
      if (!userAddress) {
        throw new Error('Wallet not connected');
      }
      
      return this.mockQueries.get(userAddress) || [];
      
    } catch (error) {
      console.error('Error getting query history:', error);
      return [];
    }
  }
  
  /**
   * Get response for a specific query
   * @param queryId ID of the query
   */
  async getQueryResponse(queryId: string): Promise<RuleResponse | null> {
    try {
      // Check if user has access to this query
      const userAddress = await this.walletService.getAddress();
      if (!userAddress) {
        throw new Error('Wallet not connected');
      }
      
      const userQueries = this.mockQueries.get(userAddress) || [];
      const isUserQuery = userQueries.some(q => q.id === queryId);
      
      // If it's not the user's query, check if it's a popular query
      const isPopularQuery = this.mockPopularQueries.some(q => q.id === queryId);
      
      if (!isUserQuery && !isPopularQuery) {
        throw new Error('Query not found or access denied');
      }
      
      // Get the response
      const response = this.mockResponses.get(queryId);
      if (!response) {
        return null;
      }
      
      // Track the request
      this.analyticsService.trackEvent('rule_response_viewed', {
        queryId,
        category: userQueries.find(q => q.id === queryId)?.category || 'unknown'
      });
      
      return response;
      
    } catch (error) {
      console.error('Error getting query response:', error);
      return null;
    }
  }
  
  /**
   * Check if user has remaining queries for the current month
   */
  async hasRemainingQueries(): Promise<boolean> {
    try {
      // Get user subscription tier
      const tier = await this.subscriptionService.getUserTier();
      
      // Get user's query history
      const userAddress = await this.walletService.getAddress();
      if (!userAddress) {
        throw new Error('Wallet not connected');
      }
      
      const userQueries = this.mockQueries.get(userAddress) || [];
      
      // Count queries for current month
      const now = new Date();
      const currentMonthQueries = userQueries.filter(query => {
        const queryDate = new Date(query.timestamp);
        return queryDate.getMonth() === now.getMonth() && 
               queryDate.getFullYear() === now.getFullYear();
      });
      
      // Check if user has reached limit
      const queryLimit = this.queryLimits[tier];
      return currentMonthQueries.length < queryLimit;
      
    } catch (error) {
      console.error('Error checking remaining queries:', error);
      return false;
    }
  }
  
  /**
   * Get the remaining query count for the current month
   */
  async getRemainingQueries(): Promise<number> {
    try {
      // Get user subscription tier
      const tier = await this.subscriptionService.getUserTier();
      
      // Get user's query history
      const userAddress = await this.walletService.getAddress();
      if (!userAddress) {
        throw new Error('Wallet not connected');
      }
      
      const userQueries = this.mockQueries.get(userAddress) || [];
      
      // Count queries for current month
      const now = new Date();
      const currentMonthQueries = userQueries.filter(query => {
        const queryDate = new Date(query.timestamp);
        return queryDate.getMonth() === now.getMonth() && 
               queryDate.getFullYear() === now.getFullYear();
      });
      
      // Calculate remaining queries
      const queryLimit = this.queryLimits[tier];
      return Math.max(0, queryLimit - currentMonthQueries.length);
      
    } catch (error) {
      console.error('Error getting remaining queries:', error);
      return 0;
    }
  }
  
  /**
   * Submit a new rule query
   * @param query The rule query text
   * @param category The rule category
   */
  async submitQuery(query: string, category: RuleCategory): Promise<RuleResponse | null> {
    try {
      // Check if user has remaining queries
      const hasRemaining = await this.hasRemainingQueries();
      if (!hasRemaining) {
        throw new Error('You have reached your monthly query limit. Upgrade your subscription for more queries.');
      }
      
      // Get user address
      const userAddress = await this.walletService.getAddress();
      if (!userAddress) {
        throw new Error('Wallet not connected');
      }
      
      // Create new query
      const queryId = `query-${Date.now()}`;
      const newQuery: RuleQuery = {
        id: queryId,
        query,
        category,
        timestamp: new Date().toISOString()
      };
      
      // Save query to user's history
      const userQueries = this.mockQueries.get(userAddress) || [];
      this.mockQueries.set(userAddress, [...userQueries, newQuery]);
      
      // In a real implementation, this would call the OpenAI API to generate a response
      // For demo, we'll generate a mock response
      
      // Get tier for tracking
      const tier = await this.subscriptionService.getUserTier();
      
      // Track the query submission
      this.analyticsService.trackEvent('rule_query_submitted', {
        queryId,
        category,
        tier,
        queryLength: query.length
      });
      
      // Generate a response based on the category
      const response = this.generateMockResponse(queryId, query, category);
      
      // Add a bit of delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      return response;
      
    } catch (error) {
      console.error('Error submitting query:', error);
      return null;
    }
  }
  
  /**
   * Generate a mock response for demo purposes
   * @param queryId The query ID
   * @param query The query text
   * @param category The rule category
   */
  private generateMockResponse(queryId: string, query: string, category: RuleCategory): RuleResponse {
    // Create a generic response based on the category
    let response: string;
    let references: {ruleNumber: string; ruleTitle: string; link: string}[] = [];
    let relatedQueries: string[] = [];
    
    switch (category) {
      case RuleCategory.BUNKER:
        response = "When playing from a bunker, you cannot ground your club in the sand before your stroke, touch the sand during your practice swings, or test the condition of the sand. You can now remove loose impediments in bunkers without penalty, but if moving them causes your ball to move, you will incur a one-stroke penalty and must replace the ball. If your ball is unplayable in a bunker, you have the standard unplayable options within the bunker for one penalty stroke, or you can take back-on-the-line relief outside the bunker for two penalty strokes.";
        references = [
          {
            ruleNumber: "12.2",
            ruleTitle: "Playing Ball in Bunker",
            link: "https://www.randa.org/en/rog/2019/rules/the-rules-of-golf/rule-12#12-2"
          },
          {
            ruleNumber: "19.3",
            ruleTitle: "Relief Options for Unplayable Ball in Bunker",
            link: "https://www.randa.org/en/rog/2019/rules/the-rules-of-golf/rule-19#19-3"
          }
        ];
        relatedQueries = [
          "What is the penalty for touching sand in a bunker during a backswing?",
          "Can I remove stones and leaves from a bunker?",
          "How do I take relief from an embedded ball in a bunker?"
        ];
        break;
      
      case RuleCategory.WATER_HAZARD:
        response = "When your ball is in a penalty area (formerly called water hazard), you have several options: 1) Play the ball as it lies without penalty. 2) Take stroke-and-distance relief by playing from where you hit your previous shot with a one-stroke penalty. 3) Take back-on-the-line relief, keeping the point where the ball last crossed the edge of the penalty area directly between the hole and the spot where you drop, going back as far as you want, with a one-stroke penalty. 4) If it's a red penalty area, you can also take lateral relief within two club-lengths of where the ball last crossed the edge, no nearer the hole, with a one-stroke penalty.";
        references = [
          {
            ruleNumber: "17.1",
            ruleTitle: "Options for Ball in Penalty Area",
            link: "https://www.randa.org/en/rog/2019/rules/the-rules-of-golf/rule-17#17-1"
          },
          {
            ruleNumber: "17.2",
            ruleTitle: "Options After Playing Ball from Penalty Area",
            link: "https://www.randa.org/en/rog/2019/rules/the-rules-of-golf/rule-17#17-2"
          }
        ];
        relatedQueries = [
          "What's the difference between red and yellow penalty areas?",
          "Can I ground my club in a penalty area?",
          "How do I identify the point where my ball last crossed a penalty area?"
        ];
        break;
      
      case RuleCategory.GREEN:
        response = "On the putting green, you may mark, lift, and clean your ball, and replace it on its original spot. You may repair damage on the green, including ball marks, shoe damage, indentations from equipment, animal tracks, and embedded objects. You cannot repair natural surface imperfections or normal wear of the hole. If your ball or marker is accidentally moved on the green, there is no penalty - simply replace it. If your ball moves due to natural forces (like wind), play it from its new position unless it had been lifted and replaced, in which case replace it on its original spot.";
        references = [
          {
            ruleNumber: "13.1",
            ruleTitle: "Actions Allowed or Required on Putting Greens",
            link: "https://www.randa.org/en/rog/2019/rules/the-rules-of-golf/rule-13#13-1"
          },
          {
            ruleNumber: "9.3",
            ruleTitle: "Ball Moved by Natural Forces",
            link: "https://www.randa.org/en/rog/2019/rules/the-rules-of-golf/rule-9#9-3"
          }
        ];
        relatedQueries = [
          "What damage can I repair on the putting green?",
          "Can I test the surface of the green by rolling a ball?",
          "What happens if my ball hits the flagstick in the hole?"
        ];
        break;
      
      default:
        response = "Under the Rules of Golf, players are expected to act with integrity, show consideration for others, and take good care of the course. You should play at a prompt pace, be aware of your positioning to avoid distracting others, and properly repair any damage you cause to the course. If you're uncertain about a rule during play, you can play two balls under Rule 20.1c in stroke play (not match play) and get a ruling later. Remember that ignorance of the rules does not exempt you from penalties, so it's always good practice to carry a copy of the rules or have the official R&A/USGA Rules of Golf app on your phone.";
        references = [
          {
            ruleNumber: "1.2",
            ruleTitle: "Standards of Player Conduct",
            link: "https://www.randa.org/en/rog/2019/rules/the-rules-of-golf/rule-1#1-2"
          },
          {
            ruleNumber: "20.1",
            ruleTitle: "Resolving Rules Issues During Round",
            link: "https://www.randa.org/en/rog/2019/rules/the-rules-of-golf/rule-20#20-1"
          }
        ];
        relatedQueries = [
          "What is the procedure for a rules dispute in match play?",
          "How do I get a ruling during a tournament?",
          "What's the difference between match play and stroke play rules?"
        ];
    }
    
    // Create and store the response
    const ruleResponse: RuleResponse = {
      id: `response-${Date.now()}`,
      queryId,
      response,
      officialRuleReferences: references,
      relatedQueries
    };
    
    this.mockResponses.set(queryId, ruleResponse);
    
    return ruleResponse;
  }
}

export default RulesAssistantService; 