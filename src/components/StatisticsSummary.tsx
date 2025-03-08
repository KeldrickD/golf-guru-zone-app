import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { RoundStats } from "@/services/performanceAnalysisService"

interface StatisticsSummaryProps {
  roundStats: RoundStats[]
}

export function StatisticsSummary({ roundStats }: StatisticsSummaryProps) {
  const calculateStats = () => {
    if (roundStats.length === 0) return null;

    const stats = {
      averageScore: 0,
      bestScore: Infinity,
      worstScore: -Infinity,
      fairwayPercentage: 0,
      girPercentage: 0,
      averagePutts: 0,
      averageDrivingDistance: 0,
      totalRounds: roundStats.length,
      fairwaysHit: 0,
      totalFairways: 0,
      greensInRegulation: 0,
      totalPutts: 0,
      bestPutts: Infinity,
      worstPutts: -Infinity,
      totalDrivingDistance: 0,
      drivingDistanceRounds: 0,
      bestDrivingDistance: -Infinity,
    };

    roundStats.forEach((round) => {
      // Scoring
      stats.averageScore += round.totalScore;
      stats.bestScore = Math.min(stats.bestScore, round.totalScore);
      stats.worstScore = Math.max(stats.worstScore, round.totalScore);

      // Fairways
      stats.fairwaysHit += round.fairwaysHit;
      stats.totalFairways += round.totalFairways;

      // Greens
      stats.greensInRegulation += round.greensInRegulation;

      // Putting
      stats.totalPutts += round.totalPutts;
      stats.bestPutts = Math.min(stats.bestPutts, round.totalPutts);
      stats.worstPutts = Math.max(stats.worstPutts, round.totalPutts);

      // Driving Distance
      if (round.avgDriveDistance) {
        stats.totalDrivingDistance += round.avgDriveDistance;
        stats.drivingDistanceRounds++;
        stats.bestDrivingDistance = Math.max(stats.bestDrivingDistance, round.avgDriveDistance);
      }

      // Fairways and Greens
      stats.fairwayPercentage += (round.fairwaysHit / round.totalFairways) * 100;
      stats.girPercentage += (round.greensInRegulation / 18) * 100;

      // Putting and Other Stats
      stats.averagePutts += round.totalPutts;
      stats.averageDrivingDistance += round.avgDriveDistance;
    });

    // Calculate averages
    stats.averageScore /= stats.totalRounds;
    stats.fairwayPercentage /= stats.totalRounds;
    stats.girPercentage /= stats.totalRounds;
    stats.averagePutts /= stats.totalRounds;
    stats.averageDrivingDistance /= stats.drivingDistanceRounds;

    return stats;
  };

  const stats = calculateStats();
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Scoring</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-muted-foreground">Average Score</dt>
              <dd className="text-2xl font-bold">{stats.averageScore.toFixed(1)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Best Round</dt>
              <dd className="text-xl font-semibold text-green-600">{stats.bestScore}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Worst Round</dt>
              <dd className="text-xl font-semibold text-red-600">{stats.worstScore}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Accuracy</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-muted-foreground">Fairways Hit</dt>
              <dd className="text-2xl font-bold">{stats.fairwayPercentage.toFixed(1)}%</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Greens in Regulation</dt>
              <dd className="text-2xl font-bold">{stats.girPercentage.toFixed(1)}%</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Avg. Driving Distance</dt>
              <dd className="text-xl font-semibold">{stats.averageDrivingDistance.toFixed(0)} yds</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Putting</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-muted-foreground">Average Putts</dt>
              <dd className="text-2xl font-bold">{stats.averagePutts.toFixed(1)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Putts per GIR</dt>
              <dd className="text-xl font-semibold">
                {(stats.averagePutts / (stats.girPercentage / 100 * 18)).toFixed(2)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Best Putting Round</dt>
              <dd className="text-xl font-semibold text-green-600">{stats.bestPutts}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
} 