'use client';

import { useState, useEffect } from 'react';
import WalletService from '../services/walletService';
import ContractService from '../services/contractService';

const WalletConnectButton = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const walletService = WalletService.getInstance();
  const contractService = ContractService.getInstance();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    const currentAddress = await walletService.getAddress();
    if (currentAddress) {
      setAddress(currentAddress);
      await updateBalance(currentAddress);
    }
  };

  const updateBalance = async (addr: string) => {
    try {
      const usdcBalance = await contractService.getUSDCBalance(addr);
      setBalance(usdcBalance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleConnect = async () => {
    setLoading(true);
    setError(null);

    try {
      const addr = await walletService.connect();
      setAddress(addr);
      
      // Initialize contract service after wallet connection
      await contractService.initialize();
      
      // Get USDC balance
      await updateBalance(addr);
    } catch (error) {
      console.error('Connection error:', error);
      setError('Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await walletService.disconnect();
      setAddress(null);
      setBalance(null);
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  if (address) {
    return (
      <div className="flex items-center space-x-4">
        <div className="text-sm">
          <p className="text-gray-600">Connected:</p>
          <p className="font-mono">{formatAddress(address)}</p>
        </div>
        {balance && (
          <div className="text-sm">
            <p className="text-gray-600">Balance:</p>
            <p className="font-medium">{parseFloat(balance).toFixed(2)} USDC</p>
          </div>
        )}
        <button
          onClick={handleDisconnect}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={loading}
      className={`bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors ${
        loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {loading ? 'Connecting...' : 'Connect Wallet'}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </button>
  );
};

export default WalletConnectButton; 