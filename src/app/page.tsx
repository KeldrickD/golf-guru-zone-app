'use client';

import Link from 'next/link';
import { Book, BrainCircuit, History } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

const features = [
  {
    icon: Book,
    title: 'Golf Rules Assistant',
    description: 'Get instant answers to your golf rules questions from our AI-powered assistant.',
    href: '/rules',
  },
  {
    icon: BrainCircuit,
    title: 'AI Betting Recommendations',
    description: 'Receive personalized betting recommendations based on historical data and current conditions.',
    href: '/recommendations',
  },
  {
    icon: History,
    title: 'Performance History',
    description: 'Track your betting performance and view detailed analytics of your past bets.',
    href: '/recommendation-history',
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-4">
          Welcome to Golf Guru Zone
        </h1>
        <p className="text-xl text-center text-muted-foreground mb-12">
          Your AI-powered golf betting companion
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((feature) => (
            <Card key={feature.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={feature.href}>
                  <Button className="w-full">Try Now</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/rules">
            <Button size="lg" className="mr-4">
              Try Rules Assistant
            </Button>
          </Link>
          <Link href="/recommendations">
            <Button size="lg" variant="outline">
              View Recommendations
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
} 