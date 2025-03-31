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
  Search,
  Flag,
  Wifi,
  WifiOff,
  Sparkles
} from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { useSession } from '@/components/SessionProvider';
import { useSubscription } from '@/hooks/useSubscription';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '@/context/LanguageContext';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  requiresAuth: boolean;
  requiresPro?: boolean;
  links?: { title: string; href: string; icon: string; description: string }[];
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: BarChart,
    description: 'Overview of your golf stats and performance',
    requiresAuth: false,
  },
  {
    name: 'Performance Analysis',
    href: '/performance-analysis',
    icon: BarChart,
    description: 'Detailed analysis with strokes gained metrics',
    requiresAuth: false,
    links: [
      {
        title: 'Strokes Gained',
        href: '/performance-analysis?tab=strokes-gained',
        icon: 'chart',
        description: 'Analyze your game with strokes gained metrics'
      },
      {
        title: 'Swing Analyzer',
        href: '/performance-analysis?tab=swing-analyzer',
        icon: 'video',
        description: 'AI-powered swing analysis and feedback'
      },
      {
        title: 'Goal Tracker',
        href: '/performance-analysis?tab=goal-tracker',
        icon: 'target',
        description: 'Set goals and track your progress'
      }
    ]
  },
  {
    name: 'Rounds',
    href: '/rounds',
    icon: Flag,
    description: 'Record and view your golf rounds',
    requiresAuth: true,
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
  {
    name: 'Features',
    href: '/features',
    icon: Sparkles,
    description: 'Explore advanced golf features and tools',
    requiresAuth: false,
  },
];

const Navigation = () => {
  const { t } = useLanguage();
  const pathname = usePathname() || '';
  const { data: session, status } = useSession();
  const { tier } = useSubscription();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  // Translated navigation items
  const translatedNavItems = navigationItems.map(item => ({
    ...item,
    name: t(`navigation.${item.href.split('/')[1] || 'home'}`),
    description: t(`navigation.${item.href.split('/')[1] || 'home'}Description`, { defaultValue: item.description })
  }));

  // Filter navigation items based on auth status
  const filteredNavItems = translatedNavItems.filter(item => 
    !item.requiresAuth || (item.requiresAuth && session)
  );

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
                Golf Guru
              </span>
              <span className="hidden sm:inline text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
                Zone
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-1">
              {filteredNavItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
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
                        {t('common.pro')}
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
                <span>{t('navigation.pricing')}</span>
              </Link>
            </div>

            {/* Desktop Right Section */}
            <div className="hidden md:flex md:items-center md:space-x-2">
              {/* Online/Offline Indicator */}
              {!isOnline && (
                <div className="flex items-center mr-2 text-amber-500">
                  <WifiOff className="h-4 w-4 mr-1" />
                  <span className="text-xs font-medium">Offline</span>
                </div>
              )}

              {/* Language Selector */}
              <LanguageSelector />

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
                  onClick={() => { /* Mock sign in */ }}
                  variant="default" 
                  size="sm" 
                  className="rounded-full px-4 ml-2 shadow-sm hover:shadow transition-shadow"
                >
                  {t('auth.signIn')}
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
                    onClick={() => { /* Mock sign out */ }}
                    className="rounded-full border-primary/20 hover:border-primary/40 text-gray-700 dark:text-gray-200"
                  >
                    Sign Out
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Online/Offline Indicator */}
              {!isOnline && (
                <div className="flex items-center mr-1">
                  <WifiOff className="h-4 w-4 text-amber-500" />
                </div>
              )}

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
            {filteredNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
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
                      {t('common.pro')}
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
                <span className="font-medium">{t('navigation.pricing')}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">View our subscription plans</span>
              </div>
            </Link>

            {/* Display offline status in mobile menu */}
            {!isOnline && (
              <div className="flex items-center space-x-3 px-4 py-3.5 rounded-xl text-base font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200">
                <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/40">
                  <WifiOff className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="font-medium">Offline Mode</span>
                  <span className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                    You're working offline. Changes will sync when you reconnect.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Mobile User Account - Bottom Fixed */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-800/20">
            {!session ? (
              <Button onClick={() => { /* Mock sign in */ }} className="w-full rounded-xl py-5 text-base">
                {t('auth.signInWith')} Google
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
                      {t('navigation.account')}
                    </Button>
                  </Link>
                  <Button variant="default" onClick={() => { /* Mock sign out */ }} className="w-full py-5 rounded-xl text-base">
                    {t('navigation.logout')}
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
                placeholder={t('common.searchPlaceholder')}
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