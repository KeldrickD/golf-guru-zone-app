'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/Tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { 
  Share2, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Copy, 
  MessageSquare, 
  CheckCircle2, 
  Circle,
  Trophy,
  BadgeCheck
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";

// Sample data types
interface Round {
  id: string;
  date: string;
  course: string;
  score: number;
  par: number;
  notes: string;
  image?: string;
}

interface Equipment {
  id: string;
  name: string;
  type: string;
  brand: string;
  model: string;
  image?: string;
  notes: string;
}

interface Achievement {
  id: string;
  title: string;
  date: string;
  description: string;
  image?: string;
  badge: string;
}

// Mock data
const mockRounds: Round[] = [
  {
    id: '1',
    date: '2023-10-15',
    course: 'Pine Valley Golf Club',
    score: 82,
    par: 72,
    notes: 'Great round with perfect weather conditions. Hit 9 fairways and 11 greens.',
    image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '2',
    date: '2023-09-30',
    course: 'Augusta National',
    score: 88,
    par: 72,
    notes: 'Challenging day but enjoyed the experience. Struggled with bunker shots.',
    image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop'
  },
];

const mockEquipment: Equipment[] = [
  {
    id: '1',
    name: 'My Driver Setup',
    type: 'Driver',
    brand: 'TaylorMade',
    model: 'Stealth 2',
    notes: 'Recently adjusted to 9.5° with a stiff shaft. Seeing great distance improvements.',
    image: 'https://images.unsplash.com/photo-1622398925373-3f91b1ff806c?q=80&w=2069&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Iron Collection',
    type: 'Irons',
    brand: 'Callaway',
    model: 'Apex Pro',
    notes: 'Full set 4-PW with KBS Tour shafts. Custom fitted last month.',
    image: 'https://images.unsplash.com/photo-1560329072-17f59dcd30a4?q=80&w=2073&auto=format&fit=crop'
  },
];

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Eagle',
    date: '2023-10-01',
    description: 'Scored my first eagle on a par 5 at Pebble Beach. Hit a great drive and a 3-wood to 15 feet, then sank the putt!',
    image: 'https://images.unsplash.com/photo-1530036846422-afb4b7af2fd4?q=80&w=2069&auto=format&fit=crop',
    badge: 'eagle'
  },
  {
    id: '2',
    title: 'Breaking 80',
    date: '2023-08-15',
    description: 'Shot a 78 at my local course for the first time ever. Finally broke 80 after years of trying!',
    image: 'https://images.unsplash.com/photo-1500932334442-8761ee4810a7?q=80&w=2070&auto=format&fit=crop',
    badge: 'score'
  },
];

const platforms = [
  { name: 'Facebook', icon: Facebook },
  { name: 'Twitter', icon: Twitter },
  { name: 'Instagram', icon: Instagram },
  { name: 'LinkedIn', icon: Linkedin },
  { name: 'Copy Link', icon: Copy },
  { name: 'Message', icon: MessageSquare },
];

