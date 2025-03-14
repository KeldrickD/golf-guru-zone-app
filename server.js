const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the 'out' directory
app.use(express.static(path.join(__dirname, 'out')));

// Handle API requests with mock data
app.get('/api/mock/:path*', (req, res) => {
  const path = req.params.path;
  
  // Mock data for different API endpoints
  const mockData = {
    clubs: [
      { id: 1, name: 'Driver', type: 'Wood', loft: 10.5 },
      { id: 2, name: '3 Wood', type: 'Wood', loft: 15 },
      { id: 3, name: '5 Iron', type: 'Iron', loft: 27 },
      { id: 4, name: 'Pitching Wedge', type: 'Wedge', loft: 46 },
      { id: 5, name: 'Putter', type: 'Putter', loft: 3 },
    ],
    stats: {
      handicap: 12.4,
      roundsPlayed: 24,
      averageScore: 86.2,
      fairwaysHit: 62,
      greensInRegulation: 48,
      puttsPerRound: 32.1,
      drivingDistance: 245.8,
      scoringBreakdown: {
        eagles: 1,
        birdies: 32,
        pars: 156,
        bogeys: 198,
        doubleBogeys: 87,
        others: 34
      }
    },
    subscription: {
      status: 'active',
      plan: 'premium',
      nextBillingDate: '2023-12-01',
      features: ['unlimited_bets', 'advanced_analytics', 'no_transaction_fees']
    },
    bets: [
      {
        id: 'bet_1',
        type: 'Match Play',
        amount: '25',
        players: ['Player 1', 'Player 2'],
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: 'bet_2',
        type: 'Nassau',
        amount: '10',
        players: ['Player 1', 'Player 3', 'Player 4'],
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ]
  };
  
  // Return appropriate mock data based on the endpoint
  if (path && mockData[path]) {
    return res.json(mockData[path]);
  }
  
  // Default response if endpoint not found
  return res.status(404).json({ message: 'Mock API endpoint not found' });
});

// For all other routes, serve the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'out', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 