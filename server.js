const express = require('express');
const path = require('path');
const app = express();

// First try to serve from out/export if it exists
app.use(express.static(path.join(__dirname, 'out', 'export')));

// Also serve from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle API requests with mock data
app.get('/api/:path*', (req, res) => {
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
  return res.status(404).json({ message: 'API endpoint not found' });
});

// For all other routes, try to serve the Next.js exported index.html
// If it doesn't exist, fall back to our public/index.html
app.get('*', (req, res) => {
  const nextJsExportPath = path.join(__dirname, 'out', 'export', 'index.html');
  const fallbackPath = path.join(__dirname, 'public', 'index.html');
  
  // Check if Next.js export exists
  try {
    if (require('fs').existsSync(nextJsExportPath)) {
      return res.sendFile(nextJsExportPath);
    }
  } catch (err) {
    console.log('Using fallback HTML');
  }
  
  // Use fallback
  return res.sendFile(fallbackPath);
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`
======================================
Server is running on port ${PORT}
Open http://localhost:${PORT} in your browser
======================================
  `);
}); 