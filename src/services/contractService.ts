'use client';

import { ethers } from 'ethers';
import ServiceRegistry from './serviceRegistry';
import contractAbi from '../abi/GolfBetTracker.json';
import networkConfig from '../config/networks';

export interface Bet {
  id: string;
  betName: string;
  creator: string;
  players: string[];
  amount: ethers.BigNumberish;
  course: string;
  date: Date;
  status: number; // 0: Created, 1: Active, 2: Completed, 3: Canceled
  winner: string;
  joined: string[];
  votes: Record<string, string>; // Player => Vote for
}

class ContractService {
  private static instance: ContractService;
  private contract: ethers.Contract | null = null;
  private contractAddress: string | null = null;
  
  private constructor() {}
  
  static getInstance(): ContractService {
    if (typeof window === 'undefined') {
      return {} as ContractService;
    }
    if (!ContractService.instance) {
      ContractService.instance = new ContractService();
    }
    return ContractService.instance;
  }

  private getWalletService() {
    return ServiceRegistry.getInstance().get('walletService');
  }
  
  /**
   * Initialize the contract instance for the given network
   */
  async initializeContract(): Promise<boolean> {
    try {
      // Get provider and signer
      const provider = this.getWalletService().getProvider();
      if (!provider) {
        throw new Error('Wallet not connected');
      }
      
      const signer = this.getWalletService().getSigner();
      if (!signer) {
        throw new Error('Wallet not connected');
      }
      
      // Get chain ID
      const chainId = await this.getWalletService().getChainId();
      if (!chainId) {
        throw new Error('Chain ID not available');
      }
      
      // Get contract address for the current network
      const networkData = this.getNetworkData(chainId);
      if (!networkData || !networkData.contractAddress) {
        throw new Error(`Contract not deployed on network with chain ID ${chainId}`);
      }
      
      this.contractAddress = networkData.contractAddress;
      if (!this.contractAddress) {
        throw new Error('Contract address not available');
      }
      
      // Create contract instance
      this.contract = new ethers.Contract(
        this.contractAddress,
        contractAbi.abi,
        signer
      );
      
      return true;
      
    } catch (error) {
      console.error('Error initializing contract:', error);
      return false;
    }
  }
  
  /**
   * Get network data for the current chain ID
   * @param chainId Chain ID to get data for
   */
  private getNetworkData(chainId: number): any {
    // Look up network by chain ID
    const networkKey = Object.keys(networkConfig).find(
      key => networkConfig[key].chainId === chainId
    );
    
    if (!networkKey) {
      return null;
    }
    
    return networkConfig[networkKey];
  }
  
  /**
   * Get all bets created by the current user
   */
  async getMyBets(): Promise<Bet[]> {
    try {
      if (!this.contract) {
        await this.initializeContract();
      }
      
      const address = await this.getWalletService().getAddress();
      if (!address || !this.contract) {
        return [];
      }
      
      // Get bets created by user
      const myBets = await this.contract.getBetsByCreator(address);
      
      return this.formatBets(myBets);
      
    } catch (error) {
      console.error('Error getting user bets:', error);
      return [];
    }
  }
  
  /**
   * Get all active bets available for joining
   */
  async getActiveBets(): Promise<Bet[]> {
    try {
      if (!this.contract) {
        await this.initializeContract();
      }
      
      if (!this.contract) {
        return [];
      }
      
      // Get all active bets
      const activeBets = await this.contract.getActiveBets();
      
      return this.formatBets(activeBets);
      
    } catch (error) {
      console.error('Error getting active bets:', error);
      return [];
    }
  }
  
  /**
   * Get bet by ID
   * @param betId Bet ID
   */
  async getBetById(betId: string): Promise<Bet | null> {
    try {
      if (!this.contract) {
        await this.initializeContract();
      }
      
      if (!this.contract) {
        return null;
      }
      
      // Get bet by ID
      const bet = await this.contract.getBet(betId);
      
      // Format the bet
      const formattedBets = this.formatBets([bet]);
      
      return formattedBets.length > 0 ? formattedBets[0] : null;
      
    } catch (error) {
      console.error('Error getting bet by ID:', error);
      return null;
    }
  }
  
  /**
   * Create a new bet
   * @param betType Type of the bet
   * @param opponents Array of opponent addresses
   * @param amount Amount of the bet
   * @param courseName Name of the course
   * @param timestamp Timestamp of the bet
   * @param feePercentage Fee percentage
   */
  async createBet(
    betType: string,
    opponents: string[],
    amount: string,
    courseName: string,
    timestamp: Date,
    feePercentage: number = 0
  ): Promise<string> {
    try {
      // Mock implementation - in a real app, this would call the smart contract
      await new Promise(resolve => setTimeout(resolve, 1000));
      return 'bet_' + Date.now().toString();
    } catch (error) {
      console.error('Error creating bet:', error);
      throw error;
    }
  }
  
