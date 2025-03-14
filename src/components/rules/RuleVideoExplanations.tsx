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
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { 
  Search, 
  Play, 
  BookOpen, 
  Filter, 
  ChevronRight, 
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Video,
  Heart,
  Youtube,
  Bookmark
} from 'lucide-react';

// Types
interface RuleVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  category: VideoCategory;
  duration: string; // In format "MM:SS"
  expert: string;
  tags: string[];
  viewCount: number;
  isFeatured?: boolean;
  relatedRules: RelatedRule[];
}

interface RelatedRule {
  number: string;
  title: string;
  link: string;
}

enum VideoCategory {
  BASICS = 'basics',
  TEEING = 'teeing',
  FAIRWAY_PLAY = 'fairway_play',
  BUNKER_PLAY = 'bunker_play',
  PENALTY_AREAS = 'penalty_areas',
  PUTTING_GREEN = 'putting_green',
  ETIQUETTE = 'etiquette',
  TOURNAMENT_RULES = 'tournament_rules',
  SPECIAL_SITUATIONS = 'special_situations'
}

// Sample video data
const ruleVideos: RuleVideo[] = [
  {
    id: 'video-1',
    title: 'Understanding Penalty Areas (Water Hazards)',
    description: 'A comprehensive guide to penalty areas, including relief options and how to properly drop your ball after it enters a penalty area.',
    thumbnailUrl: '/images/videos/penalty-area-thumbnail.jpg',
    videoUrl: 'https://www.youtube.com/embed/exampleid1',
    category: VideoCategory.PENALTY_AREAS,
    duration: '5:24',
    expert: 'Sarah Johnson, PGA Rules Official',
    tags: ['penalty area', 'water hazard', 'red stakes', 'yellow stakes', 'dropping procedure'],
    viewCount: 12453,
    isFeatured: true,
    relatedRules: [
      {
        number: '17',
        title: 'Penalty Areas',
        link: 'https://www.randa.org/Rules/The-Rules-of-Golf/Rule-17'
      },
      {
        number: '14.3',
        title: 'Dropping a Ball in Relief Area',
        link: 'https://www.randa.org/Rules/The-Rules-of-Golf/Rule-14#14-3'
      }
    ]
  },
  {
    id: 'video-2',
    title: 'Bunker Rules: Common Mistakes to Avoid',
    description: 'Learn the most common mistakes players make when playing from bunkers and how to avoid unnecessary penalties.',
    thumbnailUrl: '/images/videos/bunker-rules-thumbnail.jpg',
    videoUrl: 'https://www.youtube.com/embed/exampleid2',
    category: VideoCategory.BUNKER_PLAY,
    duration: '4:37',
    expert: 'Mark Davis, European Tour Rules Official',
    tags: ['bunker', 'sand trap', 'unplayable', 'touching sand', 'loose impediments'],
    viewCount: 8721,
    isFeatured: false,
    relatedRules: [
      {
        number: '12',
        title: 'Bunkers',
        link: 'https://www.randa.org/Rules/The-Rules-of-Golf/Rule-12'
      }
    ]
  },
  {
    id: 'video-3',
    title: 'How to Take Proper Relief from Abnormal Course Conditions',
    description: 'This tutorial explains the correct procedures for taking relief from ground under repair, temporary water, and immovable obstructions.',
    thumbnailUrl: '/images/videos/relief-procedures-thumbnail.jpg',
    videoUrl: 'https://www.youtube.com/embed/exampleid3',
    category: VideoCategory.FAIRWAY_PLAY,
    duration: '6:12',
    expert: 'Robert Green, USGA Rules Expert',
    tags: ['abnormal course conditions', 'ground under repair', 'casual water', 'immovable obstruction', 'nearest point of relief'],
    viewCount: 7345,
    isFeatured: true,
    relatedRules: [
      {
        number: '16',
        title: 'Relief from Abnormal Course Conditions',
        link: 'https://www.randa.org/Rules/The-Rules-of-Golf/Rule-16'
      }
    ]
  },
  {
    id: 'video-4',
    title: 'Rules of the Putting Green Explained',
    description: 'Everything you need to know about the rules when on the putting green, including ball marking, repairing damage, and flagstick handling.',
    thumbnailUrl: '/images/videos/putting-green-rules-thumbnail.jpg',
    videoUrl: 'https://www.youtube.com/embed/exampleid4',
    category: VideoCategory.PUTTING_GREEN,
    duration: '5:48',
    expert: 'Jennifer Williams, R&A Rules Official',
    tags: ['putting green', 'ball marking', 'flagstick', 'repair damage', 'line of putt'],
    viewCount: 9876,
    isFeatured: false,
    relatedRules: [
      {
        number: '13',
        title: 'Putting Greens',
        link: 'https://www.randa.org/Rules/The-Rules-of-Golf/Rule-13'
      }
    ]
  },
  {
    id: 'video-5',
    title: 'When Your Ball is Lost or Out of Bounds',
    description: 'Learn the rules and procedures when your ball is lost or out of bounds, including the stroke-and-distance relief and the new local rule alternative.',
    thumbnailUrl: '/images/videos/lost-ball-thumbnail.jpg',
    videoUrl: 'https://www.youtube.com/embed/exampleid5',
    category: VideoCategory.BASICS,
    duration: '4:25',
    expert: 'David Thompson, PGA Professional',
    tags: ['lost ball', 'out of bounds', 'provisional ball', 'stroke and distance', 'local rule'],
    viewCount: 15243,
    isFeatured: true,
    relatedRules: [
      {
        number: '18',
        title: 'Stroke-and-Distance Relief; Ball Lost or Out of Bounds; Provisional Ball',
        link: 'https://www.randa.org/Rules/The-Rules-of-Golf/Rule-18'
      }
    ]
  },
  {
    id: 'video-6',
    title: 'Proper Etiquette on the Golf Course',
    description: 'A guide to proper golf etiquette, including pace of play, care for the course, and consideration for other players.',
    thumbnailUrl: '/images/videos/etiquette-thumbnail.jpg',
    videoUrl: 'https://www.youtube.com/embed/exampleid6',
    category: VideoCategory.ETIQUETTE,
    duration: '7:15',
    expert: 'Michael Anderson, Golf Instructor',
    tags: ['etiquette', 'pace of play', 'care for the course', 'consideration', 'sportsmanship'],
    viewCount: 6543,
    isFeatured: false,
    relatedRules: [
      {
        number: '1.2',
        title: 'Standards of Player Conduct',
        link: 'https://www.randa.org/Rules/The-Rules-of-Golf/Rule-1#1-2'
      }
    ]
  },
  {
    id: 'video-7',
    title: 'Understanding Free Relief Situations',
    description: 'Learn when you are entitled to free relief without penalty, including from movable obstructions, animal holes, and wrong greens.',
    thumbnailUrl: '/images/videos/free-relief-thumbnail.jpg',
    videoUrl: 'https://www.youtube.com/embed/exampleid7',
    category: VideoCategory.BASICS,
    duration: '5:32',
    expert: 'Lisa Parker, Rules Official',
    tags: ['free relief', 'movable obstruction', 'animal hole', 'wrong green', 'embedded ball'],
    viewCount: 8932,
    isFeatured: false,
    relatedRules: [
      {
        number: '15',
        title: 'Relief from Loose Impediments and Movable Obstructions',
        link: 'https://www.randa.org/Rules/The-Rules-of-Golf/Rule-15'
      },
      {
        number: '16',
        title: 'Relief from Abnormal Course Conditions',
        link: 'https://www.randa.org/Rules/The-Rules-of-Golf/Rule-16'
      }
    ]
  },
  {
    id: 'video-8',
    title: 'Tournament Rules You Need to Know',
    description: 'Essential rules and procedures specific to tournament play, including scorecard requirements, starting times, and playing in groups.',
    thumbnailUrl: '/images/videos/tournament-rules-thumbnail.jpg',
    videoUrl: 'https://www.youtube.com/embed/exampleid8',
    category: VideoCategory.TOURNAMENT_RULES,
    duration: '6:45',
    expert: 'Richard Wilson, Tournament Director',
    tags: ['tournament', 'scorecard', 'starting times', 'groupings', 'committee procedures'],
    viewCount: 5421,
    isFeatured: false,
    relatedRules: [
      {
        number: '3',
        title: 'The Competition',
        link: 'https://www.randa.org/Rules/The-Rules-of-Golf/Rule-3'
      },
      {
        number: '5.3',
        title: 'Starting and Ending Round',
        link: 'https://www.randa.org/Rules/The-Rules-of-Golf/Rule-5#5-3'
      }
    ]
  }
];

