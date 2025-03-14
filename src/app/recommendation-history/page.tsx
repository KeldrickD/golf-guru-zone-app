'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/components/SessionProvider';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { Loader2, Star, AlertCircle } from 'lucide-react';

// Define types for recommendations
interface Recommendation {
  id: string;
  date: string;
  category: string;
  recommendationType: string;
  recommendation: string;
  details: string;
  actions: string;
  saved: boolean;
}

// Mock recommendation data - in a real app, this would come from your API
const mockRecommendations: Recommendation[] = [
  {
    id: 'rec_001',
    date: '2023-09-15',
    category: 'Equipment',
    recommendationType: 'Driver',
    recommendation: 'TaylorMade Stealth Plus+ Driver',
    details: 'Based on your swing speed of 95mph and slight slice tendency, this driver with adjustable weights would help improve accuracy.',
    actions: 'View Details',
    saved: true,
  },
  {
    id: 'rec_002',
    date: '2023-09-10',
    category: 'Technique',
    recommendationType: 'Swing',
    recommendation: 'Work on hip rotation during downswing',
    details: 'Analysis of your recent swing videos shows limited hip rotation, resulting in over-the-top move. Specific drills recommended.',
    actions: 'View Drills',
    saved: false,
  },
  {
    id: 'rec_003',
    date: '2023-09-01',
    category: 'Course Management',
    recommendationType: 'Strategy',
    recommendation: 'Club selection on par 5s',
    details: 'Data shows you attempt to reach par 5s in two too often, resulting in penalty strokes. Laying up to your ideal wedge distance would lower your scores.',
    actions: 'View Stats',
    saved: true,
  },
  {
    id: 'rec_004',
    date: '2023-08-25',
    category: 'Equipment',
    recommendationType: 'Putter',
    recommendation: 'Odyssey White Hot OG #7',
    details: 'Your putting statistics indicate a face-balanced mallet putter would improve your consistency on short and medium-length putts.',
    actions: 'View Details',
    saved: false,
  },
  {
    id: 'rec_005',
    date: '2023-08-20',
    category: 'Training',
    recommendationType: 'Practice Plan',
    recommendation: 'Short game focus routine',
    details: 'Based on your stats, dedicating 70% of practice time to shots inside 100 yards would most quickly lower your handicap.',
    actions: 'View Plan',
    saved: true,
  },
];

export default function RecommendationHistory() {
  const { status } = useSession();
  const [activeTab, setActiveTab] = useState('all');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call to fetch recommendations
    const fetchRecommendations = async () => {
      setLoading(true);
      // In a real app, you would fetch from your API based on the user's session
      // const response = await fetch(`/api/recommendations?userId=${session.user.id}`);
      // const data = await response.json();
      
      // Using mock data for now
      setTimeout(() => {
        setRecommendations(mockRecommendations);
        setLoading(false);
      }, 1000);
    };

    if (status === 'authenticated') {
      fetchRecommendations();
    } else if (status !== 'loading') {
      setLoading(false);
    }
  }, [status]);

  const filteredRecommendations = recommendations.filter(rec => {
    if (activeTab === 'all') return true;
    if (activeTab === 'saved') return rec.saved;
    return rec.category.toLowerCase() === activeTab.toLowerCase();
  });

  // Toggle save state for a recommendation
  const toggleSave = (id: string) => {
    setRecommendations(recommendations.map(rec => 
      rec.id === id ? { ...rec, saved: !rec.saved } : rec
    ));
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading recommendations...</span>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            Please sign in to view your recommendation history
          </AlertDescription>
        </Alert>
        <Card>
          <CardHeader>
            <CardTitle>Recommendation History</CardTitle>
            <CardDescription>
              Sign in to view personalized recommendations based on your golf profile and activity.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-10">
            <Button variant="default" asChild>
              <a href="/signin">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Recommendations</h1>
            <p className="text-muted-foreground">
          View and manage all personalized recommendations from Golf Guru.
        </p>
        </div>

      <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="Equipment">Equipment</TabsTrigger>
          <TabsTrigger value="Technique">Technique</TabsTrigger>
          <TabsTrigger value="Course Management">Course</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
              <Card>
                <CardHeader>
              <CardTitle>{activeTab === 'saved' ? 'Saved Recommendations' : `${activeTab === 'all' ? 'All' : activeTab} Recommendations`}</CardTitle>
                  <CardDescription>
                {activeTab === 'saved' 
                  ? 'Recommendations you\'ve saved for future reference' 
                  : `${activeTab === 'all' ? 'All personalized' : activeTab} recommendations based on your golf data`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
              {filteredRecommendations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No recommendations found in this category.</p>
                    </div>
              ) : (
                <Table>
                  <TableCaption>Total: {filteredRecommendations.length} recommendations</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Recommendation</TableHead>
                      <TableHead className="hidden md:table-cell">Details</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecommendations.map((rec) => (
                      <TableRow key={rec.id}>
                        <TableCell className="font-medium">{rec.date}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{rec.category}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {rec.recommendation}
                          {rec.saved && (
                            <Star 
                              className="inline-block ml-2 h-4 w-4 fill-yellow-400 text-yellow-400 cursor-pointer" 
                              onClick={() => toggleSave(rec.id)}
                            />
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-xs truncate">
                          {rec.details}
                        </TableCell>
                          <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">{rec.actions}</Button>
                            {!rec.saved && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => toggleSave(rec.id)}
                              >
                                Save
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 