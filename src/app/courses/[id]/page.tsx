'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Map, BarChart, Clock, Calendar, MapPin } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import CourseMap from '@/components/CourseMap';
import { useParams } from 'next/navigation';

// Mock course data
const mockCourseDetail = {
  id: 'pine-valley',
  name: 'Pine Valley Golf Club',
  location: 'Pine Valley, NJ',
  description: 'Consistently ranked as one of the top golf courses in the world, Pine Valley Golf Club presents a challenging layout with strategic bunkers, undulating greens, and beautiful surroundings.',
  par: 72,
  length: 7057,
  rating: 75.2,
  slope: 155,
  established: 1913,
  designer: 'George Crump & H.S. Colt',
  type: 'Private',
  amenities: ['Pro Shop', 'Practice Facility', 'Clubhouse', 'Restaurant', 'Locker Rooms'],
  images: [
    '/images/mock/course1.jpg', 
    '/images/mock/course2.jpg', 
    '/images/mock/course3.jpg'
  ],
  userStats: {
    roundsPlayed: 3,
    bestScore: 82,
    avgScore: 86.7,
    favoriteHole: 7,
    mostDifficultHole: 13,
    lastPlayed: '2023-10-15',
  }
};

// Mock tee times
const mockTeeTimes = [
  { id: '1', date: '2024-06-05', time: '07:30', available: true, price: 120 },
  { id: '2', date: '2024-06-05', time: '08:00', available: true, price: 120 },
  { id: '3', date: '2024-06-05', time: '08:30', available: false, price: 120 },
  { id: '4', date: '2024-06-05', time: '09:00', available: true, price: 135 },
  { id: '5', date: '2024-06-05', time: '09:30', available: true, price: 135 },
  { id: '6', date: '2024-06-06', time: '07:30', available: true, price: 120 },
  { id: '7', date: '2024-06-06', time: '08:00', available: true, price: 120 },
  { id: '8', date: '2024-06-06', time: '08:30', available: true, price: 120 },
];

export default function CourseDetailPage() {
  const params = useParams() || {};
  const courseId = params.id as string || 'default-course';
  const [selectedHole, setSelectedHole] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>('map');
  
  // In a real app, you would fetch the course data based on the ID
  const course = mockCourseDetail;
  
  const handleHoleSelect = (holeNumber: number) => {
    setSelectedHole(holeNumber);
  };
  
  return (
    <>
      <PageHeader
        title={course.name}
        description={`${course.location} • Par ${course.par} • ${course.length} yards`}
        icon={Map}
        gradient
      />
      
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="w-full"
            >
              <TabsList className="mb-6">
                <TabsTrigger value="map">Course Map</TabsTrigger>
                <TabsTrigger value="stats">Course Stats</TabsTrigger>
                <TabsTrigger value="tee-times">Tee Times</TabsTrigger>
              </TabsList>
              
              <TabsContent value="map" className="space-y-6">
                <CourseMap 
                  courseId={courseId} 
                  initialHole={selectedHole}
                  onHoleClick={handleHoleSelect}
                />
              </TabsContent>
              
              <TabsContent value="stats" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Statistics</CardTitle>
                    <CardDescription>
                      Key metrics and ratings for {course.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg text-center">
                        <div className="text-xs text-gray-500 mb-1">Course Rating</div>
                        <div className="text-2xl font-bold">{course.rating}</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg text-center">
                        <div className="text-xs text-gray-500 mb-1">Slope Rating</div>
                        <div className="text-2xl font-bold">{course.slope}</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg text-center">
                        <div className="text-xs text-gray-500 mb-1">Total Par</div>
                        <div className="text-2xl font-bold">{course.par}</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg text-center">
                        <div className="text-xs text-gray-500 mb-1">Total Length</div>
                        <div className="text-2xl font-bold">{course.length}y</div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">Your Stats at This Course</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
                          <div className="text-xs text-gray-500 mb-1">Rounds Played</div>
                          <div className="text-xl font-bold">{course.userStats.roundsPlayed}</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
                          <div className="text-xs text-gray-500 mb-1">Best Score</div>
                          <div className="text-xl font-bold">{course.userStats.bestScore}</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
                          <div className="text-xs text-gray-500 mb-1">Average Score</div>
                          <div className="text-xl font-bold">{course.userStats.avgScore}</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
                          <div className="text-xs text-gray-500 mb-1">Favorite Hole</div>
                          <div className="text-xl font-bold">#{course.userStats.favoriteHole}</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
                          <div className="text-xs text-gray-500 mb-1">Most Difficult</div>
                          <div className="text-xl font-bold">#{course.userStats.mostDifficultHole}</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
                          <div className="text-xs text-gray-500 mb-1">Last Played</div>
                          <div className="text-xl font-bold">
                            {new Date(course.userStats.lastPlayed).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">Hole-by-Hole Performance</h3>
                      <div className="h-[300px] bg-gray-50 dark:bg-gray-900/30 rounded-lg p-4 flex items-center justify-center">
                        <div className="text-center">
                          <BarChart className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500">
                            Hole performance chart will be displayed here
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="tee-times" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Available Tee Times</CardTitle>
                    <CardDescription>
                      Book your next round at {course.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                      {mockTeeTimes.map(teeTime => (
                        <div 
                          key={teeTime.id}
                          className={`p-4 border rounded-lg flex justify-between items-center ${
                            teeTime.available ? 'bg-white dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-900 opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-full">
                              <Clock className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">
                                {new Date(teeTime.date).toLocaleDateString(undefined, {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric'
                                })} at {teeTime.time}
                              </div>
                              <div className="text-sm text-gray-500">
                                ${teeTime.price} per player
                              </div>
                            </div>
                          </div>
                          <Button 
                            disabled={!teeTime.available}
                            variant={teeTime.available ? 'default' : 'outline'}
                          >
                            {teeTime.available ? 'Book Now' : 'Unavailable'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">About</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {course.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 pt-2">
                  <div>
                    <h4 className="text-xs text-gray-500">Type</h4>
                    <p className="text-sm font-medium">{course.type}</p>
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-500">Established</h4>
                    <p className="text-sm font-medium">{course.established}</p>
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-500">Designer</h4>
                    <p className="text-sm font-medium">{course.designer}</p>
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-500">Location</h4>
                    <p className="text-sm font-medium">{course.location}</p>
                  </div>
                </div>
                
                <div className="pt-2">
                  <h3 className="text-sm font-medium mb-2">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {course.amenities.map((amenity, i) => (
                      <div 
                        key={i}
                        className="text-xs bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1"
                      >
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-2">
                  <h3 className="text-sm font-medium mb-2">Location</h3>
                  <div className="rounded-lg overflow-hidden border bg-gray-100 dark:bg-gray-800 h-[200px] flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">
                        Map will be displayed here
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full grid grid-cols-2 gap-2">
                  <Button variant="default">Book Tee Time</Button>
                  <Button variant="outline">Add to Favorites</Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
} 