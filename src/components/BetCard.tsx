'use client';

import React from 'react';
import Card from './ui/Card';

interface Bet {
  id: string;
  type: string;
  amount: string;
  players: string[];
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

interface BetCardProps {
  bet: Bet;
  onClick?: () => void;
}

const BetCard: React.FC<BetCardProps> = ({ bet, onClick }) => {
  const { id, type, amount, players, status, createdAt } = bet;
  
  // Format date
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Get status color
  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card 
      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg">{type}</h3>
          <p className="text-gray-500 text-sm">{formattedDate}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-semibold">${amount}</span>
          <span className={`text-xs px-2 py-1 rounded-full mt-1 ${getStatusColor()}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Players: </span>
          {players.join(', ')}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          ID: {id.substring(0, 8)}...
        </div>
      </div>
    </Card>
  );
};

export default BetCard; 