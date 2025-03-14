'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from './ui/Button';
import Card from './ui/Card';

interface BetFormSimpleProps {
  onBetCreated: () => void;
}

const BetFormSimple: React.FC<BetFormSimpleProps> = ({ onBetCreated }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [betType, setBetType] = useState('Match Play');
  const [amount, setAmount] = useState('10');
  const [players, setPlayers] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [betId, setBetId] = useState<string | null>(null);
  const [qrValue, setQrValue] = useState<string | null>(null);

  const totalSteps = 3;
  const feePercentage = 0;
  const calculatedFee = (parseFloat(amount) * feePercentage / 100).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock bet ID
      const mockBetId = 'bet_' + Date.now().toString();
      setBetId(mockBetId);
      
      // Generate QR code value
      const qrCodeValue = `https://golf-guru-zone.app/bet/${mockBetId}`;
      setQrValue(qrCodeValue);
      
      setSuccess(true);
      onBetCreated();
    } catch (err) {
      setError('Failed to create bet. Please try again.');
      console.error('Error creating bet:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePresetAmount = (value: string) => {
    setAmount(value);
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
  };

  const handlePlayerChange = (index: number, value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  const addPlayerField = () => {
    setPlayers([...players, '']);
  };

  const resetForm = () => {
    setCurrentStep(1);
    setBetType('Match Play');
    setAmount('10');
    setPlayers(['']);
    setSuccess(false);
    setError(null);
    setBetId(null);
    setQrValue(null);
  };

  return (
    <Card className="p-6 relative">
      <form onSubmit={handleSubmit}>
        <h3 className="text-lg font-semibold mb-4">Create Golf Bet</h3>
        
        {/* Step indicator */}
        <div className="flex mb-6">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div 
              key={index}
              className={`h-1 flex-1 rounded-full mx-1 ${
                index + 1 <= currentStep ? 'bg-primary' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Select Bet Type */}
        {currentStep === 1 && (
          <div className="grid grid-cols-2 gap-4">
            {['Match Play', 'Nassau', 'Skins', 'Stroke Play'].map(type => (
              <div
                key={type}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  betType === type 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:border-primary/50'
                }`}
                onClick={() => setBetType(type)}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-white flex items-center justify-center mb-2 font-bold`}>
                    {type === 'Match Play' ? 'M' : type === 'Nassau' ? 'N' : type === 'Skins' ? 'S' : 'SP'}
                  </div>
                  <div className="font-medium">{type}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {type === 'Match Play' ? 'Hole by hole competition' : 
                     type === 'Nassau' ? 'Front 9, back 9, and total' :
                     type === 'Skins' ? 'Each hole is worth a skin' :
                     'Lowest total score wins'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 2: Set Amount */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h4 className="font-medium flex items-center">
              <div className="w-1 h-4 bg-primary rounded mr-2"></div>
              Set Bet Amount
            </h4>
            
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</div>
              <input
                type="number"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                min="1"
                step="0.1"
                className="w-full h-14 pl-8 pr-3 border border-gray-200 rounded-md"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {['5', '10', '25', '50'].map(preset => (
                <button
                  key={preset}
                  type="button"
                  className={`py-2 border rounded-md transition-all ${
                    amount === preset 
                      ? 'border-primary bg-primary/5 text-primary' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handlePresetAmount(preset)}
                >
                  ${preset}
                </button>
              ))}
            </div>

            <div className="flex justify-between text-sm p-3 bg-gray-50 rounded-md">
              <span>Transaction Fee ({feePercentage}%):</span>
              <span className={feePercentage === 0 ? 'text-green-600 font-medium' : ''}>
                {feePercentage === 0 ? 'FREE' : `$${calculatedFee}`}
              </span>
            </div>
          </div>
        )}

        {/* Step 3: Add Players */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h4 className="font-medium flex items-center">
              <div className="w-1 h-4 bg-primary rounded mr-2"></div>
              Add Players (Optional)
            </h4>
            
            <div className="space-y-3">
              {players.map((player, index) => (
                <div key={index} className="relative">
                  <input
                    type="text"
                    value={player}
                    onChange={(e) => handlePlayerChange(index, e.target.value)}
                    placeholder={`Player ${index + 1} name or email`}
                    className="w-full p-3 border border-gray-200 rounded-md"
                    autoFocus={index === 0}
                  />
                </div>
              ))}

              <button
                type="button"
                className="text-primary hover:text-primary/80 text-sm font-medium"
                onClick={addPlayerField}
              >
                + Add Another Player
              </button>
            </div>
          </div>
        )}

        {/* Success View */}
        {success && (
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h3 className="text-lg font-semibold mb-1">Bet Created Successfully!</h3>
            <p className="text-gray-500 text-sm mb-4">
              Share this QR code with your friends to join
            </p>

            {qrValue && (
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                <QRCodeSVG value={qrValue} size={200} level="H" />
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg w-full text-left text-sm space-y-1 mb-6">
              <div className="font-medium mb-1">Bet Details:</div>
              <div>Type: {betType}</div>
              <div>Amount: ${amount}</div>
              <div>Players: {players.filter(p => p.trim() !== '').length}</div>
              <div className="font-medium mt-2">
                Bet ID: <span className="font-mono">{betId}</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={resetForm}
            >
              Create Another Bet
            </Button>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {/* Form actions */}
        {!success && (
          <div className="flex justify-between mt-6 gap-4">
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
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      )}
    </Card>
  );
};

export default BetFormSimple; 