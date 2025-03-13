'use client';

import { useState } from 'react';
import { ShoppingBag, ChevronRight, Zap, Target, Gauge, DollarSign, Sparkles, Heart, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PlayerProfile {
  handicap: number;
  swingSpeed: number;
  budget: number;
  primaryConcern: string;
  clubType: string;
}

// Define club types with icons and colors
const clubTypes = {
  'driver': { label: 'Driver', icon: <Zap className="h-4 w-4" />, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' },
  'irons': { label: 'Irons', icon: <Target className="h-4 w-4" />, color: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400' },
  'wedges': { label: 'Wedges', icon: <Gauge className="h-4 w-4" />, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400' },
  'putter': { label: 'Putter', icon: <Target className="h-4 w-4" />, color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400' },
  'full-set': { label: 'Full Set', icon: <Heart className="h-4 w-4" />, color: 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400' },
};

// Define concerns with icons and colors
const concerns = {
  'distance': { label: 'More Distance', icon: <Zap className="h-4 w-4" />, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400' },
  'accuracy': { label: 'Better Accuracy', icon: <Target className="h-4 w-4" />, color: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400' },
  'forgiveness': { label: 'More Forgiveness', icon: <Heart className="h-4 w-4" />, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' },
  'control': { label: 'Better Control', icon: <Gauge className="h-4 w-4" />, color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400' },
  'consistency': { label: 'More Consistency', icon: <Sparkles className="h-4 w-4" />, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400' },
};

export default function EquipmentPage() {
  const [profile, setProfile] = useState<PlayerProfile>({
    handicap: 0,
    swingSpeed: 0,
    budget: 0,
    primaryConcern: '',
    clubType: '',
  });
  const [recommendations, setRecommendations] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/equipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      const data = await response.json();
      setRecommendations(data.recommendations);
      
      // Scroll to recommendations smoothly
      setTimeout(() => {
        if (recommendations) {
          document.getElementById('recommendations')?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 500);
      
    } catch (error) {
      console.error('Error getting equipment recommendations:', error);
      setRecommendations('Error getting recommendations. Please try again.');
    }

    setLoading(false);
  };

  const isFormValid = () => {
    return (
      profile.handicap >= 0 &&
      profile.swingSpeed > 0 &&
      profile.budget > 0 &&
      profile.primaryConcern !== '' &&
      profile.clubType !== ''
    );
  };

  return (
    <>
      <PageHeader
        title="Equipment Recommender"
        description="Get personalized club recommendations based on your play style, swing attributes, and budget."
        icon={ShoppingBag}
        gradient
      />
      
      <Section>
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-md border-gray-100 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900">
            <CardHeader className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/80 dark:to-gray-900 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl font-bold">Find Your Perfect Golf Clubs</CardTitle>
              </div>
              <CardDescription className="text-base">
                Fill out your profile below for AI-powered equipment recommendations tailored to your game.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6">
              {/* Step Progress Indicator */}
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  {[1, 2, 3].map(step => (
                    <div 
                      key={step}
                      className={cn(
                        "flex flex-col items-center cursor-pointer",
                        activeStep >= step ? "text-primary" : "text-gray-400 dark:text-gray-600"
                      )}
                      onClick={() => setActiveStep(step)}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-colors",
                        activeStep >= step 
                          ? "bg-primary text-white"
                          : "bg-gray-100 dark:bg-gray-800"
                      )}>
                        {step}
                      </div>
                      <span className="text-xs font-medium">
                        {step === 1 ? "Player Stats" : step === 2 ? "Preferences" : "Your Budget"}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="relative h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
                    style={{ width: `${(activeStep / 3) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Step 1: Player Stats */}
                <div className={activeStep === 1 ? "block" : "hidden"}>
                  <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Tell us about your game</h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label 
                        htmlFor="handicap" 
                        className="text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
                      >
                        <Gauge className="h-4 w-4 text-primary" />
                        <span>Your Handicap</span>
                      </Label>
                      <div className="pt-2">
                        <input
                          id="handicap"
                          type="range"
                          min="0"
                          max="54"
                          step="1"
                          value={profile.handicap}
                          onChange={(e) => setProfile({ ...profile, handicap: parseInt(e.target.value) })}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary dark:bg-gray-700"
                        />
                        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
                          <span>Beginner (54)</span>
                          <span className="font-semibold text-primary">
                            {profile.handicap}
                          </span>
                          <span>Pro (0)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label 
                        htmlFor="swingSpeed" 
                        className="text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
                      >
                        <Zap className="h-4 w-4 text-primary" />
                        <span>Driver Swing Speed (mph)</span>
                      </Label>
                      <Input
                        id="swingSpeed"
                        type="number"
                        value={profile.swingSpeed || ''}
                        onChange={(e) => setProfile({ ...profile, swingSpeed: parseInt(e.target.value) || 0 })}
                        min="0"
                        required
                        className="focus:ring-primary"
                        placeholder="Enter your average driver swing speed"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Info className="h-3.5 w-3.5" />
                        Average male golfer: 93-95 mph. Average female golfer: 65-70 mph.
                      </p>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        type="button" 
                        onClick={() => setActiveStep(2)}
                        className="group"
                        disabled={profile.swingSpeed <= 0}
                      >
                        Continue
                        <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Step 2: Equipment Preferences */}
                <div className={activeStep === 2 ? "block" : "hidden"}>
                  <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Equipment preferences</h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-gray-700 dark:text-gray-300">Club Type Needed</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {Object.entries(clubTypes).map(([key, { label, icon, color }]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setProfile({ ...profile, clubType: key })}
                            className={cn(
                              "flex items-center gap-2 p-3 rounded-md text-left transition-all",
                              profile.clubType === key
                                ? `${color} border-2 border-primary/20`
                                : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border-2 border-transparent"
                            )}
                          >
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center",
                              profile.clubType === key
                                ? "bg-white/80 dark:bg-gray-900/50"
                                : "bg-gray-200 dark:bg-gray-700"
                            )}>
                              {icon}
                            </div>
                            <span className="font-medium text-sm">{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-gray-700 dark:text-gray-300">Primary Concern</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Object.entries(concerns).map(([key, { label, icon, color }]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setProfile({ ...profile, primaryConcern: key })}
                            className={cn(
                              "flex items-center gap-2 p-3 rounded-md text-left transition-all",
                              profile.primaryConcern === key
                                ? `${color} border-2 border-primary/20`
                                : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border-2 border-transparent"
                            )}
                          >
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center",
                              profile.primaryConcern === key
                                ? "bg-white/80 dark:bg-gray-900/50"
                                : "bg-gray-200 dark:bg-gray-700"
                            )}>
                              {icon}
                            </div>
                            <span className="font-medium text-sm">{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setActiveStep(1)}
                      >
                        Back
                      </Button>
                      <Button 
                        type="button" 
                        onClick={() => setActiveStep(3)}
                        className="group"
                        disabled={!profile.clubType || !profile.primaryConcern}
                      >
                        Continue
                        <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Step 3: Budget */}
                <div className={activeStep === 3 ? "block" : "hidden"}>
                  <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Set your budget</h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label 
                          htmlFor="budget" 
                          className="text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
                        >
                          <DollarSign className="h-4 w-4 text-primary" />
                          <span>Your Budget</span>
                        </Label>
                        <span className="text-lg font-semibold text-primary">${profile.budget}</span>
                      </div>
                      <div className="pt-2">
                        <input
                          id="budget"
                          type="range"
                          min="100"
                          max="3000"
                          step="50"
                          value={profile.budget}
                          onChange={(e) => setProfile({ ...profile, budget: parseInt(e.target.value) })}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary dark:bg-gray-700"
                        />
                        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
                          <span>Budget ($100)</span>
                          <span>Premium ($3000+)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-900/30">
                      <div className="flex gap-3">
                        <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1">Budget Recommendation</h4>
                          <p className="text-xs text-amber-700 dark:text-amber-400">
                            For {profile.clubType === 'full-set' ? 'a complete set' : profile.clubType}, we recommend a budget of at least ${getMinBudget(profile.clubType)} for quality equipment that will help improve your game.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setActiveStep(2)}
                      >
                        Back
                      </Button>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          type="submit" 
                          className="group" 
                          disabled={loading || !isFormValid()}
                          size="lg"
                        >
                          {loading ? 'Finding Best Equipment...' : 'Get Recommendations'}
                          <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {/* Tips Card */}
          <Card className="mt-8 border-primary/20 dark:border-primary/30 bg-primary/5 dark:bg-primary/10">
            <CardContent className="p-6">
              <h3 className="font-medium text-base mb-2 flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Pro Tips for Equipment Selection
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Higher swing speeds generally benefit from stiffer shafts</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Higher handicap golfers should prioritize forgiveness in their club selection</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Consider getting fitted for clubs, especially if you have an unusual build or swing</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </Section>

      {recommendations && (
        <Section darkBackground pattern id="recommendations">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-lg border-0 overflow-hidden">
                <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/80 dark:to-gray-900">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl font-bold">Your Personalized Equipment Recommendations</CardTitle>
                  </div>
                  <CardDescription>
                    Based on your profile, here are our recommendations for the perfect equipment setup.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                      <h3 className="text-lg font-medium mb-2 text-primary">Your Profile Summary</h3>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Gauge className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-500 dark:text-gray-400">Handicap:</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">{profile.handicap}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-500 dark:text-gray-400">Swing Speed:</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">{profile.swingSpeed} mph</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-500 dark:text-gray-400">Budget:</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">${profile.budget}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-500 dark:text-gray-400">Main Concern:</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {profile.primaryConcern in concerns 
                              ? concerns[profile.primaryConcern as keyof typeof concerns].label 
                              : profile.primaryConcern}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      <p className="whitespace-pre-line">{recommendations}</p>
                    </div>
                    
                    <div className="mt-8 flex justify-center">
                      <Button size="lg" className="group">
                        Shop Recommended Equipment
                        <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </Section>
      )}
    </>
  );
}

// Helper function to get minimum budget based on club type
function getMinBudget(clubType: string): number {
  switch(clubType) {
    case 'driver': return 300;
    case 'irons': return 700;
    case 'wedges': return 150;
    case 'putter': return 150;
    case 'full-set': return 1200;
    default: return 300;
  }
} 