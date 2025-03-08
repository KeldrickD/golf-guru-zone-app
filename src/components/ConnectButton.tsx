'use client';

import { useState, useEffect } from 'react';
import { ConnectKitButton } from 'connectkit';

export const ConnectButton = () => {
  // Simple state to prevent hydration issues
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set mounted to true once component is mounted on client
    setMounted(true);
  }, []);

  // Return a basic button before mounting to prevent hydration issues
  if (!mounted) {
    return (
      <button 
        className="btn" 
        style={{
          padding: '8px 16px',
          borderRadius: '8px',
          backgroundColor: '#16a34a',
          color: 'white',
          fontWeight: 600,
          cursor: 'pointer',
          border: 'none',
          fontSize: '15px'
        }}
      >
        Connect Wallet
      </button>
    );
  }

  // After mounting, return the ConnectKitButton
  return (
    <ConnectKitButton />
  );
}; 