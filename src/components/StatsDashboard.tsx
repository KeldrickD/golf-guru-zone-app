'use client';

import { useState, useEffect } from 'react';
import StatsService, { BetStats, CourseStats, PlayerStats } from '../services/statsService';
import SubscriptionService, { SubscriptionTier } from '../services/subscriptionService';
import WalletService from '../services/walletService';

const StatsDashboard = () => {
  const [betStats, setBetStats] = useState<BetStats | null>(null);
  const [courseStats, setCourseStats] = useState<CourseStats[] | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats[] | null>(null);
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>(SubscriptionTier.FREE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overall' | 'courses' | 'players'>('overall');
  const [isConnected, setIsConnected] = useState(false);

  const statsService = StatsService.getInstance();
  const subscriptionService = SubscriptionService.getInstance();
  const walletService = WalletService.getInstance();

  useEffect(() => {
    const checkConnectionAndLoadStats = async () => {
      const connected = await walletService.isConnected();
      setIsConnected(connected);

      if (connected) {
        const tier = await subscriptionService.getUserTier();
        setCurrentTier(tier);
        
        if (tier !== SubscriptionTier.FREE) {
          loadStats();
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkConnectionAndLoadStats();

    window.addEventListener('walletConnected', () => {
      setIsConnected(true);
      checkConnectionAndLoadStats();
    });

    window.addEventListener('walletDisconnected', () => {
      setIsConnected(false);
      setCurrentTier(SubscriptionTier.FREE);
      setBetStats(null);
      setCourseStats(null);
      setPlayerStats(null);
    });

    return () => {
      window.removeEventListener('walletConnected', () => setIsConnected(true));
      window.removeEventListener('walletDisconnected', () => setIsConnected(false));
    };
  }, []);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load overall bet stats
      const stats = await statsService.getBetStats();
      setBetStats(stats);
      
      // Load course stats
      const courses = await statsService.getCourseStats();
      setCourseStats(courses);
      
      // Load player stats (only available for Pro tier)
      if (currentTier === SubscriptionTier.PRO) {
        const players = await statsService.getPlayerStats();
        setPlayerStats(players);
      }
    } catch (err: any) {
      console.error('Error loading stats:', err);
      setError(err.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Your Golf Betting Stats</h2>
        <p className="text-gray-600 mb-4">Please connect your wallet to view your statistics.</p>
      </div>
    );
  }

  if (currentTier === SubscriptionTier.FREE) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Your Golf Betting Stats</h2>
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Premium Feature</h3>
          <p className="text-gray-600 mb-4">
            Detailed betting statistics are available with Premium and Pro subscriptions.
          </p>
          <a
            href="#subscription"
            className="inline-block bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 transition"
          >
            Upgrade Your Subscription
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-green-800 mb-4">Your Golf Betting Stats</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'overall'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('overall')}
        >
          Overall Stats
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'courses'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('courses')}
        >
          By Course
        </button>
        {currentTier === SubscriptionTier.PRO && (
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'players'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('players')}
          >
            By Player
          </button>
        )}
      </div>
      
      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
          <p className="ml-2">Loading stats...</p>
        </div>
      ) : (
        <>
          {/* Overall Stats */}
          {activeTab === 'overall' && betStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Total Bets</h3>
                <p className="text-2xl font-bold">{betStats.totalBets}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Win Rate</h3>
                <p className="text-2xl font-bold">{(betStats.winRate * 100).toFixed(1)}%</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Total Wagered</h3>
                <p className="text-2xl font-bold">${betStats.totalWagered.toFixed(2)}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Net Profit</h3>
                <p className={`text-2xl font-bold ${betStats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${betStats.netProfit.toFixed(2)}
                </p>
              </div>
            </div>
          )}
          
          {/* Course Stats */}
          {activeTab === 'courses' && courseStats && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="py-3 px-4 text-left">Course</th>
                    <th className="py-3 px-4 text-center">Bets Played</th>
                    <th className="py-3 px-4 text-center">Win Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {courseStats.map((course, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{course.courseName}</td>
                      <td className="py-3 px-4 text-center">{course.betsPlayed}</td>
                      <td className="py-3 px-4 text-center">{(course.winRate * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Player Stats */}
          {activeTab === 'players' && playerStats && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="py-3 px-4 text-left">Player</th>
                    <th className="py-3 px-4 text-center">Games</th>
                    <th className="py-3 px-4 text-center">Wins</th>
                    <th className="py-3 px-4 text-center">Losses</th>
                    <th className="py-3 px-4 text-center">Win Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {playerStats.map((player, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{player.displayName || player.playerAddress}</td>
                      <td className="py-3 px-4 text-center">{player.gamesPlayed}</td>
                      <td className="py-3 px-4 text-center">{player.wins}</td>
                      <td className="py-3 px-4 text-center">{player.losses}</td>
                      <td className="py-3 px-4 text-center">{(player.winRateVsYou * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Refresh button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={loadStats}
              disabled={loading}
              className="text-green-600 hover:text-green-800 transition"
            >
              Refresh Stats
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StatsDashboard; 