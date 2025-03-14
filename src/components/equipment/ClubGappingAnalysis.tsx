'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, AlertTriangle, ChevronRight, Award, Ruler, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { PlusCircle, Save } from 'lucide-react';

interface ClubData {
  id: string;
  name: string;
  type: string;
  averageDistance: number;
  minDistance: number;
  maxDistance: number;
}

const CLUB_TYPES = [
  { value: 'driver', label: 'Driver' },
  { value: 'wood', label: 'Fairway Wood' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'iron', label: 'Iron' },
  { value: 'wedge', label: 'Wedge' },
];

const ClubGappingAnalysis = () => {
  const [clubs, setClubs] = useState<ClubData[]>([]);
  const [newClub, setNewClub] = useState<Partial<ClubData>>({
    name: '',
    type: '',
    averageDistance: 0,
    minDistance: 0,
    maxDistance: 0
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [gapAnalysis, setGapAnalysis] = useState<{
    gaps: { start: number; end: number; size: number }[];
    overlaps: { start: number; end: number; clubs: string[] }[];
    recommendations: string[];
  } | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  // Sort clubs by average distance (descending)
  const sortedClubs = [...clubs].sort((a, b) => b.averageDistance - a.averageDistance);

  // Generate chart data
  const chartData = sortedClubs.map(club => ({
    name: club.name,
    min: club.minDistance,
    avg: club.averageDistance,
    max: club.maxDistance,
    range: club.maxDistance - club.minDistance
  }));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClub(prev => ({
      ...prev,
      [name]: name === 'name' || name === 'type' ? value : Number(value)
    }));
  };

  const addClub = () => {
    if (!newClub.name || !newClub.type) {
      setShowAlert(true);
      return;
    }

    const clubData: ClubData = {
      id: Date.now().toString(),
      name: newClub.name || '',
      type: newClub.type || '',
      averageDistance: newClub.averageDistance || 0,
      minDistance: newClub.minDistance || 0,
      maxDistance: newClub.maxDistance || 0
    };

    setClubs(prev => [...prev, clubData]);
    setNewClub({
      name: '',
      type: '',
      averageDistance: 0,
      minDistance: 0,
      maxDistance: 0
    });
    setShowAddForm(false);
    analyzeGaps();
  };

  const removeClub = (id: string) => {
    setClubs(prev => prev.filter(club => club.id !== id));
    analyzeGaps();
  };

  const analyzeGaps = () => {
    if (clubs.length < 2) {
      return;
    }

    // Sort clubs by average distance (descending)
    const sortedByDistance = [...clubs].sort((a, b) => b.averageDistance - a.averageDistance);
    
    // Find gaps
    const gaps = [];
    for (let i = 0; i < sortedByDistance.length - 1; i++) {
      const currentClub = sortedByDistance[i];
      const nextClub = sortedByDistance[i + 1];
      
      // Calculate gap between current club's min and next club's max
      const gapSize = currentClub.minDistance - nextClub.maxDistance;
      
      if (gapSize > 10) { // Gap threshold of 10 yards
        gaps.push({
          start: nextClub.maxDistance,
          end: currentClub.minDistance,
          size: gapSize
        });
      }
    }
    
    // Find overlaps
    const overlaps = [];
    for (let i = 0; i < sortedByDistance.length - 1; i++) {
      const currentClub = sortedByDistance[i];
      const nextClub = sortedByDistance[i + 1];
      
      // Calculate overlap
      const overlapStart = Math.max(nextClub.minDistance, currentClub.minDistance);
      const overlapEnd = Math.min(nextClub.maxDistance, currentClub.maxDistance);
      
      if (overlapEnd > overlapStart && (overlapEnd - overlapStart) > 20) { // Significant overlap threshold
        overlaps.push({
          start: overlapStart,
          end: overlapEnd,
          clubs: [currentClub.name, nextClub.name]
        });
      }
    }
    
    // Generate recommendations
    const recommendations = [];
    
    if (gaps.length > 0) {
      gaps.forEach(gap => {
        const midpoint = Math.round((gap.start + gap.end) / 2);
        recommendations.push(`Consider adding a club that carries around ${midpoint} yards to address the ${gap.size} yard gap.`);
      });
    }
    
    if (overlaps.length > 0) {
      overlaps.forEach(overlap => {
        recommendations.push(`${overlap.clubs.join(' and ')} have significant distance overlap (${Math.round(overlap.end - overlap.start)} yards). Consider adjusting your setup.`);
      });
    }
    
    // Check for large distance jumps
    for (let i = 0; i < sortedByDistance.length - 1; i++) {
      const currentClub = sortedByDistance[i];
      const nextClub = sortedByDistance[i + 1];
      
      const distanceJump = currentClub.averageDistance - nextClub.averageDistance;
      
      if (distanceJump > 30) { // Large jump threshold
        recommendations.push(`The distance jump from ${nextClub.name} (${nextClub.averageDistance} yards) to ${currentClub.name} (${currentClub.averageDistance} yards) is ${distanceJump} yards, which may be too large for consistent gapping.`);
      }
    }
    
    if (recommendations.length === 0) {
      recommendations.push("Your club gapping looks good! No significant gaps or overlaps detected.");
    }
    
    setGapAnalysis({
      gaps,
      overlaps,
      recommendations
    });
  };

  const saveData = () => {
    // In a real app, this would save to a database or localStorage
    localStorage.setItem('clubGappingData', JSON.stringify(clubs));
    alert('Your club data has been saved!');
  };

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('clubGappingData');
    if (savedData) {
      try {
        setClubs(JSON.parse(savedData));
      } catch (e) {
        console.error('Error loading saved club data', e);
      }
    }
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Club Gapping Analysis</CardTitle>
              <CardDescription>
                Track your club distances and analyze gaps in your golf bag
              </CardDescription>
            </div>
            <Button 
              onClick={() => setShowAddForm(!showAddForm)} 
              size="sm"
              variant={showAddForm ? "secondary" : "default"}
            >
              {showAddForm ? 'Cancel' : <><Plus className="mr-1 h-4 w-4" /> Add Club</>}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {showAlert && (
            <Alert variant="warning" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Missing Information</AlertTitle>
              <AlertDescription>
                Please provide at least a club name and type.
              </AlertDescription>
            </Alert>
          )}
          
          {showAddForm && (
            <Card className="mb-6 border border-primary/30 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Add New Club</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 items-end">
                  <div className="space-y-1.5">
                    <Label htmlFor="clubType">Type</Label>
                    <Select
                      value={newClub.type}
                      onValueChange={(value) => setNewClub({ ...newClub, type: value })}
                    >
                      <SelectTrigger id="clubType">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {CLUB_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="clubName">Name</Label>
                    <Input
                      id="clubName"
                      name="name"
                      placeholder="e.g. 7 Iron"
                      value={newClub.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="clubMinDistance">Min Distance (yards)</Label>
                    <Input
                      id="clubMinDistance"
                      name="minDistance"
                      type="number"
                      placeholder="165"
                      value={newClub.minDistance || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="clubMaxDistance">Max Distance (yards)</Label>
                    <Input
                      id="clubMaxDistance"
                      name="maxDistance"
                      type="number"
                      placeholder="180"
                      value={newClub.maxDistance || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="clubAverageDistance">Avg. Distance (yards)</Label>
                    <Input
                      id="clubAverageDistance"
                      name="averageDistance"
                      type="number"
                      placeholder="170"
                      value={newClub.averageDistance || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="col-span-2 md:col-span-6 flex justify-end">
                    <Button onClick={addClub} className="w-full md:w-auto">
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Club
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {clubs.length > 0 && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Club</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Avg. Distance</TableHead>
                    <TableHead>Min Distance</TableHead>
                    <TableHead>Max Distance</TableHead>
                    <TableHead>Range</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedClubs.map((club) => (
                    <TableRow key={club.id}>
                      <TableCell className="font-medium">{club.name}</TableCell>
                      <TableCell>{club.type}</TableCell>
                      <TableCell>{club.averageDistance} yards</TableCell>
                      <TableCell>{club.minDistance} yards</TableCell>
                      <TableCell>{club.maxDistance} yards</TableCell>
                      <TableCell>{club.maxDistance - club.minDistance} yards</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeClub(club.id)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="flex flex-col space-y-4">
                <div className="flex space-x-4">
                  <Button onClick={analyzeGaps} className="flex-1">
                    Analyze Gaps
                  </Button>
                  <Button onClick={saveData} variant="outline" className="flex-1">
                    <Save className="mr-2 h-4 w-4" /> Save Data
                  </Button>
                </div>

                {chartData.length > 0 && (
                  <div className="h-80 w-full mt-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 'dataMax + 20']} label={{ value: 'Distance (yards)', position: 'insideBottom', offset: -5 }} />
                        <YAxis dataKey="name" type="category" width={80} />
                        <Tooltip 
                          formatter={(value, name) => {
                            if (name === 'range') return [`${value} yards`, 'Distance Range'];
                            if (name === 'avg') return [`${value} yards`, 'Average Distance'];
                            return [`${value} yards`, name === 'min' ? 'Minimum' : 'Maximum'];
                          }}
                        />
                        <Bar dataKey="range" fill="#8884d8" radius={[0, 4, 4, 0]}>
                          {/* This creates a range bar from min to max */}
                        </Bar>
                        <ReferenceLine x={0} stroke="#000" />
                        {gapAnalysis?.gaps.map((gap, index) => (
                          <ReferenceLine 
                            key={`gap-${index}`}
                            x={(gap.start + gap.end) / 2} 
                            stroke="red" 
                            strokeDasharray="3 3"
                            label={{ value: `${gap.size}yd gap`, position: 'top' }}
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {gapAnalysis && (
                  <div className="mt-6 p-4 border rounded-lg bg-slate-50">
                    <h3 className="text-lg font-semibold mb-2">Analysis Results</h3>
                    
                    {gapAnalysis.recommendations.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-1">Recommendations:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {gapAnalysis.recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {gapAnalysis.gaps.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-1">Identified Gaps:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {gapAnalysis.gaps.map((gap, index) => (
                            <li key={index}>
                              {gap.size} yard gap between {gap.start} and {gap.end} yards
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {gapAnalysis.overlaps.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-1">Significant Overlaps:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {gapAnalysis.overlaps.map((overlap, index) => (
                            <li key={index}>
                              {overlap.clubs.join(' and ')} overlap by {Math.round(overlap.end - overlap.start)} yards 
                              ({overlap.start} to {overlap.end} yards)
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
        
        <CardFooter className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>For most players, ideal club gapping is between 10-15 yards between consecutive clubs.</p>
          </div>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-gray-100 dark:border-gray-800">
              <h4 className="font-medium text-base mb-2 flex items-center">
                <Award className="mr-2 h-5 w-5 text-green-500" />
                Maximize Your Set Efficiency
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                The modern approach to club gapping focuses on even spacing between clubs, typically 10-15 yards for irons. Consider a club fitting session to ensure your specific swing produces optimal gaps.
              </p>
              <Button className="mt-4 group" variant="outline" size="sm">
                Book a Professional Fitting
                <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </div>
            
            <div className="p-4 rounded-lg border border-gray-100 dark:border-gray-800">
              <h4 className="font-medium text-base mb-2">Common Gap Solutions</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Large gap between 3-wood and 5-iron? Consider adding a hybrid.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Short game distance control issues? Add specialist wedges with specific lofts.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Consistent 20+ yard gaps? Consider a different set composition with more evenly spaced lofts.</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { ClubGappingAnalysis }; 