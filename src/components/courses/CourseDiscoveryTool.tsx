'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Checkbox } from '@/components/ui/Checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import {
  MapPin,
  Search,
  Filter,
  Star,
  Clock,
  Trophy,
  Users,
  Bookmark,
  BookmarkCheck,
  Flag,
  FlagOff,
  Info,
  Heart,
  Share2,
  Locate,
} from 'lucide-react';
import Link from 'next/link';

// Types
export interface Course {
  id: string;
  name: string;
  location: string;
  description: string;
  rating: number;
  reviewCount: number;
  par: number;
  length: number;
  difficultyRatings: DifficultyRatings;
  type: string;
  image: string;
  latitude?: number;
  longitude?: number;
  distance?: number; // Distance from user in miles
  friendsPlayed?: FriendActivity[];
  amenities?: string[];
}

interface DifficultyRatings {
  beginner: number; // 1-10 scale
  intermediate: number;
  advanced: number;
  senior: number;
}

interface FriendActivity {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  comment?: string;
}

// Mock courses data with extended information
const mockCourses: Course[] = [
  {
    id: 'pine-valley',
    name: 'Pine Valley Golf Club',
    location: 'Pine Valley, NJ',
    description: 'Consistently ranked as one of the top golf courses in the world.',
    rating: 4.9,
    reviewCount: 256,
    par: 72,
    length: 7057,
    difficultyRatings: {
      beginner: 9.8,
      intermediate: 8.5,
      advanced: 7.2,
      senior: 9.3
    },
    type: 'Private',
    image: '/images/mock/course1.jpg',
    latitude: 39.7940,
    longitude: -74.9006,
    friendsPlayed: [
      {
        id: 'user1',
        name: 'Alex Johnson',
        avatar: '/images/avatars/alex.jpg',
        rating: 4.7,
        date: '2023-10-15',
        comment: 'Challenging but rewarding. One of my favorite courses ever.'
      },
      {
        id: 'user2',
        name: 'Sarah Miller',
        avatar: '/images/avatars/sarah.jpg',
        rating: 5.0,
        date: '2023-11-20'
      }
    ],
    amenities: ['Pro Shop', 'Clubhouse', 'Restaurant', 'Practice Facility']
  },
  {
    id: 'pebble-beach',
    name: 'Pebble Beach Golf Links',
    location: 'Pebble Beach, CA',
    description: 'Famous for its stunning coastal views and challenging layout.',
    rating: 4.8,
    reviewCount: 328,
    par: 72,
    length: 6828,
    difficultyRatings: {
      beginner: 9.0,
      intermediate: 7.8,
      advanced: 6.5,
      senior: 8.7
    },
    type: 'Public',
    image: '/images/mock/course2.jpg',
    latitude: 36.5725,
    longitude: -121.9486,
    friendsPlayed: [
      {
        id: 'user3',
        name: 'Mike Williams',
        avatar: '/images/avatars/mike.jpg',
        rating: 4.9,
        date: '2023-08-05',
        comment: 'The views are incredible! Worth every penny.'
      }
    ],
    amenities: ['Pro Shop', 'Clubhouse', 'Restaurant', 'Practice Facility', 'Spa']
  },
  {
    id: 'augusta-national',
    name: 'Augusta National Golf Club',
    location: 'Augusta, GA',
    description: 'Home of the Masters Tournament, known for its pristine conditions.',
    rating: 4.9,
    reviewCount: 187,
    par: 72,
    length: 7475,
    difficultyRatings: {
      beginner: 9.5,
      intermediate: 8.0,
      advanced: 7.0,
      senior: 9.0
    },
    type: 'Private',
    image: '/images/mock/course3.jpg',
    latitude: 33.5021,
    longitude: -82.0232,
    friendsPlayed: [],
    amenities: ['Pro Shop', 'Clubhouse', 'Restaurant', 'Caddie Service']
  },
  {
    id: 'st-andrews',
    name: 'St Andrews Links (Old Course)',
    location: 'St Andrews, Scotland',
    description: 'The oldest and most iconic golf course in the world.',
    rating: 4.8,
    reviewCount: 412,
    par: 72,
    length: 6721,
    difficultyRatings: {
      beginner: 8.7,
      intermediate: 7.5,
      advanced: 6.8,
      senior: 8.5
    },
    type: 'Public',
    image: '/images/mock/course4.jpg',
    latitude: 56.3431,
    longitude: -2.8025,
    friendsPlayed: [
      {
        id: 'user1',
        name: 'Alex Johnson',
        avatar: '/images/avatars/alex.jpg',
        rating: 4.8,
        date: '2022-07-22',
        comment: 'A pilgrimage every golfer should make. Incredible history!'
      }
    ],
    amenities: ['Pro Shop', 'Clubhouse', 'Restaurant', 'Caddie Service', 'Museum']
  },
  {
    id: 'royal-melbourne',
    name: 'Royal Melbourne Golf Club',
    location: 'Melbourne, Australia',
    description: 'One of the finest examples of sandbelt golf architecture.',
    rating: 4.7,
    reviewCount: 156,
    par: 72,
    length: 6598,
    difficultyRatings: {
      beginner: 8.5,
      intermediate: 7.3,
      advanced: 6.4,
      senior: 8.0
    },
    type: 'Private',
    image: '/images/mock/course5.jpg',
    latitude: -37.9127,
    longitude: 145.0350,
    friendsPlayed: [],
    amenities: ['Pro Shop', 'Clubhouse', 'Restaurant', 'Practice Facility']
  },
  {
    id: 'torrey-pines',
    name: 'Torrey Pines Golf Course',
    location: 'La Jolla, CA',
    description: 'Municipal course with spectacular views of the Pacific Ocean.',
    rating: 4.5,
    reviewCount: 298,
    par: 72,
    length: 7607,
    difficultyRatings: {
      beginner: 8.3,
      intermediate: 7.1,
      advanced: 6.2,
      senior: 8.0
    },
    type: 'Public',
    image: '/images/mock/course6.jpg',
    latitude: 32.8937,
    longitude: -117.2519,
    distance: 3.2,
    friendsPlayed: [
      {
        id: 'user2',
        name: 'Sarah Miller',
        avatar: '/images/avatars/sarah.jpg',
        rating: 4.3,
        date: '2024-01-15'
      },
      {
        id: 'user3',
        name: 'Mike Williams',
        avatar: '/images/avatars/mike.jpg',
        rating: 4.5,
        date: '2023-12-18',
        comment: 'Great municipal course, amazing views of the ocean.'
      }
    ],
    amenities: ['Pro Shop', 'Restaurant', 'Practice Facility', 'Golf Carts']
  },
];

