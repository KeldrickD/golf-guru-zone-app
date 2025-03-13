'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: 0,
    description: 'Perfect for beginners looking to explore the basics of golf improvement',
    features: [
      'Limited performance analysis (2 rounds/month)',
      'Basic rules assistance',
      'Basic equipment recommendations',
      'Course search with limited filters'
    ],
  },
  {
    name: 'Pro Performance',
    price: 14.99,
    description: 'Elevate your game with advanced analytics and personalized insights',
    trial: '7-day free trial',
    features: [
      'Unlimited performance analysis',
      'Detailed shot-by-shot analysis',
      'Advanced rules assistance with video explanations',
      'Custom equipment fitting recommendations',
      'Advanced course search with all filters',
      'Performance tracking dashboard',
      'Save favorite courses and equipment',
      'Email support',
      '30-day money-back guarantee',
      'Special group discounts available'
    ],
  },
  {
    name: 'Elite Master',
    price: 29.99,
    description: 'Ultimate golf mastery with AI coaching and premium features',
    trial: '7-day free trial',
    features: [
      'All Pro features included',
      'AI-powered swing analysis integration',
      'Priority equipment recommendations',
      'Course strategy guides',
      'Tournament preparation tools',
      'Personal golf coach AI assistant',
      'Custom practice plans',
      'Priority support',
      '30-day money-back guarantee',
      'Family plan options available'
    ],
  }
];

export default function PricingPage() {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');

  const handleSubscribe = async (planName: string) => {
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: planName,
          interval: billingInterval,
        }),
      });

      const data = await response.json();

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error subscribing:', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Elevate Your Golf Game</h1>
          <p className="text-xl text-muted-foreground mb-2">
            Choose the perfect plan to transform your performance on the course
          </p>
          <p className="text-sm text-muted-foreground">
            All paid plans include a 7-day free trial. Cancel anytime, hassle-free.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={billingInterval === 'monthly' ? 'default' : 'ghost'}
              onClick={() => setBillingInterval('monthly')}
            >
              Monthly
            </Button>
            <Button
              variant={billingInterval === 'yearly' ? 'default' : 'ghost'}
              onClick={() => setBillingInterval('yearly')}
            >
              Yearly (Save 20%)
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card key={plan.name} className={`${plan.name === 'Pro Performance' ? 'border-primary' : ''}`}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    ${billingInterval === 'yearly' ? (plan.price * 0.8).toFixed(2) : plan.price}
                  </span>
                  <span className="text-muted-foreground">
                    /{billingInterval === 'yearly' ? 'year' : 'month'}
                  </span>
                  {plan.trial && (
                    <p className="text-sm text-primary mt-1">
                      Includes {plan.trial}
                    </p>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full mt-6"
                  variant={plan.name === 'Starter' ? 'outline' : 'default'}
                  onClick={() => plan.name !== 'Starter' && handleSubscribe(plan.name)}
                >
                  {plan.name === 'Starter' ? 'Get Started' : `Start ${plan.trial || 'Now'}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
} 