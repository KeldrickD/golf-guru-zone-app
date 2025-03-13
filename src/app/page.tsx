'use client';

import Link from 'next/link';
import Image from 'next/image';
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
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useSession } from 'next-auth/react';

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

export default function Home() {
  const { data: session } = useSession();
  
  return (
    <main className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-50 via-green-100 to-green-100 dark:from-green-950 dark:via-green-900 dark:to-green-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        
        {/* Decorative elements */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 py-24 sm:py-32 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div 
              className="md:w-1/2 mb-10 md:mb-0 md:pr-12"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-green-900 dark:text-green-50"
                variants={itemVariants}
              >
                Elevate Your <span className="text-primary relative">
                  Golf Game
                  <span className="absolute -bottom-1 left-0 right-0 h-1 bg-primary/40 rounded-full"></span>
                </span> With AI
              </motion.h1>
              <motion.p 
                className="text-xl text-green-800 dark:text-green-100 mb-8 leading-relaxed"
                variants={itemVariants}
              >
                Get personalized insights, equipment recommendations, and course discoveries tailored to your unique golf game.
              </motion.p>
              <motion.div 
                className="flex flex-wrap gap-4"
                variants={itemVariants}
              >
                <Link href={session ? "/analytics" : "/api/auth/signin"}>
                  <Button size="lg" className="rounded-lg px-8 shadow-lg hover:shadow-xl transition-shadow group">
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" size="lg" className="rounded-lg px-8 shadow-sm hover:shadow transition-shadow">
                    View Plans
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div 
                variants={itemVariants} 
                className="mt-12 flex items-center"
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="rounded-full group mr-6 flex items-center text-green-800 dark:text-green-100"
                >
                  <div className="mr-2 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                    <Play className="h-4 w-4 fill-current group-hover:scale-110 transition-transform" />
                  </div>
                  <span>Watch Demo</span>
                </Button>
                
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-background bg-gray-200 dark:bg-gray-700"></div>
                    ))}
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                        ))}
                      </div>
                      <span className="ml-2 text-sm font-medium">4.9/5 rating</span>
                    </div>
                    <p className="text-xs text-muted-foreground">From 2,000+ golfers</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                delay: 0.2,
                duration: 0.8
              }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-[4/3] w-full bg-gradient-to-br from-green-200 to-green-300 dark:from-green-900 dark:to-green-800 relative">
                  {/* Placeholder for golf analytics dashboard image */}
                  <div className="absolute inset-0 flex items-center justify-center text-green-700 dark:text-green-300">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.05, 1],
                        opacity: [0.3, 0.4, 0.3]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 4
                      }}
                    >
                      <BarChart className="h-24 w-24" />
                    </motion.div>
                  </div>
                </div>
              </div>
              <motion.div 
                className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center space-x-2">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="font-medium">Handicap improved</p>
                    <p className="text-xl font-bold text-primary">-3.2 strokes</p>
                  </div>
                </div>
              </motion.div>
              
              {/* Floating badges */}
              <motion.div 
                className="absolute -left-10 top-10 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">AI-Powered</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute -left-5 bottom-20 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <div className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Real-time Analytics</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Partners/Trusted by section */}
          <motion.div 
            className="mt-20 text-center"
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-6">Trusted by top golf brands</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70">
              <div className="h-8 w-24 bg-gray-400 dark:bg-gray-600 rounded"></div>
              <div className="h-8 w-24 bg-gray-400 dark:bg-gray-600 rounded"></div>
              <div className="h-8 w-24 bg-gray-400 dark:bg-gray-600 rounded"></div>
              <div className="h-8 w-24 bg-gray-400 dark:bg-gray-600 rounded"></div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Tools for Golfers</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to track, improve, and enjoy your golf game in one platform.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="border-none shadow-md hover:shadow-xl transition-shadow overflow-hidden h-full group">
                <CardHeader className={`${feature.color} border-b p-6 transition-all group-hover:bg-opacity-90`}>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-sm">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="mb-6">{feature.description}</p>
                  <Link href={feature.href}>
                    <Button className="w-full rounded-lg group">
                      <span>Explore {feature.title}</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full bg-green-50 dark:bg-green-950 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-30"></div>
        <motion.div 
          className="container mx-auto px-4 relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { value: "5,000+", label: "Active Golfers" },
              { value: "10,000+", label: "Rounds Analyzed" },
              { value: "3.5", label: "Avg. Handicap Improvement" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="bg-white/50 dark:bg-gray-800/20 backdrop-blur-sm rounded-2xl p-6 shadow-sm"
              >
                <motion.div 
                  className="text-5xl font-bold text-primary mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.2 }}
                >
                  {stat.value}
                </motion.div>
                <p className="text-lg text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-24">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Golfers Are Saying</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of golfers who have improved their game with Golf Guru Zone.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <Card className="border-none shadow-md h-full">
                <CardContent className="p-6">
                  <div className="mb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="inline-block h-4 w-4 fill-current text-yellow-400 mr-1" />
                    ))}
                  </div>
                  <p className="mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 mr-4"></div>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.handicap}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="w-full bg-primary text-primary-foreground py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-10"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-primary-foreground/0 via-primary-foreground/20 to-primary-foreground/0"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-primary-foreground/0 via-primary-foreground/20 to-primary-foreground/0"></div>
        
        <motion.div 
          className="container mx-auto px-4 text-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Ready to Improve Your Golf Game?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 max-w-2xl mx-auto opacity-90"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Join Golf Guru Zone today and start your journey to better golf.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Link href={session ? "/analytics" : "/api/auth/signin"}>
              <Button 
                size="lg" 
                variant="secondary" 
                className="rounded-lg px-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/pricing">
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20 rounded-lg px-8 shadow hover:shadow-lg transition-shadow"
              >
                View Pricing
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>
      
      {/* Features Grid */}
      <section className="container mx-auto px-4 py-24">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Golf Guru Zone</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We combine advanced AI technology with golf expertise to deliver an unmatched experience.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {icon: BarChart, title: "Data-Driven Insights", description: "Advanced analytics to understand your strengths and weaknesses"},
            {icon: Users, title: "Community Support", description: "Connect with other golfers and share tips and experiences"},
            {icon: Book, title: "Expert Knowledge", description: "Access to professional advice and comprehensive rules information"},
            {icon: Compass, title: "Course Navigation", description: "Detailed course maps and strategies for every hole"},
            {icon: Trophy, title: "Performance Tracking", description: "Set goals and track your progress over time"},
            {icon: ShoppingBag, title: "Personalized Recommendations", description: "Equipment and training suggestions tailored to your game"},
          ].map((item, i) => (
            <motion.div 
              key={i} 
              className="flex p-4 rounded-xl hover:bg-accent/40 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="mr-4 p-3 rounded-xl bg-primary/10 text-primary">
                <item.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold mb-2 text-lg">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
} 