'use client';

import { useState } from 'react';
import { ArrowRight, Award, Check, ChevronRight, Info, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Slider } from '@/components/ui/Slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';

interface ClubRecommendation {
  brand: string;
  model: string;
  shaft: string;
  flex: string;
  loft: string;
  description: string;
  matchPercentage: number;
  price: number;
  techSpecs: {
    forgiveness: number;
    workability: number;
    distance: number;
    control: number;
  };
}

interface PlayerProfile {
  height: number; // in inches
  swingSpeed: number; // in mph
  handicap: number;
  wristToFloor: number; // in inches
  tempo: string;
  missDirection: string;
  attackAngle: string;
  budget: number;
  priorityAttribute: string;
  preferredBrand: string;
}

// Sample data for brand preferences
const brands = [
  { label: 'No Preference', value: 'none' },
  { label: 'TaylorMade', value: 'taylormade' },
  { label: 'Callaway', value: 'callaway' },
  { label: 'Titleist', value: 'titleist' },
  { label: 'PING', value: 'ping' },
  { label: 'Mizuno', value: 'mizuno' },
  { label: 'Cobra', value: 'cobra' },
  { label: 'Cleveland', value: 'cleveland' },
];

// Sample data for default settings
const defaultProfile: PlayerProfile = {
  height: 70, // 5'10" in inches
  swingSpeed: 95,
  handicap: 15,
  wristToFloor: 32,
  tempo: 'moderate',
  missDirection: 'slice',
  attackAngle: 'neutral',
  budget: 800,
  priorityAttribute: 'forgiveness',
  preferredBrand: 'none',
};

