'use client';

import { useState, useEffect, Suspense } from 'react';
import styled, { keyframes } from 'styled-components';
import { colors, typography, borderRadius, shadows } from '@/styles/designSystem';
import BetFormSimple from '@/components/BetFormSimple';
import BetCard from '@/components/BetCard';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import BottomNavBar from '@/components/ui/BottomNavBar';
import WalletService from '@/services/walletService';

// Icons (simplified for this example)
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const StatsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const NotificationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

// Wallet Button Styles
const WalletButtonContainer = styled.div`
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 20;
`;

const ConnectedWalletButton = styled.button`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: ${colors.background.paper};
  border: 1px solid ${colors.border.light};
  border-radius: ${borderRadius.full};
  box-shadow: ${shadows.md};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.text.primary};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: ${shadows.lg};
    transform: translateY(-1px);
  }
`;

const WalletAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${colors.gradients.primaryGradient};
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.bold};
`;

const DisconnectedWalletButton = styled.button`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: ${colors.gradients.primaryGradient};
  border: none;
  border-radius: ${borderRadius.full};
  box-shadow: ${shadows.md};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: ${shadows.lg};
    transform: translateY(-1px);
  }
`;

// Page Content
const PageContainer = styled.div`
  padding: 80px 16px 80px;
  max-width: 768px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  margin: 0 0 24px;
  text-align: center;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border: none;
  background: none;
  font-size: ${typography.fontSize.md};
  font-weight: ${props => props.$active ? typography.fontWeight.semiBold : typography.fontWeight.medium};
  color: ${props => props.$active ? colors.primary.main : colors.text.secondary};
  cursor: pointer;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${props => props.$active ? colors.primary.main : 'transparent'};
    transition: all 0.2s ease;
  }
  
  &:hover::after {
    background-color: ${props => props.$active ? colors.primary.main : colors.primary.light};
  }
`;

const BetListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 80px;
`;

// Modal for creating bets
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 16px;
`;

const ModalContainer = styled.div`
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: ${borderRadius['2xl']};
  background-color: ${colors.background.default};
  box-shadow: ${shadows['2xl']};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid ${colors.border.light};
`;

const ModalTitle = styled.h2`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.text.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${colors.text.secondary};
  font-size: 24px;
  cursor: pointer;
  
  &:hover {
    color: ${colors.text.primary};
  }
`;

const ModalContent = styled.div`
  padding: 16px;
`;

// Empty state card
const EmptyStateCard = styled(Card)`
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const EmptyStateIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: ${colors.primary.light};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  font-size: 32px;
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const EmptyStateButton = styled(Button)`
  margin-top: 24px;
  animation: ${pulse} 2s infinite;
`;

// Loading spinner
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px 0;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${colors.primary.light};
  border-top-color: ${colors.primary.main};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// Mock data for bets
