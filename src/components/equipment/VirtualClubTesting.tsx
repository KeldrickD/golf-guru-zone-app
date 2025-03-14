import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/Tabs";
import { GolfBall, Maximize2, PlayCircle, BarChart3, Goal, Gamepad2 } from 'lucide-react';

// Types and interfaces
interface ClubModel {
  id: string;
  brand: string;
  model: string;
  year: number;
  clubType: string;
  imageUrl: string;
  technology: string[];
  price: number;
}

interface PlayerProfile {
  swingSpeed: number;
  attackAngle: number;
  spinRate: number;
  skillLevel: string;
}

interface SimulationResult {
  distance: number;
  accuracy: number;
  dispersion: number;
  spinRate: number;
  launchAngle: number;
  ballSpeed: number;
  smashFactor: number;
  carriedHazards: boolean;
  fairwaysHit: number;
  greensHit: number;
}

// Sample data for models
const driverModels: ClubModel[] = [
  {
    id: 'taylormade-stealth',
    brand: 'TaylorMade',
    model: 'Stealth Plus',
    year: 2023,
    clubType: 'Driver',
    imageUrl: '/images/clubs/taylormade-stealth.jpg',
    technology: ['Carbon Fiber Face', 'Speed Pocket', 'Twist Face'],
    price: 599
  },
  {
    id: 'callaway-paradym',
    brand: 'Callaway',
    model: 'Paradym',
    year: 2023,
    clubType: 'Driver',
    imageUrl: '/images/clubs/callaway-paradym.jpg',
    technology: ['Jailbreak A.I.', 'Flash Face SS21', 'Triaxial Carbon'],
    price: 579
  },
  {
    id: 'ping-g430',
    brand: 'Ping',
    model: 'G430 Max',
    year: 2023,
    clubType: 'Driver',
    imageUrl: '/images/clubs/ping-g430.jpg',
    technology: ['Carbonfly Wrap', 'Precision-Milled Face', 'Dragonfly Technology'],
    price: 549
  },
];

const ironModels: ClubModel[] = [
  {
    id: 'mizuno-jpx',
    brand: 'Mizuno',
    model: 'JPX 923 Forged',
    year: 2023,
    clubType: 'Irons',
    imageUrl: '/images/clubs/mizuno-jpx.jpg',
    technology: ['Chromoly 4140M', 'Harmonic Impact Technology', 'Stability Frame'],
    price: 1299
  },
  {
    id: 'titleist-t200',
    brand: 'Titleist',
    model: 'T200',
    year: 2023,
    clubType: 'Irons',
    imageUrl: '/images/clubs/titleist-t200.jpg',
    technology: ['Max Impact Technology', 'D18 Tungsten Weighting', 'Muscle Plate'],
    price: 1399
  },
];

// Courses for virtual testing
const virtualCourses = [
  { id: 'pebble', name: 'Pebble Beach Golf Links', difficulty: 'Pro' },
  { id: 'stAndrews', name: 'St Andrews Links - Old Course', difficulty: 'Pro' },
  { id: 'bethpage', name: 'Bethpage Black', difficulty: 'Pro' },
  { id: 'pinehurst', name: 'Pinehurst No. 2', difficulty: 'Expert' },
  { id: 'torrey', name: 'Torrey Pines South', difficulty: 'Expert' },
  { id: 'harbour', name: 'Harbour Town Golf Links', difficulty: 'Intermediate' },
  { id: 'tpc', name: 'TPC Sawgrass', difficulty: 'Expert' },
  { id: 'local', name: 'Local Municipal Course', difficulty: 'Beginner' },
];

