import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Slider } from "@/components/ui/Slider";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Gauge, Ruler, Award, Zap, AlertCircle, BarChart3 } from 'lucide-react';

// Types and interfaces
interface FittingResult {
  shaftFlex: string;
  loftRecommendation: string;
  clubLength: string;
  lieAngle: string;
  gripSize: string;
  additionalNotes: string[];
}

interface PlayerMetrics {
  swingSpeed: number;
  height: number;
  skillLevel: string;
  wristToFloor: number;
  tempoDescription: string;
}

export const EnhancedFittingAlgorithm: React.FC = () => {
  const [playerMetrics, setPlayerMetrics] = useState<PlayerMetrics>({
    swingSpeed: 90,
    height: 70,
    skillLevel: 'intermediate',
    wristToFloor: 30,
    tempoDescription: 'moderate',
  });

  const [fittingResult, setFittingResult] = useState<FittingResult | null>(null);
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false);

  const calculateFitting = () => {
    // Shaft flex based on swing speed and skill level
    let shaftFlex = 'Regular';
    if (playerMetrics.swingSpeed < 75) {
      shaftFlex = 'Ladies/Senior';
    } else if (playerMetrics.swingSpeed < 85) {
      shaftFlex = 'Senior';
    } else if (playerMetrics.swingSpeed < 95) {
      shaftFlex = 'Regular';
    } else if (playerMetrics.swingSpeed < 105) {
      shaftFlex = 'Stiff';
    } else {
      shaftFlex = 'Extra Stiff';
    }

    // Adjust based on skill level
    if (playerMetrics.skillLevel === 'beginner' && shaftFlex === 'Stiff') {
      shaftFlex = 'Regular';
    } else if (playerMetrics.skillLevel === 'advanced' && shaftFlex === 'Regular') {
      shaftFlex = 'Stiff';
    }

    // Loft recommendation based on swing speed and skill level
    let loftRecommendation = '10.5°';
    if (playerMetrics.skillLevel === 'beginner') {
      loftRecommendation = playerMetrics.swingSpeed < 85 ? '13°+' : '12°';
    } else if (playerMetrics.skillLevel === 'intermediate') {
      loftRecommendation = playerMetrics.swingSpeed < 90 ? '10.5°-11.5°' : '9.5°-10.5°';
    } else {
      loftRecommendation = playerMetrics.swingSpeed < 100 ? '9.5°' : '8.5°-9.5°';
    }

    // Club length based on player height and wrist-to-floor measurement
    let clubLength = 'Standard';
    const heightInInches = playerMetrics.height;

    if (showAdvancedMetrics && playerMetrics.wristToFloor > 0) {
      // Advanced fitting with wrist-to-floor measurement
      if (heightInInches < 68) {
        clubLength = playerMetrics.wristToFloor < 29 ? '-1 inch' : '-0.5 inch';
      } else if (heightInInches > 74) {
        clubLength = playerMetrics.wristToFloor > 35 ? '+1 inch' : '+0.5 inch';
      } else {
        // Standard height, but adjust based on wrist-to-floor
        if (playerMetrics.wristToFloor < 29) clubLength = '-0.5 inch';
        else if (playerMetrics.wristToFloor > 34) clubLength = '+0.5 inch';
      }
    } else {
      // Basic fitting with just height
      if (heightInInches < 65) clubLength = '-1 inch';
      else if (heightInInches < 68) clubLength = '-0.5 inch';
      else if (heightInInches > 76) clubLength = '+1 inch';
      else if (heightInInches > 73) clubLength = '+0.5 inch';
    }

    // Lie angle based on height and wrist-to-floor
    let lieAngle = 'Standard';
    if (showAdvancedMetrics && playerMetrics.wristToFloor > 0) {
      const wristRatio = playerMetrics.wristToFloor / heightInInches;
      if (wristRatio < 0.4) lieAngle = 'Upright (2°)';
      else if (wristRatio < 0.425) lieAngle = 'Upright (1°)';
      else if (wristRatio > 0.48) lieAngle = 'Flat (2°)';
      else if (wristRatio > 0.455) lieAngle = 'Flat (1°)';
    } else {
      // Simple approximation without wrist measurement
      lieAngle = 'Standard (recommend professional fitting for precise lie angle)';
    }

    // Grip size recommendation
    let gripSize = 'Standard';
    if (playerMetrics.height > 73) {
      gripSize = 'Midsize';
    } else if (playerMetrics.height < 65) {
      gripSize = 'Undersize';
    }

    // Additional notes and recommendations
    const additionalNotes = [];
    if (playerMetrics.tempoDescription === 'quick') {
      additionalNotes.push('Your quick tempo suggests a lighter club head may improve consistency.');
    } else if (playerMetrics.tempoDescription === 'slow') {
      additionalNotes.push('Your smooth tempo may benefit from a heavier club head for better feedback.');
    }

    if (playerMetrics.skillLevel === 'beginner') {
      additionalNotes.push('Focus on game-improvement clubs with larger sweet spots and more forgiveness.');
    } else if (playerMetrics.skillLevel === 'advanced') {
      additionalNotes.push("Player's distance irons might offer the control and workability you need.");
    }

    setFittingResult({
      shaftFlex,
      loftRecommendation,
      clubLength,
      lieAngle,
      gripSize,
      additionalNotes
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-primary" />
              <span>Player Metrics</span>
            </CardTitle>
            <CardDescription>Enter your physical attributes for personalized fitting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="swingSpeed" className="flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>Driver Swing Speed (mph)</span>
                </Label>
                <span className="text-sm font-medium">{playerMetrics.swingSpeed} mph</span>
              </div>
              <Slider
                id="swingSpeed"
                min={60}
                max={120}
                step={1}
                value={[playerMetrics.swingSpeed]}
                onValueChange={(value: number[]) => setPlayerMetrics({ ...playerMetrics, swingSpeed: value[0] })}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Slower (60)</span>
                <span>Faster (120)</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="height" className="flex items-center gap-1.5">
                  <Ruler className="h-4 w-4 text-primary" />
                  <span>Height (inches)</span>
                </Label>
                <span className="text-sm font-medium">{playerMetrics.height}"</span>
              </div>
              <Slider
                id="height"
                min={60}
                max={80}
                step={1}
                value={[playerMetrics.height]}
                onValueChange={(value: number[]) => setPlayerMetrics({ ...playerMetrics, height: value[0] })}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5'0" (60)</span>
                <span>6'8" (80)</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skillLevel" className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-primary" />
                <span>Skill Level</span>
              </Label>
              <Select
                value={playerMetrics.skillLevel}
                onValueChange={(value) => setPlayerMetrics({ ...playerMetrics, skillLevel: value })}
              >
                <SelectTrigger id="skillLevel">
                  <SelectValue placeholder="Select skill level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner (30+ handicap)</SelectItem>
                  <SelectItem value="intermediate">Intermediate (10-29 handicap)</SelectItem>
                  <SelectItem value="advanced">Advanced (0-9 handicap)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tempoDscription" className="flex items-center gap-1.5">
                <BarChart3 className="h-4 w-4 text-primary" />
                <span>Swing Tempo</span>
              </Label>
              <Select
                value={playerMetrics.tempoDescription}
                onValueChange={(value) => setPlayerMetrics({ ...playerMetrics, tempoDescription: value })}
              >
                <SelectTrigger id="tempoDscription">
                  <SelectValue placeholder="Select swing tempo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quick">Quick/Fast</SelectItem>
                  <SelectItem value="moderate">Moderate/Average</SelectItem>
                  <SelectItem value="slow">Smooth/Slow</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={() => setShowAdvancedMetrics(!showAdvancedMetrics)}
            >
              {showAdvancedMetrics ? "Hide Advanced Metrics" : "Show Advanced Metrics"}
            </Button>

            {showAdvancedMetrics && (
              <div className="space-y-2 mt-4 p-4 border rounded-md bg-muted/20">
                <div className="flex items-center justify-between">
                  <Label htmlFor="wristToFloor" className="flex items-center gap-1.5">
                    <Ruler className="h-4 w-4 text-primary" />
                    <span>Wrist-to-Floor (inches)</span>
                  </Label>
                  <span className="text-sm font-medium">{playerMetrics.wristToFloor}"</span>
                </div>
                <Slider
                  id="wristToFloor"
                  min={25}
                  max={40}
                  step={0.5}
                  value={[playerMetrics.wristToFloor]}
                  onValueChange={(value: number[]) => setPlayerMetrics({ ...playerMetrics, wristToFloor: value[0] })}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>25"</span>
                  <span>40"</span>
                </div>
                <Alert className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Measure from the crease of your wrist to the floor while standing upright.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>

        {fittingResult ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <span>Your Custom Fitting Results</span>
              </CardTitle>
              <CardDescription>Personalized club specifications based on your metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Shaft Flex</p>
                    <p className="font-medium">{fittingResult.shaftFlex}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Driver Loft</p>
                    <p className="font-medium">{fittingResult.loftRecommendation}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Club Length</p>
                    <p className="font-medium">{fittingResult.clubLength}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Lie Angle</p>
                    <p className="font-medium">{fittingResult.lieAngle}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Grip Size</p>
                    <p className="font-medium">{fittingResult.gripSize}</p>
                  </div>
                </div>

                {fittingResult.additionalNotes.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <p className="text-sm font-medium">Additional Recommendations:</p>
                    <ul className="space-y-1">
                      {fittingResult.additionalNotes.map((note, index) => (
                        <li key={index} className="text-sm">• {note}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    While these recommendations are a good starting point, we recommend a professional club
                    fitting session for the most accurate results.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="flex flex-col justify-center items-center h-full">
            <CardContent className="pt-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Gauge className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Get Your Custom Fit</h3>
              <p className="text-muted-foreground mb-6">
                Input your metrics to receive personalized club fitting recommendations.
              </p>
              <Button onClick={calculateFitting} className="w-full">
                Calculate Fitting
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}; 