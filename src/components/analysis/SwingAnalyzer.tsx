'use client';

import { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Upload, 
  Video, 
  PauseCircle, 
  PlayCircle,
  RotateCcw, 
  RefreshCw, 
  Check, 
  PenTool,
  Camera,
  Wand2,
  ListTodo,
  Lightbulb
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Progress } from '@/components/ui/Progress';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/Tooltip';

// Sample swing analysis results
const sampleAnalysisResults = {
  posture: {
    score: 75,
    issues: ['Slightly hunched shoulders', 'Weight too much on toes'],
    strengths: ['Good spine angle', 'Stable head position'],
    tips: ['Focus on standing taller at address', 'Distribute weight evenly between heels and balls of feet']
  },
  takeaway: {
    score: 82,
    issues: ['Club face slightly open'],
    strengths: ['Good tempo', 'One-piece takeaway', 'Arms and shoulders work together'],
    tips: ['Work on keeping club face square during takeaway', 'Maintain connection between arms and body']
  },
  backswing: {
    score: 68,
    issues: ['Limited hip rotation', 'Loss of wrist angle at top'],
    strengths: ['Good shoulder turn', 'Stable lower body'],
    tips: ['Improve hip mobility with stretching exercises', 'Focus on maintaining wrist hinge at the top']
  },
  downswing: {
    score: 79,
    issues: ['Slight over-the-top move'],
    strengths: ['Good weight transfer', 'Solid sequence'],
    tips: ['Drop club more into slot', 'Feel like hands are moving down and out toward the ball']
  },
  impact: {
    score: 71,
    issues: ['Early extension', 'Loss of spine angle'],
    strengths: ['Good clubhead speed', 'Stable head position'],
    tips: ['Practice maintaining spine angle through impact', 'Feel like you\'re staying in your posture']
  },
  followThrough: {
    score: 88,
    issues: ['Slight loss of balance'],
    strengths: ['Good extension', 'Full turn to finish', 'Balanced position'],
    tips: ['Continue working on balance drills', 'Ensure weight fully transfers to lead foot']
  },
  overall: {
    score: 77,
    summary: 'Your swing has many solid fundamentals with good tempo and rhythm. The main areas to focus on are maintaining your posture through impact and improving hip rotation in your backswing. Your follow-through is excellent, showing good balance and extension. Work on the takeaway to keep the club face square, which will help improve consistency.',
    topStrengths: ['Tempo and rhythm', 'Follow-through extension', 'Shoulder rotation'],
    priorityFixes: ['Maintain posture through impact', 'Increase hip rotation', 'Keep club face square in takeaway']
  }
};

// Sample swing faults dictionary
const swingFaultsDictionary = [
  {
    fault: 'Over the top',
    description: 'An outside-to-in swing path where the club approaches the ball from outside the target line and cuts across it through impact.',
    causes: ['Poor sequencing', 'Early upper body rotation', 'Steep backswing'],
    fixes: ['Drop arms into slot', 'Start downswing with lower body', 'Feel hands moving out toward the ball']
  },
  {
    fault: 'Early extension',
    description: 'Standing up or moving toward the ball during the downswing, losing spine angle and posture.',
    causes: ['Poor core stability', 'Compensating for backswing issues', 'Loss of balance'],
    fixes: ['Maintain spine angle drills', 'Practice with alignment stick behind hips', 'Focus on rotation instead of vertical movement']
  },
  {
    fault: 'Casting',
    description: 'Releasing the wrist angle too early in the downswing, losing power and accuracy.',
    causes: ['Steep transition', 'Trying to lift the ball', 'Poor sequencing'],
    fixes: ['Lag drills with alignment stick', 'Feel like hands lead the clubhead', 'Work on proper downswing sequence']
  },
  {
    fault: 'Sway',
    description: 'Lateral movement away from the target during backswing instead of proper rotation.',
    causes: ['Poor hip mobility', 'Misunderstanding of proper turn', 'Balance issues'],
    fixes: ['Practice with right foot on wall (for right-handers)', 'Focus on turning around spine', 'Hip mobility exercises']
  },
];

