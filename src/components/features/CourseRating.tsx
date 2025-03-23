import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Star, Search, MapPin, Image, ThumbsUp, ThumbsDown } from 'lucide-react';

// Interface definitions
interface Review {
  id: string;
  username: string;
  date: string;
  rating: number;
  comment: string;
  pros: string[];
  cons: string[];
  photos: string[];
  helpful: number;
  notHelpful: number;
  userReacted?: 'helpful' | 'notHelpful';
}

interface GolfCourse {
  id: string;
  name: string;
  location: string;
  address: string;
  type: 'public' | 'private' | 'resort' | 'semi-private';
  holes: number;
  par: number;
  length: number;
  slope: number;
  rating: number;
  reviewCount: number;
  designer: string;
  yearBuilt: number;
  description: string;
  features: string[];
  amenities: string[];
  priceRange: string;
  images: string[];
  reviews: Review[];
}

// Mock data
const mockCourses: GolfCourse[] = [
  {
    id: '1',
    name: 'Pine Valley Golf Club',
    location: 'Pine Valley, NJ',
    address: '1 East Atlantic Ave, Pine Valley, NJ 08021',
    type: 'private',
    holes: 18,
    par: 70,
    length: 7057,
    slope: 155,
    rating: 4.9,
    reviewCount: 128,
    designer: 'George Crump & H.S. Colt',
    yearBuilt: 1918,
    description: 'Consistently ranked as one of the best golf courses in the world, Pine Valley offers a challenging and scenic golfing experience with deep bunkers and demanding holes.',
    features: [
      'Championship Course',
      'Bentgrass Greens',
      'Deep Bunkers',
      'Strategic Layout',
      'Natural Terrain'
    ],
    amenities: [
      'Pro Shop',
      'Locker Rooms',
      'Practice Facility',
      'Dining Room',
      'Lodging'
    ],
    priceRange: 'Member Only',
    images: [
      '/courses/pinevalley1.jpg',
      '/courses/pinevalley2.jpg'
    ],
    reviews: [
      {
        id: 'r1',
        username: 'GolfPro77',
        date: '2023-05-15',
        rating: 5,
        comment: 'Pure golf perfection. Every hole is memorable and presents a unique challenge. The par 3s are particularly spectacular.',
        pros: ['Course conditions', 'Design variety', 'History'],
        cons: ['Exclusivity'],
        photos: ['/reviews/pv_review1.jpg'],
        helpful: 32,
        notHelpful: 1
      },
      {
        id: 'r2',
        username: 'ScratchGolfer',
        date: '2023-06-22',
        rating: 5,
        comment: 'Most challenging course I\'ve ever played. The bunkers are incredibly deep and the greens are lightning fast. A true bucket list experience.',
        pros: ['Challenge', 'Beauty', 'Service'],
        cons: ['Difficulty for high handicappers'],
        photos: ['/reviews/pv_review2.jpg', '/reviews/pv_review3.jpg'],
        helpful: 28,
        notHelpful: 3
      }
    ]
  },
  {
    id: '2',
    name: 'Pebble Beach Golf Links',
    location: 'Pebble Beach, CA',
    address: '1700 17-Mile Drive, Pebble Beach, CA 93953',
    type: 'resort',
    holes: 18,
    par: 72,
    length: 7075,
    slope: 145,
    rating: 4.8,
    reviewCount: 256,
    designer: 'Jack Neville & Douglas Grant',
    yearBuilt: 1919,
    description: 'Featuring stunning ocean views on nearly every hole, Pebble Beach is one of the most famous golf courses in America and has hosted the U.S. Open six times.',
    features: [
      'Ocean Views',
      'Cliffside Holes',
      'Championship Course',
      'Historic Layout',
      'Iconic 7th Hole'
    ],
    amenities: [
      'Pro Shop',
      'Restaurants',
      'Spa',
      'Resort Lodging',
      'Practice Facility'
    ],
    priceRange: '$550-$600',
    images: [
      '/courses/pebblebeach1.jpg',
      '/courses/pebblebeach2.jpg'
    ],
    reviews: [
      {
        id: 'r3',
        username: 'TravelGolfer',
        date: '2023-04-10',
        rating: 5,
        comment: 'Worth every penny. The views are absolutely breathtaking, especially holes 7, 8, and 18. The staff makes you feel like royalty.',
        pros: ['Scenery', 'Service', 'History'],
        cons: ['Price', 'Pace of play'],
        photos: ['/reviews/pb_review1.jpg'],
        helpful: 47,
        notHelpful: 2
      },
      {
        id: 'r4',
        username: 'WeekendGolfer',
        date: '2023-07-05',
        rating: 4,
        comment: 'Amazing experience but be prepared for a long round due to lots of picture taking. The course is immaculate but the greens were a bit slower than expected.',
        pros: ['Ocean views', 'Course conditions'],
        cons: ['Crowds', 'Price'],
        photos: ['/reviews/pb_review2.jpg'],
        helpful: 35,
        notHelpful: 5
      }
    ]
  },
  {
    id: '3',
    name: 'Bethpage Black Course',
    location: 'Farmingdale, NY',
    address: '99 Quaker Meeting House Rd, Farmingdale, NY 11735',
    type: 'public',
    holes: 18,
    par: 71,
    length: 7468,
    slope: 155,
    rating: 4.7,
    reviewCount: 315,
    designer: 'A.W. Tillinghast',
    yearBuilt: 1936,
    description: 'Known for its difficulty, Bethpage Black has hosted the U.S. Open and PGA Championship. The famous sign at the first tee warns golfers about the challenging course ahead.',
    features: [
      'Championship Course',
      'Difficult Layout',
      'Deep Rough',
      'Elevated Greens',
      'Long Par 4s'
    ],
    amenities: [
      'Pro Shop',
      'Snack Bar',
      'Practice Range',
      'Putting Green',
      'Restaurant'
    ],
    priceRange: '$65-$150',
    images: [
      '/courses/bethpage1.jpg',
      '/courses/bethpage2.jpg'
    ],
    reviews: [
      {
        id: 'r5',
        username: 'NYGolfer',
        date: '2023-06-18',
        rating: 5,
        comment: 'Brutal but fair. Bring your A-game and don\'t expect to hit many greens in regulation. The rough is punishing, and the fairways aren\'t much easier!',
        pros: ['Challenge', 'Affordable', 'History'],
        cons: ['Crowded', 'Difficulty'],
        photos: ['/reviews/bb_review1.jpg'],
        helpful: 54,
        notHelpful: 3
      },
      {
        id: 'r6',
        username: 'MidHandicapper',
        date: '2023-08-12',
        rating: 4,
        comment: 'The warning sign isn\'t kidding. Shot my highest score in years, but loved every minute of it. The course is remarkably well maintained for the amount of play it gets.',
        pros: ['Value', 'Conditioning', 'Challenge'],
        cons: ['Pace of play', 'Rough too penal'],
        photos: [],
        helpful: 39,
        notHelpful: 4
      }
    ]
  }
];

