import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { ClubFittingAlgorithm } from './ClubFittingAlgorithm';
import { ClubGappingAnalysis } from './ClubGappingAnalysis';
import { TradeInValueEstimator } from './TradeInValueEstimator';
import { VirtualClubTesting } from './VirtualClubTesting';
import { Ruler, BarChart3, CircleDollarSign, Gamepad2 } from 'lucide-react';

export const EquipmentRecommenderHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState("fitting");

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Golf Equipment Recommender</h1>
        <p className="text-muted-foreground">
          Find the perfect equipment for your game with our advanced analysis tools
        </p>
      </div>

      <Tabs defaultValue="fitting" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full mb-8">
          <TabsTrigger value="fitting" className="flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            <span>Club Fitting</span>
          </TabsTrigger>
          <TabsTrigger value="gapping" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Club Gapping</span>
          </TabsTrigger>
          <TabsTrigger value="tradein" className="flex items-center gap-2">
            <CircleDollarSign className="h-4 w-4" />
            <span>Trade-In Value</span>
          </TabsTrigger>
          <TabsTrigger value="virtual" className="flex items-center gap-2">
            <Gamepad2 className="h-4 w-4" />
            <span>Virtual Testing</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fitting" className="mt-0">
          <Card className="border-t-0 rounded-tl-none rounded-tr-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-primary" />
                <span>Enhanced Club Fitting Algorithm</span>
              </CardTitle>
              <CardDescription>
                Get personalized club recommendations based on your physical attributes and skill level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClubFittingAlgorithm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gapping" className="mt-0">
          <Card className="border-t-0 rounded-tl-none rounded-tr-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span>Club Gapping Analysis</span>
              </CardTitle>
              <CardDescription>
                Identify and fix distance gaps in your bag for better course coverage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClubGappingAnalysis />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tradein" className="mt-0">
          <Card className="border-t-0 rounded-tl-none rounded-tr-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CircleDollarSign className="h-5 w-5 text-primary" />
                <span>Trade-In Value Estimator</span>
              </CardTitle>
              <CardDescription>
                Find out what your current clubs are worth before upgrading
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TradeInValueEstimator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="virtual" className="mt-0">
          <Card className="border-t-0 rounded-tl-none rounded-tr-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gamepad2 className="h-5 w-5 text-primary" />
                <span>Virtual Club Testing</span>
              </CardTitle>
              <CardDescription>
                Test drive different club models with a virtual simulation of your swing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VirtualClubTesting />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 