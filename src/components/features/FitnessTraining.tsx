'use client';

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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/Tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  Dumbbell,
  Clock,
  Zap,
  CheckCircle2,
  Target,
  Download,
  Calendar,
  ChevronRight,
  PlayCircle,
  RotateCcw,
  Award,
  Timer,
  HeartPulse,
  Star,
} from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  targetArea: string;
  description: string;
  duration: number; // in seconds
  reps?: number;
  sets?: number;
  videoUrl?: string;
  imageUrl?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  golfBenefit: string;
}

interface Workout {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  focusAreas: string[];
  exercises: Exercise[];
  imageUrl?: string;
}

interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  duration: number; // in weeks
  frequency: number; // sessions per week
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetGoal: string;
  workouts: Workout[];
  imageUrl?: string;
}

// Mock exercises data
const mockExercises: Exercise[] = [
  {
    id: '1',
    name: 'Rotational Medicine Ball Throw',
    targetArea: 'Core',
    description: 'Stand sideways to a wall, hold a medicine ball at chest height. Rotate away from the wall, then explosively rotate toward the wall while throwing the ball against it.',
    duration: 60,
    sets: 3,
    reps: 10,
    videoUrl: 'https://example.com/videos/rotational-throw.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?q=80&w=2069&auto=format&fit=crop',
    difficulty: 'intermediate',
    golfBenefit: 'Improves rotational power for increased swing speed',
  },
  {
    id: '2',
    name: 'Single-Leg Balance with Golf Posture',
    targetArea: 'Balance and Stability',
    description: 'Stand on one leg with golf posture (slight knee bend, hinged at the hips). Hold a golf club in front of you and maintain balance for the duration.',
    duration: 30,
    sets: 3,
    videoUrl: 'https://example.com/videos/single-leg-balance.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1571019613914-85f342c6a11e?q=80&w=2070&auto=format&fit=crop',
    difficulty: 'beginner',
    golfBenefit: 'Improves stability during the golf swing',
  },
  {
    id: '3',
    name: 'Cable or Resistance Band Woodchops',
    targetArea: 'Core and Obliques',
    description: 'Attach a resistance band to a stable point at shoulder height. Stand sideways, grab the band, and pull it down and across your body in a chopping motion.',
    duration: 45,
    sets: 3,
    reps: 12,
    videoUrl: 'https://example.com/videos/woodchops.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?q=80&w=2070&auto=format&fit=crop',
    difficulty: 'intermediate',
    golfBenefit: 'Strengthens the muscles used in the golf swing',
  },
  {
    id: '4',
    name: 'Plank with Shoulder Tap',
    targetArea: 'Core and Shoulders',
    description: 'Start in a plank position with hands under shoulders. While maintaining a stable core, lift one hand to tap the opposite shoulder, then return to plank position. Alternate sides.',
    duration: 60,
    sets: 3,
    reps: 20,
    videoUrl: 'https://example.com/videos/plank-tap.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1590487988256-9ed24133863e?q=80&w=2028&auto=format&fit=crop',
    difficulty: 'beginner',
    golfBenefit: 'Enhances core stability and rotational control',
  },
  {
    id: '5',
    name: 'Kettlebell Swing',
    targetArea: 'Posterior Chain',
    description: 'Hold a kettlebell with both hands. Hinge at the hips, swinging the kettlebell between your legs, then thrust hips forward to swing the kettlebell to chest height.',
    duration: 60,
    sets: 3,
    reps: 15,
    videoUrl: 'https://example.com/videos/kettlebell-swing.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=2070&auto=format&fit=crop',
    difficulty: 'intermediate',
    golfBenefit: 'Develops power in the hips and glutes for distance',
  },
  {
    id: '6',
    name: 'TRX Suspension Trainer Rows',
    targetArea: 'Back and Arms',
    description: 'Hold TRX handles, lean back with arms extended. Pull your body up by bending elbows and squeezing shoulder blades together.',
    duration: 45,
    sets: 3,
    reps: 12,
    videoUrl: 'https://example.com/videos/trx-rows.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?q=80&w=2070&auto=format&fit=crop',
    difficulty: 'intermediate',
    golfBenefit: 'Strengthens pulling muscles for better control during the swing',
  },
  {
    id: '7',
    name: 'Squat to Press',
    targetArea: 'Full Body',
    description: 'Hold dumbbells at shoulder height. Perform a squat, then as you stand, press the weights overhead.',
    duration: 60,
    sets: 3,
    reps: 12,
    videoUrl: 'https://example.com/videos/squat-press.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1579126038374-6064e9370f0f?q=80&w=2072&auto=format&fit=crop',
    difficulty: 'intermediate',
    golfBenefit: 'Builds overall strength and coordination',
  },
  {
    id: '8',
    name: 'Hip Mobility Flow',
    targetArea: 'Hips',
    description: 'A series of dynamic hip stretches including hip circles, lateral lunges, and hip hinges.',
    duration: 120,
    videoUrl: 'https://example.com/videos/hip-mobility.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop',
    difficulty: 'beginner',
    golfBenefit: 'Increases hip mobility for better rotation in the swing',
  },
];

