const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

// The wallet address with Base Sepolia ETH
const FUNDED_WALLET_ADDRESS = '0x96febBA52Da1aCD9275f57dE10B39F852D83C945';

async function main() {
  console.log(`Using wallet address: ${FUNDED_WALLET_ADDRESS}`);

  // Get the provider
  const provider = hre.ethers.provider;
  
  // Check balance
  const balance = await provider.getBalance(FUNDED_WALLET_ADDRESS);
  console.log(`Wallet balance: ${hre.ethers.formatEther(balance)} ETH`);
  
  if (balance === 0n) {
    console.error('Account has no ETH. Please fund your account before deploying.');
    process.exit(1);
  }

  // Get the contract factory
  const GolfBetTracker = await hre.ethers.getContractFactory("GolfBetTracker");
  
  // Deploy the contract
  console.log("Deploying GolfBetTracker contract...");
  const golfBetTracker = await GolfBetTracker.deploy();
  
  // Wait for deployment to complete
  await golfBetTracker.waitForDeployment();
  
  // Get the contract address
  const contractAddress = await golfBetTracker.getAddress();
  console.log("GolfBetTracker deployed to:", contractAddress);
  
  // Update .env file with contract address
  const envPath = path.join(process.cwd(), '.env');
  let envContent = fs.readFileSync(envPath, 'utf8');
  envContent = envContent.replace(
    /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/,
    `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`
  );
  fs.writeFileSync(envPath, envContent);
  
  console.log(`Updated .env file with contract address: ${contractAddress}`);
  
  return contractAddress;
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