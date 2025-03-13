'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Map, Search, Filter, ArrowRight, Star, Compass, DollarSign, Clock, Award } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CourseFilters {
  location: string;
  maxPrice: number;
  difficulty: string;
  amenities: string[];
}

interface CourseResult {
  name: string;
  location: string;
  difficulty: string;
  price: number;
  description: string;
  amenities: string[];
}

// Define difficulty levels with proper styling
const difficultyLevels = {
  beginner: { label: 'Beginner-Friendly', color: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400' },
  intermediate: { label: 'Intermediate', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400' },
  advanced: { label: 'Advanced', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400' },
  championship: { label: 'Championship', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400' }
};

// Define amenity icons
const amenityIcons = {
  'Pro Shop': <Star className="h-3.5 w-3.5" />,
  'Driving Range': <Compass className="h-3.5 w-3.5" />,
  'Restaurant': <DollarSign className="h-3.5 w-3.5" />,
  'Lessons': <Award className="h-3.5 w-3.5" />,
  'Cart Rental': <Clock className="h-3.5 w-3.5" />,
  'Club Rental': <Compass className="h-3.5 w-3.5" />
};

export default function CoursesPage() {
  const [filters, setFilters] = useState<CourseFilters>({
    location: '',
    maxPrice: 200,
    difficulty: '',
    amenities: [],
  });
  const [results, setResults] = useState<CourseResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters),
      });

      const data = await response.json();
      setResults(data.courses);
    } catch (error) {
      console.error('Error searching courses:', error);
      setResults([]);
    }

    setLoading(false);
  };

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  return (
    <>
      <PageHeader
        title="Find Your Perfect Golf Course"
        description="Discover top-rated golf courses near you with our advanced search tool. Filter by location, price, difficulty, and amenities."
        icon={Map}
      />
      
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-md border-gray-100 dark:border-gray-800 overflow-hidden">
              <CardHeader className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/80 dark:to-gray-900 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Course Filters</CardTitle>
                </div>
                <CardDescription>
                  Customize your search to find the ideal course.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="location" className="text-gray-700 dark:text-gray-300 font-medium">Location</Label>
                    <div className="relative">
                      <Input
                        id="location"
                        placeholder="City, State, or Zip"
                        value={filters.location}
                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                        className="pl-10 focus:ring-primary"
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="maxPrice" className="text-gray-700 dark:text-gray-300 font-medium">Maximum Price</Label>
                      <span className="text-sm font-semibold text-primary">${filters.maxPrice}</span>
                    </div>
                    <div className="pt-2">
                      <input
                        id="maxPrice"
                        type="range"
                        min="0"
                        max="500"
                        step="10"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary dark:bg-gray-700"
                      />
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>$0</span>
                        <span>$500</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="difficulty" className="text-gray-700 dark:text-gray-300 font-medium">Difficulty Level</Label>
                    <select
                      id="difficulty"
                      value={filters.difficulty}
                      onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Any Difficulty</option>
                      <option value="beginner">Beginner-Friendly</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="championship">Championship</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-gray-700 dark:text-gray-300 font-medium">Amenities</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.keys(amenityIcons).map((amenity) => (
                        <label 
                          key={amenity} 
                          className={cn(
                            "flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors border",
                            filters.amenities.includes(amenity) 
                              ? "bg-primary/10 border-primary/20 text-primary dark:bg-primary/20" 
                              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={filters.amenities.includes(amenity)}
                            onChange={() => handleAmenityToggle(amenity)}
                            className="sr-only"
                          />
                          <div className={cn(
                            "h-4 w-4 rounded-sm border flex items-center justify-center",
                            filters.amenities.includes(amenity)
                              ? "bg-primary border-primary text-white"
                              : "border-gray-300 dark:border-gray-600"
                          )}>
                            {filters.amenities.includes(amenity) && (
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                <path d="M8.5 2.5L3.5 7.5L1.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                          <span className="text-sm">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      type="submit" 
                      className="w-full mt-2 group" 
                      disabled={loading}
                      size="lg"
                    >
                      {loading ? 'Searching Courses...' : 'Search Courses'}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20 dark:border-primary/30 bg-primary/5 dark:bg-primary/10">
              <CardContent className="p-6">
                <h3 className="font-medium text-base mb-2">Pro Tip: Finding Your Ideal Course</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  When searching for courses, consider both difficulty and price. Beginner-friendly courses often have wider fairways and fewer hazards, while championship courses offer challenging play for experienced golfers.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Course Results</h2>
              {results.length > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {results.length} course{results.length === 1 ? '' : 's'} found
                </p>
              )}
            </div>
            
            {results.length > 0 ? (
              <div className="space-y-6">
                {results.map((course) => (
                  <motion.div 
                    key={course.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="overflow-hidden border-gray-200 dark:border-gray-800 hover:border-primary/30 transition-colors duration-300">
                      <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex justify-between">
                          <div>
                            <CardTitle className="text-xl">{course.name}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <Map className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                              {course.location}
                            </CardDescription>
                          </div>
                          <span className="text-2xl font-bold text-primary">${course.price}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-4">
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{course.description}</p>
                          
                          <div className="flex flex-wrap gap-2">
                            <span className={cn(
                              "px-2.5 py-1 rounded-full text-xs font-medium flex items-center", 
                              course.difficulty in difficultyLevels 
                                ? difficultyLevels[course.difficulty as keyof typeof difficultyLevels].color
                                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                            )}>
                              <Award className="h-3 w-3 mr-1" />
                              {course.difficulty in difficultyLevels 
                                ? difficultyLevels[course.difficulty as keyof typeof difficultyLevels].label
                                : course.difficulty}
                            </span>
                            
                            {course.amenities.map((amenity) => (
                              <span 
                                key={amenity} 
                                className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs flex items-center"
                              >
                                {amenity in amenityIcons && (
                                  <span className="mr-1">{amenityIcons[amenity as keyof typeof amenityIcons]}</span>
                                )}
                                {amenity}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex justify-end">
                            <Button size="sm" variant="outline" className="group">
                              View Details
                              <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                <CardContent className="p-8 flex flex-col items-center justify-center min-h-[300px] text-center">
                  <Map className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                  <CardTitle className="text-xl mb-2">No Courses Found</CardTitle>
                  <CardDescription className="max-w-md mx-auto">
                    Try adjusting your filters or searching in a different location to find golf courses.
                  </CardDescription>
                  <Button 
                    variant="outline" 
                    className="mt-6"
                    onClick={() => setFilters({
                      location: '',
                      maxPrice: 200,
                      difficulty: '',
                      amenities: [],
                    })}
                  >
                    Reset Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Section>
    </>
  );
} 