'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { colors, typography, borderRadius, shadows, transitions } from '@/styles/designSystem';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

export interface BetCardProps {
  id: string;
  type: string;
  amount: string;
  creator: string;
  players: string[];
  joinedPlayers: string[];
  createdAt: string;
  settled: boolean;
  winner?: string;
  onJoin?: (id: string) => void;
  onVote?: (id: string, winner: string) => void;
}

// Status badge styles
const StatusBadge = styled.div<{ $status: 'open' | 'joined' | 'settled' }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: ${borderRadius.full};
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  ${props => props.$status === 'open' && `
    background-color: rgba(74, 144, 226, 0.1);
    color: ${colors.interface.skyBlue};
  `}
  
  ${props => props.$status === 'joined' && `
    background-color: rgba(10, 95, 56, 0.1);
    color: ${colors.primary.main};
  `}
  
  ${props => props.$status === 'settled' && `
    background-color: rgba(52, 199, 89, 0.1);
    color: ${colors.functional.success};
  `}
  
  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 0.5rem;
    
    ${props => props.$status === 'open' && `
      background-color: ${colors.interface.skyBlue};
    `}
    
    ${props => props.$status === 'joined' && `
      background-color: ${colors.primary.main};
    `}
    
    ${props => props.$status === 'settled' && `
      background-color: ${colors.functional.success};
    `}
  }
`;

const BetTypeIcon = styled.div<{ $type: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.gradients.primaryGradient};
  color: white;
  font-size: ${typography.fontSize.xl};
  margin-right: 1rem;
  
  ${props => props.$type === 'Nassau' && `
    &::after {
      content: 'N';
    }
  `}
  
  ${props => props.$type === 'Match Play' && `
    &::after {
      content: 'M';
    }
  `}
  
  ${props => props.$type === 'Skins' && `
    &::after {
      content: 'S';
    }
  `}
  
  ${props => props.$type === 'Stroke Play' && `
    &::after {
      content: 'SP';
    }
  `}
`;

const BetHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const BetInfo = styled.div`
  flex: 1;
`;

const BetTitle = styled.h3`
  margin: 0;
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.text.primary};
`;

const BetDetails = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
`;

const BetAmount = styled.div`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.primary.main};
  margin-right: 1rem;
`;

const BetDate = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
`;

const PlayerSection = styled.div`
  margin-top: 1rem;
`;

const PlayerList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const PlayerAvatar = styled.div<{ $joined: boolean; $isWinner: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => props.$joined 
    ? props.$isWinner 
      ? colors.secondary.main 
      : colors.primary.light 
    : colors.interface.slate};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${typography.fontSize.sm};
  transition: ${transitions.default};
  position: relative;
  
  ${props => props.$isWinner && `
    &::after {
      content: '👑';
      position: absolute;
      top: -10px;
      right: -5px;
      font-size: 16px;
    }
  `}
  
  ${props => !props.$joined && `
    opacity: 0.6;
  `}
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
  
  & > button {
    min-width: 100px;
  }
`;

const VoteSectionContainer = styled.div`
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid ${colors.border.light};
`;

const VoteTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: ${typography.fontSize.md};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.text.primary};
`;

const VotePlayerList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const VotePlayerCard = styled.div<{ $selected: boolean }>`
  padding: 0.75rem;
  border-radius: ${borderRadius.lg};
  border: 2px solid ${props => props.$selected ? colors.primary.main : colors.border.light};
  background-color: ${props => props.$selected ? `rgba(10, 95, 56, 0.05)` : 'transparent'};
  cursor: pointer;
  transition: ${transitions.default};
  
  &:hover {
    border-color: ${colors.primary.light};
    background-color: rgba(10, 95, 56, 0.02);
  }
  
  display: flex;
  align-items: center;
`;

// Function to get bet status
const getBetStatus = (
  settled: boolean,
  joinedPlayers: string[],
  currentUserAddress: string
): 'open' | 'joined' | 'settled' => {
  if (settled) return 'settled';
  if (joinedPlayers.includes(currentUserAddress)) return 'joined';
  return 'open';
};

