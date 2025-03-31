'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Book, 
  ShoppingBag, 
  Map, 
  Trophy, 
  Star, 
  Check, 
  ChevronRight,
  Users,
  Compass,
  ArrowRight,
  Play
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

const features = [
  {
    icon: BarChart,
    title: 'Performance Analysis',
    description: 'Track your stats, identify patterns, and get AI-powered insights to improve your game.',
    href: '/analytics',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300'
  },
  {
    icon: Book,
    title: 'Rules Assistant',
    description: 'Get instant answers to rules questions with our AI assistant that knows every golf rule.',
    href: '/rules',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300'
  },
  {
    icon: ShoppingBag,
    title: 'Equipment Recommender',
    description: 'Find the perfect clubs, balls, and accessories tailored to your swing and playing style.',
    href: '/equipment',
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300'
  },
  {
    icon: Map,
    title: 'Course Discovery',
    description: 'Explore new courses, read reviews, and book tee times all in one place.',
    href: '/courses',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300'
  },
];

const testimonials = [
  {
    quote: "Golf Guru Zone has helped me drop my handicap by 4 strokes in just two months. The performance insights are incredible.",
    author: "James Wilson",
    handicap: "Handicap: 8",
    image: "/testimonial-1.jpg"
  },
  {
    quote: "The equipment recommendations were spot on. Found the perfect driver for my swing and added 15 yards to my drives.",
    author: "Sarah Johnson",
    handicap: "Handicap: 12",
    image: "/testimonial-2.jpg"
  },
  {
    quote: "As a rules official, I'm impressed by the accuracy of the Rules Assistant. It's like having the USGA rule book in your pocket.",
    author: "Robert Chen",
    handicap: "PGA Professional",
    image: "/testimonial-3.jpg"
  }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20
    }
  }
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } }
};

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const handleGetStarted = () => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    } else {
      router.push('/modern-ui');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-4 py-12 bg-gradient-to-b from-green-50 to-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
          Golf Guru Zone
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl text-gray-700">
          Elevate your golf game with personalized training, performance tracking, and expert guidance.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={handleGetStarted}
            className="px-8 py-3 text-lg"
          >
            Get Started
          </Button>
          
          <Button 
            variant="outline"
            className="px-8 py-3 text-lg"
            onClick={() => router.push('/features')}
          >
            Learn More
          </Button>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🏌️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Swing Analysis</h3>
              <p className="text-gray-600">Get detailed analysis of your swing mechanics and personalized tips for improvement.</p>
            </div>
            
            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Performance Tracking</h3>
              <p className="text-gray-600">Track your golf performance with detailed statistics and visualizations.</p>
            </div>
            
            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Recommendations</h3>
              <p className="text-gray-600">Get personalized recommendations to improve your game based on your performance data.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 