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
      totalBunkers: 0,
      totalPenalties: 0,
    };

    roundStats.forEach((round) => {
      // Scoring
      stats.averageScore += round.score;
      stats.bestScore = Math.min(stats.bestScore, round.score);
      stats.worstScore = Math.max(stats.worstScore, round.score);

      // Fairways and Greens
      stats.fairwayPercentage += (round.fairwaysHit / round.fairwaysTotal) * 100;
      stats.girPercentage += (round.greensInRegulation / 18) * 100;

      // Putting and Other Stats
      stats.averagePutts += round.putts;
      if (round.drivingDistance) {
        stats.averageDrivingDistance += round.drivingDistance;
      }
      stats.totalBunkers += round.bunkersHit;
      stats.totalPenalties += round.penaltyStrokes;
    });

    // Calculate averages
    stats.averageScore /= stats.totalRounds;
    stats.fairwayPercentage /= stats.totalRounds;
    stats.girPercentage /= stats.totalRounds;
    stats.averagePutts /= stats.totalRounds;
    stats.averageDrivingDistance /= stats.totalRounds;

    return stats;
  };

  const stats = calculateStats();
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mistakes</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-muted-foreground">Bunkers per Round</dt>
              <dd className="text-2xl font-bold">{(stats.totalBunkers / stats.totalRounds).toFixed(1)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Penalties per Round</dt>
              <dd className="text-xl font-semibold">{(stats.totalPenalties / stats.totalRounds).toFixed(1)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
} 