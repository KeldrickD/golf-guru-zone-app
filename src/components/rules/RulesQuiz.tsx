'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';
import { Label } from '@/components/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { AlertCircle, CheckCircle, HelpCircle, XCircle, Award, ArrowRight, RefreshCw, Flag } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/ScrollArea';

// Quiz data types
interface QuizQuestion {
  id: string;
  question: string;
  category: RuleCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  options: string[];
  correctAnswer: number;
  explanation: string;
  ruleReference?: {
    number: string;
    title: string;
    link: string;
  };
  imageUrl?: string;
}

enum RuleCategory {
  GENERAL = 'general',
  TEEING = 'teeing',
  FAIRWAY = 'fairway',
  BUNKER = 'bunker',
  WATER_HAZARD = 'water_hazard',
  GREEN = 'green',
  EQUIPMENT = 'equipment',
  PENALTIES = 'penalties',
  SCORING = 'scoring',
  ETIQUETTE = 'etiquette',
  COMPETITION = 'competition'
}

interface QuizStatistics {
  totalQuestions: number;
  correctAnswers: number;
  streak: number;
  bestStreak: number;
  categoryPerformance: {
    [key in RuleCategory]?: {
      total: number;
      correct: number;
    };
  };
}

// Sample quiz questions
const sampleQuizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What is the penalty for hitting the ball into a water hazard?',
    category: RuleCategory.WATER_HAZARD,
    difficulty: 'beginner',
    options: [
      'No penalty',
      'One stroke penalty',
      'Two stroke penalty',
      'Disqualification'
    ],
    correctAnswer: 1,
    explanation: 'When your ball enters a water hazard (now called "penalty area"), you receive a one-stroke penalty when taking relief.',
    ruleReference: {
      number: '17.1',
      title: 'Options for Ball in Penalty Area',
      link: 'https://www.randa.org/Rules/The-Rules-of-Golf/Rule-17'
    }
  },
  {
    id: 'q2',
    question: 'How many clubs are you allowed in your bag during a round?',
    category: RuleCategory.EQUIPMENT,
    difficulty: 'beginner',
    options: [
      'As many as you want',
      'No more than 12 clubs',
      'No more than 14 clubs',
      'No more than 16 clubs'
    ],
    correctAnswer: 2,
    explanation: 'Under the Rules of Golf, you are allowed to have a maximum of 14 clubs in your bag during a round.',
    ruleReference: {
      number: '4.1b',
      title: 'Limit of 14 Clubs; Sharing, Adding or Replacing Clubs During Round',
      link: 'https://www.randa.org/Rules/The-Rules-of-Golf/Rule-4#4-1b'
    }
  },
  {
    id: 'q3',
    question: 'What is the time limit for searching for a lost ball?',
    category: RuleCategory.GENERAL,
    difficulty: 'beginner',
    options: [
      '2 minutes',
      '3 minutes',
      '5 minutes',
      '10 minutes'
    ],
    correctAnswer: 1,
    explanation: 'The time allowed for a ball search is three minutes. If the ball is not found within three minutes, it is considered lost.',
    ruleReference: {
      number: '18.2a',
      title: 'When Ball Is Lost or Out of Bounds',
      link: 'https://www.randa.org/Rules/The-Rules-of-Golf/Rule-18#18-2a'
    }
  },
  {
    id: 'q4',
    question: 'In stroke play, what is the penalty for playing from the wrong place?',
    category: RuleCategory.PENALTIES,
    difficulty: 'intermediate',
    options: [
      'No penalty',
      'One stroke penalty',
      'Two stroke penalty',
      'Disqualification'
    ],
    correctAnswer: 2,
    explanation: 'In stroke play, the general penalty for playing from a wrong place is two strokes.',
    ruleReference: {
      number: '14.7',
      title: 'Playing from Wrong Place',
      link: 'https://www.randa.org/Rules/The-Rules-of-Golf/Rule-14#14-7'
    }
  },
  {
    id: 'q5',
    question: 'What is the correct procedure when taking relief from a lateral water hazard?',
    category: RuleCategory.WATER_HAZARD,
    difficulty: 'intermediate',
    options: [
      'Drop anywhere behind the hazard',
      'Drop within one club-length of where the ball last crossed the margin',
      'Drop within two club-lengths of where the ball last crossed the margin, no nearer the hole',
      'Return to the previous spot and play again'
    ],
    correctAnswer: 2,
    explanation: 'For a lateral penalty area (red stakes/lines), you can drop within two club-lengths of where the ball last crossed the margin, no nearer the hole.',
    ruleReference: {
      number: '17.1d',
      title: 'Relief for Ball in Penalty Area',
      link: 'https://www.randa.org/Rules/The-Rules-of-Golf/Rule-17#17-1d'
    }
  },
  {
    id: 'q6',
    question: 'When are you allowed to clean your ball on the putting green?',
    category: RuleCategory.GREEN,
    difficulty: 'beginner',
    options: [
      'Never',
      'Only if it has mud on it',
      'Only when marking and lifting it',
      'Anytime'
    ],
    correctAnswer: 3,
    explanation: 'When your ball is on the putting green, you may lift and clean it anytime, even if it is in play, as long as you mark the spot first.',
    ruleReference: {
      number: '13.1b',
      title: 'Specific Rules for Putting Green',
      link: 'https://www.randa.org/Rules/The-Rules-of-Golf/Rule-13#13-1b'
    }
  },
  {
    id: 'q7',
    question: 'If your ball is embedded in its own pitch-mark in the fairway, what relief are you entitled to?',
    category: RuleCategory.FAIRWAY,
    difficulty: 'intermediate',
    options: [
      'No relief, you must play it as it lies',
      'Free relief - drop within one club-length not nearer the hole',
      'Relief with a one-stroke penalty',
      'You can place the ball on the nearest point of relief'
    ],
    correctAnswer: 1,
    explanation: 'You are entitled to free relief for a ball embedded in its own pitch-mark in the general area (which includes the fairway). You drop the ball within one club-length of the reference point, not nearer the hole.',
    ruleReference: {
      number: '16.3',
      title: 'Embedded Ball',
      link: 'https://www.randa.org/Rules/The-Rules-of-Golf/Rule-16#16-3'
    }
  },
  {
    id: 'q8',
    question: 'What happens if your ball moves after you have addressed it on the putting green?',
    category: RuleCategory.GREEN,
    difficulty: 'intermediate',
    options: [
      'One stroke penalty and the ball must be replaced',
      'Two stroke penalty and the ball must be replaced',
      'No penalty, but the ball must be replaced',
      'No penalty and play the ball from its new position'
    ],
    correctAnswer: 2,
    explanation: 'If your ball moves after you have addressed it on the putting green, there is no penalty. You simply replace the ball to its original position.',
    ruleReference: {
      number: '13.1d',
      title: 'When Ball or Ball-Marker Moves on Putting Green',
      link: 'https://www.randa.org/Rules/The-Rules-of-Golf/Rule-13#13-1d'
    }
  },
  {
    id: 'q9',
    question: 'In a bunker, what are you NOT allowed to do before making your stroke?',
    category: RuleCategory.BUNKER,
    difficulty: 'intermediate',
    options: [
      'Touch the sand during your backswing',
      'Remove loose impediments',
      'Test the condition of the sand',
      'All of the above'
    ],
    correctAnswer: 3,
    explanation: 'In a bunker, you cannot touch the sand during your backswing, test the condition of the sand, or remove loose impediments in the sand (although there are some exceptions for loose impediments).',
    ruleReference: {
      number: '12.2',
      title: 'Playing Ball in Bunker',
      link: 'https://www.randa.org/Rules/The-Rules-of-Golf/Rule-12#12-2'
    }
  },
  {
    id: 'q10',
    question: 'What is the correct way to take a drop when taking relief?',
    category: RuleCategory.GENERAL,
    difficulty: 'beginner',
    options: [
      'Drop from any height as long as the ball falls within the relief area',
      'Drop from knee height',
      'Drop from shoulder height',
      'Place the ball in the relief area'
    ],
    correctAnswer: 1,
    explanation: 'When taking a drop, you must drop the ball from knee height. This means the ball must be dropped straight down from a location at knee height without touching any part of your body or equipment before hitting the ground.',
    ruleReference: {
      number: '14.3b',
      title: 'Ball Must Be Dropped in Right Way',
      link: 'https://www.randa.org/Rules/The-Rules-of-Golf/Rule-14#14-3b'
    }
  }
];

