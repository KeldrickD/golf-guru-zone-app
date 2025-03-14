'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart, 
  Trophy, 
  Book, 
  Map, 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  Sun, 
  Moon,
  Search
} from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useSubscription } from '@/hooks/useSubscription';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  requiresAuth: boolean;
  requiresPro?: boolean;
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Performance Analysis',
    href: '/analytics',
    icon: BarChart,
    description: 'Track and improve your golf game',
    requiresAuth: false,
  },
  {
    name: 'Rules Assistant',
    href: '/rules',
    icon: Book,
    description: 'Get instant answers to your golf rules questions',
    requiresAuth: false,
  },
  {
    name: 'Equipment',
    href: '/equipment',
    icon: ShoppingBag,
    description: 'Find the perfect golf equipment for your game',
    requiresAuth: false,
  },
  {
    name: 'Courses',
    href: '/courses',
    icon: Map,
    description: 'Discover new golf courses to play',
    requiresAuth: false,
  },
];

const Navigation = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { tier } = useSubscription();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white shadow-md backdrop-blur-lg dark:bg-gray-900/95' 
            : 'bg-white border-b border-gray-200 dark:bg-gray-900/70 dark:border-gray-800 backdrop-blur-sm'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 15 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Trophy className="h-6 w-6 text-primary" />
              </motion.div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
                Golf Guru Zone
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                const showProBadge = item.requiresPro && tier !== 'PRO';

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-primary'
                        : 'text-gray-700 hover:text-primary dark:text-gray-200 dark:hover:text-primary'
                    }`}
                  >
                    <span className={`absolute inset-0 rounded-md -z-10 transition-colors ${
                      isActive ? 'bg-primary/10' : 'group-hover:bg-gray-100 dark:group-hover:bg-gray-800/40'
                    }`}></span>
                    <item.icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-primary' : ''
                    }`} />
                    <span>{item.name}</span>
                    {showProBadge && (
                      <Badge variant="secondary" className="ml-1 text-xs">
                        PRO
                      </Badge>
                    )}
                  </Link>
                );
              })}
              
              <Link 
                href="/pricing" 
                className="group relative flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-700 hover:text-primary dark:text-gray-200 dark:hover:text-primary"
              >
                <span className="absolute inset-0 rounded-md -z-10 transition-colors group-hover:bg-gray-100 dark:group-hover:bg-gray-800/40"></span>
                <span>Pricing</span>
              </Link>
            </div>

            {/* Desktop Right Section */}
            <div className="hidden md:flex md:items-center md:space-x-2">
              {/* Search Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSearch} 
                className="rounded-full text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Theme Toggle */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme} 
                className="rounded-full text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              {/* User Account */}
              {!session ? (
                <Button 
                  onClick={() => signIn('google')} 
                  variant="default" 
                  size="sm" 
                  className="rounded-full px-4 ml-2 shadow-sm hover:shadow transition-shadow"
                >
                  Sign In
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/account">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button variant="ghost" size="sm" className="rounded-full gap-2 group text-gray-700 dark:text-gray-200">
                        {session.user?.image ? (
                          <div className="h-8 w-8 rounded-full overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
                            <img src={session.user.image} alt={session.user.name || "User"} className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <span className="hidden sm:inline font-medium">{session.user?.name}</span>
                      </Button>
                    </motion.div>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => signOut()} 
                    className="rounded-full border-primary/20 hover:border-primary/40 text-gray-700 dark:text-gray-200"
                  >
                    Sign Out
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Search Button Mobile */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSearch} 
                className="rounded-full text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Theme Toggle Mobile */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme} 
                className="rounded-full text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMenu} 
                className="rounded-full ml-1 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                aria-label="Toggle menu"
              >
                <motion.div
                  animate={{ rotate: isMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </motion.div>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Space for fixed navbar */}
      <div className="h-16"></div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="md:hidden fixed top-16 inset-x-0 bottom-0 z-40 bg-white dark:bg-gray-900 overflow-hidden flex flex-col"
        >
          <div className="flex-1 px-2 py-3 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const showProBadge = item.requiresPro && tier !== 'PRO';

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl text-base font-medium ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-gray-100 text-gray-700 hover:text-primary dark:text-gray-200 dark:hover:bg-gray-800/40'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className={`p-2.5 rounded-xl ${isActive ? 'bg-primary/20' : 'bg-gray-100 dark:bg-gray-800/40'}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</span>
                  </div>
                  {showProBadge && (
                    <Badge variant="secondary" className="ml-auto">
                      PRO
                    </Badge>
                  )}
                </Link>
              );
            })}
            
            <Link 
              href="/pricing" 
              className="flex items-center space-x-3 px-4 py-3.5 rounded-xl text-base font-medium hover:bg-gray-100 text-gray-700 dark:text-gray-200 dark:hover:bg-gray-800/40"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800/40">
                <Trophy className="h-5 w-5" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="font-medium">Pricing</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">View our subscription plans</span>
              </div>
            </Link>
          </div>

          {/* Mobile User Account - Bottom Fixed */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-800/20">
            {!session ? (
              <Button onClick={() => signIn('google')} className="w-full rounded-xl py-5 text-base">
                Sign In with Google
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-white dark:bg-gray-800/60">
                  {session.user?.image ? (
                    <div className="h-12 w-12 rounded-full overflow-hidden ring-2 ring-primary/20">
                      <img src={session.user.image} alt={session.user.name || "User"} className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{session.user?.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">{session.user?.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/account" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full py-5 rounded-xl text-base">
                      Account
                    </Button>
                  </Link>
                  <Button variant="default" onClick={() => signOut()} className="w-full py-5 rounded-xl text-base">
                    Sign Out
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Search Overlay - Enhanced for mobile */}
      {isSearchOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-20 px-3 sm:px-4"
          onClick={() => setIsSearchOpen(false)}
        >
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 sm:p-4 flex items-center border-b">
              <Search className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search for courses, equipment, or rules..." 
                className="flex-1 bg-transparent border-none outline-none text-base sm:text-lg text-gray-700 dark:text-gray-200" 
                autoFocus
              />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSearchOpen(false)}
                className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-3 sm:p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Recent searches</p>
              <div className="mt-2 space-y-1.5">
                <div className="p-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                  <p className="font-medium text-gray-700 dark:text-gray-200">Driver recommendations</p>
                </div>
                <div className="p-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                  <p className="font-medium text-gray-700 dark:text-gray-200">Golf courses near me</p>
                </div>
                <div className="p-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                  <p className="font-medium text-gray-700 dark:text-gray-200">How to improve putting</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default Navigation; 