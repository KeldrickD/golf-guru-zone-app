import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/Table";

import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  Filter,
  List,
  BarChart4,
  BrainCircuit,
  AlertCircle,
} from "lucide-react";

import WalletService from '../services/walletService';
import AnalyticsService from '../services/analyticsService';
import SubscriptionService, { SubscriptionTier } from '../services/subscriptionService';
import RecommendationService, { BET_TYPES } from '../services/recommendationService';

// Simple UI components for demonstration
const Select = ({ children, value, onChange }: { children: React.ReactNode, value: string, onChange: (value: string) => void }) => (
  <select 
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  >
    {children}
  </select>
);

const Badge = ({ children, variant = "default" }: { children: React.ReactNode, variant?: string }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "success":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "destructive":
        return "bg-red-100 text-red-800";
      case "outline":
        return "bg-transparent border border-gray-300 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };
  
  return (
    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getVariantClasses()}`}>
      {children}
    </div>
  );
};

// Define recommendation history item type
interface RecommendationHistoryItem {
  id: string;
  date: string;
  type: 'bet' | 'course' | 'player';
  betType: string;
  description: string;
  confidence: number;
  outcome: 'win' | 'loss' | 'pending' | 'unused';
  betId?: string;
  amount: number;
  potentialProfit: number;
  actualProfit: number | null;
}

const RecommendationHistoryPage: React.FC = () => {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userTier, setUserTier] = useState<SubscriptionTier | null>(null);
  const [recommendationHistory, setRecommendationHistory] = useState<RecommendationHistoryItem[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [error, setError] = useState<string | null>(null);
  
  const walletService = WalletService.getInstance();
  const analyticsService = AnalyticsService.getInstance();
  const subscriptionService = SubscriptionService.getInstance();
  
  // Stats for the recommendation performance
  const [stats, setStats] = useState({
    totalRecommendations: 0,
    usedRecommendations: 0,
    winCount: 0,
    lossCount: 0,
    pendingCount: 0,
    totalAccuracy: 0,
    totalProfit: 0,
  });
  
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        
        // Check wallet connection
        const address = await walletService.getAddress();
        setIsConnected(!!address);
        
        if (address) {
          // Get user subscription tier
          const tier = await subscriptionService.getUserTier();
          setUserTier(tier);
          
          if (tier !== SubscriptionTier.PRO) {
            setError('Recommendation history is only available to Pro tier subscribers');
          } else {
            // Load recommendation history
            loadRecommendationHistory();
          }
          
          // Track page view
          analyticsService.trackEvent('recommendation_history_view', {
            tier
          });
        }
      } catch (error) {
        console.error('Error initializing recommendation history:', error);
        setError('Failed to load recommendation history. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    initialize();
  }, []);
  
  const loadRecommendationHistory = () => {
    // In a real implementation, this would fetch data from a backend or blockchain
    // For demo purposes, we'll use mock data
    const mockHistory: RecommendationHistoryItem[] = [
      {
        id: 'rec1',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'bet',
        betType: 'MATCH_PLAY',
        description: 'Match Play at Pine Valley Golf Club',
        confidence: 0.85,
        outcome: 'win',
        betId: 'bet123',
        amount: 25,
        potentialProfit: 45,
        actualProfit: 45
      },
      {
        id: 'rec2',
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'bet',
        betType: 'NASSAU',
        description: 'Nassau at Augusta National',
        confidence: 0.60,
        outcome: 'loss',
        betId: 'bet456',
        amount: 10,
        potentialProfit: 25,
        actualProfit: -10
      },
      {
        id: 'rec3',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'player',
        betType: 'SKINS',
        description: 'Skins against Tiger Woods',
        confidence: 0.75,
        outcome: 'pending',
        betId: 'bet789',
        amount: 15,
        potentialProfit: 33,
        actualProfit: null
      },
      {
        id: 'rec4',
        date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'course',
        betType: 'STROKE_PLAY',
        description: 'Stroke Play at TPC Sawgrass',
        confidence: 0.70,
        outcome: 'unused',
        amount: 30,
        potentialProfit: 54,
        actualProfit: null
      },
      {
        id: 'rec5',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'bet',
        betType: 'MATCH_PLAY',
        description: 'Match Play at Pebble Beach',
        confidence: 0.90,
        outcome: 'win',
        betId: 'bet101',
        amount: 50,
        potentialProfit: 90,
        actualProfit: 90
      },
    ];
    
    setRecommendationHistory(mockHistory);
    calculateStats(mockHistory);
  };
  
  const calculateStats = (history: RecommendationHistoryItem[]) => {
    const totalRecommendations = history.length;
    const usedRecommendations = history.filter(item => item.outcome !== 'unused').length;
    const winCount = history.filter(item => item.outcome === 'win').length;
    const lossCount = history.filter(item => item.outcome === 'loss').length;
    const pendingCount = history.filter(item => item.outcome === 'pending').length;
    
    // Calculate win rate (excluding pending and unused)
    const completedBets = winCount + lossCount;
    const totalAccuracy = completedBets > 0 ? (winCount / completedBets) * 100 : 0;
    
    // Calculate total profit
    const totalProfit = history.reduce((sum, item) => {
      return sum + (item.actualProfit || 0);
    }, 0);
    
    setStats({
      totalRecommendations,
      usedRecommendations,
      winCount,
      lossCount,
      pendingCount,
      totalAccuracy,
      totalProfit
    });
  };
  
  const handleConnect = async () => {
    try {
      setIsLoading(true);
      await walletService.connect();
      const address = await walletService.getAddress();
      setIsConnected(!!address);
      
      if (address) {
        const tier = await subscriptionService.getUserTier();
        setUserTier(tier);
        
        if (tier === SubscriptionTier.PRO) {
          loadRecommendationHistory();
        }
      }
      
      // Track connection
      analyticsService.trackEvent('wallet_connected_from_recommendation_history', {
        success: true
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError('Failed to connect wallet. Please try again.');
      
      // Track failed connection
      analyticsService.trackEvent('wallet_connected_from_recommendation_history', {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFilterChange = (value: string) => {
    setFilter(value);
    
    // Track filter change
    analyticsService.trackEvent('recommendation_history_filter_change', {
      filter: value
    });
  };
  
  const handleSortChange = (value: string) => {
    setSortBy(value);
    
    // Track sort change
    analyticsService.trackEvent('recommendation_history_sort_change', {
      sortBy: value
    });
  };
  
  const handleViewBet = (betId: string) => {
    router.push(`/bets/${betId}`);
    
    // Track navigation
    analyticsService.trackEvent('recommendation_history_view_bet', {
      betId
    });
  };
  
  const handleUpgrade = () => {
    router.push('/subscription');
    
    // Track upgrade click
    analyticsService.trackEvent('upgrade_from_recommendation_history', {
      currentTier: userTier
    });
  };
  
  // Format date as "MMM D, YYYY"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Format currency as "$X.XX"
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };
  
  // Filter and sort recommendations
  const filteredRecommendations = recommendationHistory.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'win' && item.outcome === 'win') return true;
    if (filter === 'loss' && item.outcome === 'loss') return true;
    if (filter === 'pending' && item.outcome === 'pending') return true;
    if (filter === 'unused' && item.outcome === 'unused') return true;
    if (filter === 'bet' && item.type === 'bet') return true;
    if (filter === 'course' && item.type === 'course') return true;
    if (filter === 'player' && item.type === 'player') return true;
    return false;
  }).sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime(); // Most recent first
    }
    if (sortBy === 'confidence') {
      return b.confidence - a.confidence; // Highest confidence first
    }
    if (sortBy === 'profit') {
      const aProfit = a.actualProfit || 0;
      const bProfit = b.actualProfit || 0;
      return bProfit - aProfit; // Highest profit first
    }
    return 0;
  });
  
  // Render upgrade notice for non-Pro users
  const renderUpgradeNotice = () => {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center mb-6 p-4 bg-blue-100 rounded-full">
          <BrainCircuit className="w-12 h-12 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Upgrade to Pro for Recommendation History</h2>
        <p className="text-gray-600 max-w-lg mx-auto mb-8">
          Get access to your AI recommendation history and track your results over time. See what recommendations worked best for you and optimize your betting strategy.
        </p>
        <Button onClick={handleUpgrade} className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
          Upgrade to Pro
        </Button>
      </div>
    );
  };
  
  // Render loading state
  const renderLoading = () => {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  };
  
  // Render the recommendation outcome icon
  const renderOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'win':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'loss':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'unused':
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
      default:
        return null;
    }
  };
  
  // Render the recommendation type icon
  const renderTypeIcon = (type: string) => {
    switch (type) {
      case 'bet':
        return <Trophy className="h-5 w-5 text-indigo-500" />;
      case 'course':
        return <List className="h-5 w-5 text-teal-500" />;
      case 'player':
        return <BarChart4 className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };
  
  // Render wallet connection prompt
  if (!isConnected) {
    return (
      <>
        <Head>
          <title>Recommendation History | Golf Guru Zone</title>
          <meta name="description" content="Track your AI recommendation history and performance over time." />
        </Head>
        
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-3xl font-bold mb-6">Connect Your Wallet</h1>
            <p className="text-center text-muted-foreground mb-8 max-w-md">
              Connect your wallet to access your AI recommendation history and performance metrics.
            </p>
            <button 
              onClick={handleConnect} 
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Connect Wallet
            </button>
          </div>
        </main>
      </>
    );
  }
  
  return (
    <>
      <Head>
        <title>Recommendation History | Golf Guru Zone</title>
        <meta name="description" content="Track your AI recommendation history and performance over time." />
      </Head>
      
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">AI Recommendation History</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Track the performance of your AI recommendations over time
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Button 
                onClick={() => router.push('/recommendations')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <BrainCircuit className="mr-2 h-4 w-4" />
                New Recommendations
              </Button>
            </div>
          </div>
          
          {error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          ) : null}
          
          {!isLoading && userTier !== SubscriptionTier.PRO ? (
            renderUpgradeNotice()
          ) : isLoading ? (
            renderLoading()
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total Accuracy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">
                      {stats.totalAccuracy.toFixed(1)}%
                    </div>
                    <p className="text-sm text-gray-500">
                      Based on {stats.winCount + stats.lossCount} completed recommendations
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Net Profit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-3xl font-bold ${stats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(stats.totalProfit)}
                    </div>
                    <p className="text-sm text-gray-500">
                      From recommendations you've followed
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Win/Loss Ratio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-indigo-600">
                      {stats.winCount}:{stats.lossCount}
                    </div>
                    <p className="text-sm text-gray-500">
                      {stats.pendingCount} pending recommendations
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Utilization Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">
                      {stats.totalRecommendations > 0 
                        ? Math.round((stats.usedRecommendations / stats.totalRecommendations) * 100) 
                        : 0}%
                    </div>
                    <p className="text-sm text-gray-500">
                      {stats.usedRecommendations} of {stats.totalRecommendations} recommendations used
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <h2 className="text-xl font-bold mb-4 md:mb-0">Recommendation History</h2>
                  
                  <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4 text-gray-500" />
                      <Select value={filter} onChange={handleFilterChange}>
                        <option value="all">All Recommendations</option>
                        <option value="win">Wins</option>
                        <option value="loss">Losses</option>
                        <option value="pending">Pending</option>
                        <option value="unused">Unused</option>
                        <option value="bet">Bet Type</option>
                        <option value="course">Course</option>
                        <option value="player">Player</option>
                      </Select>
                    </div>
                    
                    <div className="flex items-center">
                      <List className="mr-2 h-4 w-4 text-gray-500" />
                      <Select value={sortBy} onChange={handleSortChange}>
                        <option value="date">Sort by Date</option>
                        <option value="confidence">Sort by Confidence</option>
                        <option value="profit">Sort by Profit</option>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {filteredRecommendations.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No recommendations found with the selected filters.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Confidence</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Outcome</TableHead>
                          <TableHead>Profit/Loss</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRecommendations.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{formatDate(item.date)}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {renderTypeIcon(item.type)}
                                <span className="ml-2">{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{item.description}</div>
                                <div className="text-xs text-gray-500">
                                  {BET_TYPES[item.betType as keyof typeof BET_TYPES]?.name || item.betType}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={
                                item.confidence >= 0.8 ? 'success' : 
                                item.confidence >= 0.6 ? 'default' : 
                                'warning'
                              }>
                                {Math.round(item.confidence * 100)}%
                              </Badge>
                            </TableCell>
                            <TableCell>{formatCurrency(item.amount)}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {renderOutcomeIcon(item.outcome)}
                                <span className="ml-2 capitalize">{item.outcome}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {item.actualProfit !== null ? (
                                <span className={item.actualProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                                  {item.actualProfit >= 0 ? '+' : ''}{formatCurrency(item.actualProfit)}
                                </span>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {item.betId && item.outcome !== 'unused' ? (
                                <Button 
                                  variant="ghost" 
                                  onClick={() => handleViewBet(item.betId!)}
                                  className="h-8 w-8 p-0"
                                >
                                  <ChevronRight className="h-4 w-4" />
                                  <span className="sr-only">View Bet</span>
                                </Button>
                              ) : null}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default RecommendationHistoryPage; 