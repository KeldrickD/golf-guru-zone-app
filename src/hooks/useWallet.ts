import { useState, useEffect } from 'react';

export const useWallet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    // Check if MetaMask is installed
    const { ethereum } = window as any;
    if (ethereum) {
      // Check if already connected
      ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setIsConnected(true);
            setAddress(accounts[0]);
          }
        })
        .catch(console.error);

      // Listen for account changes
      ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setIsConnected(true);
          setAddress(accounts[0]);
        } else {
          setIsConnected(false);
          setAddress(null);
        }
      });
    }
  }, []);

  const connect = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        throw new Error('Please install MetaMask');
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        setIsConnected(true);
        setAddress(accounts[0]);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setAddress(null);
  };

  const getAddress = async () => {
    if (!isConnected) {
      return null;
    }
    return address;
  };

  return {
    isConnected,
    address,
    connect,
    disconnect,
    getAddress,
  };
}; 