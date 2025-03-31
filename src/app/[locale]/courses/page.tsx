'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/use-toast';
import { localizeUrl } from '@/lib/route-utils';
import { useSession } from 'next-auth/react';
import { MapPin, Star, Clock, Flag } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  location: string;
  description: string;
  rating: number;
  slope: number;
  par: number;
  length: number;
  image: string;
}

// Demo courses data
const DEMO_COURSES: Course[] = [
  {
    id: 'pv-001',
    name: 'Pine Valley Golf Club',
    location: 'Pine Valley, New Jersey',
    description: 'Consistently ranked as one of the top courses in the world, Pine Valley offers a challenging mix of unique holes in a beautiful pine barrens setting.',
    rating: 75.2,
    slope: 155,
    par: 72,
    length: 7181,
    image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
  },
  {
    id: 'ag-002',
    name: 'Augusta National',
    location: 'Augusta, Georgia',
    description: 'Home of the Masters Tournament, this iconic course features immaculate conditions, strategic design, and the famous Amen Corner.',
    rating: 76.2,
    slope: 148,
    par: 72,
    length: 7475,
    image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
  },
  {
    id: 'sa-003',
    name: 'St. Andrews Links (Old Course)',
    location: 'St. Andrews, Scotland',
    description: 'The birthplace of golf, the Old Course offers a unique experience with its shared fairways, large double greens, and historic setting.',
    rating: 73.1,
    slope: 132,
    par: 72,
    length: 7305,
    image: 'https://images.unsplash.com/photo-1600336153113-d66c79de3e91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80'
  },
  {
    id: 'pb-004',
    name: 'Pebble Beach Golf Links',
    location: 'Pebble Beach, California',
    description: 'Set along the rugged coastline of California, Pebble Beach offers breathtaking views and challenging holes that have tested the best players in the world.',
    rating: 74.7,
    slope: 143,
    par: 72,
    length: 7075,
    image: 'https://images.unsplash.com/photo-1541226920623-75c3f6716e14?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
  },
  {
    id: 'rc-005',
    name: 'Royal County Down',
    location: 'Newcastle, Northern Ireland',
    description: 'With dramatic views of the Mountains of Mourne, this course offers narrow fairways, "bearded" bunkers, and gorse-lined holes.',
    rating: 75.3,
    slope: 142,
    par: 71,
    length: 7186,
    image: 'https://images.unsplash.com/photo-1592919505780-303950717590?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80'
  },
  {
    id: 'tp-006',
    name: 'Trump Turnberry (Ailsa)',
    location: 'Turnberry, Scotland',
    description: 'Recently renovated, this stunning links course provides spectacular views of the Ailsa Craig, the Isle of Arran, and the Mull of Kintyre.',
    rating: 76.0,
    slope: 145,
    par: 71,
    length: 7489,
    image: 'https://images.unsplash.com/photo-1611667451042-9c965e296033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1167&q=80'
  }
];

export default function CoursesPage() {
  const { data: session } = useSession();
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const { addToast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCourses(DEMO_COURSES);
      setLoading(false);
      
      addToast({
        title: 'Demo Mode',
        description: 'Showing sample courses data',
        variant: 'default',
      });
    }, 1000);
  }, []);

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Golf Courses</h1>
        <div className="mt-2 md:mt-0 text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          Demo Mode: Sample Data
        </div>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search courses by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img
                src={course.image}
                alt={course.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
            <CardHeader>
              <CardTitle>{course.name}</CardTitle>
              <CardDescription className="flex items-center">
                <MapPin size={16} className="mr-1" />
                {course.location}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">{course.description}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <Star size={16} className="mr-1 text-yellow-500" />
                  <span>Rating: {course.rating}</span>
                </div>
                <div className="flex items-center">
                  <Flag size={16} className="mr-1 text-green-500" />
                  <span>Par: {course.par}</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <span>Slope: {course.slope}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-1 text-purple-500" />
                  <span>{course.length} yards</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="default" className="w-full">
                View Course Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
} 