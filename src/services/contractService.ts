import { ethers } from 'ethers';
import WalletService from './walletService';
import contractAbi from '../abi/GolfBetTracker.json';
import networkConfig from '../config/networks';

export interface Bet {
  id: string;
  betName: string;
  creator: string;
  players: string[];
  amount: ethers.BigNumber;
  course: string;
  date: Date;
  status: number; // 0: Created, 1: Active, 2: Completed, 3: Canceled
  winner: string;
  joined: string[];
  votes: Record<string, string>; // Player => Vote for
}

class ContractService {
  private static instance: ContractService;
  private walletService: WalletService;
  private contract: ethers.Contract | null = null;
  private contractAddress: string | null = null;
  
  private constructor() {
    this.walletService = WalletService.getInstance();
  }
  
  static getInstance(): ContractService {
    if (!ContractService.instance) {
      ContractService.instance = new ContractService();
    }
    return ContractService.instance;
  }
  
  /**
   * Initialize the contract instance for the given network
   */
  async initializeContract(): Promise<boolean> {
    try {
      // Get provider and signer
      const provider = this.walletService.getProvider();
      if (!provider) {
        throw new Error('Wallet not connected');
      }
      
      const signer = this.walletService.getSigner();
      if (!signer) {
        throw new Error('Wallet not connected');
      }
      
      // Get chain ID
      const chainId = await this.walletService.getChainId();
      if (!chainId) {
        throw new Error('Chain ID not available');
      }
      
      // Get contract address for the current network
      const networkData = this.getNetworkData(chainId);
      if (!networkData || !networkData.contractAddress) {
        throw new Error(`Contract not deployed on network with chain ID ${chainId}`);
      }
      
      this.contractAddress = networkData.contractAddress;
      
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
      
      const address = await this.walletService.getAddress();
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
   * @param betName Name of the bet
   * @param players Array of player addresses
   * @param amount Bet amount in smallest unit (wei)
   * @param course Course name
   * @param date Date of the bet
   */
  async createBet(
    betName: string,
    players: string[],
    amount: string,
    course: string,
    date: Date
  ): Promise<string | null> {
    try {
      if (!this.contract) {
        await this.initializeContract();
      }
      
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }
      
      // Convert amount to wei
      const amountWei = ethers.parseUnits(amount, 'ether');
      
      // Convert date to timestamp
      const timestamp = Math.floor(date.getTime() / 1000);
      
      // Create bet
      const tx = await this.contract.createBet(
        betName,
        players,
        amountWei,
        course,
        timestamp
      );
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      // Find the event emitted
      const event = receipt.events?.find(e => e.event === 'BetCreated');
      
      // Get the bet ID from the event
      const betId = event?.args?.betId;
      
      return betId.toString();
      
    } catch (error) {
      console.error('Error creating bet:', error);
      return null;
    }
  }
  
  /**
   * Join a bet
   * @param betId Bet ID
   */
  async joinBet(betId: string): Promise<boolean> {
    try {
      if (!this.contract) {
        await this.initializeContract();
      }
      
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }
      
      // Get bet details to check amount
      const bet = await this.getBetById(betId);
      if (!bet) {
        throw new Error('Bet not found');
      }
      
      // Join bet with required amount
      const tx = await this.contract.joinBet(betId, {
        value: bet.amount
      });
      
      // Wait for transaction to be mined
      await tx.wait();
      
      return true;
      
    } catch (error) {
      console.error('Error joining bet:', error);
      return false;
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
      
      const address = await this.walletService.getAddress();
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
}

export default ContractService; 