const CourseRating: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState<GolfCourse | null>(null);
  
  // Filter courses based on search and filters
  const filteredCourses = mockCourses.filter(course => {
    // Search term filter
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         course.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Course type filter
    const matchesType = selectedType === 'all' || course.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  // Handle reaction to review (helpful/not helpful)
  const handleReviewReaction = (reviewId: string, type: 'helpful' | 'notHelpful') => {
    if (!selectedCourse) return;
    
    const updatedCourse = {...selectedCourse};
    const reviewIndex = updatedCourse.reviews.findIndex(r => r.id === reviewId);
    
    if (reviewIndex === -1) return;
    
    const review = updatedCourse.reviews[reviewIndex];
    
    // If user already reacted the same way, remove reaction
    if (review.userReacted === type) {
      review.userReacted = undefined;
      review[type] -= 1;
    } 
    // If user reacted the opposite way, swap reaction
    else if (review.userReacted) {
      const opposite = review.userReacted === 'helpful' ? 'notHelpful' : 'helpful';
      review[opposite] -= 1;
      review[type] += 1;
      review.userReacted = type;
    } 
    // If no previous reaction, add new reaction
    else {
      review[type] += 1;
      review.userReacted = type;
    }
    
    updatedCourse.reviews[reviewIndex] = review;
    setSelectedCourse(updatedCourse);
  };

  // Render stars for ratings
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const renderCourseType = (type: 'public' | 'private' | 'resort' | 'semi-private') => {
    const colors = {
      public: 'bg-green-100 text-green-800',
      private: 'bg-purple-100 text-purple-800',
      resort: 'bg-blue-100 text-blue-800',
      'semi-private': 'bg-orange-100 text-orange-800'
    };
    
    return (
      <Badge className={colors[type]}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Golf Course Reviews</CardTitle>
        <CardDescription>Discover and review top golf courses around the world</CardDescription>
      </CardHeader>
      <CardContent>
        {selectedCourse ? (
          // Detailed view of selected course
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <Button 
                variant="outline" 
                onClick={() => setSelectedCourse(null)}
                className="mb-4"
              >
                Back to Courses
              </Button>
              <div className="flex gap-2">
                <Button>Write a Review</Button>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center h-48">
                  <div className="text-center text-gray-500">
                    <p>[Course Image: {selectedCourse.name}]</p>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  <div>
                    <Label className="text-sm text-gray-500">Location</Label>
                    <p className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-500" /> 
                      {selectedCourse.address}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Course Details</Label>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p><span className="font-medium">Holes:</span> {selectedCourse.holes}</p>
                      <p><span className="font-medium">Par:</span> {selectedCourse.par}</p>
                      <p><span className="font-medium">Length:</span> {selectedCourse.length} yards</p>
                      <p><span className="font-medium">Slope:</span> {selectedCourse.slope}</p>
                      <p><span className="font-medium">Designer:</span> {selectedCourse.designer}</p>
                      <p><span className="font-medium">Year Built:</span> {selectedCourse.yearBuilt}</p>
                      <p><span className="font-medium">Price:</span> {selectedCourse.priceRange}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:w-2/3 space-y-4">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl font-bold">{selectedCourse.name}</h2>
                        {renderCourseType(selectedCourse.type)}
                      </div>
                      <p className="text-lg text-gray-500">{selectedCourse.location}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      {renderStars(selectedCourse.rating)}
                      <span className="text-sm text-gray-500">({selectedCourse.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">About this Course</h3>
                  <p className="text-gray-700">{selectedCourse.description}</p>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="features" className="w-full mt-6">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="features">Features & Amenities</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="features" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Course Features</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {selectedCourse.features.map((feature, index) => (
                        <li key={index} className="text-gray-700">{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Amenities</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {selectedCourse.amenities.map((amenity, index) => (
                        <li key={index} className="text-gray-700">{amenity}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="photos" className="space-y-4">
                <h3 className="text-lg font-semibold">Course Photos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedCourse.images.map((image, index) => (
                    <div key={index} className="bg-gray-100 rounded-lg p-4 h-48 flex items-center justify-center">
                      <div className="text-center text-gray-500 flex flex-col items-center gap-2">
                        <Image className="h-8 w-8" />
                        <p>[Course Image {index + 1}]</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Golfer Reviews</h3>
                  <Button>Add Your Review</Button>
                </div>
                
                <div className="space-y-6">
                  {selectedCourse.reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{review.username}</p>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                        {renderStars(review.rating)}
                      </div>
                      
                      <p className="text-gray-700">{review.comment}</p>
                      
                      <div className="flex gap-4 text-sm">
                        <div>
                          <p className="font-medium text-green-600">Pros:</p>
                          <ul className="list-disc pl-5">
                            {review.pros.map((pro, idx) => (
                              <li key={idx}>{pro}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium text-red-600">Cons:</p>
                          <ul className="list-disc pl-5">
                            {review.cons.map((con, idx) => (
                              <li key={idx}>{con}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      {review.photos.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Photos from {review.username}:</p>
                          <div className="flex gap-2 overflow-x-auto pb-2">
                            {review.photos.map((photo, idx) => (
                              <div key={idx} className="bg-gray-100 rounded-lg p-2 h-20 w-20 flex-shrink-0 flex items-center justify-center">
                                <div className="text-center text-gray-500 text-xs">
                                  <p>[Photo]</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 pt-2">
                        <span className="text-sm text-gray-500">Was this review helpful?</span>
                        <Button 
                          size="sm" 
                          variant={review.userReacted === 'helpful' ? 'default' : 'outline'} 
                          onClick={() => handleReviewReaction(review.id, 'helpful')}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" /> {review.helpful}
                        </Button>
                        <Button 
                          size="sm" 
                          variant={review.userReacted === 'notHelpful' ? 'default' : 'outline'} 
                          onClick={() => handleReviewReaction(review.id, 'notHelpful')}
                        >
                          <ThumbsDown className="h-4 w-4 mr-1" /> {review.notHelpful}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          // List view of courses
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search courses by name or location..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="w-full md:w-40">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Course Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="resort">Resort</SelectItem>
                    <SelectItem value="semi-private">Semi-Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.length > 0 ? (
                filteredCourses.map(course => (
                  <Card key={course.id} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedCourse(course)}>
                    <div className="bg-gray-100 h-40 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <p>[Course Image: {course.name}]</p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{course.name}</h3>
                        {renderCourseType(course.type)}
                      </div>
                      <p className="text-sm text-gray-500 flex items-center mb-2">
                        <MapPin className="h-3 w-3 mr-1" /> {course.location}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {renderStars(course.rating)}
                          <span className="ml-2 text-xs text-gray-500">({course.reviewCount})</span>
                        </div>
                        <p className="text-sm font-medium">{course.priceRange}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No courses found matching your filters.</p>
                  <Button 
                    variant="link" 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedType('all');
                    }}
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseRating; 