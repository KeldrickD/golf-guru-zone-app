"use client"

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
import { RocketIcon, TrophyIcon, MedalIcon, HistoryIcon, DollarSignIcon, UsersIcon, MapPinIcon, ClockIcon, ArrowUpCircleIcon } from "lucide-react";
import SubscriptionService, { SubscriptionTier } from "../services/subscriptionService";
import AnalyticsService, { 
  PerformanceStats, 
  BetHistoryItem, 
  CoursePerformance, 
  PlayerPerformance,
  ANALYTICS_PERIODS
} from "../services/analyticsService";
import WalletService from '../services/walletService';

// These UI components may need to be created if they don't exist
// For now we'll use simple versions
const Table = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full overflow-auto">
    <table className="w-full caption-bottom text-sm">{children}</table>
  </div>
);

const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="[&_tr]:border-b">{children}</thead>
);

const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody className="[&_tr:last-child]:border-0">{children}</tbody>
);

const TableHead = ({ children }: { children: React.ReactNode }) => (
  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{children}</th>
);

const TableRow = ({ children }: { children: React.ReactNode }) => (
  <tr className="border-b transition-colors hover:bg-muted/50">{children}</tr>
);

const TableCell = ({ children }: { children: React.ReactNode }) => (
  <td className="p-4 align-middle">{children}</td>
);

const Badge = ({ children, variant = "default" }: { children: React.ReactNode, variant?: string }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "default":
        return "bg-primary text-primary-foreground hover:bg-primary/80";
      case "destructive":
        return "bg-destructive text-destructive-foreground hover:bg-destructive/80";
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

const Tabs = ({ children, value, onValueChange }: { children: React.ReactNode, value: string, onValueChange: (value: string) => void }) => (
  <div className="tabs-container">{children}</div>
);

const TabsList = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className || ''}`}>
    {children}
  </div>
);

const TabsTrigger = ({ children, value, disabled }: { children: React.ReactNode, value: string, disabled?: boolean }) => (
  <button 
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm`}
    disabled={disabled}
    onClick={() => {}}
  >
    {children}
  </button>
);

const TabsContent = ({ children, value }: { children: React.ReactNode, value: string }) => (
  <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
    {children}
  </div>
);

const Select = ({ children, value, onValueChange }: { children: React.ReactNode, value: string, onValueChange: (value: string) => void }) => (
  <div className="relative">{children}</div>
);

const SelectTrigger = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <button className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}>
    {children}
  </button>
);

const SelectValue = ({ placeholder }: { placeholder: string }) => (
  <span className="placeholder">{placeholder}</span>
);

const SelectContent = ({ children }: { children: React.ReactNode }) => (
  <div className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80">
    <div className="max-h-[var(--radix-select-content-available-height)] overflow-auto">
      {children}
    </div>
  </div>
);

const SelectItem = ({ children, value }: { children: React.ReactNode, value: string }) => (
  <div className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
    {children}
  </div>
);

