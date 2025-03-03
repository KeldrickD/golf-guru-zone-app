import { useState, useEffect } from 'react';
import { useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import GolfBetTracker from '../artifacts/contracts/GolfBetTracker.sol/GolfBetTracker.json';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

interface Bet {
  id: string;
  betType: string;
  amount: bigint;
  players: string[];
  timestamp: bigint;
  settled: boolean;
}

export default function BetList() {
  const [bets, setBets] = useState<Bet[]>([]);
  const [selectedBet, setSelectedBet] = useState<string | null>(null);
  const [winners, setWinners] = useState<string[]>([]);

  // Contract read for getting bet details
  const { data: betDetails, isError, isLoading } = useContractRead({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: GolfBetTracker.abi,
    functionName: 'getBetDetails',
    args: [selectedBet],
    enabled: Boolean(selectedBet),
  });

  // Contract write for settling bets
  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: GolfBetTracker.abi,
    functionName: 'settleBet',
    args: [selectedBet, winners],
    enabled: Boolean(selectedBet && winners.length > 0),
  });

  const { write: settleBet } = useContractWrite(config);

  const handleWinnerToggle = (player: string) => {
    setWinners(prev => 
      prev.includes(player)
        ? prev.filter(p => p !== player)
        : [...prev, player]
    );
  };

  const handleSettleBet = async () => {
    if (!settleBet || !winners.length) return;
    try {
      await settleBet();
      setSelectedBet(null);
      setWinners([]);
    } catch (error) {
      console.error('Error settling bet:', error);
    }
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Recent Bets</h2>
      
      {bets.map((bet) => (
        <div
          key={bet.id}
          className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{bet.betType}</h3>
              <p className="text-sm text-gray-600">
                Amount: ${Number(bet.amount) / 1e18}
              </p>
              <p className="text-sm text-gray-600">
                Date: {formatDate(bet.timestamp)}
              </p>
              <div className="mt-2">
                <p className="text-sm font-medium">Players:</p>
                <ul className="list-disc list-inside">
                  {bet.players.map((player) => (
                    <li key={player} className="text-sm">
                      {player}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {!bet.settled && (
              <button
                onClick={() => setSelectedBet(bet.id)}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                Settle
              </button>
            )}
          </div>

          {selectedBet === bet.id && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <h4 className="font-medium mb-2">Select Winners:</h4>
              <div className="space-y-2">
                {bet.players.map((player) => (
                  <label key={player} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={winners.includes(player)}
                      onChange={() => handleWinnerToggle(player)}
                      className="rounded text-green-600 focus:ring-green-500"
                    />
                    <span>{player}</span>
                  </label>
                ))}
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={handleSettleBet}
                  disabled={!winners.length}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                >
                  Confirm Settlement
                </button>
                <button
                  onClick={() => {
                    setSelectedBet(null);
                    setWinners([]);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {bets.length === 0 && (
        <p className="text-center text-gray-500">No bets found</p>
      )}
    </div>
  );
} 