// Skill levels for difficulty filtering
const skillLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'senior', label: 'Senior' }
];

export function CourseDiscoveryTool() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [skillLevel, setSkillLevel] = useState('intermediate');
  const [maxDifficulty, setMaxDifficulty] = useState<number>(10);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(mockCourses);
  const [activeTab, setActiveTab] = useState('discover');
  const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [bucketList, setBucketList] = useState<string[]>([]);
  const [showFriendsPlayed, setShowFriendsPlayed] = useState(false);
  
  // Get user's location
  const getUserLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setIsLocating(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLocating(false);
          // Show error message to user
          alert('Unable to access your location. Please check your browser settings.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
      setIsLocating(false);
    }
  };
  
  // Calculate distance between two coordinates (haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3958.8; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c;
  };
  
  // Filter and sort courses
  useEffect(() => {
    let updatedCourses = [...mockCourses];
    
    // Apply search filter
    if (searchQuery) {
      updatedCourses = updatedCourses.filter(course => 
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        course.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply type filter
    if (filterType !== 'all') {
      updatedCourses = updatedCourses.filter(course => 
        course.type.toLowerCase() === filterType.toLowerCase()
      );
    }
    
    // Apply skill level and difficulty filter
    updatedCourses = updatedCourses.filter(course => 
      course.difficultyRatings[skillLevel as keyof DifficultyRatings] <= maxDifficulty
    );
    
    // Apply friends filter
    if (showFriendsPlayed) {
      updatedCourses = updatedCourses.filter(course => 
        course.friendsPlayed && course.friendsPlayed.length > 0
      );
    }
    
    // Calculate distances if user location is available
    if (userLocation) {
      updatedCourses = updatedCourses.map(course => {
        if (course.latitude && course.longitude) {
          return {
            ...course,
            distance: calculateDistance(
              userLocation.latitude, 
              userLocation.longitude, 
              course.latitude, 
              course.longitude
            )
          };
        }
        return course;
      });
      
      // Sort by distance
      if (activeTab === 'nearby') {
        updatedCourses.sort((a, b) => (a.distance || 9999) - (b.distance || 9999));
      }
    }
    
    setFilteredCourses(updatedCourses);
  }, [searchQuery, filterType, skillLevel, maxDifficulty, userLocation, activeTab, showFriendsPlayed]);
  
  // Toggle course in bucket list
  const toggleBucketList = (courseId: string) => {
    if (bucketList.includes(courseId)) {
      setBucketList(bucketList.filter(id => id !== courseId));
    } else {
      setBucketList([...bucketList, courseId]);
    }
  };
  
  // Get bucket list courses
  const getBucketListCourses = () => {
    return mockCourses.filter(course => bucketList.includes(course.id));
  };
  
  // Get difficulty color and label
  const getDifficultyInfo = (course: Course) => {
    const difficultyValue = course.difficultyRatings[skillLevel as keyof DifficultyRatings];
    
    if (difficultyValue >= 8.5) {
      return { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', label: 'Challenging' };
    } else if (difficultyValue >= 6.5) {
      return { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', label: 'Moderate' };
    } else {
      return { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', label: 'Forgiving' };
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Golf Course Discovery</CardTitle>
          <CardDescription>
            Find your perfect golf course based on location, difficulty, and more
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="discover" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="discover" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Discover</span>
              </TabsTrigger>
              <TabsTrigger value="nearby" className="flex items-center gap-2" onClick={() => {
                if (!userLocation) getUserLocation();
              }}>
                <Locate className="h-4 w-4" />
                <span className="hidden sm:inline">Nearby</span>
              </TabsTrigger>
              <TabsTrigger value="friends" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Friends</span>
              </TabsTrigger>
              <TabsTrigger value="bucket-list" className="flex items-center gap-2">
                <BookmarkCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Bucket List</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="mb-6">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search by name or location"
                    className="w-full pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[140px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <span>{filterType === 'all' ? 'All Courses' : filterType}</span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">Difficulty for Skill Level:</span>
                    </div>
                    <Select value={skillLevel} onValueChange={setSkillLevel}>
                      <SelectTrigger className="w-[140px]">
                        <span>{skillLevels.find(s => s.value === skillLevel)?.label}</span>
                      </SelectTrigger>
                      <SelectContent>
                        {skillLevels.map(level => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs">Less Difficult</span>
                    <div className="flex-1">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.5"
                        value={maxDifficulty}
                        onChange={(e) => setMaxDifficulty(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary dark:bg-gray-700"
                      />
                    </div>
                    <span className="text-xs">More Difficult</span>
                  </div>
                </div>
                
                {activeTab === 'friends' && (
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="friends-played" 
                      checked={showFriendsPlayed}
                      onCheckedChange={(checked: boolean | 'indeterminate') => setShowFriendsPlayed(checked === true)}
                    />
                    <label
                      htmlFor="friends-played"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Only show courses my friends have played
                    </label>
                  </div>
                )}
                
                {activeTab === 'nearby' && (
                  <Button 
                    variant="outline" 
                    onClick={getUserLocation} 
                    disabled={isLocating}
                    className="w-full"
                  >
                    <Locate className="h-4 w-4 mr-2" />
                    {isLocating ? 'Getting your location...' : userLocation ? 'Update My Location' : 'Get My Location'}
                  </Button>
                )}
              </div>
            </div>
            
            <TabsContent value="discover" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {renderCourseCards(filteredCourses)}
              </div>
            </TabsContent>
            
            <TabsContent value="nearby" className="mt-0">
              {userLocation ? (
                <div className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Showing courses near {userLocation ? 'your current location' : 'you'}. Distances are shown in miles.
                    </AlertDescription>
                  </Alert>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {renderCourseCards(filteredCourses)}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                    <Locate className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium">Enable Location Services</h3>
                  <p className="text-gray-500 mt-2 mb-4 max-w-md mx-auto">
                    To see courses near you, we need your permission to access your location.
                  </p>
                  <Button onClick={getUserLocation} disabled={isLocating}>
                    {isLocating ? 'Getting your location...' : 'Share My Location'}
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="friends" className="mt-0">
              <div className="space-y-6">
                <div className="flex overflow-x-auto pb-4 space-x-2">
                  <Avatar className="h-10 w-10 border-2 border-primary">
                    <AvatarImage src="/images/avatars/alex.jpg" alt="Alex Johnson" />
                    <AvatarFallback>AJ</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/images/avatars/sarah.jpg" alt="Sarah Miller" />
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/images/avatars/mike.jpg" alt="Mike Williams" />
                    <AvatarFallback>MW</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/images/avatars/emily.jpg" alt="Emily Davis" />
                    <AvatarFallback>ED</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/images/avatars/john.jpg" alt="John Smith" />
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.length > 0 ? (
                    renderCourseCards(filteredCourses)
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <Users className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                      <h3 className="text-lg font-medium">No Courses Found</h3>
                      <p className="text-gray-500">None of your friends have played courses matching your filters.</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="bucket-list" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bucketList.length > 0 ? (
                  renderCourseCards(getBucketListCourses())
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                      <Bookmark className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium">Your Bucket List is Empty</h3>
                    <p className="text-gray-500 mt-2 mb-4">
                      Add courses to your bucket list to keep track of where you want to play.
                    </p>
                    <Button onClick={() => setActiveTab('discover')}>
                      Discover Courses
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
  
  // Helper function to render course cards
  function renderCourseCards(courses: Course[]) {
    return courses.length > 0 ? (
      courses.map(course => (
        <Card key={course.id} className="h-full hover:shadow-md transition-shadow overflow-hidden">
          <div 
            className="h-48 bg-gray-200 w-full bg-cover bg-center relative group"
            style={{ backgroundImage: `url(${course.image || '/images/course-placeholder.jpg'})` }}
          >
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-white opacity-0 group-hover:opacity-100 bg-primary/30 hover:bg-primary/50"
                onClick={(e) => {
                  e.preventDefault();
                  toggleBucketList(course.id);
                }}
              >
                {bucketList.includes(course.id) ? (
                  <BookmarkCheck className="h-5 w-5" />
                ) : (
                  <Bookmark className="h-5 w-5" />
                )}
              </Button>
            </div>
            
            {course.friendsPlayed && course.friendsPlayed.length > 0 && (
              <div className="absolute top-2 left-2 flex -space-x-2">
                {course.friendsPlayed.slice(0, 3).map((friend, i) => (
                  <Avatar key={i} className="h-8 w-8 border-2 border-white">
                    <AvatarImage src={friend.avatar} alt={friend.name} />
                    <AvatarFallback>{friend.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                ))}
                {course.friendsPlayed.length > 3 && (
                  <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-xs border-2 border-white">
                    +{course.friendsPlayed.length - 3}
                  </div>
                )}
              </div>
            )}
            
            {course.distance !== undefined && (
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-sm rounded-md">
                {course.distance.toFixed(1)} miles away
              </div>
            )}
          </div>
          
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>{course.name}</span>
              {bucketList.includes(course.id) && (
                <Bookmark className="h-4 w-4 text-primary" />
              )}
            </CardTitle>
            <CardDescription className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {course.location}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-2">
            <div className="flex items-center gap-1 text-sm mb-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{course.rating}</span>
              </div>
              <span className="text-gray-500">({course.reviewCount} reviews)</span>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
              {course.description}
            </p>
            
            <div className="mt-2 flex flex-wrap gap-2">
              <div className="text-xs bg-primary/10 text-primary rounded-full px-2 py-1">
                Par {course.par}
              </div>
              <div className="text-xs bg-primary/10 text-primary rounded-full px-2 py-1">
                {course.length} yards
              </div>
              <div className={`text-xs rounded-full px-2 py-1 ${getDifficultyInfo(course).color}`}>
                {getDifficultyInfo(course).label} for {skillLevels.find(s => s.value === skillLevel)?.label}s
              </div>
              <div className="text-xs bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1">
                {course.type}
              </div>
            </div>
            
            {course.friendsPlayed && course.friendsPlayed.length > 0 && activeTab === 'friends' && (
              <div className="mt-4 pt-3 border-t">
                <h4 className="text-xs font-medium text-gray-500 mb-2">Friends' Reviews</h4>
                {course.friendsPlayed.slice(0, 1).map((friend, i) => (
                  <div key={i} className="flex gap-2">
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage src={friend.avatar} alt={friend.name} />
                      <AvatarFallback>{friend.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">{friend.name}</span>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{friend.rating}</span>
                        </div>
                      </div>
                      {friend.comment && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                          "{friend.comment}"
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        Played: {new Date(friend.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
                {course.friendsPlayed.length > 1 && (
                  <p className="text-xs text-primary mt-1 cursor-pointer hover:underline">
                    + {course.friendsPlayed.length - 1} more friends played here
                  </p>
                )}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex gap-2">
            <Button asChild className="flex-1">
              <Link href={`/courses/${course.id}`}>View Details</Link>
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))
    ) : (
      <div className="col-span-full text-center py-8">
        <Search className="h-10 w-10 mx-auto text-gray-400 mb-2" />
        <h3 className="text-lg font-medium">No Courses Found</h3>
        <p className="text-gray-500">Try adjusting your filters to see more results.</p>
      </div>
    );
  }
} 