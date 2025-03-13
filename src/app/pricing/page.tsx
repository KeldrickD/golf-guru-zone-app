'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Check, Shield, Zap, Award } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import { motion } from 'framer-motion';

const plans = [
  {
    name: 'Starter',
    price: 0,
    icon: <Shield className="h-8 w-8 text-blue-500" />,
    description: 'Perfect for beginners looking to explore the basics of golf improvement',
    features: [
      'Limited performance analysis (2 rounds/month)',
      'Basic rules assistance',
      'Basic equipment recommendations',
      'Course search with limited filters'
    ],
    ctaText: 'Get Started Free',
    popular: false,
    color: 'border-blue-100 dark:border-blue-900 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-950/20 dark:to-transparent',
    textColor: 'text-blue-500'
  },
  {
    name: 'Pro Performance',
    price: 14.99,
    icon: <Zap className="h-8 w-8 text-green-500" />,
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
    ctaText: 'Start Free Trial',
    popular: true,
    color: 'border-green-100 dark:border-green-900 bg-gradient-to-b from-green-50 to-transparent dark:from-green-950/20 dark:to-transparent',
    textColor: 'text-green-500'
  },
  {
    name: 'Elite Master',
    price: 29.99,
    icon: <Award className="h-8 w-8 text-purple-500" />,
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
    ctaText: 'Start Free Trial',
    popular: false,
    color: 'border-purple-100 dark:border-purple-900 bg-gradient-to-b from-purple-50 to-transparent dark:from-purple-950/20 dark:to-transparent',
    textColor: 'text-purple-500'
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

  // Calculate yearly prices with discounts
  const getDiscountedPrice = (price: number) => {
    const yearlyPrice = price * 12 * 0.8; // 20% discount
    return yearlyPrice.toFixed(2);
  };

  return (
    <>
      <PageHeader
        title="Simple, Transparent Pricing"
        description="Choose the plan that's right for your golf journey. All plans include access to our core features."
        center
        gradient
      />
      <Section className="pb-24" darkBackground>
        <div className="max-w-6xl w-full mx-auto">
          {/* Billing Toggle */}
          <div className="flex flex-col items-center mb-12">
            <p className="text-base text-gray-600 dark:text-gray-300 mb-4">
              Choose your billing interval
            </p>
            <div className="relative flex p-1 rounded-full bg-gray-100 dark:bg-gray-800 w-72 h-14">
              <button
                className={`relative w-1/2 rounded-full text-sm font-medium z-10 transition-all ${
                  billingInterval === 'monthly'
                    ? 'text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
                onClick={() => setBillingInterval('monthly')}
              >
                Monthly Billing
              </button>
              <button
                className={`relative w-1/2 rounded-full text-sm font-medium z-10 transition-all ${
                  billingInterval === 'yearly'
                    ? 'text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
                onClick={() => setBillingInterval('yearly')}
              >
                Yearly Billing
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  SAVE 20%
                </span>
              </button>
              <div 
                className={`absolute inset-y-1 w-[calc(50%-2px)] bg-primary rounded-full shadow-sm transition-all duration-300 ease-in-out ${
                  billingInterval === 'yearly' ? 'left-[calc(50%+1px)]' : 'left-1'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <motion.div 
                key={plan.name}
                whileHover={{ 
                  y: -8,
                  transition: { type: "spring", stiffness: 300 }
                }}
              >
                <Card 
                  className={`h-full overflow-hidden relative ${plan.color} border-2 ${
                    plan.popular ? 'border-primary shadow-xl md:scale-105 z-10' : 'border-transparent'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-md">
                        MOST POPULAR
                      </div>
                    </div>
                  )}
                  
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-2 mb-2">
                      {plan.icon}
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                    </div>
                    <CardDescription className="min-h-12">{plan.description}</CardDescription>
                    <div className="mt-6 mb-1">
                      <div className="flex items-baseline">
                        <span className={`text-5xl font-bold ${plan.textColor}`}>
                          ${billingInterval === 'yearly' ? getDiscountedPrice(plan.price) : plan.price}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 ml-2">
                          /{billingInterval === 'yearly' ? 'year' : 'month'}
                        </span>
                      </div>
                      {plan.price > 0 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {billingInterval === 'monthly' 
                            ? `Billed monthly at $${plan.price}` 
                            : `Billed annually at $${getDiscountedPrice(plan.price)}`}
                        </p>
                      )}
                      {plan.trial && (
                        <p className={`text-sm font-medium ${plan.textColor} mt-2`}>
                          Includes {plan.trial}
                        </p>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <Check className={`h-5 w-5 ${plan.textColor} mr-2 shrink-0 mt-0.5`} />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full mt-4 group"
                      variant={plan.name === 'Starter' ? 'outline' : 'default'}
                      size="lg"
                      onClick={() => plan.name !== 'Starter' && handleSubscribe(plan.name)}
                    >
                      {plan.ctaText}
                      <motion.span
                        className="ml-2 inline-block"
                        initial={{ x: 0 }}
                        whileHover={{ x: 3 }}
                      >
                        →
                      </motion.span>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-4">Need a custom plan for your golf club or team?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              We offer special pricing for golf clubs, teams, and large groups. Contact us to learn about our enterprise options.
            </p>
            <Button variant="outline" size="lg">
              Contact Sales
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
} 