export const VirtualClubTesting: React.FC = () => {
  const [selectedClubType, setSelectedClubType] = useState<string>('driver');
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>({
    swingSpeed: 95,
    attackAngle: -2,
    spinRate: 2800,
    skillLevel: 'intermediate',
  });
  
  const [selectedModel, setSelectedModel] = useState<ClubModel | null>(null);
  const [selectedCourse, setSelectedCourse] = useState(virtualCourses[7]); // Default to local course
  const [showSimulation, setShowSimulation] = useState(false);
  const [simulationResults, setSimulationResults] = useState<SimulationResult | null>(null);
  
  const availableModels = selectedClubType === 'driver' ? driverModels : ironModels;
  
  const updatePlayerStat = (stat: keyof PlayerProfile, value: any) => {
    setPlayerProfile({ ...playerProfile, [stat]: value });
  };

  const handleModelSelect = (modelId: string) => {
    const model = availableModels.find(m => m.id === modelId);
    if (model) {
      setSelectedModel(model);
      // Reset simulation when changing models
      setShowSimulation(false);
      setSimulationResults(null);
    }
  };
  
  const runSimulation = () => {
    if (!selectedModel) return;
    
    // Base distances by club type and skill level
    const baseDistancesMap: Record<string, Record<string, number>> = {
      driver: {
        beginner: 200,
        intermediate: 240,
        advanced: 275
      },
      irons: {
        beginner: 135,
        intermediate: 160,
        advanced: 180
      }
    };
    
    // Base accuracy by skill level (higher is worse)
    const baseDispersionMap: Record<string, number> = {
      beginner: 45,
      intermediate: 30,
      advanced: 20
    };

    // Calculate distance based on club, swing speed, and attack angle
    const baseDistance = baseDistancesMap[selectedClubType][playerProfile.skillLevel];
    let distanceModifier = 1;
    
    // Swing speed impact (every 10mph over/under 90 is ~8% distance change)
    distanceModifier += (playerProfile.swingSpeed - 90) * 0.008;
    
    // Attack angle impact for drivers (positive attack angle adds distance)
    if (selectedClubType === 'driver') {
      distanceModifier += playerProfile.attackAngle * 0.01;
    }
    
    // Club technology impact (newer clubs perform slightly better)
    distanceModifier += (selectedModel.year - 2020) * 0.01;
    
    // Calculate metrics
    const distance = Math.round(baseDistance * distanceModifier);
    const spinRate = Math.round(playerProfile.spinRate * (1 + (selectedModel.year - 2022) * 0.02));
    const baseDispersion = baseDispersionMap[playerProfile.skillLevel];
    const dispersion = Math.round(baseDispersion * (1 - (selectedModel.year - 2020) * 0.05));
    const ballSpeed = Math.round(playerProfile.swingSpeed * 1.45);
    const launchAngle = selectedClubType === 'driver' 
      ? 12 + playerProfile.attackAngle * 0.5 
      : 18 - playerProfile.attackAngle * 0.3;
    const smashFactor = selectedClubType === 'driver' ? 1.48 : 1.38;
    
    // Course performance stats
    let fairwaysHit = 0;
    let greensHit = 0;
    
    // Simulate 9 holes
    if (selectedClubType === 'driver') {
      // Fairways hit based on dispersion and course difficulty
      const difficultyFactor = selectedCourse.difficulty === 'Pro' ? 0.6 : 
                              selectedCourse.difficulty === 'Expert' ? 0.7 : 
                              selectedCourse.difficulty === 'Intermediate' ? 0.8 : 0.9;
      
      fairwaysHit = Math.round(7 * (1 - dispersion/100) * difficultyFactor);
    } else {
      // Greens hit for irons
      const difficultyFactor = selectedCourse.difficulty === 'Pro' ? 0.65 : 
                              selectedCourse.difficulty === 'Expert' ? 0.75 : 
                              selectedCourse.difficulty === 'Intermediate' ? 0.85 : 0.95;
      
      greensHit = Math.round(9 * (1 - dispersion/120) * difficultyFactor);
    }
    
    // Determine if hazards were carried based on distance and difficulty
    const carriedHazards = distance > (
      selectedCourse.difficulty === 'Pro' ? 265 : 
      selectedCourse.difficulty === 'Expert' ? 245 : 
      selectedCourse.difficulty === 'Intermediate' ? 225 : 215
    );
    
    // Set results
    setSimulationResults({
      distance,
      accuracy: 100 - dispersion,
      dispersion,
      spinRate,
      launchAngle,
      ballSpeed,
      smashFactor,
      carriedHazards,
      fairwaysHit,
      greensHit
    });
    
    setShowSimulation(true);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5 text-primary" />
            <span>Virtual Club Testing</span>
          </CardTitle>
          <CardDescription>
            Test different club models with your swing metrics to see simulated performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-3">Your Swing Profile</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="clubType">Club Type</Label>
                      <Select
                        value={selectedClubType}
                        onValueChange={(value) => {
                          setSelectedClubType(value);
                          setSelectedModel(null);
                          setShowSimulation(false);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select club type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="driver">Driver</SelectItem>
                          <SelectItem value="irons">Irons</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="swingSpeed">Swing Speed (mph)</Label>
                      <Input
                        id="swingSpeed"
                        type="number"
                        value={playerProfile.swingSpeed}
                        onChange={(e) => updatePlayerStat('swingSpeed', parseInt(e.target.value) || 0)}
                        min={60}
                        max={140}
                      />
                      <div className="text-xs text-muted-foreground">
                        Average male: 93-95 mph. Average female: 65-70 mph.
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="attackAngle">Attack Angle (degrees)</Label>
                      <Select
                        value={playerProfile.attackAngle.toString()}
                        onValueChange={(value) => updatePlayerStat('attackAngle', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select attack angle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="-5">Steep (-5°)</SelectItem>
                          <SelectItem value="-3">Moderately Steep (-3°)</SelectItem>
                          <SelectItem value="-1">Slightly Steep (-1°)</SelectItem>
                          <SelectItem value="0">Neutral (0°)</SelectItem>
                          <SelectItem value="2">Slightly Upward (+2°)</SelectItem>
                          <SelectItem value="4">Upward (+4°)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="skillLevel">Skill Level</Label>
                      <Select
                        value={playerProfile.skillLevel}
                        onValueChange={(value) => updatePlayerStat('skillLevel', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select skill level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner (25+ handicap)</SelectItem>
                          <SelectItem value="intermediate">Intermediate (10-24 handicap)</SelectItem>
                          <SelectItem value="advanced">Advanced (0-9 handicap)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="course">Virtual Course</Label>
                      <Select
                        value={selectedCourse.id}
                        onValueChange={(value) => {
                          const course = virtualCourses.find(c => c.id === value);
                          if (course) setSelectedCourse(course);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select virtual course" />
                        </SelectTrigger>
                        <SelectContent>
                          {virtualCourses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                              {course.name} ({course.difficulty})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-3">Select Club Model</h3>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {availableModels.map((model) => (
                      <Card 
                        key={model.id}
                        className={`cursor-pointer transition-all hover:border-primary ${selectedModel?.id === model.id ? 'border-primary bg-primary/5' : ''}`}
                        onClick={() => handleModelSelect(model.id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center shrink-0">
                              <GolfBall className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium">{model.brand} {model.model}</h4>
                              <p className="text-xs text-muted-foreground">{model.year} | ${model.price}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-center">
              <Button 
                size="lg"
                onClick={runSimulation}
                disabled={!selectedModel}
                className="bg-primary"
              >
                <PlayCircle className="h-5 w-5 mr-2" />
                Run Virtual Test
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {showSimulation && simulationResults && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>Virtual Test Results</span>
            </CardTitle>
            <CardDescription>
              Simulated performance with {selectedModel?.brand} {selectedModel?.model} at {selectedCourse.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="performance" className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="performance" className="flex items-center gap-1">
                  <Maximize2 className="h-4 w-4" />
                  <span>Swing Data</span>
                </TabsTrigger>
                <TabsTrigger value="course" className="flex items-center gap-1">
                  <Goal className="h-4 w-4" />
                  <span>Course Performance</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="performance">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="bg-muted/30 p-4 rounded-lg text-center">
                    <h4 className="text-xs text-muted-foreground mb-1">Carry Distance</h4>
                    <div className="text-2xl font-bold text-primary">{simulationResults.distance} <span className="text-sm font-normal">yds</span></div>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg text-center">
                    <h4 className="text-xs text-muted-foreground mb-1">Ball Speed</h4>
                    <div className="text-2xl font-bold">{simulationResults.ballSpeed} <span className="text-sm font-normal">mph</span></div>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg text-center">
                    <h4 className="text-xs text-muted-foreground mb-1">Launch Angle</h4>
                    <div className="text-2xl font-bold">{simulationResults.launchAngle.toFixed(1)}° </div>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg text-center">
                    <h4 className="text-xs text-muted-foreground mb-1">Spin Rate</h4>
                    <div className="text-2xl font-bold">{simulationResults.spinRate} <span className="text-sm font-normal">rpm</span></div>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg text-center">
                    <h4 className="text-xs text-muted-foreground mb-1">Accuracy</h4>
                    <div className="text-2xl font-bold">{simulationResults.accuracy}%</div>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg text-center">
                    <h4 className="text-xs text-muted-foreground mb-1">Smash Factor</h4>
                    <div className="text-2xl font-bold">{simulationResults.smashFactor.toFixed(2)}</div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-medium mb-2">Club Insights:</h4>
                  <ul className="space-y-2 text-sm">
                    {selectedModel?.technology.map((tech, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-primary">•</span>
                        <span><strong>{tech}</strong> - {getTechnologyEffect(tech)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="course">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedClubType === 'driver' ? (
                    <>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="font-medium mb-3">Fairways Hit</h4>
                        <div className="text-4xl font-bold text-primary">{simulationResults.fairwaysHit} <span className="text-lg font-normal">/ 9</span></div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {simulationResults.fairwaysHit >= 7 ? 'Excellent accuracy' : 
                          simulationResults.fairwaysHit >= 5 ? 'Good accuracy' : 'Could use improvement'}
                        </p>
                      </div>
                      
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="font-medium mb-3">Hazards Carried</h4>
                        <div className="text-xl font-bold flex items-center gap-2">
                          {simulationResults.carriedHazards ? (
                            <>
                              <span className="text-green-600">Yes</span>
                              <span className="text-sm font-normal text-muted-foreground">Your drives clear typical hazards on {selectedCourse.name}</span>
                            </>
                          ) : (
                            <>
                              <span className="text-red-500">No</span>
                              <span className="text-sm font-normal text-muted-foreground">You may struggle with some hazard carries on this course</span>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Average carry needed: {selectedCourse.difficulty === 'Pro' ? '265' : 
                            selectedCourse.difficulty === 'Expert' ? '245' : 
                            selectedCourse.difficulty === 'Intermediate' ? '225' : '215'} yards
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="font-medium mb-3">Greens Hit</h4>
                        <div className="text-4xl font-bold text-primary">{simulationResults.greensHit} <span className="text-lg font-normal">/ 9</span></div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {simulationResults.greensHit >= 7 ? 'Excellent approach play' : 
                          simulationResults.greensHit >= 5 ? 'Good approach play' : 'Could use improvement'}
                        </p>
                      </div>
                      
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="font-medium mb-3">Shot Dispersion</h4>
                        <div className="text-xl font-bold flex items-center">
                          <span>{simulationResults.dispersion}° </span>
                          <span className="text-sm font-normal text-muted-foreground ml-2">average deviation</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {simulationResults.dispersion < 25 ? 'Professional-level accuracy' : 
                          simulationResults.dispersion < 35 ? 'Good accuracy for your skill level' : 
                          'Consider a more forgiving club design'}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                  <h4 className="font-medium mb-2">Performance Summary:</h4>
                  <p className="text-sm">
                    The {selectedModel?.brand} {selectedModel?.model} {getPerformanceSummary(simulationResults, selectedClubType)}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="justify-between">
            <div className="text-xs text-muted-foreground">
              Results are simulated based on typical performance metrics and may vary in real-world conditions.
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowSimulation(false)}>
              Test Another Club
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

// Helper functions
function getTechnologyEffect(technology: string): string {
  const effectsMap: Record<string, string> = {
    'Carbon Fiber Face': 'Increases ball speed and reduces weight for higher launch',
    'Speed Pocket': 'Increases ball speed on low face hits',
    'Twist Face': 'Corrects for common mis-hit patterns',
    'Jailbreak A.I.': 'Stabilizes the face for higher ball speeds across the face',
    'Flash Face SS21': 'Optimizes speed across the entire face',
    'Triaxial Carbon': 'Reduces weight and enhances forgiveness',
    'Carbonfly Wrap': 'Reduces weight for optimal CG placement',
    'Precision-Milled Face': 'Optimizes spin and consistency',
    'Dragonfly Technology': 'Reduces crown weight for higher MOI',
    'Chromoly 4140M': 'Thinner, stronger face for increased ball speed',
    'Harmonic Impact Technology': 'Enhanced feel and sound at impact',
    'Stability Frame': 'Provides more consistent distance control',
    'Max Impact Technology': 'Maximizes ball speed and distance across the face',
    'D18 Tungsten Weighting': 'Optimizes CG for better launch conditions',
    'Muscle Plate': 'Enhanced feel with player-preferred solid impact'
  };
  
  return effectsMap[technology] || 'Enhances overall club performance';
}

function getPerformanceSummary(results: SimulationResult, clubType: string): string {
  if (clubType === 'driver') {
    if (results.distance > 270 && results.fairwaysHit >= 6) {
      return 'provides an excellent combination of distance and accuracy for your swing profile.';
    } else if (results.distance > 270) {
      return 'delivers exceptional distance, but you may need to focus on accuracy.';
    } else if (results.fairwaysHit >= 6) {
      return 'offers great accuracy, though you might gain more distance with different settings.';
    } else {
      return 'performs adequately, but you might want to consider additional fitting options to maximize performance.';
    }
  } else {
    if (results.accuracy > 75 && results.greensHit >= 6) {
      return 'provides excellent control and consistency for your iron shots.';
    } else if (results.accuracy > 75) {
      return 'offers precision shot-making capability, though course management could improve GIR.';
    } else if (results.greensHit >= 6) {
      return 'helps you find greens effectively, despite some shot dispersion.';
    } else {
      return 'might benefit from additional fitting or considering more forgiving models.';
    }
  }
} 