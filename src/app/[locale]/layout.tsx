'use client';

import React, { useEffect } from 'react';
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

  // Set language based on route param
  useEffect(() => {
    if (params.locale) {
      setLanguage(params.locale as any);
    }
  }, [params.locale, setLanguage]);

  return (
    <div className={cn('min-h-screen font-sans antialiased', inter.className)}>
      <Providers>
        <div className="flex h-screen">
          <div className="w-64 border-r">
            <Navigation />
          </div>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
        <Footer />
        <Toaster />
      </Providers>
    </div>
  );
} 