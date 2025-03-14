'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { 
  Droplet, 
  Search, 
  Play, 
  Bookmark, 
  History, 
  ChevronRight, 
  Pencil, 
  Map,
  Info,
  ThumbsUp,
  ThumbsDown,
  Share2,
  HelpCircle,
  SparkleIcon,
  LifeBuoy
} from 'lucide-react';

// Types
interface RuleSituation {
  id: string;
  title: string;
  category: RuleCategory;
  description: string;
  options: RuleOption[];
  videoUrl?: string;
  illustration?: string;
  officialRules: OfficialRule[];
  tags: string[];
  difficulty: 'basic' | 'intermediate' | 'advanced';
}

interface RuleOption {
  id: string;
  title: string;
  description: string;
  procedure: string[];
  penalty: string;
  isRecommended?: boolean;
}

interface OfficialRule {
  number: string;
  title: string;
  link: string;
}

enum RuleCategory {
  GENERAL = 'general',
  TEEING = 'teeing',
  FAIRWAY = 'fairway',
  BUNKER = 'bunker',
  WATER_HAZARD = 'water_hazard',
  GREEN = 'green',
  EQUIPMENT = 'equipment',
  PENALTIES = 'penalties',
  SCORING = 'scoring',
  ETIQUETTE = 'etiquette',
  COMPETITION = 'competition'
}

