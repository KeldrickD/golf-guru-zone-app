'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface Course {
  id: string;
  name: string;
  location: string | null;
  par: number;
  rating: number | null;
  slope: number | null;
  holes: number;
}

export default function CoursesPage() {
  const { data: session } = useSession();
  const { addToast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to fetch courses',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Golf Courses</h1>
          <Link href="/courses/new">
            <Button>Add New Course</Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{course.name}</CardTitle>
                <CardDescription>{course.location || 'Location not specified'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Par:</span>
                    <span className="font-medium">{course.par}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Holes:</span>
                    <span className="font-medium">{course.holes}</span>
                  </div>
                  {course.rating && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Course Rating:</span>
                      <span className="font-medium">{course.rating}</span>
                    </div>
                  )}
                  {course.slope && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Slope Rating:</span>
                      <span className="font-medium">{course.slope}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <Link href={`/courses/${course.id}/edit`}>
                    <Button variant="outline">Edit</Button>
                  </Link>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      try {
                        const response = await fetch(`/api/courses/${course.id}`, {
                          method: 'DELETE',
                        });
                        if (!response.ok) throw new Error('Failed to delete course');
                        setCourses(courses.filter(c => c.id !== course.id));
                        addToast({
                          title: 'Success',
                          description: 'Course deleted successfully',
                        });
                      } catch (error) {
                        addToast({
                          title: 'Error',
                          description: 'Failed to delete course',
                          variant: 'destructive',
                        });
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">No courses added yet</h2>
            <p className="text-gray-500 mt-2">Add your first course to get started</p>
          </div>
        )}
      </div>
    </div>
  );
} 