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
        recent: recentRounds.reduce((sum, r) => sum + r.score, 0) / recentRounds.length,
        older: olderRounds.reduce((sum, r) => sum + r.score, 0) / olderRounds.length,
        best: Math.min(...sortedRounds.map(r => r.score)),
        trend: null as number | null,
        goal: null as number | null,
      },
      accuracy: {
        fairways: {
          recent: recentRounds.reduce((sum, r) => sum + (r.fairwaysHit / r.fairwaysTotal) * 100, 0) / recentRounds.length,
          older: olderRounds.reduce((sum, r) => sum + (r.fairwaysHit / r.fairwaysTotal) * 100, 0) / olderRounds.length,
        },
        greens: {
          recent: recentRounds.reduce((sum, r) => sum + (r.greensInRegulation / 18) * 100, 0) / recentRounds.length,
          older: olderRounds.reduce((sum, r) => sum + (r.greensInRegulation / 18) * 100, 0) / olderRounds.length,
        },
      },
      putting: {
        recent: recentRounds.reduce((sum, r) => sum + r.putts, 0) / recentRounds.length,
        older: olderRounds.reduce((sum, r) => sum + r.putts, 0) / olderRounds.length,
        best: Math.min(...sortedRounds.map(r => r.putts)),
      },
      driving: {
        recent: recentRounds.reduce((sum, r) => sum + (r.drivingDistance || 0), 0) / recentRounds.length,
        older: olderRounds.reduce((sum, r) => sum + (r.drivingDistance || 0), 0) / olderRounds.length,
        max: Math.max(...sortedRounds.map(r => r.drivingDistance || 0)),
      },
    };

    // Calculate trends (positive numbers indicate improvement)
    insights.score.trend = insights.score.older - insights.score.recent;
    insights.score.goal = Math.max(70, insights.score.best - 2); // Goal: 2 strokes better than best or 70

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
          <CardTitle className="text-lg">Recent Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last 5 Rounds Avg</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{insights.score.recent.toFixed(1)}</span>
                {insights.score.trend > 0 ? (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Previous 5 Rounds Avg</span>
              <span className="text-xl">{insights.score.older.toFixed(1)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Best Score</span>
              <span className="text-xl text-green-500">{insights.score.best}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Goal Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Target Score:</span>
              <span className="text-xl font-bold">{insights.score.goal}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {insights.score.recent <= insights.score.goal
                ? "Congratulations! You've reached your target score. Consider setting a new goal."
                : `You're ${(insights.score.recent - insights.score.goal).toFixed(1)} strokes away from your target.`}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderAccuracyInsights = () => (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Fairways</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Recent Accuracy</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{insights.accuracy.fairways.recent.toFixed(1)}%</span>
                {insights.accuracy.fairways.recent > insights.accuracy.fairways.older ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Previous Accuracy</span>
              <span className="text-xl">{insights.accuracy.fairways.older.toFixed(1)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Greens in Regulation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Recent GIR</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{insights.accuracy.greens.recent.toFixed(1)}%</span>
                {insights.accuracy.greens.recent > insights.accuracy.greens.older ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Previous GIR</span>
              <span className="text-xl">{insights.accuracy.greens.older.toFixed(1)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderPuttingInsights = () => (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Putting Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Recent Average</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{insights.putting.recent.toFixed(1)}</span>
                {insights.putting.recent < insights.putting.older ? (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Previous Average</span>
              <span className="text-xl">{insights.putting.older.toFixed(1)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Best Performance</span>
              <span className="text-xl text-green-500">{insights.putting.best}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Putting Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {insights.putting.recent < insights.putting.older
                ? "Your putting is improving! Keep practicing your current routine."
                : "Consider focusing on putting practice to reduce your average putts per round."}
            </p>
            <p className="text-sm text-muted-foreground">
              Your best putting round required {insights.putting.best} putts. 
              Try to maintain consistency closer to this number.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderDrivingInsights = () => (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Driving Distance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Recent Average</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{insights.driving.recent.toFixed(0)} yds</span>
                {insights.driving.recent > insights.driving.older ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Previous Average</span>
              <span className="text-xl">{insights.driving.older.toFixed(0)} yds</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Longest Drive</span>
              <span className="text-xl text-green-500">{insights.driving.max} yds</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Distance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {insights.driving.recent > insights.driving.older
                ? "Your driving distance is improving! Keep working on your swing speed and technique."
                : "Consider focusing on swing mechanics and flexibility to increase your driving distance."}
            </p>
            <p className="text-sm text-muted-foreground">
              Your longest drive was {insights.driving.max} yards. 
              This shows your potential for distance when everything clicks.
            </p>
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
        return renderAccuracyInsights();
      case "putting":
        return renderPuttingInsights();
      case "driving":
        return renderDrivingInsights();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {renderInsights()}
    </div>
  );
} 