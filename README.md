# Golf Guru Zone - Modern P2P Betting Platform

A visual-first, intuitive peer-to-peer betting platform for golfers with a focus on exceptional UX and monetization.

## Features

- 🎯 **Visual-First Design**: Intuitive interfaces that require minimal reading
- 💰 **Tiered Subscription Model**: Free, Premium, and Pro tiers with different features
- 📊 **Advanced Analytics**: Track your betting performance and stats
- 🔗 **Smart Contract Integration**: Secure betting using blockchain technology
- 👥 **QR Code Sharing**: Easily invite friends to join bets
- 📱 **Mobile-First Design**: Optimized for on-course use

## Tech Stack

- **Frontend**: Next.js 14, React, Styled Components
- **Blockchain**: Ethereum (Base Sepolia Testnet)
- **Smart Contract**: Solidity
- **Styling**: Custom design system

## Getting Started

### Prerequisites

- Node.js 18 or later
- NPM or Yarn
- MetaMask or Coinbase Wallet

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/golf-guru-zone.git
   cd golf-guru-zone
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_CONTRACT_ADDRESS=0xeAc974baD29a758ab9945B7a84628F9e26B95199
   NEXT_PUBLIC_USDC_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e
   NEXT_PUBLIC_RPC_URL=https://sepolia.base.org
   ```

### Development

Run the development server:
   ```
   npm run dev
   ```

Visit http://localhost:3000/modern-ui to see the new interface.

### Building for Production

```
npm run build
```

### Deployment

1. Install Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Deploy to Vercel:
   ```
   vercel deploy --prod
   ```

## Monetization Strategy

### Subscription Tiers

- **Free Tier**: 
  - 3% transaction fee
  - Maximum 5 active bets
  - Basic betting features

- **Premium Tier** ($5.99/month):
  - 1.5% transaction fee
  - Unlimited active bets
  - Basic analytics
  - Private betting groups

- **Pro Tier** ($14.99/month):
  - Zero transaction fees
  - Advanced analytics by course and player
  - Tournament creation tools
  - API access

### Revenue Streams

1. **Transaction Fees**: Percentage fees on betting volumes
2. **Subscription Revenue**: Monthly recurring revenue from premium users
3. **Tournament Fees**: Percentage from tournament pot for large events
4. **White-Label Solutions**: Custom versions for golf courses and clubs

## Project Structure

- `/src/components`: UI components including modern visual betting forms
- `/src/components/ui`: Reusable UI components (Button, Card, BottomNavBar)
- `/src/services`: Services for wallet connection, contracts, subscriptions
- `/src/styles`: Design system and global styles
- `/contracts`: Smart contract code
- `/scripts`: Deployment scripts for contracts

## Smart Contract

The `GolfBetTracker` contract handles:

- Bet creation and joining
- USDC token transfers
- Fee collection based on subscription tier
- Voting for winners
- Bet settlement

## Future Enhancements

- Tournament bracket system
- Course-specific analytics
- Social features and friend lists
- Native mobile apps with offline functionality
- Integration with golf tracking apps

## License

MIT
