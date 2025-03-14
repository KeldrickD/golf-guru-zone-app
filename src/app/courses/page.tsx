'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Map, Search, Filter, MapPin, Star } from 'lucide-react';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import { useLanguage } from '@/context/LanguageContext';

// Mock courses data
const mockCourses = [
  {
    id: 'pine-valley',
    name: 'Pine Valley Golf Club',
    location: 'Pine Valley, NJ',
    description: 'Consistently ranked as one of the top golf courses in the world.',
    rating: 4.9,
    reviewCount: 256,
    par: 72,
    length: 7057,
    difficulty: 'Hard',
    type: 'Private',
    image: '/images/mock/course1.jpg'
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
    difficulty: 'Medium',
    type: 'Public',
    image: '/images/mock/course2.jpg'
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
    difficulty: 'Hard',
    type: 'Private',
    image: '/images/mock/course3.jpg'
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
    difficulty: 'Medium',
    type: 'Public',
    image: '/images/mock/course4.jpg'
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
    difficulty: 'Medium',
    type: 'Private',
    image: '/images/mock/course5.jpg'
  },
  {
    id: 'shinnecock-hills',
    name: 'Shinnecock Hills Golf Club',
    location: 'Southampton, NY',
    description: 'One of the oldest golf clubs in the United States.',
    rating: 4.8,
    reviewCount: 143,
    par: 70,
    length: 7445,
    difficulty: 'Hard',
    type: 'Private',
    image: '/images/mock/course6.jpg'
  },
];

export default function CoursesPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  
  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || course.type.toLowerCase() === filterType.toLowerCase();
    const matchesDifficulty = filterDifficulty === 'all' || course.difficulty.toLowerCase() === filterDifficulty.toLowerCase();
    
    return matchesSearch && matchesType && matchesDifficulty;
  });
  
  return (
    <>
      <PageHeader
        title={t('courses.title')}
        description={t('courses.description')}
        icon={Map}
        gradient
      />
      
      <Section>
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder={t('courses.search')}
              className="w-full pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <div className="relative inline-block">
              <select
                className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md pl-3 pr-10 py-2 text-sm"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">{t('courses.allTypes')}</option>
                <option value="public">{t('courses.public')}</option>
                <option value="private">{t('courses.private')}</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <Filter className="h-4 w-4 text-gray-500" />
              </div>
            </div>
            
            <div className="relative inline-block">
              <select
                className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md pl-3 pr-10 py-2 text-sm"
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
              >
                <option value="all">{t('courses.allDifficulties')}</option>
                <option value="easy">{t('courses.easy')}</option>
                <option value="medium">{t('courses.medium')}</option>
                <option value="hard">{t('courses.hard')}</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <Filter className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map(course => (
              <Link key={course.id} href={`/courses/${course.id}`} className="no-underline">
                <Card className="h-full hover:shadow-md transition-shadow overflow-hidden">
                  <div 
                    className="h-48 bg-gray-200 w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${course.image || '/images/course-placeholder.jpg'})` }}
                  />
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{course.name}</CardTitle>
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
                      <span className="text-gray-500">({course.reviewCount} {t('courses.reviews')})</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <div className="text-xs bg-primary/10 text-primary rounded-full px-2 py-1">
                        {t('courses.par')} {course.par}
                      </div>
                      <div className="text-xs bg-primary/10 text-primary rounded-full px-2 py-1">
                        {course.length} {t('courses.yards')}
                      </div>
                      <div className="text-xs bg-primary/10 text-primary rounded-full px-2 py-1">
                        {t(`courses.${course.difficulty.toLowerCase()}`)}
                      </div>
                      <div className="text-xs bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1">
                        {t(`courses.${course.type.toLowerCase()}`)}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">{t('courses.viewCourse')}</Button>
                  </CardFooter>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium">{t('courses.noCourses')}</h3>
              <p className="text-gray-500 mt-2">
                {t('courses.tryAdjusting')}
              </p>
            </div>
          )}
        </div>
      </Section>
    </>
  );
} 