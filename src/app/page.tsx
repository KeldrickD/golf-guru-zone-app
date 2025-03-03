import { WagmiConfig, createConfig } from 'wagmi';
import { baseGoerli } from 'wagmi/chains';
import { ConnectKitProvider, ConnectKitButton, getDefaultConfig } from 'connectkit';
import BetForm from '@/components/BetForm';
import BetList from '@/components/BetList';

const config = createConfig(
  getDefaultConfig({
    appName: 'Golf Guru Zone',
    chains: [baseGoerli],
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  })
);

export default function Home() {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        <main className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <header className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Golf Guru Zone
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                Track and settle your golf bets on Base
              </p>
              <div className="flex justify-center">
                <ConnectKitButton />
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Create New Bet</h2>
                <BetForm />
              </div>
              <div>
                <BetList />
              </div>
            </div>

            <footer className="mt-16 text-center text-gray-600">
              <p>
                Free Tier: 3 bets/month |{' '}
                <a
                  href={process.env.NEXT_PUBLIC_STRIPE_PREMIUM_LINK || '#'}
                  className="text-green-600 hover:text-green-700"
                >
                  Upgrade to Premium
                </a>
              </p>
            </footer>
          </div>
        </main>
      </ConnectKitProvider>
    </WagmiConfig>
  );
} 