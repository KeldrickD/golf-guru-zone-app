import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import WalletService from '../services/walletService';

const AnalyticsPage: React.FC = () => {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const walletService = WalletService.getInstance();
  
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setIsLoading(true);
        const address = await walletService.getAddress();
        setIsConnected(!!address);
      } catch (error) {
        console.error('Error checking wallet connection:', error);
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkConnection();
  }, []);
  
  const handleConnect = async () => {
    try {
      setIsLoading(true);
      await walletService.connect();
      setIsConnected(true);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Head>
        <title>Analytics | Golf Guru Zone</title>
        <meta name="description" content="Analyze your golf betting performance with detailed statistics and insights." />
      </Head>
      
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : !isConnected ? (
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-3xl font-bold mb-6">Connect Your Wallet</h1>
            <p className="text-center text-muted-foreground mb-8 max-w-md">
              Connect your wallet to access analytics and insights about your betting performance.
            </p>
            <button 
              onClick={handleConnect} 
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <AnalyticsDashboard />
        )}
      </main>
    </>
  );
};

export default AnalyticsPage; 