'use client';

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { QRCodeSVG } from 'qrcode.react';
import { colors, typography, borderRadius, shadows, transitions } from '@/styles/designSystem';
import Card from './ui/Card';
import { Button } from './ui/Button';
import WalletService from '../services/walletService';
import SubscriptionService from '../services/subscriptionService';

interface BetFormSimpleProps {
  onBetCreated: () => void;
}

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Bet type card
const BetTypeCard = styled.div<{ $selected: boolean; $type: string }>`
  width: 100%;
  padding: 1.25rem;
  border-radius: ${borderRadius.xl};
  background-color: ${props => props.$selected ? 'rgba(10, 95, 56, 0.08)' : colors.background.paper};
  border: 2px solid ${props => props.$selected ? colors.primary.main : colors.border.light};
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: ${transitions.default};
  position: relative;
  
  &:hover {
    border-color: ${props => props.$selected ? colors.primary.main : colors.primary.light};
    transform: translateY(-2px);
  }
  
  ${props => props.$selected && `
    &::after {
      content: '✓';
      position: absolute;
      top: 10px;
      right: 10px;
      width: 20px;
      height: 20px;
      background-color: ${colors.primary.main};
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }
  `}
`;

const BetTypeIcon = styled.div<{ $type: string }>`
  width: 56px;
  height: 56px;
  border-radius: ${borderRadius.lg};
  background: ${colors.gradients.primaryGradient};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
  color: white;
  font-size: ${typography.fontSize.xl};
  
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

const BetTypeName = styled.div`
  font-weight: ${typography.fontWeight.medium};
  margin-bottom: 0.25rem;
`;

const BetTypeDescription = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
  text-align: center;
`;

// Amount selector
const AmountSection = styled.div`
  margin-top: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: ${typography.fontSize.md};
  font-weight: ${typography.fontWeight.medium};
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 16px;
    background-color: ${colors.primary.main};
    margin-right: 0.5rem;
    border-radius: ${borderRadius.sm};
  }
`;

const AmountInputWrapper = styled.div`
  position: relative;
`;

const AmountInput = styled.input`
  width: 100%;
  height: 56px;
  padding: 0 1rem 0 3rem;
  border: 2px solid ${colors.border.medium};
  border-radius: ${borderRadius.lg};
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  background-color: ${colors.background.paper};
  transition: ${transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${colors.primary.main};
    box-shadow: ${shadows.outline};
  }
  
  /* Hide arrows for number input */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type=number] {
    -moz-appearance: textfield;
  }
`;

const CurrencyLabel = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.primary.dark};
`;

const AmountPresets = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

const AmountPresetButton = styled.button<{ $selected: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: ${borderRadius.md};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  background-color: ${props => props.$selected ? colors.primary.main : 'transparent'};
  color: ${props => props.$selected ? colors.primary.contrastText : colors.text.primary};
  border: 1px solid ${props => props.$selected ? colors.primary.main : colors.border.light};
  cursor: pointer;
  transition: ${transitions.default};
  
  &:hover {
    border-color: ${colors.primary.light};
    background-color: ${props => props.$selected ? colors.primary.main : 'rgba(10, 95, 56, 0.05)'};
  }
`;

// Fee display
const FeeDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border-radius: ${borderRadius.lg};
  background-color: ${colors.background.default};
  margin-top: 0.75rem;
  font-size: ${typography.fontSize.sm};
`;

const FeeAmount = styled.span<{ $isZero: boolean }>`
  font-weight: ${typography.fontWeight.medium};
  color: ${props => props.$isZero ? colors.functional.success : colors.text.primary};
`;

// Players section
const PlayersSection = styled.div`
  margin-top: 1.5rem;
`;

const PlayerInputContainer = styled.div`
  margin-bottom: 0.75rem;
`;

const PlayerInput = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 1rem;
  border: 2px solid ${colors.border.medium};
  border-radius: ${borderRadius.lg};
  font-size: ${typography.fontSize.md};
  color: ${colors.text.primary};
  background-color: ${colors.background.paper};
  transition: ${transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${colors.primary.main};
    box-shadow: ${shadows.outline};
  }
`;

const AddPlayerButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: ${colors.primary.main};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  padding: 0;
  cursor: pointer;
  
  &:hover {
    color: ${colors.primary.dark};
  }
  
  &::before {
    content: '+';
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background-color: ${colors.primary.main};
    color: white;
    border-radius: 50%;
    margin-right: 0.5rem;
    font-size: 14px;
  }
`;

// Result Section
const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 1.5rem;
  animation: ${fadeIn} 0.5s ease-out;
`;

const SuccessIcon = styled.div`
  width: 64px;
  height: 64px;
  background-color: ${colors.functional.success};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  color: white;
  font-size: 32px;
  
  &::after {
    content: '✓';
  }
`;

const QRCodeContainer = styled.div`
  padding: 1rem;
  background-color: white;
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.md};
  margin: 1.5rem 0;
`;

