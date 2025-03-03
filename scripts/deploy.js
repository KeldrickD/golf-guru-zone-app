const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const GolfBetTracker = await hre.ethers.getContractFactory("GolfBetTracker");
  const golfBetTracker = await GolfBetTracker.deploy();

  await golfBetTracker.deployed();

  console.log("GolfBetTracker deployed to:", golfBetTracker.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 