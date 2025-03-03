import { useState } from 'react';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { parseEther } from 'viem';
import GolfBetTracker from '../artifacts/contracts/GolfBetTracker.sol/GolfBetTracker.json';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

export default function BetForm() {
  const [betType, setBetType] = useState('Nassau');
  const [amount, setAmount] = useState('');
  const [players, setPlayers] = useState('');
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();

  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: GolfBetTracker.abi,
    functionName: 'createBet',
    args: [
      betType,
      parseEther(amount || '0'),
      players.split(',').map(p => p.trim()),
    ],
    enabled: Boolean(address && betType && amount && players),
  });

  const { write: createBet } = useContractWrite(config);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createBet) return;

    setLoading(true);
    try {
      await createBet();
    } catch (error) {
      console.error('Error creating bet:', error);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700">Bet Type</label>
        <select
          value={betType}
          onChange={(e) => setBetType(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        >
          <option value="Nassau">Nassau</option>
          <option value="Skins">Skins</option>
          <option value="Match Play">Match Play</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Amount ($)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          placeholder="Enter amount"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Players</label>
        <input
          type="text"
          value={players}
          onChange={(e) => setPlayers(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          placeholder="Enter player names (comma-separated)"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading || !createBet}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
      >
        {loading ? 'Creating Bet...' : 'Create Bet'}
      </button>
    </form>
  );
} 