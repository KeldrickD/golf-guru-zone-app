'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { formatDate, formatRelativeDate, formatNumber } from '@/utils/formatters';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, 
  Button, Tabs, TabsContent, TabsList, TabsTrigger,
  Badge
} from '@/components/ui';
import { 
  Trophy, Target, Award, TrendingUp, Plus, Calendar, Golf, Flag, 
  Clock, Share, ChevronRight
} from 'lucide-react';
import { AchievementShare } from '@/components/AchievementShare';

// Achievement data (mock - would come from API in real app)
const achievements = [
  {
    id: 1,
    title: 'First Sub-80 Round',
    description: 'Congratulations on breaking 80 for the first time!',
    date: '2023-10-15',
    type: 'personal-best',
    metrics: {
      score: 79,
      course: 'Pine Valley Golf Club',
      par: 72,
      handicapDifferential: -4.3
    }
  },
  {
    id: 2,
    title: '50 Rounds Milestone',
    description: 'You\'ve played 50 rounds with Golf Guru Zone!',
    date: '2023-09-22',
    type: 'milestone',
    metrics: {
      totalRounds: 50,
      averageScore: 85.2,
      bestScore: 79
    }
  },
  {
    id: 3,
    title: 'Driving Accuracy Expert',
    description: 'Hit 90% of fairways in a single round',
    date: '2023-08-05',
    type: 'badge',
    metrics: {
      fairwaysHit: 13,
      totalFairways: 14,
      accuracyPercentage: 0.93
    }
  },
  {
    id: 4,
    title: 'Handicap Improvement',
    description: 'Reduced handicap by 3 strokes in one month',
    date: '2023-11-01',
    type: 'improvement',
    metrics: {
      previousHandicap: 18.2,
      newHandicap: 15.1,
      improvement: 3.1
    }
  },
  {
    id: 5,
    title: 'First Eagle',
    description: 'Scored your first eagle on a par 5!',
    date: '2023-07-30',
    type: 'personal-best',
    metrics: {
      hole: 12,
      par: 5,
      score: 3,
      courseName: 'Pebble Beach Golf Links'
    }
  }
];

// Achievement type icons and labels
const achievementTypes = {
  'personal-best': { icon: <Trophy className="h-5 w-5" />, label: 'Personal Best' },
  'milestone': { icon: <Target className="h-5 w-5" />, label: 'Milestone' },
  'badge': { icon: <Award className="h-5 w-5" />, label: 'Badge' },
  'improvement': { icon: <TrendingUp className="h-5 w-5" />, label: 'Improvement' }
};