// Video categories mapping
const categoryMap = {
  [VideoCategory.BASICS]: 'Basics & Fundamentals',
  [VideoCategory.TEEING]: 'Teeing Ground Rules',
  [VideoCategory.FAIRWAY_PLAY]: 'Fairway Play',
  [VideoCategory.BUNKER_PLAY]: 'Bunker Play',
  [VideoCategory.PENALTY_AREAS]: 'Penalty Areas (Water Hazards)',
  [VideoCategory.PUTTING_GREEN]: 'Putting Green Rules',
  [VideoCategory.ETIQUETTE]: 'Golf Etiquette',
  [VideoCategory.TOURNAMENT_RULES]: 'Tournament Rules',
  [VideoCategory.SPECIAL_SITUATIONS]: 'Special Situations'
};

export const RuleVideoExplanations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<RuleVideo | null>(null);
  const [activeCategory, setActiveCategory] = useState<VideoCategory | 'all'>('all');
  const [savedVideos, setSavedVideos] = useState<string[]>([]);
  
  // Filter videos based on search term and active category
  const filteredVideos = ruleVideos.filter(video => {
    const matchesSearch = searchTerm === '' || 
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesCategory = activeCategory === 'all' || video.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Get featured videos
  const featuredVideos = ruleVideos.filter(video => video.isFeatured);
  
  // Handle video selection
  const handleSelectVideo = (video: RuleVideo) => {
    setSelectedVideo(video);
  };
  
  // Handle going back to video list
  const handleBackToList = () => {
    setSelectedVideo(null);
  };
  
  // Handle saving a video
  const handleSaveVideo = (videoId: string) => {
    if (savedVideos.includes(videoId)) {
      setSavedVideos(savedVideos.filter(id => id !== videoId));
    } else {
      setSavedVideos([...savedVideos, videoId]);
    }
  };
  
  // Format view count
  const formatViewCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M views`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K views`;
    } else {
      return `${count} views`;
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Golf Rules Video Explanations
        </CardTitle>
        <CardDescription>
          Watch expert explanations of golf rules with practical demonstrations
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {selectedVideo ? (
          // Video Detail View
          <div className="space-y-6">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBackToList}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to videos
              </Button>
            </div>
            
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
              <iframe 
                className="w-full h-full" 
                src={selectedVideo.videoUrl} 
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">{selectedVideo.title}</h2>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span>{formatViewCount(selectedVideo.viewCount)}</span>
                  <span>{selectedVideo.duration}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSaveVideo(selectedVideo.id)}
                  className={savedVideos.includes(selectedVideo.id) ? "text-primary" : ""}
                >
                  {savedVideos.includes(selectedVideo.id) ? (
                    <Bookmark className="h-4 w-4 mr-1 fill-primary" />
                  ) : (
                    <Bookmark className="h-4 w-4 mr-1" />
                  )}
                  {savedVideos.includes(selectedVideo.id) ? "Saved" : "Save"}
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex items-start gap-4">
                <Badge variant="outline" className="mt-1">
                  {categoryMap[selectedVideo.category]}
                </Badge>
                <div>
                  <p className="text-muted-foreground mb-4">
                    {selectedVideo.description}
                  </p>
                  <p className="text-sm font-medium">Expert: {selectedVideo.expert}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                <BookOpen className="h-4 w-4" />
                Related Rules
              </h3>
              <ul className="space-y-2">
                {selectedVideo.relatedRules.map((rule) => (
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
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Related Videos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ruleVideos
                  .filter(video => 
                    video.id !== selectedVideo.id && 
                    (video.category === selectedVideo.category || 
                     video.tags.some(tag => selectedVideo.tags.includes(tag)))
                  )
                  .slice(0, 2)
                  .map((video) => (
                    <div 
                      key={video.id} 
                      className="flex gap-3 border rounded-lg p-3 cursor-pointer hover:bg-muted"
                      onClick={() => handleSelectVideo(video)}
                    >
                      <div 
                        className="relative w-24 h-16 bg-muted rounded-md flex-shrink-0 overflow-hidden"
                        style={{ backgroundImage: `url(${video.thumbnailUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black/60 rounded-full p-1">
                            <Play className="h-4 w-4 text-white" fill="white" />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2">{video.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{video.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
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
            </div>
          </div>
        ) : (
          // Video List View
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for rules videos..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2 whitespace-nowrap">
              <Button 
                variant={activeCategory === 'all' ? "default" : "outline"} 
                size="sm" 
                onClick={() => setActiveCategory('all')}
              >
                All Videos
              </Button>
              {Object.entries(categoryMap).map(([category, label]) => (
                <Button 
                  key={category} 
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category as VideoCategory)}
                >
                  {label}
                </Button>
              ))}
            </div>
            
            {searchTerm === '' && activeCategory === 'all' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" />
                  Featured Videos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featuredVideos.map((video) => (
                    <div 
                      key={video.id} 
                      className="border rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handleSelectVideo(video)}
                    >
                      <div 
                        className="aspect-video bg-muted relative"
                        style={{ backgroundImage: `url(${video.thumbnailUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black/60 rounded-full p-2">
                            <Play className="h-5 w-5 text-white" fill="white" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                          {video.duration}
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium line-clamp-1">{video.title}</h3>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline" className="text-xs">
                            {categoryMap[video.category]}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatViewCount(video.viewCount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                {searchTerm !== '' ? (
                  <>
                    <Search className="h-4 w-4" />
                    Search Results 
                    <span className="text-sm font-normal text-muted-foreground">
                      ({filteredVideos.length} videos)
                    </span>
                  </>
                ) : activeCategory !== 'all' ? (
                  <>
                    <Filter className="h-4 w-4" />
                    {categoryMap[activeCategory as VideoCategory]} 
                    <span className="text-sm font-normal text-muted-foreground">
                      ({filteredVideos.length} videos)
                    </span>
                  </>
                ) : (
                  <>
                    <Youtube className="h-4 w-4" />
                    All Videos
                  </>
                )}
              </h3>

              {filteredVideos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {filteredVideos.map((video) => (
                    <div 
                      key={video.id} 
                      className="border rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handleSelectVideo(video)}
                    >
                      <div 
                        className="aspect-video bg-muted relative"
                        style={{ backgroundImage: `url(${video.thumbnailUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black/60 rounded-full p-2">
                            <Play className="h-5 w-5 text-white" fill="white" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                          {video.duration}
                        </div>
                        {savedVideos.includes(video.id) && (
                          <div className="absolute top-2 right-2">
                            <Bookmark className="h-4 w-4 fill-primary text-primary" />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium line-clamp-2">{video.title}</h3>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline" className="text-xs">
                            {categoryMap[video.category]}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatViewCount(video.viewCount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 border rounded-lg">
                  <Video className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-1">No videos found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try a different search term or category
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex items-center justify-between text-sm text-muted-foreground">
        <div>Videos sourced from official golf organizations</div>
        <Button variant="link" className="h-auto p-0" size="sm">
          Submit video suggestion
        </Button>
      </CardFooter>
    </Card>
  );
}; 