// Mock workout data
const mockWorkouts: Workout[] = [
  {
    id: '1',
    title: 'Golf Power Development',
    description: 'Focus on building rotational power for increased swing speed',
    duration: 30,
    difficulty: 'intermediate',
    focusAreas: ['Core', 'Hips', 'Shoulders'],
    exercises: [mockExercises[0], mockExercises[2], mockExercises[4], mockExercises[6]],
    imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=2071&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Golf Mobility & Stability',
    description: 'Improve your range of motion and balance for a consistent swing',
    duration: 25,
    difficulty: 'beginner',
    focusAreas: ['Balance', 'Flexibility', 'Mobility'],
    exercises: [mockExercises[1], mockExercises[7], mockExercises[3]],
    imageUrl: 'https://images.unsplash.com/photo-1607962837359-5e7e89f86776?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Core Strength for Golfers',
    description: 'Strengthen your core for better stability and control',
    duration: 20,
    difficulty: 'beginner',
    focusAreas: ['Core', 'Obliques', 'Lower Back'],
    exercises: [mockExercises[3], mockExercises[0], mockExercises[2]],
    imageUrl: 'https://images.unsplash.com/photo-1620188467120-5042ed1eb5da?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '4',
    title: 'Full Body Golf Conditioning',
    description: 'A comprehensive workout targeting all the major muscle groups used in golf',
    duration: 45,
    difficulty: 'advanced',
    focusAreas: ['Full Body', 'Strength', 'Endurance'],
    exercises: [mockExercises[6], mockExercises[4], mockExercises[5], mockExercises[0], mockExercises[3]],
    imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop',
  },
];

// Mock workout plans
const mockWorkoutPlans: WorkoutPlan[] = [
  {
    id: '1',
    title: '4-Week Drive Distance Booster',
    description: 'Increase your driving distance with this focused plan targeting rotational power and core strength',
    duration: 4,
    frequency: 3,
    difficulty: 'intermediate',
    targetGoal: 'Increase driving distance',
    workouts: [mockWorkouts[0], mockWorkouts[2]],
    imageUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '2',
    title: '6-Week Golf Fitness Foundation',
    description: 'Build a solid foundation of golf fitness with this comprehensive plan for beginners',
    duration: 6,
    frequency: 2,
    difficulty: 'beginner',
    targetGoal: 'Improve overall golf fitness',
    workouts: [mockWorkouts[1], mockWorkouts[2]],
    imageUrl: 'https://images.unsplash.com/photo-1556749533-e296ef97f521?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '3',
    title: '8-Week Tour Pro Conditioning',
    description: 'Train like the pros with this advanced conditioning program to take your game to the next level',
    duration: 8,
    frequency: 4,
    difficulty: 'advanced',
    targetGoal: 'Achieve elite golf fitness',
    workouts: [mockWorkouts[0], mockWorkouts[3], mockWorkouts[2]],
    imageUrl: 'https://images.unsplash.com/photo-1545809074-59472b3f5ecc?q=80&w=2070&auto=format&fit=crop',
  },
];