const AnalyticsDashboard: React.FC = () => {
  const router = useRouter();
  const [activePeriod, setActivePeriod] = useState<number>(30); // Default to 30 days
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userTier, setUserTier] = useState<SubscriptionTier | null>(null);
  
  // Analytics data states
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats | null>(null);
  const [betHistory, setBetHistory] = useState<BetHistoryItem[] | null>(null);
  const [coursePerformance, setCoursePerformance] = useState<CoursePerformance[] | null>(null);
  const [playerPerformance, setPlayerPerformance] = useState<PlayerPerformance[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const analyticsService = AnalyticsService.getInstance();
  const subscriptionService = SubscriptionService.getInstance();
  const walletService = WalletService.getInstance();
  
  // Load user tier when component mounts
  useEffect(() => {
    const loadUserTier = async () => {
      const tier = await subscriptionService.getUserTier();
      setUserTier(tier);
      
      // Track page view
      analyticsService.trackEvent('analytics_view', {
        tier: tier
      });
    };
    
    loadUserTier();
  }, []);
  
  // Load analytics data when period or tab changes
  useEffect(() => {
    const loadAnalyticsData = async () => {
      if (!userTier) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Only load data for the active tab to improve performance
        if (currentTab === 'overview' || currentTab === 'history') {
          const stats = await analyticsService.getPerformanceStats(activePeriod);
          setPerformanceStats(stats);
          
          if (currentTab === 'history') {
            const history = await analyticsService.getBetHistory(activePeriod);
            setBetHistory(history);
          }
        }
        
        if (currentTab === 'courses') {
          const courses = await analyticsService.getCoursePerformance(activePeriod);
          setCoursePerformance(courses);
        }
        
        if (currentTab === 'players') {
          const players = await analyticsService.getPlayerPerformance(activePeriod);
          setPlayerPerformance(players);
        }
        
        // Track data load
        analyticsService.trackEvent('analytics_data_loaded', {
          period: activePeriod,
          tab: currentTab
        });
        
      } catch (error: any) {
        console.error('Error loading analytics data:', error);
        setError(error.message || 'Failed to load analytics data');
        
        if (error.message.includes('need a Premium') || error.message.includes('need a Pro')) {
          // User needs to upgrade
          setUserTier(SubscriptionTier.FREE);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAnalyticsData();
  }, [activePeriod, currentTab, userTier]);
  
  const handlePeriodChange = (value: string) => {
    setActivePeriod(parseInt(value));
  };
  
  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };
  
  const handleUpgrade = () => {
    router.push('/subscription');
    analyticsService.trackEvent('upgrade_from_analytics', {
      current_tier: userTier
    });
  };
  
  const formatCurrency = (amount: number): string => {
    return `$${amount.toFixed(2)}`;
  };
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const formatAddress = (address: string): string => {
    return walletService.formatAddress(address);
  };
  
  // Render premium upgrade notice
  const renderUpgradeNotice = (requiredTier: SubscriptionTier) => {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Upgrade to {requiredTier === SubscriptionTier.PREMIUM ? 'Premium' : 'Pro'}</h3>
              <p className="text-muted-foreground">
                {requiredTier === SubscriptionTier.PREMIUM 
                  ? 'Unlock detailed analytics and get insights into your betting performance.' 
                  : 'Get advanced player analytics and see how you perform against specific opponents.'}
              </p>
            </div>
            <Button onClick={handleUpgrade} className="bg-green-600 hover:bg-green-700">
              <div className="flex items-center gap-2">
                <RocketIcon className="w-4 h-4 text-primary" />
                <span>Upgrade to Premium</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  // Render loading skeletons
  const renderSkeletons = () => (
    <div className="space-y-4">
      <Skeleton className="h-[125px] w-full" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-[125px] w-full" />
        <Skeleton className="h-[125px] w-full" />
        <Skeleton className="h-[125px] w-full" />
        <Skeleton className="h-[125px] w-full" />
      </div>
      <Skeleton className="h-[350px] w-full" />
    </div>
  );
  
  // Render performance overview
  const renderOverview = () => {
    if (!performanceStats) return null;
    
    const {
      totalBets,
      wonBets,
      lostBets,
      pendingBets,
      winRate,
      totalWagered,
      totalWon,
      netProfit
    } = performanceStats;
    
    const isProfitable = netProfit > 0;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Bets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <HistoryIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold">{totalBets}</div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {pendingBets} pending bets
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <TrophyIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold">{Math.round(winRate * 100)}%</div>
              </div>
              <Progress value={winRate * 100} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Amount Wagered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <DollarSignIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold">{formatCurrency(totalWagered)}</div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Across {totalBets} bets
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <DollarSignIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className={`text-2xl font-bold ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
                  {isProfitable ? '+' : ''}{formatCurrency(netProfit)}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {isProfitable ? 'Profit' : 'Loss'} from betting
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Betting Performance</CardTitle>
            <CardDescription>Your betting performance over the selected time period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className="w-64 h-64 rounded-full border-8 border-gray-100 flex items-center justify-center relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold">{wonBets}</div>
                    <div className="text-sm text-muted-foreground">Wins</div>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center rotate-180">
                  <div className="w-full h-full" style={{ 
                    background: `conic-gradient(#10b981 0% ${winRate * 100}%, #ef4444 ${winRate * 100}% 100%)`,
                    borderRadius: '50%'
                  }}></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 bg-background rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold">{lostBets}</div>
                      <div className="text-sm text-muted-foreground">Losses</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center">
                <div className="text-sm font-medium text-muted-foreground">Win/Loss Ratio</div>
                <div className="text-2xl font-bold mt-2">
                  {lostBets > 0 ? (wonBets / lostBets).toFixed(2) : '∞'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-muted-foreground">Avg. Wager</div>
                <div className="text-2xl font-bold mt-2">
                  {totalBets > 0 ? formatCurrency(totalWagered / totalBets) : '$0.00'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-muted-foreground">Return on Investment</div>
                <div className={`text-2xl font-bold mt-2 ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
                  {totalWagered > 0 ? `${Math.round((netProfit / totalWagered) * 100)}%` : '0%'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  // Render bet history
  const renderBetHistory = () => {
    if (!betHistory) return null;
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bet History</CardTitle>
          <CardDescription>Your recent betting activity</CardDescription>
        </CardHeader>
        <CardContent>
          {betHistory.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No betting history found for the selected time period.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Opponent</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {betHistory.map((bet) => (
                  <TableRow key={bet.betId}>
                    <TableCell>{formatDate(bet.date)}</TableCell>
                    <TableCell>{bet.betType}</TableCell>
                    <TableCell>{formatAddress(bet.opponent)}</TableCell>
                    <TableCell>{bet.courseName || 'N/A'}</TableCell>
                    <TableCell>${parseFloat(bet.amount).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          bet.result === 'win' ? 'default' : 
                          bet.result === 'loss' ? 'destructive' : 'outline'
                        }
                      >
                        {bet.result === 'win' ? 'Won' : 
                         bet.result === 'loss' ? 'Lost' : 'Pending'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    );
  };
  
  // Render course performance
  const renderCoursePerformance = () => {
    if (!coursePerformance) return null;
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Course Performance</CardTitle>
          <CardDescription>Your performance at different golf courses</CardDescription>
        </CardHeader>
        <CardContent>
          {coursePerformance.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No course performance data found for the selected time period.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {coursePerformance.map((course) => (
                <div key={course.courseId} className="border-b pb-6 last:border-none last:pb-0">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="font-semibold text-lg flex items-center">
                        <MapPinIcon className="mr-2 h-4 w-4" />
                        {course.courseName}
                      </h4>
                      <p className="text-sm text-muted-foreground">{course.betsPlayed} bets played</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Win Rate</p>
                      <p className={`text-lg font-bold ${
                        course.winRate > 0.5 ? 'text-green-500' : 
                        course.winRate < 0.5 ? 'text-red-500' : 'text-yellow-500'
                      }`}>
                        {Math.round(course.winRate * 100)}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm mb-2">
                    <span>Performance</span>
                    <span>{course.wins}W - {course.losses}L</span>
                  </div>
                  <Progress value={course.winRate * 100} className="h-2" />
                  
                  {course.averageScore && (
                    <div className="mt-4 text-sm">
                      <span className="text-muted-foreground">Average Score: </span>
                      <span className="font-medium">{course.averageScore}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };
  
  // Render player performance
  const renderPlayerPerformance = () => {
    if (!playerPerformance) return null;
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Player Performance</CardTitle>
          <CardDescription>Your performance against other players</CardDescription>
        </CardHeader>
        <CardContent>
          {playerPerformance.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No player performance data found for the selected time period.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {playerPerformance.map((player) => (
                <div key={player.playerAddress} className="border-b pb-6 last:border-none last:pb-0">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="font-semibold text-lg flex items-center">
                        <UsersIcon className="mr-2 h-4 w-4" />
                        {player.displayName || formatAddress(player.playerAddress)}
                      </h4>
                      <p className="text-sm text-muted-foreground">{player.betsPlayed} bets played</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Your Win Rate</p>
                      <p className={`text-lg font-bold ${
                        1 - player.winRateVsYou > 0.5 ? 'text-green-500' : 
                        1 - player.winRateVsYou < 0.5 ? 'text-red-500' : 'text-yellow-500'
                      }`}>
                        {Math.round((1 - player.winRateVsYou) * 100)}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm mb-2">
                    <span>Your Record</span>
                    <span>{player.lossesAgainstYou}W - {player.winsAgainstYou}L</span>
                  </div>
                  <Progress value={(1 - player.winRateVsYou) * 100} className="h-2" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };
  
  // If user is not connected or on free tier
  if (userTier === SubscriptionTier.FREE) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Analytics Dashboard</h2>
        {renderUpgradeNotice(SubscriptionTier.PREMIUM)}
        
        <Card>
          <CardHeader>
            <CardTitle>Premium Analytics</CardTitle>
            <CardDescription>
              Upgrade to premium to access detailed analytics about your betting performance
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Premium Features:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <RocketIcon className="mr-2 h-4 w-4 text-green-500" />
                    Performance statistics and win rate
                  </li>
                  <li className="flex items-center">
                    <HistoryIcon className="mr-2 h-4 w-4 text-green-500" />
                    Detailed bet history
                  </li>
                  <li className="flex items-center">
                    <MapPinIcon className="mr-2 h-4 w-4 text-green-500" />
                    Course performance analysis
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold">Pro Features:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <UsersIcon className="mr-2 h-4 w-4 text-blue-500" />
                    Player performance analysis
                  </li>
                  <li className="flex items-center">
                    <TrophyIcon className="mr-2 h-4 w-4 text-blue-500" />
                    Advanced betting insights
                  </li>
                  <li className="flex items-center">
                    <MedalIcon className="mr-2 h-4 w-4 text-blue-500" />
                    Performance predictions
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Button onClick={handleUpgrade} size="lg" className="bg-green-600 hover:bg-green-700">
                <div className="flex items-center gap-2">
                  <RocketIcon className="w-4 h-4 text-primary" />
                  <span>Upgrade to Premium</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-3xl font-bold mb-4 md:mb-0">Analytics Dashboard</h2>
        
        <div className="flex items-center space-x-4">
          <Select value={activePeriod.toString()} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              {ANALYTICS_PERIODS.map((period) => (
                <SelectItem key={period.value} value={period.value.toString()}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {userTier === SubscriptionTier.PREMIUM && (
            <Button onClick={handleUpgrade} variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
              <div className="flex items-center gap-2">
                <RocketIcon className="w-4 h-4 text-primary" />
                <span>Upgrade to Premium</span>
              </div>
            </Button>
          )}
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Bet History</TabsTrigger>
          <TabsTrigger value="courses">Course Analysis</TabsTrigger>
          <TabsTrigger value="players" disabled={userTier !== SubscriptionTier.PRO}>
            Player Analysis {userTier !== SubscriptionTier.PRO && <LockIcon className="ml-1 h-3 w-3" />}
          </TabsTrigger>
        </TabsList>
        
        {isLoading ? (
          renderSkeletons()
        ) : (
          <>
            <TabsContent value="overview">
              {renderOverview()}
            </TabsContent>
            
            <TabsContent value="history">
              {renderBetHistory()}
            </TabsContent>
            
            <TabsContent value="courses">
              {renderCoursePerformance()}
            </TabsContent>
            
            <TabsContent value="players">
              {userTier !== SubscriptionTier.PRO ? (
                renderUpgradeNotice(SubscriptionTier.PRO)
              ) : (
                renderPlayerPerformance()
              )}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

// Lock icon component for tabs that require Pro subscription
const LockIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export default AnalyticsDashboard; 