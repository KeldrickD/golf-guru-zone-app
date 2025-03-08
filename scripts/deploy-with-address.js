import { createWalletClient, http, createPublicClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Load contract ABI and bytecode
const contractPath = path.join(process.cwd(), 'src/artifacts/contracts/GolfBetTracker.sol/GolfBetTracker.json');
const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));

// The wallet address with Base Sepolia ETH
const FUNDED_WALLET_ADDRESS = '0x96febBA52Da1aCD9275f57dE10B39F852D83C945';

async function main() {
  // Create account from private key
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.error('No private key found in .env file');
    process.exit(1);
  }

  // Ensure private key has 0x prefix
  const formattedPrivateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
  
  try {
    const account = privateKeyToAccount(formattedPrivateKey);
    console.log(`Account derived from private key: ${account.address}`);
    console.log(`Using funded wallet address: ${FUNDED_WALLET_ADDRESS}`);
    
    // Create public client to check balance
    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(process.env.ALCHEMY_URL)
    });
    
    // Check balance of the funded wallet
    const balance = await publicClient.getBalance({ 
      address: FUNDED_WALLET_ADDRESS 
    });
    
    console.log(`Funded wallet balance: ${balance} wei (${Number(balance) / 1e18} ETH)`);
    
    if (balance === 0n) {
      console.error('Account has no ETH. Please fund your account before deploying.');
      process.exit(1);
    }

    // Create wallet client with the account from private key
    const client = createWalletClient({
      account,
      chain: baseSepolia,
      transport: http(process.env.ALCHEMY_URL)
    });

    console.log('Deploying contract...');
    
    // Deploy contract
    const hash = await client.deployContract({
      abi: contractJson.abi,
      bytecode: contractJson.bytecode,
      account
    });

    console.log(`Transaction hash: ${hash}`);
    
    // Wait for transaction receipt
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log(`Contract deployed at: ${receipt.contractAddress}`);
    
    // Update .env file with contract address
    const envPath = path.join(process.cwd(), '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    envContent = envContent.replace(
      /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/,
      `NEXT_PUBLIC_CONTRACT_ADDRESS=${receipt.contractAddress}`
    );
    fs.writeFileSync(envPath, envContent);
    
    console.log(`Updated .env file with contract address: ${receipt.contractAddress}`);
    
    return receipt.contractAddress;
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main()
  .then((address) => {
    console.log(`Deployment successful! Contract address: ${address}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 