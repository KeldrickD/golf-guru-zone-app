'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { DollarSign, Calculator, Sparkles, CircleDollarSign, Briefcase } from 'lucide-react';

// Types and interfaces
interface ClubDetails {
  brand: string;
  model: string;
  year: number;
  condition: string;
  clubType: string;
  originalPrice: number;
}

interface TradeInEstimate {
  tradeInValue: number;
  marketValue: number;
  recommendations: string[];
}

// Sample data for brands and club types
const clubBrands = [
  "Titleist", "Callaway", "TaylorMade", "PING", "Mizuno",
  "Cobra", "Srixon", "Cleveland", "PXG", "Wilson",
  "Odyssey", "Scotty Cameron", "Other"
];

const clubTypes = [
  "Driver", "Fairway Wood", "Hybrid", "Iron Set", "Wedge",
  "Putter", "Full Set"
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 15 }, (_, i) => currentYear - i);
const conditions = ["Mint", "Excellent", "Good", "Fair", "Poor"];

export const TradeInValueEstimator: React.FC = () => {
  const [clubDetails, setClubDetails] = useState<ClubDetails>({
    brand: '',
    model: '',
    year: currentYear - 2,
    condition: 'Good',
    clubType: '',
    originalPrice: 0,
  });
  
  const [showResults, setShowResults] = useState(false);
  const [tradeInEstimate, setTradeInEstimate] = useState<TradeInEstimate | null>(null);
  
  const updateClubDetail = (field: keyof ClubDetails, value: string | number) => {
    setClubDetails({ ...clubDetails, [field]: value });
  };
  
  const calculateTradeIn = () => {
    // Validate inputs
    if (!clubDetails.brand || !clubDetails.model || !clubDetails.clubType || clubDetails.originalPrice <= 0) {
      alert('Please fill out all fields.');
      return;
    }
    
    // Calculate age factor (newer clubs retain value better)
    const age = currentYear - clubDetails.year;
    let ageFactor = 1;
    if (age <= 1) ageFactor = 0.85;
    else if (age <= 2) ageFactor = 0.75;
    else if (age <= 3) ageFactor = 0.65;
    else if (age <= 5) ageFactor = 0.5;
    else if (age <= 7) ageFactor = 0.35;
    else ageFactor = 0.25;
    
    // Condition factor
    let conditionFactor = 1;
    switch (clubDetails.condition) {
      case 'Mint': conditionFactor = 1; break;
      case 'Excellent': conditionFactor = 0.9; break;
      case 'Good': conditionFactor = 0.8; break;
      case 'Fair': conditionFactor = 0.65; break;
      case 'Poor': conditionFactor = 0.4; break;
      default: conditionFactor = 0.8;
    }
    
    // Brand premium factor (some brands hold value better)
    let brandFactor = 1;
    const premiumBrands = ['Titleist', 'Scotty Cameron', 'PING', 'Mizuno', 'PXG'];
    if (premiumBrands.includes(clubDetails.brand)) {
      brandFactor = 1.15;
    }
    
    // Club type factor (putters and wedges tend to hold value better)
    let typeFactor = 1;
    if (clubDetails.clubType === 'Putter') typeFactor = 1.2;
    else if (clubDetails.clubType === 'Wedge') typeFactor = 1.1;
    else if (clubDetails.clubType === 'Driver') typeFactor = 0.9; // Drivers depreciate faster due to technology changes
    
    // Calculate market value (what it could sell for on the used market)
    const marketValue = Math.round(clubDetails.originalPrice * ageFactor * conditionFactor * brandFactor * typeFactor);
    
    // Trade-in value is typically 50-60% of market value
    const tradeInValue = Math.round(marketValue * 0.55);
    
    // Generate recommendations
    const recommendations = [];
    
    if (age > 5 && clubDetails.clubType === 'Driver') {
      recommendations.push(`Your ${clubDetails.year} driver is older technology. Trading in and upgrading could offer significant performance gains.`);
    }
    
    if (conditionFactor < 0.7) {
      recommendations.push('The condition of your club is reducing its value. Consider getting clubs professionally cleaned before trade-in.');
    }
    
    if (tradeInValue < 100) {
      recommendations.push('Consider selling privately rather than trading in for potentially higher returns.');
    }
    
    if (age <= 2 && conditionFactor >= 0.9) {
      recommendations.push('Your club still has good value. If upgrading, look for significant technology improvements to justify the change.');
    }
    
    setTradeInEstimate({
      tradeInValue,
      marketValue,
      recommendations
    });
    
    setShowResults(true);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CircleDollarSign className="h-5 w-5 text-primary" />
            <span>Trade-In Value Estimator</span>
          </CardTitle>
          <CardDescription>
            Find out how much your current clubs are worth if you're looking to upgrade
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Select
                  value={clubDetails.brand}
                  onValueChange={(value) => updateClubDetail('brand', value)}
                >
                  <SelectTrigger id="brand">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {clubBrands.map((brand) => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  placeholder="e.g., Stealth Plus, AP2, etc."
                  value={clubDetails.model}
                  onChange={(e) => updateClubDetail('model', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clubType">Club Type</Label>
                <Select
                  value={clubDetails.clubType}
                  onValueChange={(value) => updateClubDetail('clubType', value)}
                >
                  <SelectTrigger id="clubType">
                    <SelectValue placeholder="Select club type" />
                  </SelectTrigger>
                  <SelectContent>
                    {clubTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Select
                  value={clubDetails.year.toString()}
                  onValueChange={(value) => updateClubDetail('year', parseInt(value))}
                >
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select
                  value={clubDetails.condition}
                  onValueChange={(value) => updateClubDetail('condition', value)}
                >
                  <SelectTrigger id="condition">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((condition) => (
                      <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price" className="flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span>Original Retail Price</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  placeholder="Original price when new"
                  value={clubDetails.originalPrice || ''}
                  onChange={(e) => updateClubDetail('originalPrice', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="condition-guide">
              <AccordionTrigger className="text-sm">Condition Rating Guide</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p><strong>Mint:</strong> Like new, barely or never used, no visible wear.</p>
                  <p><strong>Excellent:</strong> Light use, minimal cosmetic blemishes, no damage.</p>
                  <p><strong>Good:</strong> Normal use, minor scratches or wear, fully functional.</p>
                  <p><strong>Fair:</strong> Heavy use, noticeable cosmetic damage, still functional.</p>
                  <p><strong>Poor:</strong> Extensive wear, may have functional issues, significant cosmetic damage.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="pt-4">
            <Button onClick={calculateTradeIn} className="w-full">
              <Calculator className="h-4 w-4 mr-2" /> Calculate Trade-In Value
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {showResults && tradeInEstimate && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <span>Your Estimated Trade-In Value</span>
            </CardTitle>
            <CardDescription>
              Based on {clubDetails.year} {clubDetails.brand} {clubDetails.model} in {clubDetails.condition.toLowerCase()} condition
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center justify-center p-6 bg-muted/20 rounded-lg">
                <h4 className="text-lg text-muted-foreground mb-2">Trade-In Value</h4>
                <div className="text-4xl font-bold flex items-center text-primary">
                  <DollarSign className="h-7 w-7" />
                  <span>{tradeInEstimate.tradeInValue}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Average value at retail locations</p>
              </div>
              
              <div className="flex flex-col items-center justify-center p-6 bg-muted/20 rounded-lg">
                <h4 className="text-lg text-muted-foreground mb-2">Used Market Value</h4>
                <div className="text-4xl font-bold flex items-center">
                  <DollarSign className="h-7 w-7" />
                  <span>{tradeInEstimate.marketValue}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Potential value in private sales</p>
              </div>
            </div>
            
            {tradeInEstimate.recommendations.length > 0 && (
              <div className="mt-8">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span>Recommendations</span>
                </h4>
                <ul className="space-y-2">
                  {tradeInEstimate.recommendations.map((rec, index) => (
                    <li key={index} className="flex gap-2 text-sm">
                      <span className="text-primary">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 