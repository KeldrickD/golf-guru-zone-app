'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import WalletService, { WalletInfo } from '../services/walletService';
import ContractService from '../services/contractService';

export function WalletConnectButton() {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0.00');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const walletService = WalletService.getInstance();
  const contractService = ContractService.getInstance();

  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await walletService.isConnected();
      if (isConnected) {
        const addr = await walletService.getAddress();
        setAddress(addr);
        if (addr) {
          updateBalance(addr);
        }
      }
    };

    checkConnection();
  }, []);

  const updateBalance = async (addr: string) => {
    try {
      const usdcBalance = await contractService.getUSDCBalance(addr);
      setBalance(usdcBalance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setError('Failed to fetch balance');
    }
  };

  const handleConnect = async () => {
    setLoading(true);
    setError(null);

    try {
      const walletInfo = await walletService.connect();
      if (walletInfo && walletInfo.address) {
        setAddress(walletInfo.address);
        
        // Initialize contract service after wallet connection
        await contractService.initializeContract();
        
        // Update USDC balance
        updateBalance(walletInfo.address);
      }
    } catch (err) {
      console.error('Connection error:', err);
      setError('Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await walletService.disconnect();
      setAddress(null);
      setBalance('0.00');
    } catch (err) {
      console.error('Disconnection error:', err);
      setError('Failed to disconnect wallet');
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  if (error) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="destructive" onClick={() => setError(null)}>
          {error}
        </Button>
      </div>
    );
  }

  if (address) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">
          {formatAddress(address)}
        </span>
        <span className="text-sm font-medium">
          {balance} USDC
        </span>
        <Button variant="outline" size="sm" onClick={handleDisconnect}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={loading}
    >
      {loading ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
} 