'use client';

import { ethers } from 'ethers';
import AnalyticsService from './analyticsService';
import ServiceRegistry from './serviceRegistry';

export interface WalletInfo {
  address: string;
  chainId: number;
  isConnected: boolean;
}

// Event names for wallet events
export enum WalletEvents {
  CONNECTED = 'wallet_connected',
  DISCONNECTED = 'wallet_disconnected',
  ACCOUNT_CHANGED = 'account_changed',
  CHAIN_CHANGED = 'chain_changed',
}

// Network IDs
export enum NetworkIds {
  BASE_MAINNET = 8453,
  BASE_SEPOLIA = 84532,
  ARBITRUM = 42161,
  ARBITRUM_GOERLI = 421613,
}

class WalletService {
  private static instance: WalletService | null = null;
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private walletInfo: WalletInfo | null = null;
  private eventListeners: Map<string, Function[]> = new Map();
  private analyticsService: AnalyticsService;
  
  private constructor() {
    this.analyticsService = AnalyticsService.getInstance();
    // Initialize event listeners map for each event type
    Object.values(WalletEvents).forEach(event => {
      this.eventListeners.set(event, []);
    });
    
    // Set up window ethereum event listeners if in browser
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      this.setupEthereumListeners();
    }
    
    // Register this instance
    ServiceRegistry.getInstance().register('walletService', this);
  }
  
  static getInstance(): WalletService {
    if (typeof window === 'undefined') {
      return {} as WalletService;
    }
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }
  
  /**
   * Set up listeners for Ethereum provider events
   */
  private setupEthereumListeners(): void {
    const ethereum = (window as any).ethereum;
    
    ethereum.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected the wallet
        this.walletInfo = null;
        this.emitEvent(WalletEvents.DISCONNECTED, null);
      } else {
        // Account changed
        if (this.walletInfo) {
          this.walletInfo.address = accounts[0];
          this.emitEvent(WalletEvents.ACCOUNT_CHANGED, accounts[0]);
        } else {
          // This shouldn't happen, but just in case
          this.connect().catch(console.error);
        }
      }
    });
    
    ethereum.on('chainChanged', (chainIdHex: string) => {
      const chainId = parseInt(chainIdHex, 16);
      if (this.walletInfo) {
        this.walletInfo.chainId = chainId;
        this.emitEvent(WalletEvents.CHAIN_CHANGED, chainId);
      }
    });
    
    ethereum.on('disconnect', () => {
      this.walletInfo = null;
      this.emitEvent(WalletEvents.DISCONNECTED, null);
    });
  }
  
  /**
   * Connect to wallet
   */
  async connect(): Promise<WalletInfo | null> {
    try {
      // Check if MetaMask is installed
      if (typeof window === 'undefined' || !(window as any).ethereum) {
        throw new Error('No Ethereum wallet found. Please install MetaMask or another wallet.');
      }
      
      const ethereum = (window as any).ethereum;
      
      // Request account access
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      
      // Create provider and signer
      this.provider = new ethers.BrowserProvider(ethereum);
      this.signer = await this.provider.getSigner();
      
      // Get chain ID
      const network = await this.provider.getNetwork();
      const chainId = Number(network.chainId);
      
      // Store wallet info
      this.walletInfo = {
        address: accounts[0],
        chainId,
        isConnected: true,
      };
      
      // Emit connected event
      this.emitEvent(WalletEvents.CONNECTED, this.walletInfo);
      
      return this.walletInfo;
      
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      this.analyticsService.trackError('wallet_connection_error', error as Error);
      return null;
    }
  }
  
  /**
   * Disconnect from wallet (note: this is not a standard function in web3,
   * as wallets typically handle disconnection themselves)
   */
  disconnect(): void {
    this.walletInfo = null;
    this.emitEvent(WalletEvents.DISCONNECTED, null);
  }
  
  /**
   * Check if wallet is connected
   */
  isConnected(): boolean {
    return !!this.walletInfo?.isConnected;
  }
  
  /**
   * Get current provider
   */
  getProvider(): ethers.BrowserProvider | null {
    return this.provider;
  }
  
  /**
   * Get current signer
   */
  getSigner(): ethers.JsonRpcSigner | null {
    return this.signer;
  }
  
  /**
   * Get current wallet address
   */
  async getAddress(): Promise<string | null> {
    if (this.walletInfo?.address) {
      return this.walletInfo.address;
    }
    
    // If wallet info is null, try reconnecting silently (without user prompt)
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const ethereum = (window as any).ethereum;
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          // User is already connected
          await this.connect();
          return this.walletInfo?.address || null;
        }
      }
    } catch (error) {
      console.error('Error checking wallet address:', error);
    }
    
    return null;
  }
  
  /**
   * Get current chain ID
   */
  getChainId(): number | null {
    return this.walletInfo?.chainId || null;
  }
  
  /**
   * Switch network
   * @param chainId Chain ID to switch to
   */
  async switchNetwork(chainId: number): Promise<boolean> {
    try {
      if (typeof window === 'undefined' || !(window as any).ethereum) {
        return false;
      }
      
      const ethereum = (window as any).ethereum;
      const chainIdHex = `0x${chainId.toString(16)}`;
      
      try {
        // Try switching to network
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainIdHex }],
        });
        return true;
      } catch (error: any) {
        // If network doesn't exist, add it
        if (error.code === 4902) {
          const networkDetails = this.getNetworkDetails(chainId);
          if (networkDetails) {
            await ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [networkDetails],
            });
            return true;
          }
        }
        
        throw error;
      }
      
    } catch (error) {
      console.error('Error switching network:', error);
      this.analyticsService.trackError('switch_network_error', error as Error);
      return false;
    }
  }
  
  /**
   * Get network details for adding to wallet
   * @param chainId Chain ID to get details for
   */
  private getNetworkDetails(chainId: number): any {
    const chainIdHex = `0x${chainId.toString(16)}`;
    
    switch (chainId) {
      case NetworkIds.BASE_MAINNET:
        return {
          chainId: chainIdHex,
          chainName: 'Base Mainnet',
          nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
          },
          rpcUrls: ['https://mainnet.base.org'],
          blockExplorerUrls: ['https://basescan.org'],
        };
        
      case NetworkIds.BASE_SEPOLIA:
        return {
          chainId: chainIdHex,
          chainName: 'Base Sepolia Testnet',
          nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
          },
          rpcUrls: ['https://sepolia.base.org'],
          blockExplorerUrls: ['https://sepolia.basescan.org'],
        };
        
      case NetworkIds.ARBITRUM:
        return {
          chainId: chainIdHex,
          chainName: 'Arbitrum One',
          nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
          },
          rpcUrls: ['https://arb1.arbitrum.io/rpc'],
          blockExplorerUrls: ['https://arbiscan.io'],
        };
        
      case NetworkIds.ARBITRUM_GOERLI:
        return {
          chainId: chainIdHex,
          chainName: 'Arbitrum Goerli Testnet',
          nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
          },
          rpcUrls: ['https://goerli-rollup.arbitrum.io/rpc'],
          blockExplorerUrls: ['https://goerli.arbiscan.io'],
        };
        
      default:
        return null;
    }
  }
  
  /**
   * Add event listener
   * @param event Event name
   * @param callback Callback function
   */
  addEventListener(event: WalletEvents, callback: Function): void {
    const listeners = this.eventListeners.get(event) || [];
    listeners.push(callback);
    this.eventListeners.set(event, listeners);
  }
  
  /**
   * Remove event listener
   * @param event Event name
   * @param callback Callback function
   */
  removeEventListener(event: WalletEvents, callback: Function): void {
    const listeners = this.eventListeners.get(event) || [];
    const index = listeners.indexOf(callback);
    if (index !== -1) {
      listeners.splice(index, 1);
      this.eventListeners.set(event, listeners);
    }
  }
  
  /**
   * Emit event
   * @param event Event name
   * @param data Event data
   */
  private emitEvent(event: WalletEvents, data: any): void {
    const listeners = this.eventListeners.get(event) || [];
    listeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in wallet event listener for ${event}:`, error);
      }
    });
  }
  
  /**
   * Sign message
   * @param message Message to sign
   */
  async signMessage(message: string): Promise<string | null> {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }
      
      const signature = await this.signer.signMessage(message);
      
      this.analyticsService.trackEvent('message_signed', {
        address: this.walletInfo?.address,
      });
      
      return signature;
    } catch (error) {
      console.error('Error signing message:', error);
      this.analyticsService.trackError('sign_message_error', error as Error);
      return null;
    }
  }
  
  /**
   * Format address for display (shortens address)
   * @param address Address to format
   */
  formatAddress(address: string | null): string {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }
}

export default WalletService; 