export const SocialSharing = () => {
  const [selectedContent, setSelectedContent] = useState<Round | Equipment | Achievement | null>(null);
  const [activeTab, setActiveTab] = useState('rounds');
  const [customMessage, setCustomMessage] = useState('');
  const [sharedSuccessfully, setSharedSuccessfully] = useState(false);
  
  const handleShare = (platform: string) => {
    console.log(`Sharing to ${platform}:`, { 
      content: selectedContent, 
      message: customMessage 
    });
    
    // In a real app, this would integrate with social media APIs
    
    // Show success message
    setSharedSuccessfully(true);
    setTimeout(() => setSharedSuccessfully(false), 3000);
  };
  
  const renderContentPreview = () => {
    if (!selectedContent) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
          <Share2 className="h-16 w-16 mb-4 opacity-30" />
          <p>Select content from the tabs above to share it</p>
        </div>
      );
    }
    
    if ('score' in selectedContent) {
      // It's a Round
      const round = selectedContent as Round;
      return (
        <Card className="overflow-hidden border-dashed">
          {round.image && (
            <div className="aspect-video w-full overflow-hidden">
              <img 
                src={round.image} 
                alt={`Round at ${round.course}`} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardHeader>
            <div className="flex items-center gap-2">
              <Circle className="text-primary h-5 w-5 fill-current" />
              <CardTitle>Golf Round</CardTitle>
            </div>
            <CardDescription>{round.course} • {new Date(round.date).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-lg font-bold mb-4">
              <span>Score: {round.score}</span>
              <span>{round.score > round.par ? `+${round.score - round.par}` : round.score < round.par ? `-${round.par - round.score}` : 'E'}</span>
            </div>
            <p className="text-sm text-muted-foreground">{round.notes}</p>
          </CardContent>
        </Card>
      );
    } else if ('brand' in selectedContent) {
      // It's Equipment
      const equipment = selectedContent as Equipment;
      return (
        <Card className="overflow-hidden border-dashed">
          {equipment.image && (
            <div className="aspect-video w-full overflow-hidden">
              <img 
                src={equipment.image} 
                alt={equipment.name} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardHeader>
            <div className="flex items-center gap-2">
              <BadgeCheck className="text-primary h-5 w-5" />
              <CardTitle>{equipment.name}</CardTitle>
            </div>
            <CardDescription>{equipment.brand} {equipment.model} • {equipment.type}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{equipment.notes}</p>
          </CardContent>
        </Card>
      );
    } else {
      // It's an Achievement
      const achievement = selectedContent as Achievement;
      return (
        <Card className="overflow-hidden border-dashed">
          {achievement.image && (
            <div className="aspect-video w-full overflow-hidden">
              <img 
                src={achievement.image} 
                alt={achievement.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="text-primary h-5 w-5" />
              <CardTitle>{achievement.title}</CardTitle>
            </div>
            <CardDescription>{new Date(achievement.date).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{achievement.description}</p>
          </CardContent>
        </Card>
      );
    }
  };
  
  const getContentItems = () => {
    switch (activeTab) {
      case 'rounds':
        return mockRounds;
      case 'equipment':
        return mockEquipment;
      case 'achievements':
        return mockAchievements;
      default:
        return [];
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-6 w-6 text-primary" />
          Social Sharing
        </CardTitle>
        <CardDescription>
          Share your rounds, equipment setups, and achievements with your golfing network
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="rounds" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="rounds" className="flex items-center gap-2">
              <Circle className="h-4 w-4 fill-current" />
              Rounds
            </TabsTrigger>
            <TabsTrigger value="equipment" className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4" />
              Equipment
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Achievements
            </TabsTrigger>
          </TabsList>
          
          {['rounds', 'equipment', 'achievements'].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getContentItems().map((item) => (
                  <Card 
                    key={item.id}
                    className={`cursor-pointer transition-all overflow-hidden ${
                      selectedContent?.id === item.id ? 'border-primary ring-1 ring-primary' : 'hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedContent(item)}
                  >
                    {'image' in item && item.image ? (
                      <div className="aspect-video w-full overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={'title' in item ? item.title : 'name' in item ? item.name : item.course} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : null}
                    <CardContent className="p-4">
                      <h3 className="font-medium">
                        {'course' in item ? item.course : 'name' in item ? item.name : item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {'score' in item ? `Score: ${item.score}` : 
                         'brand' in item ? `${item.brand} ${item.model}` : 
                         new Date(item.date).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Preview</h3>
            {renderContentPreview()}
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Share</h3>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Add a message (optional)</label>
                  <Textarea 
                    placeholder="Write something about this..."
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="resize-none"
                  />
                </div>
                
                <div className="pt-4">
                  <h4 className="text-sm font-medium mb-3">Share to</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {platforms.map((platform) => (
                      <Button 
                        key={platform.name}
                        variant="outline" 
                        className="flex flex-col items-center justify-center py-3 h-auto gap-2"
                        onClick={() => handleShare(platform.name)}
                        disabled={!selectedContent}
                      >
                        <platform.icon className="h-5 w-5" />
                        <span className="text-xs">{platform.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                
                {sharedSuccessfully && (
                  <div className="flex items-center gap-2 p-2 mt-4 bg-green-50 text-green-700 rounded">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm">Shared successfully!</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 