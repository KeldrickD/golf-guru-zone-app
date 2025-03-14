"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BetFormSimple from '@/components/BetFormSimple';
import BetCard from '@/components/BetCard';
import BottomNavigation from '@/components/BottomNavigation';
import { useWallet } from '@/hooks/useWallet';

export default function ModernUIPage() {
  const router = useRouter();
  const { isConnected } = useWallet();
  const [showBetForm, setShowBetForm] = useState(false);
  const [recentBets, setRecentBets] = useState<any[]>([]);

  // Mock data for recent bets
  useEffect(() => {
    // Simulate loading recent bets
    const mockBets = [
      {
        id: 'bet_1',
        type: 'Match Play',
        amount: '25',
        players: ['Player 1', 'Player 2'],
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: 'bet_2',
        type: 'Nassau',
        amount: '10',
        players: ['Player 1', 'Player 3', 'Player 4'],
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      }
    ];
    
    setRecentBets(mockBets);
  }, []);

  const handleBetCreated = () => {
    setShowBetForm(false);
    // Add the new bet to the list (in a real app, you'd fetch from API)
    const newBet = {
      id: 'bet_' + Date.now(),
      type: 'Match Play',
      amount: '10',
      players: ['Player 1'],
      status: 'active',
      createdAt: new Date().toISOString()
    };
    setRecentBets([newBet, ...recentBets]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-md">
        {/* Welcome message */}
        {!showBetForm && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Welcome to Golf Guru Zone</h1>
            <p className="text-gray-600">
              Create and manage your golf bets with friends
            </p>
          </div>
        )}

        {/* Bet form or recent bets */}
        {showBetForm ? (
          <BetFormSimple onBetCreated={handleBetCreated} />
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Bets</h2>
              <button
                onClick={() => setShowBetForm(true)}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                + New Bet
              </button>
            </div>

            {recentBets.length > 0 ? (
              recentBets.map(bet => (
                <BetCard
                  key={bet.id}
                  bet={bet}
                  onClick={() => router.push(`/bets/${bet.id}`)}
                />
              ))
            ) : (
              <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                <div className="text-gray-500 mb-2">No bets yet</div>
                <button
                  onClick={() => setShowBetForm(true)}
                  className="text-primary font-medium"
                >
                  Create your first bet
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
} 