export const RulesQuiz = () => {
  const { toast } = useToast();
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(sampleQuizQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [quizStats, setQuizStats] = useState<QuizStatistics>({
    totalQuestions: 0,
    correctAnswers: 0,
    streak: 0,
    bestStreak: 0,
    categoryPerformance: {},
  });
  
  // Filter questions based on category and difficulty
  const filterQuestions = () => {
    let filtered = [...sampleQuizQuestions];
    
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(q => q.category === selectedCategory);
    }
    
    if (selectedDifficulty && selectedDifficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty === selectedDifficulty);
    }
    
    // Shuffle the filtered questions
    filtered = shuffleArray(filtered);
    
    // Limit to the selected question count
    filtered = filtered.slice(0, questionCount);
    
    return filtered;
  };
  
  // Function to shuffle array (Fisher-Yates algorithm)
  const shuffleArray = (array: any[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  // Start a new quiz
  const startQuiz = () => {
    const filteredQuestions = filterQuestions();
    
    if (filteredQuestions.length === 0) {
      toast({
        title: "No questions available",
        description: "Try selecting different categories or difficulty levels",
        variant: "destructive",
      });
      return;
    }
    
    if (filteredQuestions.length < questionCount) {
      toast({
        title: "Not enough questions",
        description: `Only ${filteredQuestions.length} questions available for these filters. Starting quiz with available questions.`,
        variant: "default",
      });
    }
    
    setQuizQuestions(filteredQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setQuizStarted(true);
    setQuizFinished(false);
    setQuizStats({
      totalQuestions: 0,
      correctAnswers: 0,
      streak: 0,
      bestStreak: 0,
      categoryPerformance: {},
    });
  };
  
  // Handle answer selection
  const handleSelectAnswer = (index: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(index);
    setIsAnswered(true);
    
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isCorrect = index === currentQuestion.correctAnswer;
    
    // Update statistics
    setQuizStats(prev => {
      const newStats = { ...prev };
      newStats.totalQuestions += 1;
      
      if (isCorrect) {
        newStats.correctAnswers += 1;
        newStats.streak += 1;
        
        if (newStats.streak > newStats.bestStreak) {
          newStats.bestStreak = newStats.streak;
        }
      } else {
        newStats.streak = 0;
      }
      
      // Update category performance
      const category = currentQuestion.category;
      if (!newStats.categoryPerformance[category]) {
        newStats.categoryPerformance[category] = {
          total: 0,
          correct: 0,
        };
      }
      
      newStats.categoryPerformance[category]!.total += 1;
      
      if (isCorrect) {
        newStats.categoryPerformance[category]!.correct += 1;
      }
      
      return newStats;
    });
  };
  
  // Move to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };
  
  // Restart the quiz with the same settings
  const restartQuiz = () => {
    startQuiz();
  };
  
  // Return to setup screen
  const handleBackToSetup = () => {
    setQuizStarted(false);
    setQuizFinished(false);
  };
  
  // Calculate score percentage
  const calculateScorePercentage = () => {
    if (quizStats.totalQuestions === 0) return 0;
    return Math.round((quizStats.correctAnswers / quizStats.totalQuestions) * 100);
  };
  
  // Get performance feedback
  const getPerformanceFeedback = () => {
    const scorePercentage = calculateScorePercentage();
    
    if (scorePercentage >= 90) {
      return {
        message: "Outstanding! You're a golf rules expert!",
        icon: <Award className="w-8 h-8 text-yellow-500" />,
      };
    } else if (scorePercentage >= 70) {
      return {
        message: "Great job! You have a solid understanding of golf rules.",
        icon: <CheckCircle className="w-8 h-8 text-green-500" />,
      };
    } else if (scorePercentage >= 50) {
      return {
        message: "Good effort. Keep studying to improve your knowledge.",
        icon: <HelpCircle className="w-8 h-8 text-blue-500" />,
      };
    } else {
      return {
        message: "Keep practicing. Golf rules take time to master.",
        icon: <AlertCircle className="w-8 h-8 text-red-500" />,
      };
    }
  };
  
  const currentQuestion = quizQuestions[currentQuestionIndex];
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flag className="h-5 w-5" />
          Golf Rules Quiz
        </CardTitle>
        <CardDescription>
          Test your knowledge of golf rules and improve your understanding of the game
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!quizStarted ? (
          // Quiz Setup Screen
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={selectedCategory || 'all'}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.values(RuleCategory).map(category => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1).toLowerCase().replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={selectedDifficulty || 'all'}
                  onValueChange={setSelectedDifficulty}
                >
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="questionCount">Number of Questions</Label>
              <Select
                value={questionCount.toString()}
                onValueChange={(value) => setQuestionCount(parseInt(value))}
              >
                <SelectTrigger id="questionCount">
                  <SelectValue placeholder="Select question count" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 Questions</SelectItem>
                  <SelectItem value="10">10 Questions</SelectItem>
                  <SelectItem value="15">15 Questions</SelectItem>
                  <SelectItem value="20">20 Questions</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              className="w-full" 
              onClick={startQuiz}
            >
              Start Quiz
            </Button>
          </div>
        ) : quizFinished ? (
          // Quiz Results Screen
          <div className="space-y-6">
            <div className="text-center py-4">
              {getPerformanceFeedback().icon}
              <h3 className="text-2xl font-bold mt-2">Quiz Complete!</h3>
              <p className="text-muted-foreground">
                {getPerformanceFeedback().message}
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Score</span>
                <span className="text-sm font-medium">{quizStats.correctAnswers} / {quizStats.totalQuestions}</span>
              </div>
              <Progress value={calculateScorePercentage()} className="h-2" />
              <div className="text-xs text-right text-muted-foreground">
                {calculateScorePercentage()}%
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border rounded-md p-4">
                <h4 className="text-sm font-medium mb-2">Statistics</h4>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Best Streak</dt>
                    <dd className="text-sm font-medium">{quizStats.bestStreak}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Correct Answers</dt>
                    <dd className="text-sm font-medium">{quizStats.correctAnswers}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Total Questions</dt>
                    <dd className="text-sm font-medium">{quizStats.totalQuestions}</dd>
                  </div>
                </dl>
              </div>
              
              <div className="border rounded-md p-4">
                <h4 className="text-sm font-medium mb-2">Category Performance</h4>
                <ScrollArea className="h-24">
                  <div className="space-y-2">
                    {Object.entries(quizStats.categoryPerformance).map(([category, data]) => (
                      <div key={category} className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground capitalize">
                          {category.toLowerCase().replace('_', ' ')}
                        </span>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={data.total > 0 ? (data.correct / data.total) * 100 : 0} 
                            className="h-2 w-16" 
                          />
                          <span className="text-xs font-medium">
                            {data.correct}/{data.total}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <Button 
                className="w-full" 
                onClick={restartQuiz}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Start New Quiz
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleBackToSetup}
              >
                Modify Settings
              </Button>
            </div>
          </div>
        ) : (
          // Quiz Question Screen
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2">
                  Question {currentQuestionIndex + 1}/{quizQuestions.length}
                </Badge>
                <Badge variant="secondary">
                  {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
                </Badge>
              </div>
              <Badge>
                {currentQuestion.category.charAt(0).toUpperCase() + currentQuestion.category.slice(1).toLowerCase().replace('_', ' ')}
              </Badge>
            </div>
            
            <Progress 
              value={((currentQuestionIndex + 1) / quizQuestions.length) * 100} 
              className="h-2" 
            />
            
            <div>
              <h3 className="text-lg font-medium mb-6">{currentQuestion.question}</h3>
              
              <RadioGroup
                value={selectedAnswer !== null ? selectedAnswer.toString() : undefined}
                className="space-y-3"
              >
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-2 rounded-md border p-3 cursor-pointer
                      ${isAnswered && index === currentQuestion.correctAnswer ? 'border-green-500 bg-green-50 dark:bg-green-950/30' : ''}
                      ${isAnswered && selectedAnswer === index && index !== currentQuestion.correctAnswer ? 'border-red-500 bg-red-50 dark:bg-red-950/30' : ''}
                      ${!isAnswered ? 'hover:bg-muted' : ''}
                    `}
                    onClick={() => !isAnswered && handleSelectAnswer(index)}
                  >
                    <RadioGroupItem
                      value={index.toString()}
                      id={`option-${index}`}
                      disabled={isAnswered}
                      className="bg-background"
                    />
                    <Label
                      htmlFor={`option-${index}`}
                      className="w-full cursor-pointer flex justify-between"
                    >
                      <span>{option}</span>
                      {isAnswered && index === currentQuestion.correctAnswer && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {isAnswered && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            {isAnswered && (
              <div className={`rounded-md ${selectedAnswer === currentQuestion.correctAnswer ? 'bg-green-50 dark:bg-green-950/30 border-green-200' : 'bg-red-50 dark:bg-red-950/30 border-red-200'} border p-4`}>
                <div className="flex">
                  {selectedAnswer === currentQuestion.correctAnswer ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2 shrink-0" />
                  )}
                  <div>
                    <h4 className="text-sm font-medium">
                      {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect'}
                    </h4>
                    <p className="text-sm mt-1">
                      {currentQuestion.explanation}
                    </p>
                    {currentQuestion.ruleReference && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">
                          Rule {currentQuestion.ruleReference.number}: {currentQuestion.ruleReference.title}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {isAnswered && (
              <div className="flex justify-end">
                <Button onClick={handleNextQuestion}>
                  {currentQuestionIndex < quizQuestions.length - 1 ? (
                    <>
                      Next Question
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    'See Results'
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t px-6 py-4">
        <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
          <div>
            {quizStarted && !quizFinished && (
              <>
                <span className="mr-2">
                  Streak: {quizStats.streak}
                </span>
                <span>
                  Score: {quizStats.correctAnswers}/{quizStats.totalQuestions}
                </span>
              </>
            )}
          </div>
          <div>
            {quizStarted && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBackToSetup}
                className="h-auto px-2 py-1 text-xs"
              >
                Exit Quiz
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}; 