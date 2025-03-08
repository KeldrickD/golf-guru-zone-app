const hre = require("hardhat");
require("dotenv").config();

async function main() {
  // Base Sepolia USDC token address - this would be replaced with the actual one
  // For Base Sepolia testnet, we'll need to use the correct USDC address
  const USDC_ADDRESS = process.env.USDC_ADDRESS || "0x036CbD53842c5426634e7929541eC2318f3dCF7e"; // Base Sepolia USDC address
  
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());
  console.log("Using USDC address:", USDC_ADDRESS);
  
  console.log("Deploying GolfBetTracker...");
  const GolfBetTracker = await hre.ethers.getContractFactory("GolfBetTracker");
  const golfBetTracker = await GolfBetTracker.deploy();

  await golfBetTracker.waitForDeployment();
  
  const contractAddress = await golfBetTracker.getAddress();
  console.log("GolfBetTracker deployed to:", contractAddress);
  
  // Verify contract on Base Sepolia (if explorer API is available)
  console.log("Waiting for blockchain confirmations...");
  // Wait for some confirmations to ensure deployment is confirmed
  await golfBetTracker.deploymentTransaction().wait(5);
  
  console.log("Deployment completed! Contract is ready for use.");
  console.log("Contract Address:", contractAddress);
  console.log("Network:", hre.network.name);
  
  // Write deployment info to a file for the frontend to use
  const fs = require("fs");
  const deploymentInfo = {
    contractAddress,
    network: hre.network.name,
    usdcAddress: USDC_ADDRESS,
    timestamp: new Date().toISOString(),
  };
  
  fs.writeFileSync(
    "src/deployments/contracts.json", 
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("Deployment info saved to src/deployments/contracts.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 