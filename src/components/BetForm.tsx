'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { QRCodeSVG } from 'qrcode.react';
import ContractService from '../services/contractService';
import WalletService from '../services/walletService';
import SubscriptionService from '../services/subscriptionService';

interface BetFormProps {
  onBetCreated: () => void;
}

const BetForm: React.FC<BetFormProps> = ({ onBetCreated }) => {
  const [betType, setBetType] = useState('Nassau');
  const [amount, setAmount] = useState('5');
  const [players, setPlayers] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [betId, setBetId] = useState<string | null>(null);
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [feePercentage, setFeePercentage] = useState<number>(3.0); // Default to free tier fee
  const [calculatedFee, setCalculatedFee] = useState<string>('0.15'); // Default calculated fee

  const contractService = ContractService.getInstance();
  const walletService = WalletService.getInstance();
  const subscriptionService = SubscriptionService.getInstance();

  // Check wallet connection on mount and listen for changes
  useEffect(() => {
    const checkConnection = async () => {
      const connected = await walletService.isConnected();
      console.log('BetForm - Wallet connection status:', connected);
      setIsWalletConnected(connected);
    };

    checkConnection();

    window.addEventListener('walletConnected', () => {
      console.log('BetForm - Wallet connected event received');
      setIsWalletConnected(true);
    });

    window.addEventListener('walletDisconnected', () => {
      console.log('BetForm - Wallet disconnected event received');
      setIsWalletConnected(false);
    });

    return () => {
      window.removeEventListener('walletConnected', () => setIsWalletConnected(true));
      window.removeEventListener('walletDisconnected', () => setIsWalletConnected(false));
    };
  }, []);

  // Get fee percentage based on subscription
  useEffect(() => {
    const getFeePercentage = async () => {
      const fee = await subscriptionService.getTransactionFeePercentage();
      setFeePercentage(fee);
      updateCalculatedFee(amount, fee);
    };

    if (isWalletConnected) {
      getFeePercentage();
    }
  }, []);

  // Update calculated fee when amount changes
  const updateCalculatedFee = (betAmount: string, fee: number) => {
    const parsedAmount = parseFloat(betAmount);
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      const calculatedFee = (parsedAmount * fee / 100).toFixed(2);
      setCalculatedFee(calculatedFee);
    } else {
      setCalculatedFee('0.00');
    }
  };

  // Handle amount change
  const handleAmountChange = (value: string) => {
    setAmount(value);
    updateCalculatedFee(value, feePercentage);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setBetId(null);
    setQrValue(null);

    // Validate inputs
    if (!betType) {
      setError('Please select a bet type');
      return;
    }

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    // Filter out empty player addresses
    const validPlayers = players.filter(player => player.trim() !== '');

    if (validPlayers.length < 1) {
      setError('Please enter at least 1 player address');
      return;
    }

    // Validate Ethereum addresses
    for (const player of validPlayers) {
      if (!ethers.isAddress(player)) {
        setError(`Invalid Ethereum address: ${player}`);
        return;
      }
    }

    setLoading(true);

    try {
      // Get current user's address
      const userAddress = await walletService.getAddress();
      if (!userAddress) {
        throw new Error('Wallet not connected');
      }

      // Add current user to players if not already included
      if (!validPlayers.includes(userAddress)) {
        validPlayers.push(userAddress);
      }

      // Create bet on blockchain
      const newBetId = await contractService.createBet(
        betType,
        amount,
        validPlayers
      );

      // Generate QR code value
      const currentUrl = window.location.origin;
      const qrUrl = `${currentUrl}?betId=${newBetId}`;
      setQrValue(qrUrl);

      // Update UI
      setBetId(newBetId);
      setSuccess(`Bet created successfully! Share the QR code with your friends to join.`);
      
      // Reset form
      setBetType('Nassau');
      setAmount('5');
      setPlayers(['']);
      
      // Notify parent component
      onBetCreated();
    } catch (err: any) {
      console.error('Error creating bet:', err);
      setError(err.message || 'Failed to create bet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle player address changes
  const handlePlayerChange = (index: number, value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  // Add another player field
  const addPlayerField = () => {
    setPlayers([...players, '']);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-green-800 mb-4">Create a Golf Bet</h2>
      
      {isWalletConnected ? (
        <form onSubmit={handleSubmit}>
          {/* Bet Type */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Bet Type</label>
            <select
              value={betType}
              onChange={(e) => setBetType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Nassau">Nassau</option>
              <option value="Match Play">Match Play</option>
              <option value="Skins">Skins</option>
              <option value="Stroke Play">Stroke Play</option>
            </select>
          </div>
          
          {/* Amount */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Amount (USDC)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              min="1"
              step="0.1"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            
            {/* Transaction Fee Info */}
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-gray-600">Transaction Fee ({feePercentage}%):</span>
              <span className={feePercentage === 0 ? 'text-green-600 font-medium' : 'text-gray-700'}>
                {feePercentage === 0 ? 'FREE' : `${calculatedFee} USDC`}
              </span>
            </div>
            {feePercentage > 0 && (
              <div className="mt-1 text-xs text-gray-500">
                Upgrade your subscription to reduce or eliminate fees.
              </div>
            )}
          </div>
          
          {/* Players */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Other Players (Optional)</label>
            <div className="space-y-2">
              {players.map((player, index) => (
                <input
                  key={index}
                  type="text"
                  value={player}
                  onChange={(e) => handlePlayerChange(index, e.target.value)}
                  placeholder={`Player ${index + 1} address or Coinbase username`}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ))}
            </div>
            <button
              type="button"
              onClick={addPlayerField}
              className="mt-2 text-green-600 text-sm hover:text-green-800"
            >
              + Add another player
            </button>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {/* Success message and QR Code */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-700 mb-4">{success}</p>
              {qrValue && (
                <div className="flex flex-col items-center">
                  <QRCodeSVG value={qrValue} size={200} level="H" />
                  <p className="mt-2 text-sm text-gray-600">
                    Scan this QR code to join the bet
                  </p>
                  <div className="mt-2">
                    <p className="text-sm font-medium">Bet ID:</p>
                    <code className="block p-2 bg-gray-100 rounded text-sm overflow-x-auto">
                      {betId}
                    </code>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Bet...' : 'Create Bet'}
          </button>
        </form>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">Please connect your wallet to create bets.</p>
        </div>
      )}
    </div>
  );
};

export default BetForm; 