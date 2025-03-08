"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';
import BetFormSimple from '@/components/BetFormSimple';
import BetCard from '@/components/BetCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import BottomNavBar from '@/components/ui/BottomNavBar';
import { HomeIcon, ChartBarIcon, UserIcon, BellIcon, PlusIcon } from 'lucide-react';

export default function ModernUIPage() {
  const router = useRouter();
  const { isConnected } = useWallet();
  const [showBetForm, setShowBetForm] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  const handleCreateBet = () => {
    setShowBetForm(true);
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: <HomeIcon /> },
    { id: 'stats', label: 'Stats', icon: <ChartBarIcon /> },
    { id: 'profile', label: 'Profile', icon: <UserIcon /> },
    { id: 'notifications', label: 'Notifications', icon: <BellIcon /> }
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Welcome Section */}
          <Card className="p-6">
            <h1 className="text-2xl font-bold mb-4">Welcome to Golf Guru Zone</h1>
            <p className="text-muted-foreground mb-4">
              Create and manage your golf bets with ease. Track your performance and compete with friends.
            </p>
            <Button onClick={handleCreateBet}>Create New Bet</Button>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-3">Quick Actions</h2>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  View Active Bets
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  View Performance
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  View Rules
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-3">Recent Activity</h2>
              <div className="space-y-4">
                <BetCard
                  id="1"
                  type="Match Play"
                  amount="0.1"
                  creator="You"
                  players={['You', 'John']}
                  joinedPlayers={['You']}
                  createdAt={new Date().toISOString()}
                  settled={false}
                  onJoin={() => {}}
                  onVote={() => {}}
                />
              </div>
            </Card>
          </div>
        </div>

        {showBetForm && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm">
            <div className="fixed inset-x-4 top-[50%] translate-y-[-50%] max-w-lg mx-auto">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Create New Bet</h2>
                <BetFormSimple onBetCreated={() => setShowBetForm(false)} />
              </Card>
            </div>
          </div>
        )}
      </main>

      <BottomNavBar
        items={navItems}
        activeItem={activeSection}
        onItemClick={setActiveSection}
        centerActionButton={{
          icon: <PlusIcon />,
          onClick: handleCreateBet,
          label: 'Create Bet'
        }}
      />
    </div>
  );
} 