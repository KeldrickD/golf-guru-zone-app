'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Button } from "./ui/Button";
import { Progress } from "./ui/Progress";
import { Skeleton } from "./ui/Skeleton";
import { Alert, AlertDescription, AlertTitle } from "./ui/Alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs";

import {
  Trophy,
  TrendingUp,
  Map,
  Users,
  DollarSign,
  Star,
  Zap,
  Calendar,
  PlusCircle,
  ChevronRight,
  ThumbsUp,
  AlertCircle,
  CheckCircle2,
  BrainCircuit,
  TargetIcon,
  BarChart3,
  LineChart,
  Sparkles,
} from "lucide-react";

import RecommendationService, {
  BetRecommendation,
  CourseRecommendation,
  PlayerMatchupRecommendation,
  BET_TYPES,
  BetType
} from '../services/recommendationService';
import SubscriptionService, { SubscriptionTier } from '../services/subscriptionService';
import AnalyticsService from '../services/analyticsService';
import WalletService from '../services/walletService';
import QuickBetModal from './QuickBetModal';

// Simple implementations of missing UI components
const Separator = () => <div className="w-full h-px bg-gray-200 dark:bg-gray-700 my-4" />;

const Badge = ({ children, variant = "default" }: { children: React.ReactNode, variant?: string }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "default":
        return "bg-primary text-primary-foreground hover:bg-primary/80";
      case "secondary":
        return "bg-secondary text-secondary-foreground hover:bg-secondary/80";
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case "danger":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      case "outline":
        return "text-foreground border border-input hover:bg-accent hover:text-accent-foreground";
      default:
        return "bg-primary text-primary-foreground";
    }
  };
  
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none ${getVariantClasses()}`}>
      {children}
    </div>
  );
};

const AIRecommendations: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('betting');
  const [userTier, setUserTier] = useState<SubscriptionTier | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Recommendation states
  const [betRecommendations, setBetRecommendations] = useState<BetRecommendation[] | null>(null);
  const [courseRecommendations, setCourseRecommendations] = useState<CourseRecommendation[] | null>(null);
  const [playerRecommendations, setPlayerRecommendations] = useState<PlayerMatchupRecommendation[] | null>(null);
  
  // Quick Bet Modal states
  const [isQuickBetModalOpen, setIsQuickBetModalOpen] = useState<boolean>(false);
  const [quickBetData, setQuickBetData] = useState<{
    betType: BetType;
    courseName: string;
    recommendedAmount: number;
    opponents?: string[];
    confidence?: number;
  } | null>(null);
  
  const recommendationService = RecommendationService.getInstance();
  const subscriptionService = SubscriptionService.getInstance();
  const analyticsService = AnalyticsService.getInstance();
  const walletService = WalletService.getInstance();
  
  useEffect(() => {
    const checkTierAndLoadData = async () => {
      try {
        setIsLoading(true);
        
        // Check user subscription tier
        const tier = await subscriptionService.getUserTier();
        setUserTier(tier);
        
        if (tier !== SubscriptionTier.PRO) {
          setError('AI Recommendations are only available to Pro tier subscribers');
          setIsLoading(false);
          return;
        }
        
        // Track page view
        analyticsService.trackEvent('ai_recommendations_view', {
          tier
        });
        
        // Load data based on active tab
        await loadRecommendations(activeTab);
        
      } catch (error) {
        console.error('Error loading AI recommendations:', error);
        setError('Failed to load recommendations. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkTierAndLoadData();
  }, []);
  
  const loadRecommendations = async (tabType: string) => {
    try {
      setIsLoading(true);
      
      if (tabType === 'betting' && !betRecommendations) {
        const data = await recommendationService.getBetRecommendations();
        setBetRecommendations(data);
      } else if (tabType === 'courses' && !courseRecommendations) {
        const data = await recommendationService.getCourseRecommendations();
        setCourseRecommendations(data);
      } else if (tabType === 'players' && !playerRecommendations) {
        const data = await recommendationService.getPlayerMatchupRecommendations();
        setPlayerRecommendations(data);
      }
      
    } catch (error) {
      console.error(`Error loading ${tabType} recommendations:`, error);
      setError(`Failed to load ${tabType} recommendations. Please try again later.`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTabChange = async (tab: string) => {
    setActiveTab(tab);
    await loadRecommendations(tab);
    
    // Track tab change
    analyticsService.trackEvent('ai_recommendations_tab_change', {
      tab
    });
  };
  
  const handleQuickBet = (recommendation: BetRecommendation) => {
    // Set up data for quick bet modal
    setQuickBetData({
      betType: recommendation.type as BetType,
      courseName: recommendation.courseName,
      recommendedAmount: recommendation.recommendedAmount,
      opponents: recommendation.recommendedOpponents,
      confidence: recommendation.confidence
    });
    
    // Open the modal
    setIsQuickBetModalOpen(true);
    
    // Track quick bet initiation
    analyticsService.trackEvent('quick_bet_initiated', {
      type: 'bet_recommendation',
      betType: recommendation.type,
      courseName: recommendation.courseName,
      confidence: recommendation.confidence
    });
  };
  
  const handleQuickBetFromCourse = (recommendation: CourseRecommendation) => {
    // For course recommendations, default to Match Play
    setQuickBetData({
      betType: 'MATCH_PLAY',
      courseName: recommendation.courseName,
      recommendedAmount: 25, // Default amount
      confidence: recommendation.recommendationStrength === 'high' ? 0.85 : 
                  recommendation.recommendationStrength === 'medium' ? 0.7 : 0.6
    });
    
    // Open the modal
    setIsQuickBetModalOpen(true);
    
    // Track quick bet initiation
    analyticsService.trackEvent('quick_bet_initiated', {
      type: 'course_recommendation',
      courseName: recommendation.courseName,
      strength: recommendation.recommendationStrength
    });
  };
  
  const handleQuickBetFromPlayer = (recommendation: PlayerMatchupRecommendation) => {
    setQuickBetData({
      betType: recommendation.recommendedBetType as BetType,
      courseName: 'Your preferred course', // This would ideally be customized
      recommendedAmount: recommendation.recommendedAmount,
      opponents: [recommendation.playerAddress],
      confidence: recommendation.winProbability
    });
    
    // Open the modal
    setIsQuickBetModalOpen(true);
    
    // Track quick bet initiation
    analyticsService.trackEvent('quick_bet_initiated', {
      type: 'player_recommendation',
      playerAddress: recommendation.playerAddress,
      betType: recommendation.recommendedBetType,
      winProbability: recommendation.winProbability
    });
  };
  
  const handleCreateBet = (recommendation: BetRecommendation) => {
    // In a real implementation, this would navigate to the bet creation form with prefilled values
    router.push({
      pathname: '/bets/create',
      query: {
        type: recommendation.type,
        course: recommendation.courseName,
        amount: recommendation.recommendedAmount.toString()
      }
    });
    
    // Track recommendation usage
    analyticsService.trackEvent('ai_recommendation_used', {
      type: 'bet',
      courseId: recommendation.courseId,
      betType: recommendation.type,
      confidence: recommendation.confidence
    });
  };
  
  const handleUpgrade = () => {
    router.push('/subscription');
    
    // Track upgrade click
    analyticsService.trackEvent('upgrade_from_ai_recommendations', {
      currentTier: userTier
    });
  };
  
  const formatAddress = (address: string): string => {
    return walletService.formatAddress(address);
  };
  
  const formatCurrency = (amount: number): string => {
    return `$${amount.toFixed(2)}`;
  };
  
  const renderConfidenceLevel = (confidence: number) => {
    const percentage = Math.round(confidence * 100);
    
    let color = '';
    if (percentage >= 80) color = 'text-green-500';
    else if (percentage >= 60) color = 'text-yellow-500';
    else color = 'text-red-500';
    
    return (
      <div className="flex items-center space-x-2">
        <div className="text-sm font-medium">{percentage}%</div>
        <Progress
          value={percentage}
          className="h-2 w-24"
          // Inline style for progress bar color
          style={{
            '--progress-background': percentage >= 80 ? '#10b981' : percentage >= 60 ? '#f59e0b' : '#ef4444',
          } as React.CSSProperties}
        />
      </div>
    );
  };
  
  // Render upgrade notice for non-Pro users
  const renderUpgradeNotice = () => {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <BrainCircuit className="w-12 h-12 text-blue-500 mr-4" />
                <div>
                  <h3 className="text-xl font-bold">AI-Powered Recommendations</h3>
                  <p className="text-muted-foreground">
                    Upgrade to Pro to access personalized betting recommendations powered by AI
                  </p>
                </div>
              </div>
              <Button onClick={handleUpgrade} className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
                Upgrade to Pro
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Pro Features Include:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base">
                    <TargetIcon className="w-5 h-5 mr-2 text-blue-500" />
                    Smart Bet Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Get AI-powered recommendations for bets with the highest chance of success based on your play history
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base">
                    <Map className="w-5 h-5 mr-2 text-blue-500" />
                    Course Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Discover new courses that match your playing style and get personalized score predictions
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base">
                    <Users className="w-5 h-5 mr-2 text-blue-500" />
                    Player Matchup Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Find favorable matchups against other players with detailed win probability analysis
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Supercharge your golf betting strategy with powerful AI insights.
            </p>
            <Button onClick={handleUpgrade} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
              Upgrade to Pro Now
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  const renderLoadingState = () => (
    <div className="space-y-8">
      <Skeleton className="h-12 w-full md:w-1/3" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
  
  const renderError = () => (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
  
  const renderBetRecommendations = () => {
    if (!betRecommendations || betRecommendations.length === 0) {
      return (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              No bet recommendations available at this time. Try playing more golf to get personalized recommendations.
            </p>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {betRecommendations.map((recommendation, index) => (
          <Card key={`bet-${index}`} className="overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-bold">{BET_TYPES[recommendation.type as keyof typeof BET_TYPES].name}</h3>
                <Badge variant="success">AI Recommended</Badge>
              </div>
              <p className="text-blue-100 text-sm">{recommendation.courseName}</p>
            </div>
            
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-green-500 mr-2" />
                    <span className="font-medium">Recommended Bet:</span>
                  </div>
                  <span className="font-bold">{formatCurrency(recommendation.recommendedAmount)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 text-purple-500 mr-2" />
                    <span className="font-medium">Potential Profit:</span>
                  </div>
                  <span className="font-bold text-green-500">+{formatCurrency(recommendation.potentialProfit)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
                    <span className="font-medium">Confidence:</span>
                  </div>
                  {renderConfidenceLevel(recommendation.confidence)}
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Why We Recommend This:</h4>
                  <ul className="space-y-2">
                    {recommendation.reasoning.map((reason, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleQuickBet(recommendation)}
                    className="flex-1 border-blue-500 text-blue-500 hover:bg-blue-50"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Quick Bet
                  </Button>
                  <Button 
                    onClick={() => handleCreateBet(recommendation)} 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Custom
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  const renderCourseRecommendations = () => {
    if (!courseRecommendations || courseRecommendations.length === 0) {
      return (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              No course recommendations available at this time. Check back later for personalized recommendations.
            </p>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courseRecommendations.map((recommendation, index) => (
          <Card key={`course-${index}`} className="overflow-hidden">
            <div className={`p-4 ${
              recommendation.recommendationStrength === 'high' 
                ? 'bg-gradient-to-r from-green-500 to-green-600' 
                : recommendation.recommendationStrength === 'medium'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                  : 'bg-gradient-to-r from-purple-500 to-purple-600'
            }`}>
              <div className="flex justify-between items-center">
                <h3 className="text-white font-bold">{recommendation.courseName}</h3>
                <Badge variant={
                  recommendation.recommendationStrength === 'high' 
                    ? 'success' 
                    : recommendation.recommendationStrength === 'medium' 
                      ? 'secondary' 
                      : 'outline'
                }>
                  {recommendation.recommendationStrength.charAt(0).toUpperCase() + recommendation.recommendationStrength.slice(1)} Match
                </Badge>
              </div>
            </div>
            
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <BarChart3 className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="font-medium">Predicted Score:</span>
                  </div>
                  <span className="font-bold">{recommendation.averageScorePrediction}</span>
                </div>
                
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-indigo-500 mr-2 flex-shrink-0" />
                    <span className="font-medium">Best Time:</span>
                  </div>
                  <span className="text-right">{recommendation.bestTimeToPlay}</span>
                </div>
                
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <Map className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0" />
                    <span className="font-medium">Weather:</span>
                  </div>
                  <span className="text-right">{recommendation.weatherConditions}</span>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Why This Course:</h4>
                  <ul className="space-y-2">
                    {recommendation.reasoning.map((reason, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-blue-500 text-blue-500 hover:bg-blue-50"
                    onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(recommendation.courseName)}`, '_blank')}
                  >
                    <Map className="h-4 w-4 mr-2" />
                    View Map
                  </Button>
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleQuickBetFromCourse(recommendation)}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Quick Bet
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  const renderPlayerRecommendations = () => {
    if (!playerRecommendations || playerRecommendations.length === 0) {
      return (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              No player matchup recommendations available at this time. Play against more opponents to get personalized recommendations.
            </p>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {playerRecommendations.map((recommendation, index) => (
          <Card key={`player-${index}`} className="overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-bold">
                  {recommendation.playerName || formatAddress(recommendation.playerAddress)}
                </h3>
                <Badge variant={
                  recommendation.winProbability > 0.7 ? 'success' : 
                  recommendation.winProbability > 0.5 ? 'secondary' : 'warning'
                }>
                  {Math.round(recommendation.winProbability * 100)}% Win Rate
                </Badge>
              </div>
              <p className="text-purple-100 text-sm">
                {BET_TYPES[recommendation.recommendedBetType as keyof typeof BET_TYPES].name} Recommendation
              </p>
            </div>
            
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-green-500 mr-2" />
                    <span className="font-medium">Suggested Bet:</span>
                  </div>
                  <span className="font-bold">{formatCurrency(recommendation.recommendedAmount)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
                    <span className="font-medium">Win Probability:</span>
                  </div>
                  {renderConfidenceLevel(recommendation.winProbability)}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <LineChart className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="font-medium">Bet Type:</span>
                  </div>
                  <span className="font-medium">{BET_TYPES[recommendation.recommendedBetType as keyof typeof BET_TYPES].name}</span>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Matchup Analysis:</h4>
                  <ul className="space-y-2">
                    {recommendation.reasoning.map((reason, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline"
                    className="flex-1 border-purple-500 text-purple-500 hover:bg-purple-50"
                    onClick={() => {
                      router.push({
                        pathname: '/bets/create',
                        query: { 
                          type: recommendation.recommendedBetType,
                          opponent: recommendation.playerAddress,
                          amount: recommendation.recommendedAmount.toString()
                        }
                      });
                      
                      // Track recommendation usage
                      analyticsService.trackEvent('player_recommendation_used', {
                        playerAddress: recommendation.playerAddress,
                        betType: recommendation.recommendedBetType,
                        action: 'custom',
                        winProbability: recommendation.winProbability
                      });
                    }}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Custom
                  </Button>
                  <Button 
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                    onClick={() => handleQuickBetFromPlayer(recommendation)}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Quick Bet
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  if (userTier !== SubscriptionTier.PRO) {
    return renderUpgradeNotice();
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Quick Bet Modal */}
      {quickBetData && (
        <QuickBetModal
          isOpen={isQuickBetModalOpen}
          onClose={() => setIsQuickBetModalOpen(false)}
          betType={quickBetData.betType}
          courseName={quickBetData.courseName}
          recommendedAmount={quickBetData.recommendedAmount}
          opponents={quickBetData.opponents}
          confidence={quickBetData.confidence}
        />
      )}
      
      <div className="flex items-center mb-6">
        <BrainCircuit className="h-8 w-8 text-blue-500 mr-3" />
        <h2 className="text-3xl font-bold">AI Recommendations</h2>
      </div>
      
      {error && renderError()}
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="betting">
            <Zap className="h-4 w-4 mr-2" />
            Betting Insights
          </TabsTrigger>
          <TabsTrigger value="courses">
            <Map className="h-4 w-4 mr-2" />
            Course Recommendations
          </TabsTrigger>
          <TabsTrigger value="players">
            <Users className="h-4 w-4 mr-2" />
            Player Matchups
          </TabsTrigger>
        </TabsList>
        
        {isLoading ? (
          renderLoadingState()
        ) : (
          <>
            <TabsContent value="betting">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Personalized Bet Recommendations</h3>
                <p className="text-muted-foreground">
                  Based on your betting history and performance, our AI suggests these optimal bets for maximum success.
                </p>
              </div>
              {renderBetRecommendations()}
            </TabsContent>
            
            <TabsContent value="courses">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Recommended Courses</h3>
                <p className="text-muted-foreground">
                  Discover new courses that match your playing style and offer the best betting opportunities.
                </p>
              </div>
              {renderCourseRecommendations()}
            </TabsContent>
            
            <TabsContent value="players">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Favorable Player Matchups</h3>
                <p className="text-muted-foreground">
                  Find the most advantageous matchups against other players based on your historical performance.
                </p>
              </div>
              {renderPlayerRecommendations()}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default AIRecommendations; 