// Drawing tool colors
const drawingColors = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Yellow', value: '#eab308' },
];

export function SwingAnalyzer() {
  // State for video upload and playback
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [selectedColor, setSelectedColor] = useState(drawingColors[0].value);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setVideoSrc(objectUrl);
      setIsAnalyzing(false);
      setAnalysisComplete(false);
      setAnalysisProgress(0);
    }
  };
  
  // Trigger file upload dialog
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  // Video playback controls
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      videoRef.current.currentTime = parseFloat(event.target.value);
    }
  };
  
  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (isPlaying) {
        videoRef.current.play();
      }
    }
  };
  
  // Toggle drawing mode
  const toggleDrawingMode = () => {
    setIsDrawingMode(!isDrawingMode);
  };
  
  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };
  
  // Start AI analysis
  const startAnalysis = () => {
    setIsAnalyzing(true);
    
    // Simulate analysis progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setAnalysisProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsAnalyzing(false);
        setAnalysisComplete(true);
      }
    }, 200);
  };
  
  // Get color for score visualization
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-500';
    if (score >= 70) return 'text-amber-500';
    return 'text-red-500';
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle>AI Swing Analyzer</CardTitle>
            <CardDescription>
              Upload a video of your swing for AI-powered analysis and feedback
            </CardDescription>
          </div>
          {!videoSrc && (
            <Button 
              onClick={handleUploadClick} 
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              <span>Upload Swing Video</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="video/*" 
          onChange={handleFileUpload} 
          className="hidden" 
        />
        
        {!videoSrc ? (
          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center">
            <Video className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No video uploaded</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
              Upload a video of your golf swing from face-on or down-the-line perspective for best results.
              Videos should be 10-15 seconds long and clearly show your entire swing.
            </p>
            <Button onClick={handleUploadClick} className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span>Upload Swing Video</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Video player with drawing canvas overlay */}
            <div className="relative">
              <video 
                ref={videoRef} 
                src={videoSrc} 
                className="w-full rounded-lg aspect-video bg-black" 
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                controls={false}
              />
              <canvas 
                ref={canvasRef} 
                className={`absolute top-0 left-0 w-full h-full ${isDrawingMode ? 'cursor-crosshair' : 'pointer-events-none'}`}
              />
              
              {/* Video controls */}
              <div className="absolute bottom-4 left-0 right-0 px-4 flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="bg-background/80 backdrop-blur-sm" 
                  onClick={togglePlayPause}
                >
                  {isPlaying ? 
                    <PauseCircle className="h-5 w-5" /> : 
                    <PlayCircle className="h-5 w-5" />
                  }
                </Button>
                <input 
                  type="range" 
                  min="0" 
                  max={videoRef.current?.duration || 100} 
                  step="0.1"
                  value={videoRef.current?.currentTime || 0}
                  onChange={handleSeek}
                  className="flex-grow" 
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="bg-background/80 backdrop-blur-sm" 
                  onClick={handleRestart}
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Drawing tools */}
            <div className="flex items-center justify-between gap-2 px-1">
              <div className="flex items-center space-x-2">
                <Button 
                  variant={isDrawingMode ? "default" : "outline"} 
                  size="sm" 
                  className="flex items-center gap-1" 
                  onClick={toggleDrawingMode}
                >
                  <PenTool className="h-4 w-4" />
                  <span>{isDrawingMode ? "Drawing Mode" : "Enable Drawing"}</span>
                </Button>
                
                {isDrawingMode && (
                  <>
                    <div className="flex space-x-1">
                      {drawingColors.map((color) => (
                        <TooltipProvider key={color.value}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                className={`w-6 h-6 rounded-full border ${selectedColor === color.value ? 'ring-2 ring-offset-2' : ''}`}
                                style={{ backgroundColor: color.value }}
                                onClick={() => setSelectedColor(color.value)}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{color.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearCanvas}
                    >
                      Clear
                    </Button>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={handleUploadClick}
                >
                  <Camera className="h-4 w-4" />
                  <span>New Video</span>
                </Button>
                
                {!isAnalyzing && !analysisComplete && (
                  <Button 
                    className="flex items-center gap-1"
                    size="sm"
                    onClick={startAnalysis}
                  >
                    <Wand2 className="h-4 w-4" />
                    <span>Analyze Swing</span>
                  </Button>
                )}
              </div>
            </div>
            
            {/* Analysis progress or results */}
            {isAnalyzing && (
              <div className="space-y-2 p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Analyzing your swing...</span>
                  <span className="text-sm text-muted-foreground">{analysisProgress}%</span>
                </div>
                <Progress value={analysisProgress} className="h-2" />
                <div className="text-xs text-muted-foreground animate-pulse">
                  Our AI is identifying swing characteristics and comparing to ideal patterns
                </div>
              </div>
            )}
            
            {analysisComplete && (
              <div className="mt-6">
                <Tabs
                  defaultValue="overview"
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="overview" className="flex items-center gap-1">
                      <Lightbulb className="h-4 w-4" />
                      <span>Overview</span>
                    </TabsTrigger>
                    <TabsTrigger value="details" className="flex items-center gap-1">
                      <ListTodo className="h-4 w-4" />
                      <span>Detailed Analysis</span>
                    </TabsTrigger>
                    <TabsTrigger value="faults" className="flex items-center gap-1">
                      <RefreshCw className="h-4 w-4" />
                      <span>Common Faults</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-4 mt-2">
                    <div className="flex flex-col sm:flex-row justify-between gap-6">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium mb-3">Swing Analysis Summary</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {sampleAnalysisResults.overall.summary}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 mt-6">
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium">Top Strengths</h4>
                            <ul className="space-y-2">
                              {sampleAnalysisResults.overall.topStrengths.map((strength, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                                  <span>{strength}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium">Priority Fixes</h4>
                            <ul className="space-y-2">
                              {sampleAnalysisResults.overall.priorityFixes.map((fix, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <span className="h-4 w-4 rounded-full bg-amber-500 mt-0.5 flex items-center justify-center text-white text-[10px]">{index + 1}</span>
                                  <span>{fix}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className="sm:w-60 flex flex-col items-center">
                        <div className="relative w-40 h-40">
                          <div className="w-40 h-40 rounded-full border-8 border-gray-100 dark:border-gray-800 flex items-center justify-center">
                            <div className="text-3xl font-bold text-center">
                              <span className={getScoreColor(sampleAnalysisResults.overall.score)}>
                                {sampleAnalysisResults.overall.score}
                              </span>
                              <div className="text-xs text-muted-foreground mt-1">Overall Score</div>
                            </div>
                          </div>
                          <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-8 h-8 flex items-center justify-center font-medium">
                            12.4
                          </div>
                        </div>
                        <div className="text-xs text-center text-muted-foreground mt-3">
                          Based on your Handicap
                        </div>
                        
                        <Button variant="outline" size="sm" className="mt-4">
                          Get Custom Drills
                        </Button>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border p-4 mt-6">
                      <h3 className="text-sm font-medium mb-3">Book a Virtual Lesson</h3>
                      <p className="text-xs text-muted-foreground mb-3">
                        Get personalized instruction from a PGA pro based on your swing analysis.
                      </p>
                      <Button variant="default" size="sm">
                        Schedule Lesson
                      </Button>
                    </div>
                  </TabsContent>
                  
                  {/* Detailed Analysis Tab */}
                  <TabsContent value="details" className="space-y-6 mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(sampleAnalysisResults)
                        .filter(([key]) => key !== 'overall')
                        .map(([phase, data]) => {
                          // Type assertion to help TypeScript understand the shape
                          const phaseData = data as {
                            score: number;
                            issues: string[];
                            strengths: string[];
                            tips: string[];
                          };
                          
                          return (
                            <Card key={phase} className="overflow-hidden">
                              <CardHeader className="p-4 pb-3">
                                <div className="flex justify-between items-center">
                                  <CardTitle className="text-base capitalize">
                                    {phase === 'followThrough' ? 'Follow Through' : phase}
                                  </CardTitle>
                                  <div className={`text-lg font-bold ${getScoreColor(phaseData.score)}`}>
                                    {phaseData.score}
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="p-4 pt-0">
                                <div className="space-y-3">
                                  {phaseData.strengths.length > 0 && (
                                    <div>
                                      <h4 className="text-xs font-medium text-muted-foreground mb-1">Strengths</h4>
                                      <ul className="space-y-1">
                                        {phaseData.strengths.map((strength: string, index: number) => (
                                          <li key={index} className="flex items-start gap-2 text-sm">
                                            <Check className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />
                                            <span>{strength}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  
                                  {phaseData.issues.length > 0 && (
                                    <div>
                                      <h4 className="text-xs font-medium text-muted-foreground mb-1">Issues</h4>
                                      <ul className="space-y-1">
                                        {phaseData.issues.map((issue, index) => (
                                          <li key={index} className="flex items-start gap-2 text-sm">
                                            <span className="h-3 w-3 rounded-full bg-amber-500 mt-0.5 flex items-center justify-center text-white text-[8px] shrink-0">
                                              !
                                            </span>
                                            <span>{issue}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  
                                  {phaseData.tips.length > 0 && (
                                    <div>
                                      <h4 className="text-xs font-medium text-muted-foreground mb-1">Tips</h4>
                                      <ul className="space-y-1">
                                        {phaseData.tips.map((tip, index) => (
                                          <li key={index} className="flex items-start gap-2 text-sm">
                                            <span className="h-3 w-3 rounded-full bg-blue-500 mt-0.5 flex items-center justify-center text-white text-[8px] shrink-0">
                                              i
                                            </span>
                                            <span>{tip}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                    </div>
                  </TabsContent>
                  
                  {/* Common Faults Tab */}
                  <TabsContent value="faults" className="space-y-4 mt-2">
                    <div className="rounded-lg border overflow-hidden">
                      <div className="bg-muted/50 p-3">
                        <h3 className="text-sm font-medium">Common Swing Faults</h3>
                      </div>
                      <div className="divide-y">
                        {swingFaultsDictionary.map((fault, index) => (
                          <div key={index} className="p-4">
                            <h4 className="text-base font-medium mb-2">{fault.fault}</h4>
                            <p className="text-sm text-muted-foreground mb-3">{fault.description}</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                              <div>
                                <h5 className="text-xs font-medium text-muted-foreground mb-1">Common Causes</h5>
                                <ul className="space-y-1 text-sm">
                                  {fault.causes.map((cause, causeIndex) => (
                                    <li key={causeIndex} className="flex items-start gap-2">
                                      <span className="h-3 w-3 rounded-full bg-amber-500 mt-0.5 flex items-center justify-center shrink-0" />
                                      <span>{cause}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div>
                                <h5 className="text-xs font-medium text-muted-foreground mb-1">How to Fix</h5>
                                <ul className="space-y-1 text-sm">
                                  {fault.fixes.map((fix, fixIndex) => (
                                    <li key={fixIndex} className="flex items-start gap-2">
                                      <span className="h-3 w-3 rounded-full bg-blue-500 mt-0.5 flex items-center justify-center shrink-0" />
                                      <span>{fix}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground border-t pt-4">
        <div>Golf Guru Zone AI Swing Analysis</div>
        <div>Powered by Advanced Swing Recognition Technology</div>
      </CardFooter>
    </Card>
  );
} 