  /**
   * Join a bet
   * @param betId Bet ID
   */
  async joinBet(betId: string, amount: string): Promise<boolean> {
    try {
      // Mock implementation - in a real app, this would call the smart contract
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('Error joining bet:', error);
      throw error;
    }
  }
  
  /**
   * Vote for a winner
   * @param betId Bet ID
   * @param winner Address of the player to vote for
   */
  async voteForWinner(betId: string, winner: string): Promise<boolean> {
    try {
      if (!this.contract) {
        await this.initializeContract();
      }
      
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }
      
      // Vote for winner
      const tx = await this.contract.voteForWinner(betId, winner);
      
      // Wait for transaction to be mined
      await tx.wait();
      
      return true;
      
    } catch (error) {
      console.error('Error voting for winner:', error);
      return false;
    }
  }
  
  /**
   * Cancel a bet (only creator can cancel a bet)
   * @param betId Bet ID
   */
  async cancelBet(betId: string): Promise<boolean> {
    try {
      if (!this.contract) {
        await this.initializeContract();
      }
      
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }
      
      // Cancel bet
      const tx = await this.contract.cancelBet(betId);
      
      // Wait for transaction to be mined
      await tx.wait();
      
      return true;
      
    } catch (error) {
      console.error('Error canceling bet:', error);
      return false;
    }
  }
  
  /**
   * Check if consensus has been reached and settle the bet
   * @param betId Bet ID
   */
  async checkConsensus(betId: string): Promise<boolean> {
    try {
      if (!this.contract) {
        await this.initializeContract();
      }
      
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }
      
      // Check consensus
      const tx = await this.contract.checkConsensus(betId);
      
      // Wait for transaction to be mined
      await tx.wait();
      
      return true;
      
    } catch (error) {
      console.error('Error checking consensus:', error);
      return false;
    }
  }
  
  /**
   * Check if user has joined a bet
   * @param betId Bet ID
   */
  async hasUserJoined(betId: string): Promise<boolean> {
    try {
      if (!this.contract) {
        await this.initializeContract();
      }
      
      if (!this.contract) {
        return false;
      }
      
      const address = await this.getWalletService().getAddress();
      if (!address) {
        return false;
      }
      
      // Get bet by ID
      const bet = await this.getBetById(betId);
      if (!bet) {
        return false;
      }
      
      // Check if user has joined
      return bet.joined.includes(address.toLowerCase());
      
    } catch (error) {
      console.error('Error checking if user joined bet:', error);
      return false;
    }
  }
  
  /**
   * Format bets returned from the contract
   * @param bets Array of bets from contract
   */
  private formatBets(bets: any[]): Bet[] {
    return bets.map(bet => {
      // Parse votes into a more usable format
      const votes: Record<string, string> = {};
      bet.votes.forEach((vote: any) => {
        votes[vote.voter.toLowerCase()] = vote.votedFor.toLowerCase();
      });
      
      return {
        id: bet.id.toString(),
        betName: bet.betName,
        creator: bet.creator.toLowerCase(),
        players: bet.players.map((player: string) => player.toLowerCase()),
        amount: bet.amount,
        course: bet.course,
        date: new Date(bet.date.toNumber() * 1000),
        status: bet.status,
        winner: bet.winner.toLowerCase(),
        joined: bet.joinedPlayers.map((player: string) => player.toLowerCase()),
        votes
      };
    });
  }
  
  /**
   * Get the contract address
   */
  getContractAddress(): string | null {
    return this.contractAddress;
  }
  
  async getUserBets(userAddress: string): Promise<string[]> {
    try {
      // Mock implementation - in a real app, this would call the smart contract
      // Return an empty array for now
      return [];
    } catch (error) {
      console.error('Error getting user bets:', error);
      throw error;
    }
  }
  
  async getBet(betId: string): Promise<any> {
    try {
      // Mock implementation - in a real app, this would call the smart contract
      return {
        betType: 'GOLF_ROUND',
        amount: '0.1',
        settled: false,
        creator: '0x1234567890abcdef',
        timestamp: Date.now(),
        outcome: null,
        participants: [],
      };
    } catch (error) {
      console.error('Error getting bet:', error);
      throw error;
    }
  }

  async voteWinner(betId: string, winner: string): Promise<boolean> {
    try {
      // Mock implementation - in a real app, this would call the smart contract
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('Error voting for winner:', error);
      throw error;
    }
  }

  async getUSDCBalance(address: string | null): Promise<string> {
    try {
      if (!address) {
        return '0.00';
      }
      // Mock implementation - in a real app, this would call the USDC contract
      await new Promise(resolve => setTimeout(resolve, 500));
      return '1000.00';
    } catch (error) {
      console.error('Error getting USDC balance:', error);
      return '0.00';
    }
  }
}

export default ContractService; 