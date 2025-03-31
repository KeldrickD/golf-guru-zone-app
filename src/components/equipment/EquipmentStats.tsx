'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface EquipmentStats {
  id: string;
  type: string;
  brand: string;
  model: string;
  totalRounds: number;
  averageDistance: number;
  accuracy: number;
  consistency: number;
  lastUsed: string;
  maintenanceHistory: {
    date: string;
    type: string;
    notes: string;
  }[];
}

interface EquipmentStatsProps {
  stats: EquipmentStats;
}

export function EquipmentStats({ stats }: EquipmentStatsProps) {
  const distanceData = stats.maintenanceHistory.map(record => ({
    date: new Date(record.date).toLocaleDateString(),
    distance: stats.averageDistance,
  }));

  const accuracyData = stats.maintenanceHistory.map(record => ({
    date: new Date(record.date).toLocaleDateString(),
    accuracy: stats.accuracy,
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Rounds</CardTitle>
            <CardDescription>Number of rounds played</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRounds}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Distance</CardTitle>
            <CardDescription>Average distance per shot</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageDistance} yards</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accuracy</CardTitle>
            <CardDescription>Shot accuracy percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.accuracy}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consistency</CardTitle>
            <CardDescription>Shot consistency score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.consistency}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distance Trend</CardTitle>
            <CardDescription>Average distance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={distanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="distance"
                    name="Distance (yards)"
                    stroke="#8884d8"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accuracy Trend</CardTitle>
            <CardDescription>Accuracy percentage over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={accuracyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    name="Accuracy (%)"
                    stroke="#82ca9d"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance History</CardTitle>
          <CardDescription>Recent maintenance records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.maintenanceHistory.map((record, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{record.type}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(record.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm">{record.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 