'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ContractService from '../services/contractService';
import WalletService from '../services/walletService';
import SubscriptionService, { SubscriptionTier } from '../services/subscriptionService';

interface BetListProps {
  refreshTrigger: number;
  betIdToShow?: string;
}

interface Bet {
  betId: string;
  betType: string;
  amount: string;
  players: string[];
  joinedStatus: boolean[];
  winner?: string;
  settled: boolean;
}

const BetList: React.FC<BetListProps> = ({ refreshTrigger, betIdToShow }) => {
  const [bets, setBets] = useState<Bet[]>([]);
  const [expandedBetId, setExpandedBetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedWinner, setSelectedWinner] = useState('');
  const [settlingBetId, setSettlingBetId] = useState<string | null>(null);
  const [isSettling, setIsSettling] = useState(false);
  const [activeTab, setActiveTab] = useState<'open' | 'settled'>('open');
  const [userJoinedStatus, setUserJoinedStatus] = useState<{[key: string]: boolean}>({});
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>(SubscriptionTier.FREE);
  const [betLimitReached, setBetLimitReached] = useState(false);
  const [activeBetsCount, setActiveBetsCount] = useState(0);
  const [maxActiveBets, setMaxActiveBets] = useState(5); // Default for FREE tier

  const contractService = ContractService.getInstance();
  const walletService = WalletService.getInstance();
  const subscriptionService = SubscriptionService.getInstance();

  // Check wallet connection on mount and listen for changes
  useEffect(() => {
    const checkConnection = async () => {
      const connected = await walletService.isConnected();
      console.log('BetList - Wallet connection status:', connected);
      setIsWalletConnected(connected);
      if (connected) {
        loadBets();
      }
    };

    checkConnection();

    window.addEventListener('walletConnected', () => {
      console.log('BetList - Wallet connected event received');
      setIsWalletConnected(true);
      loadBets();
    });

    window.addEventListener('walletDisconnected', () => {
      console.log('BetList - Wallet disconnected event received');
      setIsWalletConnected(false);
      setBets([]);
    });

    return () => {
      window.removeEventListener('walletConnected', () => {
        setIsWalletConnected(true);
        loadBets();
      });
      window.removeEventListener('walletDisconnected', () => {
        setIsWalletConnected(false);
        setBets([]);
      });
    };
  }, []);

  // Load bets when refreshTrigger changes
  useEffect(() => {
    if (isWalletConnected) {
      loadBets();
    }
  }, [refreshTrigger, betIdToShow]);

  // Check subscription tier and bet limits
  useEffect(() => {
    const checkSubscription = async () => {
      if (isWalletConnected) {
        const tier = await subscriptionService.getUserTier();
        setSubscriptionTier(tier);
        
        const tierDetails = subscriptionService.getTierDetails(tier);
        setMaxActiveBets(tierDetails.maxBets);
        
        // Count active bets
        const openBets = bets.filter(bet => !bet.settled).length;
        setActiveBetsCount(openBets);
        
        // Check if limit reached
        setBetLimitReached(tier === SubscriptionTier.FREE && openBets >= 5);
      }
    };
    
    checkSubscription();
  }, [bets, isWalletConnected]);

  // Load bets from blockchain
  const loadBets = async () => {
    setLoading(true);
    setError('');

    try {
      const userAddress = await walletService.getAddress();
      if (!userAddress) {
        throw new Error('Wallet not connected');
      }

      let betIds: string[];
      if (betIdToShow) {
        betIds = [betIdToShow];
      } else {
        betIds = await contractService.getUserBets(userAddress);
      }

      const loadedBets: Bet[] = [];
      const joinedStatuses: {[key: string]: boolean} = {};

      for (const betId of betIds) {
        const betInfo = await contractService.getBet(betId);
        const bet = {
          betId,
          betType: betInfo.betType,
          amount: ethers.formatUnits(betInfo.amount, 6), // USDC has 6 decimals
          players: betInfo.players,
          joinedStatus: betInfo.joinedStatus,
          winner: betInfo.winner,
          settled: betInfo.settled
        };
        loadedBets.push(bet);
        
        // Check if user has joined this bet
        const hasJoined = await checkUserJoined(bet);
        joinedStatuses[betId] = hasJoined;
      }

      setBets(loadedBets);
      setUserJoinedStatus(joinedStatuses);
    } catch (err) {
      console.error('Error loading bets:', err);
      setError('Failed to load bets. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Check if current user has joined a bet
  const checkUserJoined = async (bet: Bet): Promise<boolean> => {
    try {
      const userAddress = await walletService.getAddress();
      if (!userAddress) return false;
      
      const playerIndex = bet.players.findIndex(
        player => player.toLowerCase() === userAddress.toLowerCase()
      );
      
      return playerIndex >= 0 && bet.joinedStatus[playerIndex];
    } catch (error) {
      console.error('Error checking if user joined:', error);
      return false;
    }
  };

  // Handle bet expansion toggle
  const toggleExpandBet = (betId: string) => {
    setExpandedBetId(expandedBetId === betId ? null : betId);
  };

  // Handle joining a bet
  const handleJoinBet = async (bet: Bet) => {
    try {
      await contractService.joinBet(bet.betId, bet.amount);
      await loadBets(); // Refresh the list
    } catch (error) {
      console.error('Error joining bet:', error);
      setError('Failed to join bet. Please try again.');
    }
  };

  // Handle settling a bet
  const handleSettleBet = (betId: string) => {
    const bet = bets.find(b => b.betId === betId);
    if (bet) {
      setSettlingBetId(betId);
      setSelectedWinner(bet.players[0] || '');
    }
  };

  // Cancel settlement
  const handleCancelSettlement = () => {
    setSettlingBetId(null);
    setSelectedWinner('');
    setIsSettling(false);
  };

  // Confirm settlement
  const handleConfirmSettlement = async (betId: string) => {
    setIsSettling(true);
    
    try {
      await contractService.voteWinner(betId, selectedWinner);
      await loadBets(); // Refresh the list
      setSettlingBetId(null);
      setSelectedWinner('');
    } catch (error) {
      console.error('Error settling bet:', error);
      setError('Failed to settle bet. Please try again.');
    } finally {
      setIsSettling(false);
    }
  };

  // Format address for display
  const formatAddress = (address: string) => {
    return address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : '';
  };

  // Render a bet card
  const renderBetCard = (bet: Bet) => {
    const isExpanded = expandedBetId === bet.betId;
    const hasJoined = userJoinedStatus[bet.betId];
    
    return (
      <div 
        key={bet.betId}
        className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 ${
          isExpanded ? 'border-2 border-green-500' : 'border border-gray-200'
        }`}
      >
        {/* Bet Header */}
        <div 
          className="p-4 cursor-pointer flex justify-between items-center"
          onClick={() => toggleExpandBet(bet.betId)}
        >
          <div>
            <h3 className="font-bold text-lg text-green-800">{bet.betType}</h3>
            <p className="text-gray-600 text-sm">
              {bet.settled 
                ? `Settled • Winner: ${formatAddress(bet.winner || '')}` 
                : `${bet.players.length} Players`}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg">${bet.amount} USDC</p>
            <p className="text-sm text-gray-500">per player</p>
          </div>
        </div>
        
        {/* Expanded Content */}
        {isExpanded && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">Players</h4>
              <div className="space-y-2">
                {bet.players.map((player, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-2 rounded bg-gray-100"
                  >
                    <span className="font-mono text-sm">
                      {formatAddress(player)}
                    </span>
                    <span className={`text-sm ${
                      bet.joinedStatus[index] ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {bet.joinedStatus[index] ? 'Joined' : 'Not Joined'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Action Section */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              {!bet.settled && settlingBetId !== bet.betId && (
                <div className="space-y-2">
                  {hasJoined ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSettleBet(bet.betId);
                      }}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 transition"
                    >
                      Vote for Winner
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJoinBet(bet);
                      }}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition"
                    >
                      Join Bet
                    </button>
                  )}
                </div>
              )}
              
              {settlingBetId === bet.betId && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Select Winner</h4>
                  <select
                    value={selectedWinner}
                    onChange={(e) => setSelectedWinner(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {bet.players.map((player, index) => (
                      <option key={index} value={player}>
                        {formatAddress(player)}
                      </option>
                    ))}
                  </select>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfirmSettlement(bet.betId);
                      }}
                      disabled={isSettling}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 transition disabled:opacity-50"
                    >
                      {isSettling ? 'Processing...' : 'Confirm'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelSettlement();
                      }}
                      disabled={isSettling}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-400 transition disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
              {bet.settled && (
                <div className="bg-green-100 p-3 rounded-md">
                  <p className="text-green-800 text-center font-medium">
                    This bet has been settled!
                  </p>
                  <p className="text-center text-sm mt-1">
                    Winner: {formatAddress(bet.winner || '')}
                  </p>
                </div>
              )}
            </div>
            
            {/* Bet Details */}
            <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
              <p>Bet ID: {bet.betId}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-green-800 mb-4">Your Golf Bets</h2>
      
      {isWalletConnected ? (
        <>
          {/* Bet limit warning for free tier */}
          {subscriptionTier === SubscriptionTier.FREE && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-blue-700 font-medium">Free Tier: {activeBetsCount}/{maxActiveBets} Active Bets</p>
                  <p className="text-sm text-blue-600">
                    {betLimitReached 
                      ? 'You\'ve reached your limit of active bets. Upgrade for unlimited bets.' 
                      : 'Upgrade to Premium for unlimited active bets.'}
                  </p>
                </div>
                <a
                  href="#subscription"
                  className="text-xs bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700"
                >
                  Upgrade
                </a>
              </div>
            </div>
          )}
        
          {/* Tabs */}
          {!betIdToShow && (
            <div className="flex border-b border-gray-200 mb-4">
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === 'open'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('open')}
              >
                Open Bets
              </button>
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === 'settled'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('settled')}
              >
                Settled Bets
              </button>
            </div>
          )}
          
          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {/* Loading state */}
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
              <p className="ml-2">Loading bets...</p>
            </div>
          ) : (
            <>
              {/* Bet list */}
              {bets.length > 0 ? (
                <div className="space-y-4">
                  {bets
                    .filter(bet => betIdToShow || (activeTab === 'open' ? !bet.settled : bet.settled))
                    .map(renderBetCard)}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {betIdToShow ? (
                    <p>Bet not found or you are not authorized to view it.</p>
                  ) : (
                    <p>No {activeTab} bets found. Create a new bet to get started!</p>
                  )}
                </div>
              )}
              
              {/* Refresh button */}
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => loadBets()}
                  disabled={loading}
                  className="text-green-600 hover:text-green-800 transition"
                >
                  Refresh
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">Please connect your wallet to view your bets.</p>
        </div>
      )}
    </div>
  );
};

export default BetList; 