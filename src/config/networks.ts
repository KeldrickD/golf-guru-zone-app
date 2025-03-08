interface NetworkConfig {
  [key: string]: {
    chainId: number;
    chainName: string;
    rpcUrl: string;
    blockExplorerUrl: string;
    contractAddress: string;
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
  };
}

// Network configuration
const networkConfig: NetworkConfig = {
  BASE_SEPOLIA: {
    chainId: 84532,
    chainName: 'Base Sepolia Testnet',
    rpcUrl: 'https://sepolia.base.org',
    blockExplorerUrl: 'https://sepolia.basescan.org',
    contractAddress: '0xeAc974baD29a758ab9945B7a84628F9e26B95199', // Deployed GolfBetTracker contract address
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    }
  },
  BASE_MAINNET: {
    chainId: 8453,
    chainName: 'Base Mainnet',
    rpcUrl: 'https://mainnet.base.org',
    blockExplorerUrl: 'https://basescan.org',
    contractAddress: '', // To be filled when deployed to mainnet
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    }
  },
  ARBITRUM_GOERLI: {
    chainId: 421613,
    chainName: 'Arbitrum Goerli Testnet',
    rpcUrl: 'https://goerli-rollup.arbitrum.io/rpc',
    blockExplorerUrl: 'https://goerli.arbiscan.io',
    contractAddress: '', // To be filled when deployed to Arbitrum Goerli
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    }
  },
  ARBITRUM: {
    chainId: 42161,
    chainName: 'Arbitrum One',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorerUrl: 'https://arbiscan.io',
    contractAddress: '', // To be filled when deployed to Arbitrum
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    }
  }
};

export default networkConfig; 