import React from 'react';
import type { AppProps } from 'next/app';
import '@/styles/globals.css';

// Simple wrapper without session provider or any other client components
export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
} 