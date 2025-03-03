async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const GolfBetTracker = await ethers.getContractFactory("GolfBetTracker");
  const golfBetTracker = await GolfBetTracker.deploy();

  await golfBetTracker.waitForDeployment();

  console.log("GolfBetTracker deployed to:", await golfBetTracker.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 