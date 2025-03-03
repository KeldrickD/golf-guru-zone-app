# Golf Guru Zone - Bet Tracker

A decentralized golf bet tracking application built on Base (Coinbase's L2 blockchain).

## Features

- Create and track golf bets (Nassau, Skins, Match Play)
- On-chain bet settlement
- Fiat payments via Stripe
- Crypto payments via Coinbase Wallet
- Free tier (3 bets/month) and Premium tier

## Tech Stack

- Frontend: Next.js, React, TailwindCSS
- Blockchain: Solidity, Hardhat, Base Testnet
- Backend: Express.js
- Wallet Integration: WalletConnect, Coinbase Wallet SDK

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd golf-guru-zone
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Fill in your environment variables in `.env`

5. Deploy the smart contract:
```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network baseTestnet
```

6. Update the `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env` with your deployed contract address

## Development

1. Start the development server:
```bash
npm run dev
```

2. Start the Express server:
```bash
npm run server
```

## Deployment to Vercel

1. Push your code to GitHub

2. Create a new project on Vercel

3. Connect your GitHub repository

4. Add environment variables in Vercel project settings

5. Deploy!

## Base Testnet Setup

1. Get Base Goerli ETH from the faucet:
   - Visit https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

2. Add Base Testnet to MetaMask:
   - Network Name: Base Goerli
   - RPC URL: https://goerli.base.org
   - Chain ID: 84531
   - Currency Symbol: ETH
   - Block Explorer URL: https://goerli.basescan.org

## Smart Contract

The smart contract is deployed on Base Testnet and handles:
- Bet creation and tracking
- Settlement logic
- Free tier limitations

## Premium Features

Upgrade to Premium ($4.99/month) to unlock:
- Unlimited bets
- Automated Stripe payment links
- Crypto payout options

## License

MIT
