import { useState } from 'react';
import BetForm from './BetForm';

export default function CreateBet() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleBetCreated = () => {
    // Increment refresh trigger to cause BetList to refetch
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <>
      <div className="card">
        <h2>Create New Bet</h2>
        <p>
          Log your golf wagers and track them on the blockchain. Perfect for Nassau, 
          Skins, Match Play, and other golf betting formats.
        </p>
      </div>
      <BetForm onBetCreated={handleBetCreated} />
    </>
  );
} 