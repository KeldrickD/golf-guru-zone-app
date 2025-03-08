import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { 
  Loader, 
  X, 
  DollarSign, 
  Calendar, 
  Users, 
  MapPin, 
  Trophy,
  CheckCircle2
} from "lucide-react";

import WalletService from '../services/walletService';
import ContractService from '../services/contractService';
import AnalyticsService from '../services/analyticsService';
import { BetType } from '../services/recommendationService';

export interface QuickBetModalProps {
  isOpen: boolean;
  onClose: () => void;
  betType: BetType;
  courseName: string;
  recommendedAmount: number;
  opponents?: string[];
  confidence?: number;
}

const QuickBetModal: React.FC<QuickBetModalProps> = ({
  isOpen,
  onClose,
  betType,
  courseName,
  recommendedAmount,
  opponents = [],
  confidence = 0.7,
}) => {
  const router = useRouter();
  const [amount, setAmount] = useState<string>(recommendedAmount.toString());
  const [date, setDate] = useState<string>(getTomorrowDate());
  const [selectedOpponents, setSelectedOpponents] = useState<string[]>(opponents);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [betId, setBetId] = useState<string | null>(null);
  
  const walletService = WalletService.getInstance();
  const contractService = ContractService.getInstance();
  const analyticsService = AnalyticsService.getInstance();
  
  useEffect(() => {
    // Reset the form when the modal opens
    if (isOpen) {
      setAmount(recommendedAmount.toString());
      setDate(getTomorrowDate());
      setSelectedOpponents(opponents);
      setError(null);
      setSuccess(false);
      setBetId(null);
    }
  }, [isOpen, recommendedAmount, opponents]);
  
  // Helper function to get tomorrow's date in YYYY-MM-DD format
  function getTomorrowDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }
  
  // Handle bet creation
  const handleCreateBet = async () => {
    try {
      setIsCreating(true);
      setError(null);
      
      // Basic validation
      if (!amount || parseFloat(amount) <= 0) {
        setError('Please enter a valid bet amount');
        return;
      }
      
      if (!date) {
        setError('Please select a valid date');
        return;
      }
      
      const dateObj = new Date(date);
      if (dateObj < new Date()) {
        setError('Date cannot be in the past');
        return;
      }
      
      if (selectedOpponents.length === 0) {
        setError('Please select at least one opponent');
        return;
      }
      
      // Create the bet
      const createdBetId = await contractService.createBet(
        betType,
        selectedOpponents,
        amount,
        courseName,
        dateObj
      );
      
      if (!createdBetId) {
        throw new Error('Failed to create bet');
      }
      
      // Track bet creation from recommendation
      analyticsService.trackEvent('quick_bet_created', {
        betType,
        amount,
        courseName,
        confidence,
        opponentCount: selectedOpponents.length
      });
      
      // Show success message
      setSuccess(true);
      setBetId(createdBetId);
      
      // Auto-close after 3 seconds on success
      setTimeout(() => {
        onClose();
        // Navigate to bet details page
        router.push(`/bets/${createdBetId}`);
      }, 3000);
      
    } catch (error) {
      console.error('Error creating bet:', error);
      setError('Failed to create bet. Please try again.');
      
      // Track error
      analyticsService.trackEvent('quick_bet_error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        betType,
        amount
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  // Handle opponent selection
  const handleOpponentToggle = (opponent: string) => {
    setSelectedOpponents(prev => 
      prev.includes(opponent)
        ? prev.filter(o => o !== opponent)
        : [...prev, opponent]
    );
  };
  
  // Render nothing if modal is closed
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <Button 
            variant="ghost" 
            className="absolute right-2 top-2 h-8 w-8 p-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
          
          <CardTitle>Quick Bet</CardTitle>
          <CardDescription>
            Create a {betType.replace('_', ' ').toLowerCase()} bet at {courseName}
          </CardDescription>
        </CardHeader>
        
        {success ? (
          <CardContent className="pb-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold">Bet Created Successfully!</h3>
              <p className="text-muted-foreground">
                Your bet has been created and is now available for others to join.
              </p>
              {betId && (
                <p className="text-sm">
                  Bet ID: <span className="font-mono">{betId}</span>
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Redirecting to bet details...
              </p>
            </div>
          </CardContent>
        ) : (
          <>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="amount">Bet Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-9"
                    placeholder="Enter bet amount"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="course"
                    type="text"
                    value={courseName}
                    readOnly
                    className="pl-9 bg-gray-50"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Bet Type</Label>
                <div className="relative flex items-center">
                  <Trophy className="h-4 w-4 mr-2 text-gray-500" />
                  <div className="font-medium">
                    {betType.replace('_', ' ')}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {getBetTypeDescription(betType)}
                </p>
              </div>
              
              {opponents.length > 0 && (
                <div className="space-y-2">
                  <Label>Select Opponents</Label>
                  <div className="flex items-center flex-wrap gap-2">
                    {opponents.map((opponent, index) => (
                      <div 
                        key={index}
                        onClick={() => handleOpponentToggle(opponent)}
                        className={`
                          px-3 py-1.5 rounded-md text-sm cursor-pointer flex items-center
                          ${selectedOpponents.includes(opponent) ? 
                            'bg-blue-100 text-blue-800 border border-blue-300' : 
                            'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
                          }
                        `}
                      >
                        <Users className="h-3.5 w-3.5 mr-1.5" />
                        {formatAddress(opponent)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {confidence && (
                <div className="flex items-center text-sm">
                  <span className="text-muted-foreground mr-2">AI Confidence:</span>
                  <span className={`font-medium ${
                    confidence >= 0.8 ? 'text-green-600' : 
                    confidence >= 0.6 ? 'text-yellow-600' : 
                    'text-red-600'
                  }`}>
                    {Math.round(confidence * 100)}%
                  </span>
                </div>
              )}
            </CardContent>
            
            <CardFooter>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleCreateBet}
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Bet'
                )}
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
};

// Helper to format addresses
function formatAddress(address: string): string {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

// Helper to get bet type descriptions
function getBetTypeDescription(betType: BetType): string {
  const descriptions: Record<BetType, string> = {
    'MATCH_PLAY': 'Play against an opponent where each hole is a separate competition.',
    'STROKE_PLAY': 'Standard golf where the total number of strokes determines the winner.',
    'NASSAU': 'Three separate bets on the front 9, back 9, and overall 18 holes.',
    'SKINS': 'Each hole is worth a set amount, tied holes carry over to next hole.',
    'STABLEFORD': 'Points-based system with scoring relative to par on each hole.',
    'BEST_BALL': 'Team format where the best score from each team is used on each hole.'
  };
  
  return descriptions[betType] || 'Custom bet type';
}

export default QuickBetModal; 