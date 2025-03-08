import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { RoundStats } from "@/services/performanceAnalysisService";
import { TrendingUp, TrendingDown, Target, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/Alert";

interface StatisticalInsightsProps {
  roundStats: RoundStats[];
  selectedMetric: "score" | "accuracy" | "putting" | "driving";
}

export function StatisticalInsights({ roundStats, selectedMetric }: StatisticalInsightsProps) {
  // Calculate insights based on the selected metric
  const calculateInsights = () => {
    if (roundStats.length < 2) return null;

    const sortedRounds = [...roundStats].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const recentRounds = sortedRounds.slice(-5);
    const olderRounds = sortedRounds.slice(-10, -5);

    const insights = {
      score: {
        recent: recentRounds.reduce((sum, r) => sum + r.totalScore, 0) / recentRounds.length,
        older: olderRounds.reduce((sum, r) => sum + r.totalScore, 0) / olderRounds.length,
        best: Math.min(...sortedRounds.map(r => r.totalScore)),
        trend: recentRounds.length > 0 ? recentRounds[recentRounds.length - 1].totalScore - recentRounds[0].totalScore : 0,
      },
      fairways: {
        recent: recentRounds.reduce((sum, r) => sum + (r.fairwaysHit / r.totalFairways) * 100, 0) / recentRounds.length,
        older: olderRounds.reduce((sum, r) => sum + (r.fairwaysHit / r.totalFairways) * 100, 0) / olderRounds.length,
        best: Math.max(...sortedRounds.map(r => (r.fairwaysHit / r.totalFairways) * 100)),
        trend: recentRounds.length > 0 ? (recentRounds[recentRounds.length - 1].fairwaysHit / recentRounds[recentRounds.length - 1].totalFairways) * 100 - (recentRounds[0].fairwaysHit / recentRounds[0].totalFairways) * 100 : 0,
      },
      gir: {
        recent: recentRounds.reduce((sum, r) => sum + (r.greensInRegulation / 18) * 100, 0) / recentRounds.length,
        older: olderRounds.reduce((sum, r) => sum + (r.greensInRegulation / 18) * 100, 0) / olderRounds.length,
        best: Math.max(...sortedRounds.map(r => (r.greensInRegulation / 18) * 100)),
        trend: recentRounds.length > 0 ? (recentRounds[recentRounds.length - 1].greensInRegulation / 18) * 100 - (recentRounds[0].greensInRegulation / 18) * 100 : 0,
      },
      putts: {
        recent: recentRounds.reduce((sum, r) => sum + r.totalPutts, 0) / recentRounds.length,
        older: olderRounds.reduce((sum, r) => sum + r.totalPutts, 0) / olderRounds.length,
        best: Math.min(...sortedRounds.map(r => r.totalPutts)),
        trend: recentRounds.length > 0 ? recentRounds[recentRounds.length - 1].totalPutts - recentRounds[0].totalPutts : 0,
      },
      drivingDistance: {
        recent: recentRounds.reduce((sum, r) => sum + r.avgDriveDistance, 0) / recentRounds.length,
        older: olderRounds.reduce((sum, r) => sum + r.avgDriveDistance, 0) / olderRounds.length,
        best: Math.max(...sortedRounds.map(r => r.avgDriveDistance)),
        trend: recentRounds.length > 0 ? recentRounds[recentRounds.length - 1].avgDriveDistance - recentRounds[0].avgDriveDistance : 0,
      },
    };

    return insights;
  };

  const insights = calculateInsights();
  if (!insights) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Not enough rounds to generate insights. Play more rounds to see statistical analysis.
        </AlertDescription>
      </Alert>
    );
  }

  const renderScoreInsights = () => (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Score Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <span className="text-sm text-muted-foreground">Recent Average</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{insights.score.recent.toFixed(1)}</span>
                {insights.score.recent < insights.score.older ? (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-destructive" />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Previous Average</span>
              <span className="text-xl">{insights.score.older.toFixed(1)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Best Score</span>
              <span className="text-xl text-green-500">{insights.score.best}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Trend</span>
              <span className={`text-xl ${insights.score.trend < 0 ? 'text-green-500' : 'text-destructive'}`}>
                {insights.score.trend < 0 ? `${Math.abs(insights.score.trend).toFixed(1)} better` : `${insights.score.trend.toFixed(1)} worse`}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Fairway Accuracy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <span className="text-sm text-muted-foreground">Recent Average</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{insights.fairways.recent.toFixed(1)}%</span>
                {insights.fairways.recent > insights.fairways.older ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Previous Average</span>
              <span className="text-xl">{insights.fairways.older.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Best Performance</span>
              <span className="text-xl text-green-500">{insights.fairways.best.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Trend</span>
              <span className={`text-xl ${insights.fairways.trend > 0 ? 'text-green-500' : 'text-destructive'}`}>
                {insights.fairways.trend > 0 ? `${insights.fairways.trend.toFixed(1)}% better` : `${Math.abs(insights.fairways.trend).toFixed(1)}% worse`}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Greens in Regulation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <span className="text-sm text-muted-foreground">Recent Average</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{insights.gir.recent.toFixed(1)}%</span>
                {insights.gir.recent > insights.gir.older ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Previous Average</span>
              <span className="text-xl">{insights.gir.older.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Best Performance</span>
              <span className="text-xl text-green-500">{insights.gir.best.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Trend</span>
              <span className={`text-xl ${insights.gir.trend > 0 ? 'text-green-500' : 'text-destructive'}`}>
                {insights.gir.trend > 0 ? `${insights.gir.trend.toFixed(1)}% better` : `${Math.abs(insights.gir.trend).toFixed(1)}% worse`}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Putting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <span className="text-sm text-muted-foreground">Recent Average</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{insights.putts.recent.toFixed(1)}</span>
                {insights.putts.recent < insights.putts.older ? (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-destructive" />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Previous Average</span>
              <span className="text-xl">{insights.putts.older.toFixed(1)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Best Performance</span>
              <span className="text-xl text-green-500">{insights.putts.best}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Trend</span>
              <span className={`text-xl ${insights.putts.trend < 0 ? 'text-green-500' : 'text-destructive'}`}>
                {insights.putts.trend < 0 ? `${Math.abs(insights.putts.trend).toFixed(1)} better` : `${insights.putts.trend.toFixed(1)} worse`}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Driving Distance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <span className="text-sm text-muted-foreground">Recent Average</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{insights.drivingDistance.recent.toFixed(0)} yds</span>
                {insights.drivingDistance.recent > insights.drivingDistance.older ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Previous Average</span>
              <span className="text-xl">{insights.drivingDistance.older.toFixed(0)} yds</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Best Performance</span>
              <span className="text-xl text-green-500">{insights.drivingDistance.best} yds</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Trend</span>
              <span className={`text-xl ${insights.drivingDistance.trend > 0 ? 'text-green-500' : 'text-destructive'}`}>
                {insights.drivingDistance.trend > 0 ? `${insights.drivingDistance.trend.toFixed(0)} yds better` : `${Math.abs(insights.drivingDistance.trend).toFixed(0)} yds worse`}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderInsights = () => {
    switch (selectedMetric) {
      case "score":
        return renderScoreInsights();
      case "accuracy":
        return renderScoreInsights();
      case "putting":
        return renderScoreInsights();
      case "driving":
        return renderScoreInsights();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {renderInsights()}
    </div>
  );
} 