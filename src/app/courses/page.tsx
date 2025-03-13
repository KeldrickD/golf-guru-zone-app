'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

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
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="max-w-6xl w-full">
        <h1 className="text-4xl font-bold mb-8">Find Your Perfect Golf Course</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Filters */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Search Filters</CardTitle>
              <CardDescription>
                Customize your search to find the ideal course.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="City, State, or Zip"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxPrice">Maximum Price ($)</Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <select
                    id="difficulty"
                    value={filters.difficulty}
                    onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="">Any Difficulty</option>
                    <option value="beginner">Beginner-Friendly</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="championship">Championship</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Amenities</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Pro Shop', 'Driving Range', 'Restaurant', 'Lessons', 'Cart Rental', 'Club Rental'].map((amenity) => (
                      <label key={amenity} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filters.amenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Searching...' : 'Search Courses'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="lg:col-span-2 space-y-6">
            {results.length > 0 ? (
              results.map((course) => (
                <Card key={course.name}>
                  <CardHeader>
                    <CardTitle>{course.name}</CardTitle>
                    <CardDescription>{course.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p>{course.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-primary/10 rounded-full text-xs">
                          {course.difficulty}
                        </span>
                        <span className="px-2 py-1 bg-primary/10 rounded-full text-xs">
                          ${course.price}/round
                        </span>
                        {course.amenities.map((amenity) => (
                          <span key={amenity} className="px-2 py-1 bg-muted rounded-full text-xs">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Courses Found</CardTitle>
                  <CardDescription>
                    Try adjusting your filters to see more results.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 