export default function AchievementsPage() {
  const { t, language } = useLanguage();
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [shareAchievement, setShareAchievement] = useState<any | null>(null);

  // Filter achievements based on selected tab
  const filteredAchievements = selectedTab === 'all' 
    ? achievements 
    : achievements.filter(achievement => achievement.type === selectedTab);

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('achievements.title')}</h1>
          <p className="text-muted-foreground">{t('achievements.description')}</p>
        </div>
      </div>

      <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">{t('achievements.tabs.all')}</TabsTrigger>
          <TabsTrigger value="personal-best">{t('achievements.tabs.personalBests')}</TabsTrigger>
          <TabsTrigger value="milestone">{t('achievements.tabs.milestones')}</TabsTrigger>
          <TabsTrigger value="badge">{t('achievements.tabs.badges')}</TabsTrigger>
          <TabsTrigger value="improvement">{t('achievements.tabs.improvements')}</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab}>
          {filteredAchievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAchievements.map((achievement) => (
                <Card key={achievement.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="flex items-center gap-1">
                        {achievementTypes[achievement.type as keyof typeof achievementTypes].icon}
                        {t(`achievements.types.${achievement.type}`)}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(achievement.date, 'PP', language)}
                      </div>
                    </div>
                    <CardTitle className="mt-2">{achievement.title}</CardTitle>
                    <CardDescription>{achievement.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {achievement.type === 'personal-best' && (
                        <>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">{t('achievements.metrics.score')}</span>
                            <span className="text-xl font-semibold">{formatNumber(achievement.metrics.score, language)}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">{t('achievements.metrics.par')}</span>
                            <span className="text-xl font-semibold">{formatNumber(achievement.metrics.par, language)}</span>
                          </div>
                          <div className="flex flex-col col-span-2">
                            <span className="text-sm text-muted-foreground">{t('achievements.metrics.course')}</span>
                            <span className="text-md font-medium truncate">{achievement.metrics.course}</span>
                          </div>
                        </>
                      )}
                      
                      {achievement.type === 'milestone' && (
                        <>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">{t('achievements.metrics.totalRounds')}</span>
                            <span className="text-xl font-semibold">{formatNumber(achievement.metrics.totalRounds, language)}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">{t('achievements.metrics.averageScore')}</span>
                            <span className="text-xl font-semibold">{formatNumber(achievement.metrics.averageScore, language, { maximumFractionDigits: 1 })}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">{t('achievements.metrics.bestScore')}</span>
                            <span className="text-xl font-semibold">{formatNumber(achievement.metrics.bestScore, language)}</span>
                          </div>
                        </>
                      )}
                      
                      {achievement.type === 'badge' && (
                        <>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">{t('achievements.metrics.fairwaysHit')}</span>
                            <span className="text-xl font-semibold">{formatNumber(achievement.metrics.fairwaysHit, language)} / {formatNumber(achievement.metrics.totalFairways, language)}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">{t('achievements.metrics.accuracy')}</span>
                            <span className="text-xl font-semibold">{formatNumber(achievement.metrics.accuracyPercentage * 100, language, { maximumFractionDigits: 0 })}%</span>
                          </div>
                        </>
                      )}
                      
                      {achievement.type === 'improvement' && (
                        <>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">{t('achievements.metrics.previousHandicap')}</span>
                            <span className="text-xl font-semibold">{formatNumber(achievement.metrics.previousHandicap, language, { maximumFractionDigits: 1 })}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">{t('achievements.metrics.newHandicap')}</span>
                            <span className="text-xl font-semibold">{formatNumber(achievement.metrics.newHandicap, language, { maximumFractionDigits: 1 })}</span>
                          </div>
                          <div className="flex flex-col col-span-2">
                            <span className="text-sm text-muted-foreground">{t('achievements.metrics.improvement')}</span>
                            <span className="text-xl font-semibold text-green-600">-{formatNumber(achievement.metrics.improvement, language, { maximumFractionDigits: 1 })}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {formatRelativeDate(achievement.date, undefined, language)}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => setShareAchievement(achievement)}
                    >
                      <Share className="h-4 w-4" />
                      {t('achievements.share')}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-muted rounded-full p-4 mb-4">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('achievements.noAchievements')}</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                {t('achievements.keepPlaying')}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Achievement Goals Section */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{t('achievements.goals.title')}</h2>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            {t('achievements.goals.createNew')}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Golf className="h-5 w-5 mr-2 text-primary" />
                {t('achievements.goals.handicap')}
              </CardTitle>
              <CardDescription>{t('achievements.goals.handicapDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-muted-foreground">{t('achievements.goals.currentHandicap')}</div>
                  <div className="text-2xl font-bold">15.1</div>
                </div>
                <div className="h-8 w-px bg-border mx-2"></div>
                <div>
                  <div className="text-sm text-muted-foreground">{t('achievements.goals.targetHandicap')}</div>
                  <div className="text-2xl font-bold">12.0</div>
                </div>
              </div>
              {/* Progress bar would go here */}
              <div className="w-full bg-muted rounded-full h-2.5 mt-4">
                <div className="bg-primary h-2.5 rounded-full w-[40%]"></div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full flex justify-between">
                {t('achievements.goals.viewDetails')}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Flag className="h-5 w-5 mr-2 text-primary" />
                {t('achievements.goals.score')}
              </CardTitle>
              <CardDescription>{t('achievements.goals.scoreDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-muted-foreground">{t('achievements.goals.averageScore')}</div>
                  <div className="text-2xl font-bold">85</div>
                </div>
                <div className="h-8 w-px bg-border mx-2"></div>
                <div>
                  <div className="text-sm text-muted-foreground">{t('achievements.goals.targetScore')}</div>
                  <div className="text-2xl font-bold">80</div>
                </div>
              </div>
              {/* Progress bar would go here */}
              <div className="w-full bg-muted rounded-full h-2.5 mt-4">
                <div className="bg-primary h-2.5 rounded-full w-[60%]"></div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full flex justify-between">
                {t('achievements.goals.viewDetails')}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                {t('achievements.goals.skillImprovement')}
              </CardTitle>
              <CardDescription>{t('achievements.goals.skillDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-muted-foreground">{t('achievements.goals.puttingAverage')}</div>
                  <div className="text-2xl font-bold">1.9</div>
                </div>
                <div className="h-8 w-px bg-border mx-2"></div>
                <div>
                  <div className="text-sm text-muted-foreground">{t('achievements.goals.targetPutting')}</div>
                  <div className="text-2xl font-bold">1.7</div>
                </div>
              </div>
              {/* Progress bar would go here */}
              <div className="w-full bg-muted rounded-full h-2.5 mt-4">
                <div className="bg-primary h-2.5 rounded-full w-[25%]"></div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full flex justify-between">
                {t('achievements.goals.viewDetails')}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Achievement sharing dialog */}
      {shareAchievement && (
        <AchievementShare
          title={shareAchievement.title}
          description={shareAchievement.description}
          date={shareAchievement.date}
          metrics={shareAchievement.metrics}
          achievementType={shareAchievement.type}
          onClose={() => setShareAchievement(null)}
        />
      )}
    </div>
  );
} 