// Sample data for common on-course situations
const ruleSituations: RuleSituation[] = [
  {
    id: 'situation-1',
    title: 'Ball in water hazard (penalty area)',
    category: RuleCategory.WATER_HAZARD,
    description: 'Your ball has entered a water hazard (now called a penalty area), which is marked with either yellow or red stakes and/or lines.',
    options: [
      {
        id: 'option-1-1',
        title: 'Play the ball as it lies',
        description: 'If the ball is playable within the penalty area, you may play it as it lies without a penalty.',
        procedure: [
          'You may ground your club (including in a practice swing)',
          'You may remove loose impediments',
          'You may touch the ground or water with your hand or club',
          'You may not build a stance'
        ],
        penalty: 'No penalty',
        isRecommended: false
      },
      {
        id: 'option-1-2',
        title: 'Stroke and distance relief',
        description: 'You may take stroke-and-distance relief by going back to where you last played from.',
        procedure: [
          'Return to the spot where you last played from',
          'Add one penalty stroke to your score',
          'Play another ball from that spot'
        ],
        penalty: 'One stroke penalty',
        isRecommended: true
      },
      {
        id: 'option-1-3',
        title: 'Back-on-the-line relief',
        description: 'For both yellow and red penalty areas, you may take back-on-the-line relief.',
        procedure: [
          'Identify where your ball last crossed the edge of the penalty area',
          'Pick a reference point on a line going straight back from the hole through that point',
          'Drop a ball anywhere on that line behind the penalty area',
          'Add one penalty stroke to your score'
        ],
        penalty: 'One stroke penalty',
        isRecommended: false
      },
      {
        id: 'option-1-4',
        title: 'Lateral relief (red penalty area only)',
        description: 'For red penalty areas only, you may take lateral relief within two club-lengths of where the ball last crossed the edge of the penalty area.',
        procedure: [
          'Identify where your ball last crossed the edge of the penalty area',
          'Measure two club-lengths from that point, no nearer to the hole',
          'Drop a ball within that area',
          'Add one penalty stroke to your score'
        ],
        penalty: 'One stroke penalty',
        isRecommended: false
      }
    ],
    officialRules: [
      {
        number: '17.1',
        title: 'Options for Ball in Penalty Area',
        link: 'https://www.randa.org/Rules/The-Rules-of-Golf/Rule-17#17-1'
      }
    ],
    tags: ['water hazard', 'penalty area', 'red stakes', 'yellow stakes', 'lateral relief'],
    difficulty: 'basic'
  },
  {
    id: 'situation-2',
    title: 'Ball in bunker partially filled with temporary water',
    category: RuleCategory.BUNKER,
    description: 'Your ball is in a bunker that has temporary water (casual water) in it, affecting your stance or the lie of your ball.',
    options: [
      {
        id: 'option-2-1',
        title: 'Play the ball as it lies',
        description: 'You can play the ball as it lies, even from temporary water.',
        procedure: [
          'Address the ball as normal',
          'Make your stroke'
        ],
        penalty: 'No penalty',
        isRecommended: false
      },
      {
        id: 'option-2-2',
        title: 'Free relief in the bunker',
        description: 'You may take free relief from the temporary water within the bunker.',
        procedure: [
          'Find the nearest point of complete relief in the bunker',
          'Drop a ball within one club-length of that point, not nearer the hole',
          'The ball must remain in the bunker'
        ],
        penalty: 'No penalty',
        isRecommended: true
      },
      {
        id: 'option-2-3',
        title: 'Back-on-the-line relief outside the bunker',
        description: 'You may take back-on-the-line relief outside the bunker by going back as far as you want on a straight line from the hole through the spot of your original ball.',
        procedure: [
          'Pick a reference point on a line going straight back from the hole through the spot of your original ball',
          'Drop a ball outside the bunker on that line, as far back as you want',
          'Add two penalty strokes to your score'
        ],
        penalty: 'Two stroke penalty',
        isRecommended: false
      }
    ],
    officialRules: [
      {
        number: '16.1c',
        title: 'Relief for Ball in Bunker',
        link: 'https://www.randa.org/Rules/The-Rules-of-Golf/Rule-16#16-1c'
      }
    ],
    tags: ['bunker', 'sand trap', 'casual water', 'temporary water'],
    difficulty: 'intermediate'
  },
  {
    id: 'situation-3',
    title: 'Ball is unplayable',
    category: RuleCategory.GENERAL,
    description: 'Your ball is in a position where you decide it is unplayable (e.g., against a tree or in a bush).',
    options: [
      {
        id: 'option-3-1',
        title: 'Stroke and distance relief',
        description: 'You may take stroke-and-distance relief by going back to where you last played from.',
        procedure: [
          'Return to the spot where you last played from',
          'Add one penalty stroke to your score',
          'Play another ball from that spot'
        ],
        penalty: 'One stroke penalty',
        isRecommended: false
      },
      {
        id: 'option-3-2',
        title: 'Back-on-the-line relief',
        description: 'You may take back-on-the-line relief by going back as far as you want on a straight line from the hole through the spot of your original ball.',
        procedure: [
          'Pick a reference point on a line going straight back from the hole through the spot of your original ball',
          'Drop a ball on that line, as far back as you want',
          'Add one penalty stroke to your score'
        ],
        penalty: 'One stroke penalty',
        isRecommended: false
      },
      {
        id: 'option-3-3',
        title: 'Lateral relief',
        description: 'You may take lateral relief within two club-lengths of where the ball lies, not nearer the hole.',
        procedure: [
          'Identify where your ball lies',
          'Measure two club-lengths from that point, no nearer to the hole',
          'Drop a ball within that area',
          'Add one penalty stroke to your score'
        ],
        penalty: 'One stroke penalty',
        isRecommended: true
      }
    ],
    officialRules: [
      {
        number: '19',
        title: 'Unplayable Ball',
        link: 'https://www.randa.org/Rules/The-Rules-of-Golf/Rule-19'
      }
    ],
    tags: ['unplayable', 'tree', 'bush', 'relief'],
    difficulty: 'basic'
  },
  {
    id: 'situation-4',
    title: 'Ball moved during search',
    category: RuleCategory.GENERAL,
    description: 'You or your caddie accidentally moved your ball while searching for it.',
    options: [
      {
        id: 'option-4-1',
        title: 'Replace the ball',
        description: 'If you accidentally move your ball while searching for it, there is no penalty, but you must replace the ball in its original spot.',
        procedure: [
          'Replace the ball on its original spot (or estimated spot if not known exactly)',
          'If the original lie was altered, restore the lie as close as possible'
        ],
        penalty: 'No penalty',
        isRecommended: true
      }
    ],
    officialRules: [
      {
        number: '7.4',
        title: 'Ball Accidentally Moved in Trying to Find or Identify It',
        link: 'https://www.randa.org/Rules/The-Rules-of-Golf/Rule-7#7-4'
      }
    ],
    tags: ['moved ball', 'search', 'accident'],
    difficulty: 'basic'
  },
  {
    id: 'situation-5',
    title: 'Ball deflected by outside influence',
    category: RuleCategory.GENERAL,
    description: 'Your ball in motion is accidentally deflected by a person, animal, or another outside influence.',
    options: [
      {
        id: 'option-5-1',
        title: 'Play the ball as it lies',
        description: 'When your ball is deflected by an outside influence, you must play it from where it comes to rest.',
        procedure: [
          'Accept the outcome, good or bad',
          'Play the ball from its new position'
        ],
        penalty: 'No penalty',
        isRecommended: true
      }
    ],
    officialRules: [
      {
        number: '11.1',
        title: 'Ball in Motion Accidentally Hits Person or Outside Influence',
        link: 'https://www.randa.org/Rules/The-Rules-of-Golf/Rule-11#11-1'
      }
    ],
    tags: ['deflection', 'outside influence', 'animal', 'spectator'],
    difficulty: 'intermediate'
  },
  {
    id: 'situation-6',
    title: 'Ball embedded in the ground',
    category: RuleCategory.FAIRWAY,
    description: 'Your ball is embedded in its own pitch mark in the general area (which includes fairways and rough, but not bunkers or penalty areas).',
    options: [
      {
        id: 'option-6-1',
        title: 'Play the ball as it lies',
        description: 'You can play the ball as it is, embedded in the ground.',
        procedure: [
          'Address the ball as normal',
          'Make your stroke'
        ],
        penalty: 'No penalty',
        isRecommended: false
      },
      {
        id: 'option-6-2',
        title: 'Take free relief',
        description: 'You may take free relief from an embedded ball in the general area.',
        procedure: [
          'Mark the spot directly behind the ball',
          'Lift the ball',
          'Drop a ball within one club-length of that spot, not nearer the hole',
          'The ball must be dropped in and come to rest in the general area'
        ],
        penalty: 'No penalty',
        isRecommended: true
      }
    ],
    officialRules: [
      {
        number: '16.3',
        title: 'Embedded Ball',
        link: 'https://www.randa.org/Rules/The-Rules-of-Golf/Rule-16#16-3'
      }
    ],
    tags: ['embedded', 'pitch mark', 'plugged', 'mud ball'],
    difficulty: 'basic'
  },
  {
    id: 'situation-7',
    title: 'Ball on wrong green',
    category: RuleCategory.GREEN,
    description: 'Your ball comes to rest on a wrong putting green (not the green of the hole you are playing).',
    options: [
      {
        id: 'option-7-1',
        title: 'Take mandatory free relief',
        description: 'You must take free relief when your ball is on a wrong putting green. You may not play the ball as it lies.',
        procedure: [
          'Find the nearest point of complete relief off the wrong green',
          'Drop a ball within one club-length of that point, not nearer the hole',
          'The ball must be dropped in and come to rest in the general area'
        ],
        penalty: 'No penalty',
        isRecommended: true
      }
    ],
    officialRules: [
      {
        number: '13.1f',
        title: 'Relief Must Be Taken from Wrong Green',
        link: 'https://www.randa.org/Rules/The-Rules-of-Golf/Rule-13#13-1f'
      }
    ],
    tags: ['wrong green', 'putting green', 'mandatory relief'],
    difficulty: 'basic'
  },
  {
    id: 'situation-8',
    title: 'Ball in ground under repair',
    category: RuleCategory.GENERAL,
    description: 'Your ball is in ground under repair (an area marked with white lines or otherwise designated as GUR).',
    options: [
      {
        id: 'option-8-1',
        title: 'Play the ball as it lies',
        description: 'You can play the ball from ground under repair if you choose.',
        procedure: [
          'Address the ball as normal',
          'Make your stroke'
        ],
        penalty: 'No penalty',
        isRecommended: false
      },
      {
        id: 'option-8-2',
        title: 'Take free relief',
        description: 'You may take free relief from ground under repair.',
        procedure: [
          'Find the nearest point of complete relief outside the ground under repair',
          'Drop a ball within one club-length of that point, not nearer the hole',
          'The ball must be dropped in and come to rest in the same area of the course as the nearest point of complete relief'
        ],
        penalty: 'No penalty',
        isRecommended: true
      }
    ],
    officialRules: [
      {
        number: '16.1',
        title: 'Abnormal Course Conditions (Including Immovable Obstructions)',
        link: 'https://www.randa.org/Rules/The-Rules-of-Golf/Rule-16#16-1'
      }
    ],
    tags: ['ground under repair', 'GUR', 'abnormal course condition'],
    difficulty: 'basic'
  }
];

