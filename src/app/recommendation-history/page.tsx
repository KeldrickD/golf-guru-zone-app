'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useSubscription } from '@/hooks/useSubscription';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, TrendingUp, TrendingDown, Filter, RefreshCw, Calendar, Download, Share2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { StatisticsSummary } from '@/components/StatisticsSummary';
import PerformanceAnalysisService, { RoundStats, PerformanceAnalysis, PracticePlan } from '@/services/performanceAnalysisService';
import { exportRoundStats, exportPracticePlan, generatePracticePlanPDF } from '@/utils/exportUtils';
import { PerformanceTrends } from '@/components/PerformanceTrends';

type TimeFilter = '7days' | '30days' | '90days' | 'all';

export default function RecommendationHistoryPage() {
  const { isConnected } = useWallet();
  const { tier } = useSubscription();
  const { toast } = useToast();
  const performanceService = PerformanceAnalysisService.getInstance();

  const [roundStats, setRoundStats] = useState<RoundStats[]>([]);
  const [analysis, setAnalysis] = useState<PerformanceAnalysis | null>(null);
  const [practicePlans, setPracticePlans] = useState<PracticePlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('30days');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (isConnected) {
      loadData();
    }
  }, [isConnected, timeFilter]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [stats, performanceAnalysis, plans] = await Promise.all([
        performanceService.getRoundStats(),
        performanceService.getPerformanceAnalysis(),
        performanceService.getPracticePlans()
      ]);

      // Filter stats based on time range
      const filteredStats = filterStatsByTime(stats, timeFilter);
      setRoundStats(filteredStats);
      setAnalysis(performanceAnalysis);
      setPracticePlans(plans);
    } catch (error) {
      console.error('Error loading recommendation history:', error);
      setError('Failed to load recommendation history');
      toast({
        title: 'Error',
        description: 'Failed to load recommendation history',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterStatsByTime = (stats: RoundStats[], filter: TimeFilter): RoundStats[] => {
    const now = new Date();
    const filterDays = {
      '7days': 7,
      '30days': 30,
      '90days': 90,
      'all': 365 * 10 // Effectively "all" data
    };

    const cutoff = new Date(now.getTime() - filterDays[filter] * 24 * 60 * 60 * 1000);
    return stats.filter(stat => new Date(stat.date) >= cutoff);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await performanceService.generateNewAnalysis();
    await loadData();
    setIsRefreshing(false);
    toast({
      title: 'Analysis Updated',
      description: 'Your performance analysis has been refreshed with the latest data.',
    });
  };

  const handleExportStats = () => {
    try {
      exportRoundStats(roundStats);
      toast({
        title: 'Export Successful',
        description: 'Your round statistics have been exported to CSV.',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export round statistics.',
        variant: 'destructive',
      });
    }
  };

  const handleExportPracticePlan = (plan: PracticePlan) => {
    try {
      exportPracticePlan(plan);
      toast({
        title: 'Export Successful',
        description: 'Practice plan has been exported to CSV.',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export practice plan.',
        variant: 'destructive',
      });
    }
  };

  const handleSharePracticePlan = async (plan: PracticePlan) => {
    try {
      const shareData = {
        title: 'Golf Practice Plan',
        text: `Check out my golf practice plan: ${plan.title}`,
        url: generatePracticePlanPDF(plan)
      };

      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast({
          title: 'Share Successful',
          description: 'Practice plan has been shared.',
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(JSON.stringify(plan, null, 2));
        toast({
          title: 'Copied to Clipboard',
          description: 'Practice plan has been copied to your clipboard.',
        });
      }
    } catch (error) {
      toast({
        title: 'Share Failed',
        description: 'Failed to share practice plan.',
        variant: 'destructive',
      });
    }
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Wallet Required</AlertTitle>
          <AlertDescription>
            Please connect your wallet to view your recommendation history
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (tier !== 'PRO') {
    return (
      <div className="container mx-auto py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Pro Subscription Required</AlertTitle>
          <AlertDescription>
            Upgrade to Pro to access detailed recommendation history and performance analysis
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const renderLoadingState = () => (
    <div className="space-y-4">
      {/* Statistics Cards Loading */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-[150px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[100px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Trends Loading */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[200px] mb-2" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-[300px] w-full" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Cards Loading */}
      <Card>
        <CardContent className="py-4">
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Recommendation History</h1>
          <p className="text-muted-foreground">
            Track your performance and get personalized practice plans
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select
            value={timeFilter}
            onValueChange={(value) => setTimeFilter(value as TimeFilter)}
          >
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={handleExportStats}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Stats
          </Button>
        </div>
      </div>

      {isLoading ? (
        renderLoadingState()
      ) : (
        <>
          {/* Statistics Summary */}
          <StatisticsSummary roundStats={roundStats} />

          {/* Performance Trends */}
          {roundStats.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>
                  Visualize your progress over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PerformanceTrends roundStats={roundStats} />
              </CardContent>
            </Card>
          )}

          {analysis && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Performance Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{analysis.summary}</p>
                  <div className="mt-4 space-y-2">
                    <h4 className="font-semibold">Key Strengths:</h4>
                    <ul className="list-disc list-inside text-sm">
                      {analysis.strengths.map((strength, index) => (
                        <li key={index} className="text-green-600">{strength}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Areas for Improvement */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Areas for Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.improvementAreas.map((area, index) => (
                      <div key={index}>
                        <h4 className="font-semibold">{area.area}</h4>
                        <p className="text-sm text-muted-foreground">{area.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.comparisonToAverage.map((metric, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{metric.category}</span>
                        <div className="flex items-center">
                          {metric.difference > 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                          )}
                          <span className={metric.difference > 0 ? 'text-green-500' : 'text-red-500'}>
                            {metric.difference > 0 ? '+' : ''}{metric.difference}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Practice Plans */}
          {practicePlans.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recommended Practice Plans</CardTitle>
                <CardDescription>
                  Personalized practice plans based on your performance analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {practicePlans.map((plan) => (
                    <Card key={plan.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{plan.title}</CardTitle>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleExportPracticePlan(plan)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSharePracticePlan(plan)}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <CardDescription>{plan.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Drills:</h4>
                            <ul className="list-disc list-inside text-sm space-y-2">
                              {plan.drills.map((drill, index) => (
                                <li key={index}>
                                  <span className="font-medium">{drill.name}</span>
                                  <p className="ml-6 text-muted-foreground">{drill.description}</p>
                                  {drill.videoUrl && (
                                    <a
                                      href={drill.videoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="ml-6 text-primary hover:underline"
                                    >
                                      Watch Video
                                    </a>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Goals:</h4>
                            <ul className="list-disc list-inside text-sm">
                              {plan.goals.map((goal, index) => (
                                <li key={index}>{goal}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Expected timeframe: {plan.expectedTimeframe}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Round History Table */}
          <Card>
            <CardHeader>
              <CardTitle>Round History</CardTitle>
              <CardDescription>
                Your recent rounds and performance statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roundStats.length > 0 ? (
                    roundStats.map((round) => (
                      <TableRow key={round.id}>
                        <TableCell>{new Date(round.date).toLocaleDateString()}</TableCell>
                        <TableCell>{round.course}</TableCell>
                        <TableCell>{round.score}</TableCell>
                        <TableCell>
                          <Badge
                            variant={round.score <= round.par ? 'default' : 'destructive'}
                          >
                            {round.score - round.par > 0 ? '+' : ''}{round.score - round.par}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{round.notes}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No rounds found for the selected time period
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
} 