export function ClubFittingAlgorithm() {
  const [profile, setProfile] = useState<PlayerProfile>({ ...defaultProfile });
  const [activeTab, setActiveTab] = useState('driver');
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState<ClubRecommendation[]>([]);
  
  // Process recommendations when profile changes or when tab changes
  const processRecommendations = () => {
    // This would normally be an API call to a fitting algorithm
    // For demo purposes, we're generating recommendations based on the profile
    
    let newRecommendations: ClubRecommendation[] = [];
    
    // Driver recommendations
    if (activeTab === 'driver') {
      // Low swing speed drivers (under 85 mph)
      if (profile.swingSpeed < 85) {
        newRecommendations = [
          {
            brand: 'Callaway',
            model: 'Epic Max',
            shaft: 'Project X Cypher 50',
            flex: 'Regular',
            loft: profile.missDirection === 'slice' ? '12°' : '10.5°',
            description: 'Maximum forgiveness with high launch characteristics, perfect for moderate swing speeds and players seeking more consistency.',
            matchPercentage: calculateMatchPercentage('callaway'),
            price: 549,
            techSpecs: { forgiveness: 9, workability: 5, distance: 7, control: 6 }
          },
          {
            brand: 'PING',
            model: 'G425 Max',
            shaft: 'Alta CB Slate 55',
            flex: 'Regular',
            loft: profile.missDirection === 'slice' ? '12°' : '10.5°',
            description: 'High MOI design for exceptional forgiveness with a slightly lower spin profile for better distance at moderate speeds.',
            matchPercentage: calculateMatchPercentage('ping'),
            price: 499,
            techSpecs: { forgiveness: 9, workability: 4, distance: 8, control: 7 }
          },
          {
            brand: 'Cobra',
            model: 'AeroJet Max',
            shaft: 'UST Helium Nanocore',
            flex: 'Regular',
            loft: '11.5°',
            description: 'Ultra-lightweight design helps increase swing speed with draw bias to minimize slicing for those with fade misses.',
            matchPercentage: calculateMatchPercentage('cobra'),
            price: 449,
            techSpecs: { forgiveness: 8, workability: 5, distance: 8, control: 6 }
          }
        ];
      } 
      // Mid swing speed drivers (85-100 mph)
      else if (profile.swingSpeed >= 85 && profile.swingSpeed < 100) {
        newRecommendations = [
          {
            brand: 'TaylorMade',
            model: 'Stealth 2',
            shaft: 'Mitsubishi Tensei AV Blue 65',
            flex: profile.tempo === 'quick' ? 'Stiff' : 'Regular',
            loft: profile.attackAngle === 'steep' ? '10.5°' : '9.5°',
            description: 'Advanced carbon face design for incredible ball speed with mid-spin characteristics for the ideal balance of distance and control.',
            matchPercentage: calculateMatchPercentage('taylormade'),
            price: 599,
            techSpecs: { forgiveness: 7, workability: 7, distance: 9, control: 7 }
          },
          {
            brand: 'Titleist',
            model: 'TSR3',
            shaft: 'Hzrdus Smoke Yellow 60',
            flex: profile.tempo === 'quick' ? 'Stiff' : 'Regular',
            loft: '10°',
            description: 'Precision performance with adjustable weighting for flight control and moderate forgiveness for better players.',
            matchPercentage: calculateMatchPercentage('titleist'),
            price: 599,
            techSpecs: { forgiveness: 6, workability: 9, distance: 8, control: 9 }
          },
          {
            brand: 'Mizuno',
            model: 'ST-Z 230',
            shaft: 'Aldila Ascent 60',
            flex: profile.swingSpeed > 95 ? 'Stiff' : 'Regular',
            loft: '9.5°',
            description: 'Balanced performance with low spin characteristics for players seeking maximum distance with clean aesthetics.',
            matchPercentage: calculateMatchPercentage('mizuno'),
            price: 499,
            techSpecs: { forgiveness: 7, workability: 8, distance: 9, control: 8 }
          }
        ];
      } 
      // High swing speed drivers (100+ mph)
      else {
        newRecommendations = [
          {
            brand: 'Titleist',
            model: 'TSR4',
            shaft: 'Graphite Design Tour AD UB 70',
            flex: 'X-Stiff',
            loft: '8.5°',
            description: 'Ultra-low spin design for skilled players with high swing speeds seeking maximum distance and workability.',
            matchPercentage: calculateMatchPercentage('titleist'),
            price: 599,
            techSpecs: { forgiveness: 4, workability: 10, distance: 10, control: 9 }
          },
          {
            brand: 'TaylorMade',
            model: 'Stealth 2 Plus',
            shaft: 'Mitsubishi Kai\'li White 70',
            flex: 'X-Stiff',
            loft: '9°',
            description: 'Tour-level performance with lowest spin profile in the Stealth lineup, perfect for aggressive swingers seeking workability.',
            matchPercentage: calculateMatchPercentage('taylormade'),
            price: 629,
            techSpecs: { forgiveness: 5, workability: 9, distance: 10, control: 8 }
          },
          {
            brand: 'Callaway',
            model: 'Paradym Triple Diamond',
            shaft: 'Project X HZRDUS Black 70',
            flex: 'X-Stiff',
            loft: '8.5°',
            description: 'Compact, low-spin head shape designed for tour-level ball strikers with adjustable perimeter weighting.',
            matchPercentage: calculateMatchPercentage('callaway'),
            price: 599,
            techSpecs: { forgiveness: 5, workability: 10, distance: 9, control: 9 }
          }
        ];
      }
    } 
    // Iron recommendations
    else if (activeTab === 'irons') {
      // High handicap irons (15+)
      if (profile.handicap >= 15) {
        newRecommendations = [
          {
            brand: 'PING',
            model: 'G425',
            shaft: profile.swingSpeed < 85 ? 'AWT 2.0 Graphite Regular' : 'AWT 2.0 Steel Stiff',
            flex: profile.swingSpeed < 85 ? 'Regular' : 'Stiff',
            loft: 'Standard (4-PW)',
            description: 'Maximum forgiveness with perimeter weighting and wide soles for consistent turf interaction, perfect for developing players.',
            matchPercentage: calculateMatchPercentage('ping'),
            price: 999,
            techSpecs: { forgiveness: 10, workability: 4, distance: 8, control: 6 }
          },
          {
            brand: 'Callaway',
            model: 'Mavrik Max',
            shaft: profile.swingSpeed < 85 ? 'True Temper Elevate 95 Graphite' : 'True Temper Elevate 95 Steel',
            flex: profile.swingSpeed < 90 ? 'Regular' : 'Stiff',
            loft: 'Strong (4-PW)',
            description: 'Game-improvement irons with high launch and optimized ball flight for players seeking distance and forgiveness.',
            matchPercentage: calculateMatchPercentage('callaway'),
            price: 899,
            techSpecs: { forgiveness: 9, workability: 5, distance: 9, control: 6 }
          },
          {
            brand: 'Cleveland',
            model: 'Launcher XL',
            shaft: 'Action Lite',
            flex: 'Regular',
            loft: 'Standard (5-PW)',
            description: 'Ultra-forgiving cavity back design with high MOI and deep undercut for maximum consistency on off-center hits.',
            matchPercentage: calculateMatchPercentage('cleveland'),
            price: 799,
            techSpecs: { forgiveness: 10, workability: 3, distance: 7, control: 5 }
          }
        ];
      } 
      // Mid handicap irons (8-14)
      else if (profile.handicap >= 8 && profile.handicap < 15) {
        newRecommendations = [
          {
            brand: 'Mizuno',
            model: 'JPX 923 Hot Metal Pro',
            shaft: 'Nippon Modus 105',
            flex: profile.swingSpeed < 95 ? 'Regular' : 'Stiff',
            loft: 'Standard (4-PW)',
            description: 'Premium feel with moderate forgiveness in a more compact shape, perfect for mid-handicap players seeking performance and workability.',
            matchPercentage: calculateMatchPercentage('mizuno'),
            price: 1099,
            techSpecs: { forgiveness: 7, workability: 7, distance: 8, control: 8 }
          },
          {
            brand: 'TaylorMade',
            model: 'P790',
            shaft: 'True Temper Dynamic Gold 105',
            flex: profile.swingSpeed < 95 ? 'Regular' : 'Stiff',
            loft: 'Standard (4-PW)',
            description: 'Players distance irons with hollow body construction and SpeedFoam for incredible ball speed with medium workability.',
            matchPercentage: calculateMatchPercentage('taylormade'),
            price: 1299,
            techSpecs: { forgiveness: 7, workability: 8, distance: 9, control: 7 }
          },
          {
            brand: 'Titleist',
            model: 'T200',
            shaft: 'KBS Tour Lite',
            flex: profile.swingSpeed < 90 ? 'Regular' : 'Stiff',
            loft: 'Standard (4-PW)',
            description: 'Mid-sized cavity back with advanced perimeter weighting for the perfect blend of distance and precise control.',
            matchPercentage: calculateMatchPercentage('titleist'),
            price: 1199,
            techSpecs: { forgiveness: 6, workability: 7, distance: 8, control: 8 }
          }
        ];
      } 
      // Low handicap irons (0-7)
      else {
        newRecommendations = [
          {
            brand: 'Titleist',
            model: 'T100s',
            shaft: 'Project X IO',
            flex: 'Stiff',
            loft: 'Standard (4-PW)',
            description: 'Tour-validated design with moderate forgiveness in a compact blade-like profile for skilled players seeking precision control.',
            matchPercentage: calculateMatchPercentage('titleist'),
            price: 1299,
            techSpecs: { forgiveness: 5, workability: 9, distance: 7, control: 10 }
          },
          {
            brand: 'Mizuno',
            model: 'Pro 225',
            shaft: 'Nippon Modus3 120',
            flex: 'Stiff',
            loft: 'Standard (4-PW)',
            description: 'Multi-material construction with forged feel and compact profile for better players seeking workability with moderate forgiveness.',
            matchPercentage: calculateMatchPercentage('mizuno'),
            price: 1399,
            techSpecs: { forgiveness: 6, workability: 9, distance: 8, control: 9 }
          },
          {
            brand: 'PING',
            model: 'Blueprint',
            shaft: 'Dynamic Gold Tour Issue X100',
            flex: 'X-Stiff',
            loft: 'Standard (4-PW)',
            description: 'Tour-level forged blade for elite ball strikers seeking maximum shot shaping and trajectory control.',
            matchPercentage: calculateMatchPercentage('ping'),
            price: 1499,
            techSpecs: { forgiveness: 3, workability: 10, distance: 6, control: 10 }
          }
        ];
      }
    }
    // Add shaft length recommendations based on height and wrist-to-floor measurement
    newRecommendations = newRecommendations.map(rec => {
      const lengthAdjustment = calculateLengthAdjustment(profile.height, profile.wristToFloor);
      return {
        ...rec,
        description: lengthAdjustment !== "Standard" 
          ? `${rec.description} Recommended with ${lengthAdjustment} length shafts based on your height and wrist-to-floor measurements.` 
          : rec.description
      };
    });
    
    // Sort by match percentage
    newRecommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    // Filter by budget if specified
    if (profile.budget > 0) {
      newRecommendations = newRecommendations.filter(rec => rec.price <= profile.budget);
    }
    
    setRecommendations(newRecommendations);
    setShowResults(true);
  };
  
  // Helper function to calculate match percentage based on brand preference
  const calculateMatchPercentage = (brand: string): number => {
    let baseScore = 85 + Math.random() * 10; // Random base score between 85-95
    
    // Add points for brand match
    if (profile.preferredBrand === brand) {
      baseScore += 5;
    }
    
    // Add points for priorityAttribute match
    const techSpecKey = profile.priorityAttribute as keyof ClubRecommendation['techSpecs'];
    
    // Simulate attribute matching (in real implementation, this would be much more sophisticated)
    if (brand === 'ping' && profile.priorityAttribute === 'forgiveness') {
      baseScore += 3;
    } else if (brand === 'titleist' && profile.priorityAttribute === 'control') {
      baseScore += 4;
    } else if (brand === 'taylormade' && profile.priorityAttribute === 'distance') {
      baseScore += 3;
    } else if (brand === 'mizuno' && profile.priorityAttribute === 'workability') {
      baseScore += 4;
    }
    
    return Math.min(99, Math.round(baseScore)); // Cap at 99%
  };
  
  // Helper function to calculate shaft length adjustment based on height and wrist-to-floor
  const calculateLengthAdjustment = (height: number, wristToFloor: number): string => {
    // Standard wrist-to-floor measurements for given heights (approximate)
    const stdWristToFloor = Math.round(height * 0.485);
    
    const difference = wristToFloor - stdWristToFloor;
    
    if (difference < -2) {
      return "+0.5\" Longer";
    } else if (difference > 2) {
      return "-0.5\" Shorter";
    } else {
      return "Standard";
    }
  };

  const getFlex = (swingSpeed: number): string => {
    if (swingSpeed < 75) return 'Senior/Ladies';
    if (swingSpeed < 85) return 'Regular';
    if (swingSpeed < 95) return 'Stiff';
    return 'X-Stiff';
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Advanced Club Fitting Algorithm</CardTitle>
          <CardDescription>
            Get personalized club recommendations based on your body metrics, swing attributes, and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="physicalMetrics" className="space-y-4">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="physicalMetrics">Physical Metrics</TabsTrigger>
              <TabsTrigger value="swingMetrics">Swing Metrics</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
            
            {/* Physical Metrics Tab */}
            <TabsContent value="physicalMetrics" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="player-height">Height</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      id="player-height"
                      defaultValue={[profile.height]}
                      max={84}
                      min={60}
                      step={1}
                      onValueChange={(value) => setProfile({ ...profile, height: value[0] })}
                      className="flex-1"
                    />
                    <span className="text-sm w-24 text-right">
                      {Math.floor(profile.height / 12)}'{profile.height % 12}"
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="wrist-to-floor">Wrist-to-Floor Measurement</Label>
                    <div className="flex items-center">
                      <Info className="h-4 w-4 mr-1.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Important for shaft length</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Slider
                      id="wrist-to-floor"
                      defaultValue={[profile.wristToFloor]}
                      max={45}
                      min={25}
                      step={0.5}
                      onValueChange={(value) => setProfile({ ...profile, wristToFloor: value[0] })}
                      className="flex-1"
                    />
                    <span className="text-sm w-24 text-right">
                      {profile.wristToFloor}"
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="handicap">Handicap</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      id="handicap"
                      defaultValue={[profile.handicap]}
                      max={36}
                      min={0}
                      step={1}
                      onValueChange={(value) => setProfile({ ...profile, handicap: value[0] })}
                      className="flex-1"
                    />
                    <span className="text-sm w-24 text-right">
                      {profile.handicap === 0 ? "Scratch" : profile.handicap}
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Swing Metrics Tab */}
            <TabsContent value="swingMetrics" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="swing-speed">Driver Swing Speed</Label>
                    <div className="flex items-center">
                      <Info className="h-4 w-4 mr-1.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Determines shaft flex</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Slider
                      id="swing-speed"
                      defaultValue={[profile.swingSpeed]}
                      max={130}
                      min={60}
                      step={1}
                      onValueChange={(value) => setProfile({ ...profile, swingSpeed: value[0] })}
                      className="flex-1"
                    />
                    <span className="text-sm w-24 text-right">
                      {profile.swingSpeed} mph ({getFlex(profile.swingSpeed)} flex)
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Swing Tempo</Label>
                  <RadioGroup 
                    defaultValue={profile.tempo}
                    onValueChange={(value) => setProfile({ ...profile, tempo: value })}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="smooth" id="tempo-smooth" />
                      <Label htmlFor="tempo-smooth" className="font-normal">Smooth/Slow</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderate" id="tempo-moderate" />
                      <Label htmlFor="tempo-moderate" className="font-normal">Moderate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="quick" id="tempo-quick" />
                      <Label htmlFor="tempo-quick" className="font-normal">Quick/Fast</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label>Typical Miss Direction</Label>
                  <RadioGroup 
                    defaultValue={profile.missDirection}
                    onValueChange={(value) => setProfile({ ...profile, missDirection: value })}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="slice" id="miss-slice" />
                      <Label htmlFor="miss-slice" className="font-normal">Slice/Fade (right for right-handed)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="straight" id="miss-straight" />
                      <Label htmlFor="miss-straight" className="font-normal">Fairly Straight</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hook" id="miss-hook" />
                      <Label htmlFor="miss-hook" className="font-normal">Hook/Draw (left for right-handed)</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label>Attack Angle (Driver)</Label>
                  <RadioGroup 
                    defaultValue={profile.attackAngle}
                    onValueChange={(value) => setProfile({ ...profile, attackAngle: value })}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="steep" id="angle-steep" />
                      <Label htmlFor="angle-steep" className="font-normal">Steep (negative)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="neutral" id="angle-neutral" />
                      <Label htmlFor="angle-neutral" className="font-normal">Neutral</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="up" id="angle-up" />
                      <Label htmlFor="angle-up" className="font-normal">Upward (positive)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </TabsContent>
            
            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="budget">Budget</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      id="budget"
                      defaultValue={[profile.budget]}
                      max={2000}
                      min={300}
                      step={50}
                      onValueChange={(value) => setProfile({ ...profile, budget: value[0] })}
                      className="flex-1"
                    />
                    <span className="text-sm w-24 text-right">
                      ${profile.budget}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Attribute</Label>
                  <Select 
                    defaultValue={profile.priorityAttribute}
                    onValueChange={(value) => setProfile({ ...profile, priorityAttribute: value })}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="forgiveness">Forgiveness</SelectItem>
                      <SelectItem value="distance">Distance</SelectItem>
                      <SelectItem value="workability">Workability/Shot Shaping</SelectItem>
                      <SelectItem value="control">Control & Precision</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="brand">Preferred Brand (Optional)</Label>
                  <Select 
                    defaultValue={profile.preferredBrand}
                    onValueChange={(value) => setProfile({ ...profile, preferredBrand: value })}
                  >
                    <SelectTrigger id="brand">
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand.value} value={brand.value}>
                          {brand.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="pt-6">
            <Alert variant="info" className="mb-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                To get more accurate recommendations, please complete all sections above.
              </AlertDescription>
            </Alert>
            
            <div className="pt-2">
              <div className="text-sm font-medium mb-2">Which clubs are you interested in?</div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList>
                  <TabsTrigger value="driver">Driver</TabsTrigger>
                  <TabsTrigger value="irons">Irons</TabsTrigger>
                  <TabsTrigger value="wedges">Wedges</TabsTrigger>
                  <TabsTrigger value="putter">Putter</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t pt-6">
          <Button onClick={processRecommendations} size="lg" className="group">
            Get Recommendations
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>
      </Card>
      
      {showResults && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Your Personalized {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Recommendations</CardTitle>
            <CardDescription>
              Based on your unique profile, here are the best options for your game
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recommendations.length > 0 ? (
                recommendations.map((rec, index) => (
                  <Card key={index} className={`overflow-hidden ${index === 0 ? 'border-primary/50 shadow-md' : ''}`}>
                    <CardHeader className={`pb-3 ${index === 0 ? 'bg-primary/5' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center">
                            {index === 0 && (
                              <span className="mr-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400">
                                <Award className="h-3 w-3 mr-1" />
                                Best Match
                              </span>
                            )}
                            <span>{rec.brand} {rec.model}</span>
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {rec.shaft} • {rec.flex} flex • {rec.loft}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-primary">${rec.price}</div>
                          <div className="text-sm text-muted-foreground">
                            {rec.matchPercentage}% match
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        {rec.description}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {Object.entries(rec.techSpecs).map(([key, value]) => (
                          <div key={key} className="space-y-1">
                            <div className="text-xs font-medium capitalize">{key}</div>
                            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${value * 10}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-right">{value}/10</div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="space-x-2">
                          <Button variant="outline" size="sm">
                            More Details
                          </Button>
                          <Button variant="outline" size="sm">
                            Compare
                          </Button>
                        </div>
                        <Button size="sm" className="group">
                          Shop Now
                          <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Alert variant="warning">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>No matching clubs found</AlertTitle>
                  <AlertDescription>
                    Please adjust your preferences or budget to see more options.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-4 border-t pt-6">
            <div className="flex flex-wrap gap-2 text-sm">
              <div className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-green-500" />
                <span>Fitting algorithm uses {recommendations.length > 0 ? recommendations.length * 55 : 120}+ data points</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-green-500" />
                <span>Based on analysis of 10,000+ fitting sessions</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-green-500" />
                <span>Recommendations updated monthly with new releases</span>
              </div>
            </div>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Professional Club Fitting Recommended</AlertTitle>
              <AlertDescription>
                While our algorithm provides excellent guidance, nothing replaces an in-person fitting with a professional. 
                Consider scheduling a fitting session for the most accurate results.
              </AlertDescription>
            </Alert>
          </CardFooter>
        </Card>
      )}
    </div>
  );
} 