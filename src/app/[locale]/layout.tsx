'use client';

import React, { useEffect, useState } from 'react';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import '@/styles/rtl.css';
import '@/styles/mobile-charts.css';
import '@/styles/mobile.css';
import { Navigation } from '@/components/layout/Navigation';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/Toaster';
import { cn } from '@/lib/utils';
import { Providers } from '@/components/Providers';
import { useLanguage } from '@/context/LanguageContext';

const inter = Inter({ subsets: ['latin'] });

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { setLanguage } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);

  // Set language based on route param
  useEffect(() => {
    if (params.locale) {
      setLanguage(params.locale as any);
    }
  }, [params.locale, setLanguage]);

  // Check if we're on mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Set initial value
    checkIsMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkIsMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return (
    <div className={cn('min-h-screen font-sans antialiased', inter.className)}>
      <Providers>
        <div className="flex flex-col md:flex-row h-screen">
          {/* Sidebar Navigation */}
          <Navigation />
          
          {/* Main Content with padding for mobile menu button */}
          <main className={cn(
            "flex-1 overflow-auto w-full", 
            isMobile && "pt-16" // Add padding top on mobile for the menu button
          )}>
            {children}
          </main>
        </div>
        <Footer />
        <Toaster />
      </Providers>
    </div>
  );
} 