const MOCK_BETS = [
  {
    id: 'bet1',
    type: 'Nassau',
    amount: '10',
    creator: '0x1234567890AbcdEF1234567890aBcDeF12345678',
    players: [
      '0x1234567890AbcdEF1234567890aBcDeF12345678',
      '0x2345678901BcDeF2345678901bCdEf23456789',
      '0x3456789012CdEf3456789012cDEf34567890'
    ],
    joinedPlayers: [
      '0x1234567890AbcdEF1234567890aBcDeF12345678',
      '0x2345678901BcDeF2345678901bCdEf23456789'
    ],
    createdAt: new Date().toISOString(),
    settled: false
  },
  {
    id: 'bet2',
    type: 'Match Play',
    amount: '25',
    creator: '0x1234567890AbcdEF1234567890aBcDeF12345678',
    players: [
      '0x1234567890AbcdEF1234567890aBcDeF12345678',
      '0x2345678901BcDeF2345678901bCdEf23456789'
    ],
    joinedPlayers: [
      '0x1234567890AbcdEF1234567890aBcDeF12345678',
      '0x2345678901BcDeF2345678901bCdEf23456789'
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    settled: true,
    winner: '0x1234567890AbcdEF1234567890aBcDeF12345678'
  },
  {
    id: 'bet3',
    type: 'Skins',
    amount: '5',
    creator: '0x2345678901BcDeF2345678901bCdEf23456789',
    players: [
      '0x1234567890AbcdEF1234567890aBcDeF12345678',
      '0x2345678901BcDeF2345678901bCdEf23456789',
      '0x3456789012CdEf3456789012cDEf34567890',
      '0x4567890123DeF4567890123dEF45678901'
    ],
    joinedPlayers: [
      '0x1234567890AbcdEF1234567890aBcDeF12345678',
      '0x2345678901BcDeF2345678901bCdEf23456789'
    ],
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    settled: false
  }
];

const ModernUIPage = () => {
  const [activeTab, setActiveTab] = useState<'open' | 'settled'>('open');
  const [navSection, setNavSection] = useState<string>('home');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bets, setBets] = useState<any[]>([]);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  
  // Simulating data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setBets(MOCK_BETS);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Check wallet connection on mount
  useEffect(() => {
    const walletService = WalletService.getInstance();
    
    const checkConnection = async () => {
      const connected = await walletService.isConnected();
      setWalletConnected(connected);
      
      if (connected) {
        const address = await walletService.getAddress();
        setWalletAddress(address);
      }
    };
    
    checkConnection();
    
    window.addEventListener('walletConnected', () => {
      setWalletConnected(true);
      checkConnection();
    });
    
    window.addEventListener('walletDisconnected', () => {
      setWalletConnected(false);
      setWalletAddress(null);
    });
    
    return () => {
      window.removeEventListener('walletConnected', () => setWalletConnected(true));
      window.removeEventListener('walletDisconnected', () => setWalletConnected(false));
    };
  }, []);
  
  // Handle wallet connection
  const handleConnectWallet = async () => {
    const walletService = WalletService.getInstance();
    try {
      await walletService.connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };
  
  // Handle bet creation
  const handleBetCreated = () => {
    setIsCreateModalOpen(false);
    // Reload bets
    setLoading(true);
    setTimeout(() => {
      setBets([...MOCK_BETS]);
      setLoading(false);
    }, 500);
  };
  
  // Handle joining a bet
  const handleJoinBet = (id: string) => {
    // In a real app, this would call the contract
    console.log('Joining bet:', id);
    
    // Update UI optimistically
    const updatedBets = bets.map(bet => {
      if (bet.id === id && walletAddress) {
        return {
          ...bet,
          joinedPlayers: [...bet.joinedPlayers, walletAddress]
        };
      }
      return bet;
    });
    
    setBets(updatedBets);
  };
  
  // Handle voting for a winner
  const handleVoteForWinner = (id: string, winner: string) => {
    // In a real app, this would call the contract
    console.log('Voting for winner:', winner, 'in bet:', id);
    
    // For demo purposes, settle the bet immediately
    const updatedBets = bets.map(bet => {
      if (bet.id === id) {
        return {
          ...bet,
          settled: true,
          winner
        };
      }
      return bet;
    });
    
    setBets(updatedBets);
  };
  
  // Filter bets based on active tab
  const filteredBets = bets.filter(bet => activeTab === 'open' ? !bet.settled : bet.settled);
  
  // Navigation items
  const navItems = [
    { id: 'home', label: 'Home', icon: <HomeIcon /> },
    { id: 'stats', label: 'Stats', icon: <StatsIcon /> },
    { id: 'profile', label: 'Profile', icon: <ProfileIcon /> },
    { id: 'notifications', label: 'Notifications', icon: <NotificationIcon /> }
  ];
  
  return (
    <>
      {/* Wallet Button */}
      <WalletButtonContainer>
        {walletConnected && walletAddress ? (
          <ConnectedWalletButton>
            <WalletAvatar>{walletAddress.substring(2, 4).toUpperCase()}</WalletAvatar>
            {`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}
          </ConnectedWalletButton>
        ) : (
          <DisconnectedWalletButton onClick={handleConnectWallet}>
            Connect Wallet
          </DisconnectedWalletButton>
        )}
      </WalletButtonContainer>
      
      <PageContainer>
        <PageTitle>Golf Bets</PageTitle>
        
        {/* Tabs for filtering bets */}
        {navSection === 'home' && walletConnected && (
          <TabContainer>
            <TabButton 
              $active={activeTab === 'open'} 
              onClick={() => setActiveTab('open')}
            >
              Open Bets
            </TabButton>
            <TabButton 
              $active={activeTab === 'settled'} 
              onClick={() => setActiveTab('settled')}
            >
              Settled Bets
            </TabButton>
          </TabContainer>
        )}
        
        {/* Content based on navigation section */}
        {navSection === 'home' && (
          <>
            {/* Not connected state */}
            {!walletConnected && (
              <EmptyStateCard elevation="medium">
                <EmptyStateIcon>🏌️</EmptyStateIcon>
                <h2 style={{ 
                  fontSize: typography.fontSize.xl, 
                  fontWeight: typography.fontWeight.semiBold,
                  margin: '0 0 8px'
                }}>
                  Welcome to Golf Guru Zone
                </h2>
                <p style={{ 
                  color: colors.text.secondary,
                  margin: '0 0 16px',
                  maxWidth: '300px'
                }}>
                  Connect your wallet to start creating and managing golf bets with friends
                </p>
                <EmptyStateButton 
                  variant="gradient"
                  size="large"
                  onClick={handleConnectWallet}
                >
                  Connect Wallet
                </EmptyStateButton>
              </EmptyStateCard>
            )}
            
            {/* Connected with no bets */}
            {walletConnected && !loading && filteredBets.length === 0 && (
              <EmptyStateCard elevation="medium">
                <EmptyStateIcon>🎯</EmptyStateIcon>
                <h2 style={{ 
                  fontSize: typography.fontSize.xl, 
                  fontWeight: typography.fontWeight.semiBold,
                  margin: '0 0 8px'
                }}>
                  No {activeTab} Bets Found
                </h2>
                <p style={{ 
                  color: colors.text.secondary,
                  margin: '0 0 16px',
                  maxWidth: '300px'
                }}>
                  {activeTab === 'open' 
                    ? 'Create your first bet to get started'
                    : 'Your settled bets will appear here'}
                </p>
                {activeTab === 'open' && (
                  <EmptyStateButton 
                    variant="gradient"
                    size="large"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    Create New Bet
                  </EmptyStateButton>
                )}
              </EmptyStateCard>
            )}
            
            {/* Loading state */}
            {loading && (
              <LoadingContainer>
                <Spinner />
              </LoadingContainer>
            )}
            
            {/* Bet list */}
            {!loading && filteredBets.length > 0 && (
              <BetListContainer>
                {filteredBets.map(bet => (
                  <BetCard
                    key={bet.id}
                    id={bet.id}
                    type={bet.type}
                    amount={bet.amount}
                    creator={bet.creator}
                    players={bet.players}
                    joinedPlayers={bet.joinedPlayers}
                    createdAt={bet.createdAt}
                    settled={bet.settled}
                    winner={bet.winner}
                    onJoin={handleJoinBet}
                    onVote={handleVoteForWinner}
                  />
                ))}
              </BetListContainer>
            )}
          </>
        )}
        
        {/* Stats Section */}
        {navSection === 'stats' && (
          <Card elevation="medium" fullWidth>
            <h2 style={{ 
              fontSize: typography.fontSize.xl, 
              fontWeight: typography.fontWeight.semiBold,
              margin: '0 0 16px'
            }}>
              Statistics
            </h2>
            
            {!walletConnected ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <p style={{ color: colors.text.secondary, marginBottom: '16px' }}>
                  Connect your wallet to view your statistics
                </p>
                <Button 
                  variant="primary"
                  onClick={handleConnectWallet}
                >
                  Connect Wallet
                </Button>
              </div>
            ) : (
              <div>
                <h3 style={{ 
                  fontSize: typography.fontSize.lg, 
                  fontWeight: typography.fontWeight.medium,
                  margin: '0 0 12px'
                }}>
                  Your Performance
                </h3>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '12px',
                  marginBottom: '24px'
                }}>
                  <div style={{ 
                    padding: '16px', 
                    backgroundColor: colors.background.default,
                    borderRadius: borderRadius.lg
                  }}>
                    <div style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                      Total Bets
                    </div>
                    <div style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold }}>
                      3
                    </div>
                  </div>
                  
                  <div style={{ 
                    padding: '16px', 
                    backgroundColor: colors.background.default,
                    borderRadius: borderRadius.lg
                  }}>
                    <div style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                      Win Rate
                    </div>
                    <div style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold }}>
                      66.7%
                    </div>
                  </div>
                  
                  <div style={{ 
                    padding: '16px', 
                    backgroundColor: colors.background.default,
                    borderRadius: borderRadius.lg
                  }}>
                    <div style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                      Total Wagered
                    </div>
                    <div style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold }}>
                      $40
                    </div>
                  </div>
                  
                  <div style={{ 
                    padding: '16px', 
                    backgroundColor: colors.background.default,
                    borderRadius: borderRadius.lg
                  }}>
                    <div style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                      Net Profit
                    </div>
                    <div style={{ 
                      fontSize: typography.fontSize['2xl'], 
                      fontWeight: typography.fontWeight.bold,
                      color: colors.functional.success
                    }}>
                      +$15
                    </div>
                  </div>
                </div>
                
                <p style={{ 
                  fontSize: typography.fontSize.sm, 
                  color: colors.primary.main,
                  textAlign: 'center',
                  padding: '16px',
                  borderTop: `1px solid ${colors.border.light}`
                }}>
                  Upgrade to Premium for detailed stats by course and player
                </p>
              </div>
            )}
          </Card>
        )}
        
        {/* Profile Section */}
        {navSection === 'profile' && (
          <Card elevation="medium" fullWidth>
            <h2 style={{ 
              fontSize: typography.fontSize.xl, 
              fontWeight: typography.fontWeight.semiBold,
              margin: '0 0 16px'
            }}>
              Your Profile
            </h2>
            
            {!walletConnected ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <p style={{ color: colors.text.secondary, marginBottom: '16px' }}>
                  Connect your wallet to view your profile
                </p>
                <Button 
                  variant="primary"
                  onClick={handleConnectWallet}
                >
                  Connect Wallet
                </Button>
              </div>
            ) : (
              <div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  marginBottom: '24px'
                }}>
                  <div style={{ 
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: colors.gradients.primaryGradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginRight: '16px'
                  }}>
                    {walletAddress?.substring(2, 4).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ 
                      fontSize: typography.fontSize.lg,
                      fontWeight: typography.fontWeight.semiBold,
                      marginBottom: '4px'
                    }}>
                      Golf Pro
                    </div>
                    <div style={{ 
                      fontSize: typography.fontSize.sm,
                      color: colors.text.secondary,
                      fontFamily: 'monospace'
                    }}>
                      {walletAddress}
                    </div>
                  </div>
                </div>
                
                <div style={{ 
                  padding: '16px',
                  backgroundColor: colors.background.default,
                  borderRadius: borderRadius.lg,
                  marginBottom: '16px'
                }}>
                  <h3 style={{ 
                    fontSize: typography.fontSize.md,
                    fontWeight: typography.fontWeight.medium,
                    margin: '0 0 8px'
                  }}>
                    Subscription
                  </h3>
                  <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontWeight: typography.fontWeight.medium }}>
                        Free Plan
                      </div>
                      <div style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                        3% transaction fee, max 5 active bets
                      </div>
                    </div>
                    <Button 
                      variant="outline"
                      size="small"
                    >
                      Upgrade
                    </Button>
                  </div>
                </div>
                
                <Button 
                  variant="text"
                  fullWidth
                  style={{ marginTop: '16px' }}
                >
                  Sign Out
                </Button>
              </div>
            )}
          </Card>
        )}
        
        {/* Notifications Section */}
        {navSection === 'notifications' && (
          <Card elevation="medium" fullWidth>
            <h2 style={{ 
              fontSize: typography.fontSize.xl, 
              fontWeight: typography.fontWeight.semiBold,
              margin: '0 0 16px'
            }}>
              Notifications
            </h2>
            
            {!walletConnected ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <p style={{ color: colors.text.secondary, marginBottom: '16px' }}>
                  Connect your wallet to view your notifications
                </p>
                <Button 
                  variant="primary"
                  onClick={handleConnectWallet}
                >
                  Connect Wallet
                </Button>
              </div>
            ) : (
              <div>
                <div style={{ 
                  padding: '12px 0',
                  borderBottom: `1px solid ${colors.border.light}`
                }}>
                  <div style={{ 
                    fontSize: typography.fontSize.sm,
                    color: colors.primary.main,
                    marginBottom: '4px',
                    fontWeight: typography.fontWeight.medium
                  }}>
                    New Bet Invitation
                  </div>
                  <div style={{ marginBottom: '4px' }}>
                    <strong>John</strong> has invited you to a $25 Match Play bet
                  </div>
                  <div style={{ 
                    fontSize: typography.fontSize.sm,
                    color: colors.text.secondary
                  }}>
                    2 hours ago
                  </div>
                </div>
                
                <div style={{ 
                  padding: '12px 0',
                  borderBottom: `1px solid ${colors.border.light}`
                }}>
                  <div style={{ 
                    fontSize: typography.fontSize.sm,
                    color: colors.functional.success,
                    marginBottom: '4px',
                    fontWeight: typography.fontWeight.medium
                  }}>
                    Bet Settled
                  </div>
                  <div style={{ marginBottom: '4px' }}>
                    Your Nassau bet has been settled. You won $10!
                  </div>
                  <div style={{ 
                    fontSize: typography.fontSize.sm,
                    color: colors.text.secondary
                  }}>
                    Yesterday
                  </div>
                </div>
                
                <div style={{ 
                  padding: '12px 0'
                }}>
                  <div style={{ 
                    fontSize: typography.fontSize.sm,
                    color: colors.interface.skyBlue,
                    marginBottom: '4px',
                    fontWeight: typography.fontWeight.medium
                  }}>
                    Vote Required
                  </div>
                  <div style={{ marginBottom: '4px' }}>
                    A bet needs your vote to determine the winner
                  </div>
                  <div style={{ 
                    fontSize: typography.fontSize.sm,
                    color: colors.text.secondary
                  }}>
                    2 days ago
                  </div>
                </div>
              </div>
            )}
          </Card>
        )}
      </PageContainer>
      
      {/* Bottom Navigation */}
      <BottomNavBar
        items={navItems}
        activeItem={navSection}
        onItemClick={setNavSection}
        centerActionButton={{
          icon: <PlusIcon />,
          onClick: () => setIsCreateModalOpen(true),
          label: 'Create Bet'
        }}
      />
      
      {/* Create Bet Modal */}
      {isCreateModalOpen && (
        <ModalOverlay>
          <ModalContainer>
            <ModalHeader>
              <ModalTitle>Create New Bet</ModalTitle>
              <CloseButton onClick={() => setIsCreateModalOpen(false)}>×</CloseButton>
            </ModalHeader>
            <ModalContent>
              <BetFormSimple onBetCreated={handleBetCreated} />
            </ModalContent>
          </ModalContainer>
        </ModalOverlay>
      )}
    </>
  );
};

export default ModernUIPage; 