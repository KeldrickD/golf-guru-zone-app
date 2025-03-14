'use client';

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
  private walletInfo: WalletInfo | null = null;
  private eventListeners: Map<string, Function[]> = new Map();
  private analyticsService: AnalyticsService;

  private constructor() {
    this.analyticsService = AnalyticsService.getInstance();
    // Initialize event listeners map for each event type
    Object.values(WalletEvents).forEach(event => {
      this.eventListeners.set(event, []);
    });

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
   * Connect to wallet - MOCK IMPLEMENTATION
   */
  async connect(): Promise<WalletInfo | null> {
    try {
      // Mock wallet connection
      this.walletInfo = {
        address: '0x1234567890abcdef1234567890abcdef12345678',
        chainId: NetworkIds.BASE_MAINNET,
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
   * Disconnect from wallet
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
   * Get current provider - MOCK IMPLEMENTATION
   */
  getProvider(): any | null {
    return null;
  }

  /**
   * Get current signer - MOCK IMPLEMENTATION
   */
  getSigner(): any | null {
    return null;
  }

  /**
   * Get current wallet address
   */
  async getAddress(): Promise<string | null> {
    if (this.walletInfo?.address) {
      return this.walletInfo.address;
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
   * Switch network - MOCK IMPLEMENTATION
   * @param chainId Chain ID to switch to
   */
  async switchNetwork(chainId: number): Promise<boolean> {
    try {
      // Mock network switch
      if (this.walletInfo) {
        this.walletInfo.chainId = chainId;
        this.emitEvent(WalletEvents.CHAIN_CHANGED, chainId);
      }
      return true;
    } catch (error) {
      console.error('Error switching network:', error);
      this.analyticsService.trackError('switch_network_error', error as Error);
      return false;
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
   * Sign message - MOCK IMPLEMENTATION
   * @param message Message to sign
   */
  async signMessage(message: string): Promise<string | null> {
    try {
      // Mock signature
      const signature = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef00";
      
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