export const FitnessTraining = () => {
  const [selectedTab, setSelectedTab] = useState('plans');
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [focusAreaFilter, setFocusAreaFilter] = useState<string>('all');
  
  // Get all unique focus areas from workouts
  const allFocusAreas = Array.from(
    new Set(mockWorkouts.flatMap(workout => workout.focusAreas))
  );
  
  // Filter workouts based on selected filters
  const filteredWorkouts = mockWorkouts.filter(workout => {
    const matchesDifficulty = difficultyFilter === 'all' || workout.difficulty === difficultyFilter;
    const matchesFocusArea = focusAreaFilter === 'all' || 
      workout.focusAreas.some(area => area.toLowerCase() === focusAreaFilter.toLowerCase());
    
    return matchesDifficulty && matchesFocusArea;
  });
  
  const handleStartWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setCurrentExerciseIndex(0);
    setIsWorkoutActive(true);
  };
  
  const handleNextExercise = () => {
    if (selectedWorkout && currentExerciseIndex < selectedWorkout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      // Workout completed
      setIsWorkoutActive(false);
    }
  };
  
  const renderExerciseDetails = (exercise: Exercise) => {
    return (
      <Card className="border-none shadow-none">
        <CardContent className="p-0 space-y-4">
          {exercise.imageUrl && (
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <img 
                src={exercise.imageUrl} 
                alt={exercise.name} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold">{exercise.name}</h3>
              <p className="text-sm text-muted-foreground">{exercise.targetArea}</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {exercise.sets && (
                <div className="flex items-center gap-1">
                  <RotateCcw className="h-4 w-4 text-primary" />
                  <span className="text-sm">{exercise.sets} sets</span>
                </div>
              )}
              
              {exercise.reps && (
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-sm">{exercise.reps} reps</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm">{Math.floor(exercise.duration / 60)}:{(exercise.duration % 60).toString().padStart(2, '0')}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm capitalize">{exercise.difficulty}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Instructions</h4>
              <p className="text-sm">{exercise.description}</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Golf Benefit</h4>
              <p className="text-sm">{exercise.golfBenefit}</p>
            </div>
            
            {exercise.videoUrl && (
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <PlayCircle className="h-4 w-4" />
                Watch Video
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };
  
  const renderActiveWorkout = () => {
    if (!selectedWorkout || !isWorkoutActive) return null;
    
    const currentExercise = selectedWorkout.exercises[currentExerciseIndex];
    const progress = ((currentExerciseIndex + 1) / selectedWorkout.exercises.length) * 100;
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{selectedWorkout.title}</h2>
            <p className="text-muted-foreground">
              Exercise {currentExerciseIndex + 1} of {selectedWorkout.exercises.length}
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setIsWorkoutActive(false)}
            className="gap-2"
          >
            Exit Workout
          </Button>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {renderExerciseDetails(currentExercise)}
        
        <div className="flex justify-end gap-3">
          {currentExerciseIndex > 0 && (
            <Button 
              variant="outline" 
              onClick={() => setCurrentExerciseIndex(currentExerciseIndex - 1)}
            >
              Previous
            </Button>
          )}
          
          <Button onClick={handleNextExercise}>
            {currentExerciseIndex < selectedWorkout.exercises.length - 1 ? 'Next Exercise' : 'Complete Workout'}
          </Button>
        </div>
      </div>
    );
  };
  
  const renderWorkoutCard = (workout: Workout) => {
    return (
      <Card key={workout.id} className="overflow-hidden">
        {workout.imageUrl && (
          <div className="aspect-video w-full overflow-hidden">
            <img 
              src={workout.imageUrl} 
              alt={workout.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardContent className="p-5 space-y-4">
          <div>
            <h3 className="text-lg font-bold">{workout.title}</h3>
            <p className="text-sm text-muted-foreground">{workout.description}</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm">{workout.duration} min</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Dumbbell className="h-4 w-4 text-primary" />
              <span className="text-sm">{workout.exercises.length} exercises</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm capitalize">{workout.difficulty}</span>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Focus Areas:</h4>
            <div className="flex flex-wrap gap-2">
              {workout.focusAreas.map((area, i) => (
                <span 
                  key={i} 
                  className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-5 py-3 border-t">
          <Button 
            className="w-full"
            onClick={() => handleStartWorkout(workout)}
          >
            Start Workout
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  const renderPlanCard = (plan: WorkoutPlan) => {
    return (
      <Card key={plan.id} className="overflow-hidden">
        {plan.imageUrl && (
          <div className="aspect-video w-full overflow-hidden">
            <img 
              src={plan.imageUrl} 
              alt={plan.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardContent className="p-5 space-y-4">
          <div>
            <h3 className="text-lg font-bold">{plan.title}</h3>
            <p className="text-sm text-muted-foreground">{plan.description}</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm">{plan.duration} weeks</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Timer className="h-4 w-4 text-primary" />
              <span className="text-sm">{plan.frequency}x weekly</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm capitalize">{plan.difficulty}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-sm">{plan.targetGoal}</span>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Includes:</h4>
            <ul className="space-y-1">
              {plan.workouts.map((workout, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {workout.title}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="px-5 py-3 border-t">
          <Button 
            className="w-full"
            onClick={() => setSelectedPlan(plan)}
          >
            View Plan Details
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  const renderPlanDetails = () => {
    if (!selectedPlan) return null;
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{selectedPlan.title}</h2>
            <p className="text-muted-foreground">{selectedPlan.description}</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setSelectedPlan(null)}
          >
            Back to Plans
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Duration</p>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-primary" />
                  <p className="font-medium">{selectedPlan.duration} weeks</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Frequency</p>
                <div className="flex items-center gap-1">
                  <Timer className="h-4 w-4 text-primary" />
                  <p className="font-medium">{selectedPlan.frequency}x weekly</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Difficulty</p>
                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4 text-primary" />
                  <p className="font-medium capitalize">{selectedPlan.difficulty}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Goal</p>
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4 text-primary" />
                  <p className="font-medium">{selectedPlan.targetGoal}</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <h3 className="text-lg font-bold mb-4">Weekly Schedule</h3>
              <div className="space-y-4">
                {Array.from({ length: selectedPlan.duration }).map((_, weekIndex) => (
                  <Accordion key={weekIndex} type="single" collapsible className="border rounded-lg">
                    <AccordionItem value={`week-${weekIndex}`} className="border-none">
                      <AccordionTrigger className="px-4 py-3">
                        Week {weekIndex + 1}
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-0">
                        <div className="space-y-3">
                          {Array.from({ length: selectedPlan.frequency }).map((_, sessionIndex) => {
                            const workoutIndex = (weekIndex + sessionIndex) % selectedPlan.workouts.length;
                            const workout = selectedPlan.workouts[workoutIndex];
                            
                            return (
                              <Card key={sessionIndex} className="overflow-hidden">
                                <div className="flex items-center p-4">
                                  <div className="flex-1">
                                    <h4 className="font-medium">Session {sessionIndex + 1}: {workout.title}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {workout.duration} min • {workout.exercises.length} exercises
                                    </p>
                                  </div>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="gap-1"
                                    onClick={() => handleStartWorkout(workout)}
                                  >
                                    <PlayCircle className="h-4 w-4" />
                                    Start
                                  </Button>
                                </div>
                              </Card>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center pt-4">
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                Download Full Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  // If we're in workout mode, show the active workout
  if (isWorkoutActive && selectedWorkout) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            Golf Fitness & Training
          </CardTitle>
          <CardDescription>
            Improve your golf performance with specialized fitness programs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderActiveWorkout()}
        </CardContent>
      </Card>
    );
  }
  
  // If a plan is selected, show plan details
  if (selectedPlan) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            Golf Fitness & Training
          </CardTitle>
          <CardDescription>
            Improve your golf performance with specialized fitness programs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderPlanDetails()}
        </CardContent>
      </Card>
    );
  }
  
  // Otherwise show the main screen
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-primary" />
          Golf Fitness & Training
        </CardTitle>
        <CardDescription>
          Improve your golf performance with specialized fitness programs
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="plans" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="plans" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Training Plans</span>
            </TabsTrigger>
            <TabsTrigger value="workouts" className="flex items-center gap-2">
              <Dumbbell className="h-4 w-4" />
              <span>Single Workouts</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="plans" className="space-y-6">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {mockWorkoutPlans.map(plan => renderPlanCard(plan))}
            </div>
          </TabsContent>
          
          <TabsContent value="workouts" className="space-y-6">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Difficulty</label>
                <Select 
                  value={difficultyFilter}
                  onValueChange={setDifficultyFilter}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Focus Area</label>
                <Select 
                  value={focusAreaFilter}
                  onValueChange={setFocusAreaFilter}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Areas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Areas</SelectItem>
                    {allFocusAreas.map((area, index) => (
                      <SelectItem key={index} value={area.toLowerCase()}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredWorkouts.map(workout => renderWorkoutCard(workout))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}; 