// Function to truncate address
const truncateAddress = (address: string) => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Function to get initials from address
const getInitials = (address: string) => {
  return address.substring(2, 4).toUpperCase();
};

const BetCard: React.FC<BetCardProps> = ({
  id,
  type,
  amount,
  creator,
  players,
  joinedPlayers,
  createdAt,
  settled,
  winner,
  onJoin,
  onVote
}) => {
  // Mock current user - in real app this would come from a context or prop
  const currentUserAddress = players[0]; // Assuming first player is current user for demo
  
  // State for selected winner when voting
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);
  // State for expanded view
  const [expanded, setExpanded] = useState(false);
  
  // Get bet status
  const status = getBetStatus(settled, joinedPlayers, currentUserAddress);
  
  // Handle join bet
  const handleJoin = () => {
    if (onJoin) onJoin(id);
  };
  
  // Handle vote for winner
  const handleVote = () => {
    if (onVote && selectedWinner) {
      onVote(id, selectedWinner);
    }
  };
  
  // Format date
  const formattedDate = new Date(createdAt).toLocaleDateString();
  
  // Check if user can join this bet
  const canJoin = status === 'open' && 
    players.includes(currentUserAddress) && 
    !joinedPlayers.includes(currentUserAddress);
  
  // Check if user can vote
  const canVote = status === 'joined' && 
    !settled && 
    joinedPlayers.includes(currentUserAddress);
  
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{type} Bet</h3>
          <p className="text-sm text-muted-foreground">
            {formattedDate}
          </p>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">{amount} USDC</div>
          <span className={`text-sm ${status === 'settled' ? 'text-green-500' : 'text-muted-foreground'}`}>
            {status}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm">
          <span className="text-muted-foreground">Participants: </span>
          {joinedPlayers.length}/{players.length} Players Joined
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Show Less' : 'Show All'}
        </Button>
      </div>

      <PlayerSection>
        <PlayerList>
          {(expanded ? players : players.slice(0, 5)).map((player, index) => {
            const isJoined = joinedPlayers.includes(player);
            const isWinner = winner === player;
            return (
              <PlayerAvatar key={index} $joined={isJoined} $isWinner={isWinner}>
                {getInitials(player)}
              </PlayerAvatar>
            );
          })}
          {!expanded && players.length > 5 && (
            <PlayerAvatar $joined={false} $isWinner={false}>
              +{players.length - 5}
            </PlayerAvatar>
          )}
        </PlayerList>
      </PlayerSection>
      
      {canVote && (
        <VoteSectionContainer>
          <VoteTitle>Vote for Winner</VoteTitle>
          <VotePlayerList>
            {joinedPlayers.map((player, index) => (
              <VotePlayerCard 
                key={index} 
                $selected={selectedWinner === player}
                onClick={() => setSelectedWinner(player)}
              >
                <PlayerAvatar $joined={true} $isWinner={false} style={{ marginRight: '0.5rem' }}>
                  {getInitials(player)}
                </PlayerAvatar>
                <span style={{ fontSize: typography.fontSize.sm }}>
                  {player === currentUserAddress ? 'You' : truncateAddress(player)}
                </span>
              </VotePlayerCard>
            ))}
          </VotePlayerList>
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            onClick={handleVote}
            disabled={!selectedWinner}
          >
            Submit Vote
          </Button>
        </VoteSectionContainer>
      )}
      
      {status === 'settled' && winner && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <div className="font-semibold">
            Winner: {winner === currentUserAddress ? 'You' : truncateAddress(winner)}
          </div>
          <div className="mt-2">
            Payout: {amount} USDC × {joinedPlayers.length} players
          </div>
        </div>
      )}
      
      {canJoin && (
        <ActionsContainer>
          <Button 
            variant="default" 
            size="default" 
            className="flex-1"
            onClick={handleJoin}
          >
            Join Bet
          </Button>
        </ActionsContainer>
      )}
    </Card>
  );
};

export default BetCard; 