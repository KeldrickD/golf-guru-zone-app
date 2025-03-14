import { useState, useEffect } from 'react';

export const useWallet = () => {
  const [isConnected, setIsConnected] = useState(true); // Default to connected for mock
  const [address, setAddress] = useState<string | null>('0x1234567890abcdef1234567890abcdef12345678'); // Mock address

  // Mock connect function
  const connect = async () => {
    try {
      setIsConnected(true);
      setAddress('0x1234567890abcdef1234567890abcdef12345678');
      return true;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  };

  // Mock disconnect function
  const disconnect = () => {
    setIsConnected(false);
    setAddress(null);
  };

  // Mock getAddress function
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