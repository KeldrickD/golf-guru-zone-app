import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Slider } from "@/components/ui/Slider";
import { Star, Search, Filter, ThumbsUp, ThumbsDown, Share2 } from 'lucide-react';

// Type definitions
interface Review {
  id: string;
  username: string;
  date: string;
  rating: number;
  pros: string[];
  cons: string[];
  comment: string;
  helpful: number;
  notHelpful: number;
  userReacted?: 'helpful' | 'notHelpful';
}

interface EquipmentItem {
  id: string;
  name: string;
  brand: string;
  category: 'driver' | 'iron' | 'putter' | 'wedge' | 'hybrid' | 'fairwayWood' | 'ball' | 'accessory';
  image: string;
  price: number;
  rating: number;
  reviewCount: number;
  releaseYear: number;
  description: string;
  features: string[];
  pros: string[];
  cons: string[];
  reviews: Review[];
  specifications: Record<string, string>;
}

// Mock data
const mockEquipment: EquipmentItem[] = [
  {
    id: '1',
    name: 'TaylorMade Stealth 2 Driver',
    brand: 'TaylorMade',
    category: 'driver',
    image: '/equipment/driver1.jpg',
    price: 599.99,
    rating: 4.7,
    reviewCount: 156,
    releaseYear: 2023,
    description: 'The TaylorMade Stealth 2 Driver features a 60X Carbon Twist Face designed to enhance ball speed and deliver unprecedented distance.',
    features: [
      '60X Carbon Twist Face',
      'Nanotexture Technology',
      'Inertia Generator',
      'Adjustable Loft Sleeve'
    ],
    pros: [
      'Exceptional forgiveness on off-center hits',
      'Significant distance gains',
      'Satisfying sound at impact',
      'Premium look and feel'
    ],
    cons: [
      'Premium price point',
      'Similar performance to previous model',
      'Limited customization options'
    ],
    reviews: [
      {
        id: 'r1',
        username: 'GolfPro77',
        date: '2023-04-15',
        rating: 5,
        pros: ['Distance', 'Forgiveness'],
        cons: ['Price'],
        comment: 'Gained about 15 yards off the tee compared to my previous driver. The forgiveness is incredible, and mishits still find the fairway.',
        helpful: 24,
        notHelpful: 2
      },
      {
        id: 'r2',
        username: 'WeekendGolfer',
        date: '2023-05-22',
        rating: 4,
        pros: ['Sound', 'Feel'],
        cons: ['Adjustment learning curve'],
        comment: 'Great driver overall, took me a while to find the right settings but now it\'s dialed in perfectly for my swing.',
        helpful: 18,
        notHelpful: 3
      }
    ],
    specifications: {
      'Loft Options': '9°, 10.5°, 12°',
      'Shaft': 'Fujikura Ventus TR Red 5',
      'Clubhead Size': '460cc',
      'Adjustability': 'Loft Sleeve (±2°)',
      'Hand Availability': 'Right, Left'
    }
  },
  {
    id: '2',
    name: 'Callaway Paradym Irons',
    brand: 'Callaway',
    category: 'iron',
    image: '/equipment/iron1.jpg',
    price: 1299.99,
    rating: 4.8,
    reviewCount: 98,
    releaseYear: 2023,
    description: 'The Callaway Paradym Irons feature Artificial Intelligence-designed face patterns for optimal speed and spin consistency across the face.',
    features: [
      'A.I.-designed Flash Face',
      'Urethane Microspheres',
      'Tungsten Energy Core',
      'Premium Forged Body'
    ],
    pros: [
      'Exceptional ball speed across the face',
      'Great feel for a game-improvement iron',
      'Consistent distance control',
      'Pleasing sound at impact'
    ],
    cons: [
      'High price point',
      'May be too much offset for better players',
      'Limited workability'
    ],
    reviews: [
      {
        id: 'r3',
        username: 'IronMaster',
        date: '2023-03-10',
        rating: 5,
        pros: ['Distance consistency', 'Forgiveness'],
        cons: ['Premium price'],
        comment: 'These irons have transformed my mid-to-long iron play. The forgiveness is incredible and I\'ve gained about a club length in distance.',
        helpful: 34,
        notHelpful: 1
      },
      {
        id: 'r4',
        username: 'SeniorGolfer',
        date: '2023-06-05',
        rating: 4,
        pros: ['Ease of launch', 'Forgiveness'],
        cons: ['Limited workability'],
        comment: 'At my age, I need help getting the ball airborne. These irons make it so much easier to get good height and distance.',
        helpful: 22,
        notHelpful: 2
      }
    ],
    specifications: {
      'Set Composition': '4-PW, AW',
      'Shaft Options': 'Steel (True Temper Elevate 95), Graphite (UST Mamiya Recoil Dart)',
      'Stock Grip': 'Golf Pride Tour Velvet 360',
      'Construction': 'Hollow Body with Forged Face',
      'Hand Availability': 'Right, Left'
    }
  },
  {
    id: '3',
    name: 'Titleist Pro V1x Golf Balls',
    brand: 'Titleist',
    category: 'ball',
    image: '/equipment/ball1.jpg',
    price: 49.99,
    rating: 4.9,
    reviewCount: 324,
    releaseYear: 2023,
    description: 'The Titleist Pro V1x offers high flight, low long game spin, and high short game spin with a firm feel.',
    features: [
      'Cast Urethane Elastomer Cover',
      'Reformulated 2.0 ZG Process Core',
      'High Flex Casing Layer',
      'Spherically-tiled 348 Tetrahedral Dimple Design'
    ],
    pros: [
      'Exceptional distance with driver',
      'Consistent flight in windy conditions',
      'Superior greenside control',
      'Excellent durability'
    ],
    cons: [
      'Premium price point',
      'May be too firm for some players',
      'Higher swing speed requirement for optimal performance'
    ],
    reviews: [
      {
        id: 'r5',
        username: 'ScratchPlayer',
        date: '2023-02-08',
        rating: 5,
        pros: ['Control', 'Consistency'],
        cons: ['Price'],
        comment: 'Best ball in golf. Period. The consistency is unmatched and the control around the greens gives me confidence in my short game.',
        helpful: 45,
        notHelpful: 3
      },
      {
        id: 'r6',
        username: 'MidHandicapper',
        date: '2023-04-30',
        rating: 4,
        pros: ['Durability', 'Feel'],
        cons: ['Price', 'Swing speed requirements'],
        comment: 'Great ball but I\'m not sure my swing speed fully optimizes it. Still, I love the feel and trust the brand.',
        helpful: 19,
        notHelpful: 7
      }
    ],
    specifications: {
      'Construction': '4-piece',
      'Cover': 'Cast Urethane Elastomer',
      'Dimple Pattern': '348 Tetrahedral Dimples',
      'Compression': 'High',
      'Feel': 'Firm',
      'Color Options': 'White, Yellow'
    }
  }
];

