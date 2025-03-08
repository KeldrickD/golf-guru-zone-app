'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrainCircuit, History, Book, Menu, X } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { useWallet } from '@/hooks/useWallet';
import { useSubscription } from '@/hooks/useSubscription';

const navigationItems = [
  {
    name: 'AI Recommendations',
    href: '/recommendations',
    icon: BrainCircuit,
    description: 'Get personalized betting recommendations',
    requiresAuth: true,
    requiresPro: true,
  },
  {
    name: 'Recommendation History',
    href: '/recommendation-history',
    icon: History,
    description: 'View your past recommendations and their performance',
    requiresAuth: true,
  },
  {
    name: 'Rules Assistant',
    href: '/rules',
    icon: Book,
    description: 'Get instant answers to your golf rules questions',
    requiresAuth: false,
  },
];

const Navigation = () => {
  const pathname = usePathname();
  const { isConnected, connect } = useWallet();
  const { tier } = useSubscription();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Golf Guru Zone</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const showProBadge = item.requiresPro && tier !== 'PRO';

              if (item.requiresAuth && !isConnected) {
                return null;
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                  {showProBadge && (
                    <Badge variant="secondary" className="ml-2">
                      PRO
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Wallet Connection */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {!isConnected ? (
              <Button onClick={connect}>Connect Wallet</Button>
            ) : (
              <Button variant="outline">Connected</Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const showProBadge = item.requiresPro && tier !== 'PRO';

              if (item.requiresAuth && !isConnected) {
                return null;
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                  {showProBadge && (
                    <Badge variant="secondary" className="ml-2">
                      PRO
                    </Badge>
                  )}
                </Link>
              );
            })}

            {/* Mobile Wallet Connection */}
            <div className="px-3 py-2">
              {!isConnected ? (
                <Button onClick={connect} className="w-full">
                  Connect Wallet
                </Button>
              ) : (
                <Button variant="outline" className="w-full">
                  Connected
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation; 