// Popular situations
const popularSituations = [
  'Ball in water hazard (penalty area)',
  'Ball in bunker partially filled with temporary water',
  'Ball is unplayable',
  'Ball moved during search',
  'Ball on wrong green',
];

export const SituationRulesEngine = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSituation, setSelectedSituation] = useState<RuleSituation | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>('browse');
  
  // Filter situations based on search term
  const filteredSituations = ruleSituations.filter(situation => {
    const searchLower = searchTerm.toLowerCase();
    return (
      situation.title.toLowerCase().includes(searchLower) ||
      situation.description.toLowerCase().includes(searchLower) ||
      situation.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });
  
  // Handle situation selection
  const handleSelectSituation = (situation: RuleSituation) => {
    setSelectedSituation(situation);
    
    // Add to recently viewed
    setRecentlyViewed(prev => {
      const newRecent = [situation.title, ...prev.filter(item => item !== situation.title)].slice(0, 5);
      return newRecent;
    });
  };
  
  // Handle clearing selection to go back to search
  const handleBackToSearch = () => {
    setSelectedSituation(null);
  };
  
  // Handle popular situation click
  const handlePopularSituationClick = (title: string) => {
    const situation = ruleSituations.find(s => s.title === title);
    if (situation) {
      handleSelectSituation(situation);
    }
  };
  
  // Handle recent situation click
  const handleRecentSituationClick = (title: string) => {
    const situation = ruleSituations.find(s => s.title === title);
    if (situation) {
      handleSelectSituation(situation);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LifeBuoy className="h-5 w-5" />
          Golf Rules Situation Helper
        </CardTitle>
        <CardDescription>
          Find rules guidance for common on-course situations
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {selectedSituation ? (
          // Situation Detail View
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBackToSearch}
                className="flex items-center"
              >
                <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
                Back to search
              </Button>
              
              <Badge variant="outline">
                {selectedSituation.category.charAt(0).toUpperCase() + 
                  selectedSituation.category.slice(1).toLowerCase().replace('_', ' ')}
              </Badge>
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-2">{selectedSituation.title}</h2>
              <p className="text-muted-foreground">{selectedSituation.description}</p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Your Options</h3>
              
              {selectedSituation.options.map((option) => (
                <div 
                  key={option.id} 
                  className={`border rounded-lg p-4 ${option.isRecommended ? 'border-primary' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{option.title}</h4>
                        {option.isRecommended && (
                          <Badge className="bg-primary hover:bg-primary">Recommended</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 mb-3">{option.description}</p>
                    </div>
                    
                    <Badge variant={option.penalty === 'No penalty' ? 'outline' : 'destructive'}>
                      {option.penalty}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <h5 className="text-sm font-medium">Procedure:</h5>
                    <ul className="space-y-1 ml-5 list-disc">
                      {option.procedure.map((step, index) => (
                        <li key={index} className="text-sm">{step}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
                <Info className="h-4 w-4" />
                Official Rules Reference
              </h3>
              <ul className="space-y-2">
                {selectedSituation.officialRules.map((rule) => (
                  <li key={rule.number} className="text-sm">
                    <a 
                      href={rule.link} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-primary hover:underline"
                    >
                      Rule {rule.number}: {rule.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex justify-between text-sm border-t pt-4">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="h-7 px-3">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Helpful
                </Button>
                <Button variant="ghost" size="sm" className="h-7 px-3">
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  Not Helpful
                </Button>
              </div>
              <div>
                <Button variant="ghost" size="sm" className="h-7 px-3">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Search and Browse View
          <div>
            <div className="relative mb-6">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for a situation (e.g., ball in water hazard)"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="browse">Browse</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
              </TabsList>
              
              <TabsContent value="browse" className="space-y-6">
                {searchTerm ? (
                  // Search Results
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Search Results ({filteredSituations.length})</h3>
                    {filteredSituations.length > 0 ? (
                      <ScrollArea className="h-[400px]">
                        <div className="space-y-2">
                          {filteredSituations.map((situation) => (
                            <div
                              key={situation.id}
                              className="border rounded-md p-3 hover:bg-muted cursor-pointer"
                              onClick={() => handleSelectSituation(situation)}
                            >
                              <div className="flex justify-between items-start">
                                <h3 className="font-medium">{situation.title}</h3>
                                <Badge variant="outline" className="ml-2">
                                  {situation.difficulty}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {situation.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="text-center py-8">
                        <HelpCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <h3 className="text-lg font-medium mb-1">No results found</h3>
                        <p className="text-sm text-muted-foreground">
                          Try a different search term or browse by category
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  // Default Browse View
                  <>
                    {/* Popular Situations */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium flex items-center gap-1">
                        <SparkleIcon className="h-4 w-4" />
                        Popular Situations
                      </h3>
                      <div className="space-y-2">
                        {popularSituations.map((title) => (
                          <div
                            key={title}
                            className="border rounded-md p-3 hover:bg-muted cursor-pointer"
                            onClick={() => handlePopularSituationClick(title)}
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium">{title}</h4>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Recently Viewed */}
                    {recentlyViewed.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium flex items-center gap-1">
                          <History className="h-4 w-4" />
                          Recently Viewed
                        </h3>
                        <div className="space-y-2">
                          {recentlyViewed.map((title) => (
                            <div
                              key={title}
                              className="border rounded-md p-3 hover:bg-muted cursor-pointer"
                              onClick={() => handleRecentSituationClick(title)}
                            >
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium">{title}</h4>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* All Situations */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">All Situations</h3>
                      <ScrollArea className="h-[300px]">
                        <div className="space-y-2">
                          {ruleSituations.map((situation) => (
                            <div
                              key={situation.id}
                              className="border rounded-md p-3 hover:bg-muted cursor-pointer"
                              onClick={() => handleSelectSituation(situation)}
                            >
                              <div className="flex justify-between items-start">
                                <h3 className="font-medium">{situation.title}</h3>
                                <Badge variant="outline" className="ml-2">
                                  {situation.difficulty}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {situation.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="categories" className="space-y-4">
                <h3 className="text-sm font-medium">Browse by Category</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.values(RuleCategory).map((category) => {
                    const count = ruleSituations.filter(s => s.category === category).length;
                    const categoryName = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase().replace('_', ' ');
                    
                    return (
                      <div 
                        key={category}
                        className="border rounded-md p-3 hover:bg-muted cursor-pointer"
                        onClick={() => setSearchTerm(categoryName)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{categoryName}</span>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <h3 className="text-sm font-medium mt-6">Browse by Difficulty</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['basic', 'intermediate', 'advanced'].map((difficulty) => {
                    const count = ruleSituations.filter(s => s.difficulty === difficulty).length;
                    
                    return (
                      <div 
                        key={difficulty}
                        className="border rounded-md p-3 hover:bg-muted cursor-pointer"
                        onClick={() => setSearchTerm(difficulty)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium capitalize">{difficulty}</span>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex items-center justify-between text-sm text-muted-foreground">
        <div>Based on the Official Rules of Golf</div>
        <Button variant="link" className="h-auto p-0" size="sm">
          Submit a Situation
        </Button>
      </CardFooter>
    </Card>
  );
}; 