const EquipmentReview: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [selectedItem, setSelectedItem] = useState<EquipmentItem | null>(null);
  
  // Get unique brands from equipment
  const brands = ['all', ...Array.from(new Set(mockEquipment.map(item => item.brand)))];
  
  // Filter equipment based on search and filters
  const filteredEquipment = mockEquipment.filter(item => {
    // Search term filter
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    // Brand filter
    const matchesBrand = selectedBrand === 'all' || item.brand === selectedBrand;
    
    // Price filter
    const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });

  // Handle reaction to review (helpful/not helpful)
  const handleReviewReaction = (reviewId: string, type: 'helpful' | 'notHelpful') => {
    if (!selectedItem) return;
    
    const updatedItem = {...selectedItem};
    const reviewIndex = updatedItem.reviews.findIndex(r => r.id === reviewId);
    
    if (reviewIndex === -1) return;
    
    const review = updatedItem.reviews[reviewIndex];
    
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
    
    updatedItem.reviews[reviewIndex] = review;
    setSelectedItem(updatedItem);
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Equipment Reviews</CardTitle>
        <CardDescription>Research and compare the latest golf equipment with expert and user reviews.</CardDescription>
      </CardHeader>
      <CardContent>
        {selectedItem ? (
          // Detailed view of selected equipment
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <Button 
                variant="outline" 
                onClick={() => setSelectedItem(null)}
                className="mb-4"
              >
                Back to Equipment List
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center h-64">
                  <div className="text-center text-gray-500">
                    <p>[Product Image: {selectedItem.name}]</p>
                  </div>
                </div>
              </div>
              
              <div className="md:w-2/3 space-y-4">
                <div>
                  <Badge className="mb-2">{selectedItem.category}</Badge>
                  <h2 className="text-2xl font-bold">{selectedItem.name}</h2>
                  <p className="text-lg text-gray-500">{selectedItem.brand} • {selectedItem.releaseYear}</p>
                  <div className="flex items-center mt-2">
                    {renderStars(selectedItem.rating)}
                    <span className="ml-2 text-sm text-gray-500">({selectedItem.reviewCount} reviews)</span>
                  </div>
                  <p className="text-xl font-bold mt-2">${selectedItem.price.toFixed(2)}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">Description</h3>
                  <p className="text-gray-700">{selectedItem.description}</p>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="features" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="proscons">Pros & Cons</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="features" className="space-y-4">
                <h3 className="text-lg font-semibold">Key Features</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {selectedItem.features.map((feature, index) => (
                    <li key={index} className="text-gray-700">{feature}</li>
                  ))}
                </ul>
              </TabsContent>
              
              <TabsContent value="specifications" className="space-y-4">
                <h3 className="text-lg font-semibold">Technical Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(selectedItem.specifications).map(([key, value], index) => (
                    <div key={index} className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">{key}</span>
                      <span className="text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="proscons" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-green-600">Pros</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {selectedItem.pros.map((pro, index) => (
                        <li key={index} className="text-gray-700">{pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-red-600">Cons</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {selectedItem.cons.map((con, index) => (
                        <li key={index} className="text-gray-700">{con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">User Reviews</h3>
                  <Button>Write a Review</Button>
                </div>
                
                <div className="space-y-6">
                  {selectedItem.reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{review.username}</p>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                        {renderStars(review.rating)}
                      </div>
                      
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
                      
                      <p className="text-gray-700">{review.comment}</p>
                      
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
          // List view of equipment
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search equipment..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <div className="w-40">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="driver">Drivers</SelectItem>
                      <SelectItem value="iron">Irons</SelectItem>
                      <SelectItem value="putter">Putters</SelectItem>
                      <SelectItem value="wedge">Wedges</SelectItem>
                      <SelectItem value="hybrid">Hybrids</SelectItem>
                      <SelectItem value="fairwayWood">Fairway Woods</SelectItem>
                      <SelectItem value="ball">Golf Balls</SelectItem>
                      <SelectItem value="accessory">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-40">
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger>
                      <SelectValue placeholder="Brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map(brand => (
                        <SelectItem key={brand} value={brand}>
                          {brand === 'all' ? 'All Brands' : brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button variant="outline" onClick={() => {
                  // Reset filters
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedBrand('all');
                  setPriceRange([0, 1500]);
                }}>
                  Clear
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Price Range: ${priceRange[0]} - ${priceRange[1]}</Label>
              </div>
              <Slider
                min={0}
                max={1500}
                step={25}
                value={priceRange}
                onValueChange={setPriceRange}
                className="py-4"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEquipment.length > 0 ? (
                filteredEquipment.map(item => (
                  <Card key={item.id} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedItem(item)}>
                    <div className="bg-gray-100 h-40 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <p>[Product Image: {item.name}]</p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <Badge className="mb-2">{item.category}</Badge>
                      <h3 className="font-semibold truncate">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.brand}</p>
                      <div className="flex items-center mt-2">
                        {renderStars(item.rating)}
                        <span className="ml-2 text-xs text-gray-500">({item.reviewCount})</span>
                      </div>
                      <p className="font-bold mt-2">${item.price.toFixed(2)}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No equipment found matching your filters.</p>
                  <Button 
                    variant="link" 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                      setSelectedBrand('all');
                      setPriceRange([0, 1500]);
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

export default EquipmentReview; 