import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import '@/app/globals.css';
import Navigation from '../components/Navigation';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Golf Guru Zone - Golf Betting Platform</title>
        <meta name="description" content="A decentralized platform for golf betting and tracking" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Navigation />
      
      <Component {...pageProps} />
    </>
  );
}

export default MyApp; 