// Error message
const ErrorMessage = styled.div`
  background-color: rgba(255, 59, 48, 0.1);
  color: ${colors.functional.error};
  padding: 0.75rem;
  border-radius: ${borderRadius.lg};
  font-size: ${typography.fontSize.sm};
  margin-top: 1rem;
  display: flex;
  align-items: center;
  
  &::before {
    content: '!';
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    background-color: ${colors.functional.error};
    color: white;
    border-radius: 50%;
    margin-right: 0.5rem;
    font-size: 14px;
    font-weight: bold;
  }
`;

// Step indicator
const StepsContainer = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
`;

const StepIndicator = styled.div<{ $active: boolean; $completed: boolean }>`
  flex: 1;
  height: 4px;
  background-color: ${props => 
    props.$completed 
      ? colors.primary.main 
      : props.$active 
        ? colors.secondary.light
        : colors.border.light};
  position: relative;
  
  & + & {
    margin-left: 4px;
  }
`;

// Loading spinner
const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: ${borderRadius['2xl']};
`;

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${colors.primary.light};
  border-top-color: ${colors.primary.main};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

// Bet descriptions
const BET_TYPE_DESCRIPTIONS = {
  'Nassau': 'Front nine, back nine, and overall match bets',
  'Match Play': 'Hole by hole competition',
  'Skins': 'Each hole is a separate bet',
  'Stroke Play': 'Lowest total score wins'
};

