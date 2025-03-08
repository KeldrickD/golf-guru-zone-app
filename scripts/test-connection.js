import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";

async function main() {
  const client = createPublicClient({
    chain: baseSepolia,
    transport: http("https://base-sepolia.g.alchemy.com/v2/2NBTGi8lgtOc8Curm0rn6mNpEMDMAIv0"),
  });

  try {
    const blockNumber = await client.getBlockNumber();
    console.log("Current block number:", blockNumber);
    
    const block = await client.getBlock({
      blockNumber: BigInt(blockNumber - 10n),
    });

    console.log("Block details:", block);
    console.log("Connection to Base Sepolia successful!");
  } catch (error) {
    console.error("Error connecting to Base Sepolia:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 