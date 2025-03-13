'use client';

import Link from 'next/link';
import { BarChart, Book, ShoppingBag, Map } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

const features = [
  {
    icon: BarChart,
    title: 'Performance Analysis',
    description: 'Get AI-powered insights to improve your golf game based on your round statistics.',
    href: '/analytics',
  },
  {
    icon: Book,
    title: 'Rules Assistant',
    description: 'Get instant answers to your golf rules questions from our AI-powered assistant.',
    href: '/rules',
  },
  {
    icon: ShoppingBag,
    title: 'Equipment Recommender',
    description: 'Receive personalized golf equipment recommendations based on your playing style.',
    href: '/equipment',
  },
  {
    icon: Map,
    title: 'Course Discovery',
    description: 'Find the perfect golf courses for your skill level and preferences.',
    href: '/courses',
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-4">
          Welcome to Golf Guru Zone
        </h1>
        <p className="text-xl text-center text-muted-foreground mb-4">
          Your AI-powered golf improvement companion
        </p>
        <p className="text-center mb-12">
          <Link href="/pricing">
            <Button variant="outline" className="mx-2">
              View Pricing
            </Button>
          </Link>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
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
          <Link href="/analytics">
            <Button size="lg" className="mr-4">
              Analyze Your Game
            </Button>
          </Link>
          <Link href="/rules">
            <Button size="lg" variant="outline">
              Check Rules
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
} 