// Main component
const BetFormSimple: React.FC<BetFormSimpleProps> = ({ onBetCreated }) => {
  // Step tracking
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  // Form values
  const [betType, setBetType] = useState('Nassau');
  const [amount, setAmount] = useState('5');
  const [players, setPlayers] = useState(['']);
  
  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [betId, setBetId] = useState<string | null>(null);
  const [qrValue, setQrValue] = useState<string | null>(null);
  
  // Fees
  const [feePercentage, setFeePercentage] = useState<number>(3.0);
  const [calculatedFee, setCalculatedFee] = useState<string>('0.15');
  
  // Services
  const walletService = WalletService.getInstance();
  const subscriptionService = SubscriptionService.getInstance();
  
  // Get fee percentage on mount
  useEffect(() => {
    const getFeePercentage = async () => {
      const fee = await subscriptionService.getTransactionFeePercentage();
      setFeePercentage(fee);
      updateCalculatedFee(amount, fee);
    };
    
    getFeePercentage();
  }, []);
  
  // Update calculated fee when amount changes
  const updateCalculatedFee = (betAmount: string, fee: number) => {
    const parsedAmount = parseFloat(betAmount);
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      const calculatedFee = (parsedAmount * fee / 100).toFixed(2);
      setCalculatedFee(calculatedFee);
    } else {
      setCalculatedFee('0.00');
    }
  };
  
  // Handle amount change
  const handleAmountChange = (value: string) => {
    setAmount(value);
    updateCalculatedFee(value, feePercentage);
  };
  
  // Handle amount preset selection
  const handlePresetAmount = (value: string) => {
    setAmount(value);
    updateCalculatedFee(value, feePercentage);
  };
  
  // Handle player address changes
  const handlePlayerChange = (index: number, value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };
  
  // Add another player field
  const addPlayerField = () => {
    setPlayers([...players, '']);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      return;
    }
    
    // Validate inputs before final submission
    if (!betType) {
      setError('Please select a bet type');
      return;
    }
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    // Filter out empty player addresses
    const validPlayers = players.filter(player => player.trim() !== '');
    
    if (validPlayers.length < 1) {
      setError('Please enter at least 1 player address');
      return;
    }
    
    setLoading(true);
    
    try {
      // Get current user's address
      const userAddress = await walletService.getAddress();
      if (!userAddress) {
        throw new Error('Wallet not connected');
      }
      
      // Add current user to players if not already included
      if (!validPlayers.includes(userAddress)) {
        validPlayers.push(userAddress);
      }
      
      // Mock bet creation for demo
      // In a real implementation, this would call the contract service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock bet ID
      const mockBetId = `bet_${Date.now().toString(36)}`;
      
      // Generate QR code value
      const currentUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const qrUrl = `${currentUrl}?betId=${mockBetId}`;
      
      // Update UI
      setBetId(mockBetId);
      setQrValue(qrUrl);
      setSuccess(true);
      
      // Notify parent component
      onBetCreated();
    } catch (err: any) {
      console.error('Error creating bet:', err);
      setError(err.message || 'Failed to create bet. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle go back
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Reset form
  const resetForm = () => {
    setBetType('Nassau');
    setAmount('5');
    setPlayers(['']);
    setCurrentStep(1);
    setSuccess(false);
    setBetId(null);
    setQrValue(null);
    setError('');
  };
  
  return (
    <Card className="w-full">
      {/* Step indicators */}
      <StepsContainer>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <StepIndicator 
            key={index}
            $active={currentStep === index + 1}
            $completed={currentStep > index + 1}
          />
        ))}
      </StepsContainer>
      
      <form onSubmit={handleSubmit}>
        {/* Step 1: Select Bet Type */}
        {currentStep === 1 && (
          <>
            <SectionTitle>Select Bet Type</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {Object.entries(BET_TYPE_DESCRIPTIONS).map(([type, description]) => (
                <BetTypeCard 
                  key={type} 
                  $selected={betType === type}
                  $type={type}
                  onClick={() => setBetType(type)}
                >
                  <BetTypeIcon $type={type} />
                  <BetTypeName>{type}</BetTypeName>
                  <BetTypeDescription>{description}</BetTypeDescription>
                </BetTypeCard>
              ))}
            </div>
          </>
        )}
        
        {/* Step 2: Set Amount */}
        {currentStep === 2 && (
          <AmountSection>
            <SectionTitle>Set Bet Amount</SectionTitle>
            <AmountInputWrapper>
              <CurrencyLabel>USDC</CurrencyLabel>
              <AmountInput 
                type="number"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                min="1"
                step="0.1"
                autoFocus
              />
            </AmountInputWrapper>
            
            <AmountPresets>
              <AmountPresetButton 
                type="button"
                $selected={amount === '5'}
                onClick={() => handlePresetAmount('5')}
              >
                $5
              </AmountPresetButton>
              <AmountPresetButton 
                type="button"
                $selected={amount === '10'}
                onClick={() => handlePresetAmount('10')}
              >
                $10
              </AmountPresetButton>
              <AmountPresetButton 
                type="button"
                $selected={amount === '25'}
                onClick={() => handlePresetAmount('25')}
              >
                $25
              </AmountPresetButton>
              <AmountPresetButton 
                type="button"
                $selected={amount === '50'}
                onClick={() => handlePresetAmount('50')}
              >
                $50
              </AmountPresetButton>
            </AmountPresets>
            
            <FeeDisplay>
              <span>Transaction Fee ({feePercentage}%):</span>
              <FeeAmount $isZero={feePercentage === 0}>
                {feePercentage === 0 ? 'FREE' : `${calculatedFee} USDC`}
              </FeeAmount>
            </FeeDisplay>
          </AmountSection>
        )}
        
        {/* Step 3: Add Players */}
        {currentStep === 3 && (
          <PlayersSection>
            <SectionTitle>Add Players (Optional)</SectionTitle>
            <div>
              {players.map((player, index) => (
                <PlayerInputContainer key={index}>
                  <PlayerInput
                    type="text"
                    value={player}
                    onChange={(e) => handlePlayerChange(index, e.target.value)}
                    placeholder={`Player ${index + 1} address or Coinbase username`}
                    autoFocus={index === 0}
                  />
                </PlayerInputContainer>
              ))}
              
              <AddPlayerButton
                type="button"
                onClick={addPlayerField}
              >
                Add Another Player
              </AddPlayerButton>
            </div>
          </PlayersSection>
        )}
        
        {/* Success View */}
        {success && (
          <SuccessContainer>
            <SuccessIcon />
            <h3 style={{ margin: '0 0 0.5rem 0' }}>Bet Created Successfully!</h3>
            <p style={{ 
              color: colors.text.secondary, 
              fontSize: typography.fontSize.sm,
              margin: '0 0 1rem 0'
            }}>
              Share this QR code with your friends to join
            </p>
            
            {qrValue && (
              <QRCodeContainer>
                <QRCodeSVG value={qrValue} size={200} level="H" />
              </QRCodeContainer>
            )}
            
            <div style={{ 
              padding: '0.75rem', 
              backgroundColor: colors.background.default, 
              borderRadius: borderRadius.lg, 
              width: '100%',
              textAlign: 'left',
              fontSize: typography.fontSize.sm,
              color: colors.text.secondary
            }}>
              <div style={{ marginBottom: '0.25rem', fontWeight: typography.fontWeight.medium }}>
                Bet Details:
              </div>
              <div>Type: {betType}</div>
              <div>Amount: {amount} USDC</div>
              <div>Players: {players.filter(p => p.trim() !== '').length}</div>
              <div style={{ marginTop: '0.25rem', fontWeight: typography.fontWeight.medium }}>
                Bet ID: <span style={{ fontFamily: 'monospace' }}>{betId}</span>
              </div>
            </div>
            
            <Button
              variant="outline"
              className="w-full mt-6"
              onClick={resetForm}
            >
              Reset Form
            </Button>
          </SuccessContainer>
        )}
        
        {/* Error message */}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        {/* Form actions */}
        {!success && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginTop: '1.5rem',
            gap: '1rem'
          }}>
            {currentStep > 1 ? (
              <Button
                variant="outline"
                onClick={handleBack}
                type="button"
              >
                Back
              </Button>
            ) : (
              <div></div>
            )}
            
            <Button
              variant={currentStep === totalSteps ? 'default' : 'secondary'}
              type="submit"
              className={currentStep === totalSteps ? 'w-full' : ''}
            >
              {currentStep === totalSteps ? 'Create Bet' : 'Next Step'}
            </Button>
          </div>
        )}
      </form>
      
      {/* Loading overlay */}
      {loading && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}
    </Card>
  );
};

export default BetFormSimple; 