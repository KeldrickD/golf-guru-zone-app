'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/use-toast';

export default function NewCourse() {
  const router = useRouter();
  const { data: session } = useSession();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      location: formData.get('location') as string,
      par: parseInt(formData.get('par') as string),
      rating: formData.get('rating') ? parseFloat(formData.get('rating') as string) : null,
      slope: formData.get('slope') ? parseInt(formData.get('slope') as string) : null,
      holes: parseInt(formData.get('holes') as string),
    };

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create course');
      }

      addToast({
        title: 'Success',
        description: 'Course created successfully',
      });

      router.push('/courses');
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to create course',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Add New Course</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Course Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="par" className="block text-sm font-medium text-gray-700">
                  Par
                </label>
                <input
                  type="number"
                  name="par"
                  id="par"
                  required
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="holes" className="block text-sm font-medium text-gray-700">
                  Number of Holes
                </label>
                <input
                  type="number"
                  name="holes"
                  id="holes"
                  required
                  min="1"
                  max="36"
                  defaultValue="18"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                  Course Rating
                </label>
                <input
                  type="number"
                  name="rating"
                  id="rating"
                  step="0.1"
                  min="0"
                  max="80"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="slope" className="block text-sm font-medium text-gray-700">
                  Slope Rating
                </label>
                <input
                  type="number"
                  name="slope"
                  id="slope"
                  min="55"
                  max="155"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  onClick={() => router.back()}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Course'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 