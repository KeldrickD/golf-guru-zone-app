import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { RulesQuiz } from "./RulesQuiz";
import { SituationRulesEngine } from "./SituationRulesEngine";
import { RuleVideoExplanations } from "./RuleVideoExplanations";
import { OfficialRulingsDatabase } from "./OfficialRulingsDatabase";
import { BookOpen, HelpCircle, Video, Database, Trophy } from 'lucide-react';

export const GolfRulesHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState("quiz");

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Golf Rules Assistant</h1>
        <p className="text-muted-foreground">
          Learn, explore, and master the rules of golf with our comprehensive tools
        </p>
      </div>

      <Tabs defaultValue="quiz" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full mb-8">
          <TabsTrigger value="quiz" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            <span>Rules Quiz</span>
          </TabsTrigger>
          <TabsTrigger value="situations" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span>Situation Rules</span>
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span>Video Explanations</span>
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span>Official Rulings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quiz" className="mt-0">
          <Card className="border-t-0 rounded-tl-none rounded-tr-none">
            <CardHeader>
              <CardTitle>Interactive Rules Quiz</CardTitle>
              <CardDescription>
                Test your knowledge of golf rules through fun, interactive quizzes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RulesQuiz />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="situations" className="mt-0">
          <Card className="border-t-0 rounded-tl-none rounded-tr-none">
            <CardHeader>
              <CardTitle>Situation-Based Rules Engine</CardTitle>
              <CardDescription>
                Find guidance for common on-course situations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SituationRulesEngine />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos" className="mt-0">
          <Card className="border-t-0 rounded-tl-none rounded-tr-none">
            <CardHeader>
              <CardTitle>Rule Video Explanations</CardTitle>
              <CardDescription>
                Learn golf rules through expert video explanations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RuleVideoExplanations />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="mt-0">
          <Card className="border-t-0 rounded-tl-none rounded-tr-none">
            <CardHeader>
              <CardTitle>Official Rulings Database</CardTitle>
              <CardDescription>
                Search through official rulings and interpretations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OfficialRulingsDatabase />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 