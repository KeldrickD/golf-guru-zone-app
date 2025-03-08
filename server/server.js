// Golf Guru Zone - Backend Server
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    error: 'An unexpected error occurred',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Please try again later'
  });
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Check if OpenAI API key is valid
const apiKey = process.env.OPENAI_API_KEY;
const isValidApiKey = apiKey && apiKey !== 'your_valid_openai_api_key';

// Initialize OpenAI if API key is valid
let openai;
if (isValidApiKey) {
    openai = new OpenAI({
        apiKey: apiKey
    });
}

// API Routes
app.post('/api/analyze', async (req, res) => {
    try {
        const { score, putts, fairways, greens } = req.body;
        
        // Validate input
        if (!score || !putts || fairways === undefined || greens === undefined) {
            return res.status(400).json({ 
              error: 'Validation Error', 
              message: 'All golf stats are required',
              fields: {
                score: score ? null : 'Score is required',
                putts: putts ? null : 'Putts is required',
                fairways: fairways !== undefined ? null : 'Fairways hit is required',
                greens: greens !== undefined ? null : 'Greens in regulation is required'
              }
            });
        }
        
        // Check if OpenAI API key is valid
        if (!isValidApiKey) {
            // Return mock data if no valid API key
            return res.json({ 
                analysis: `
                **Analysis of Your Golf Performance**

                Based on your stats (Score: ${score}, Putts: ${putts}, Fairways Hit: ${fairways}, Greens in Regulation: ${greens}), here are 3 insights and tips:

                **Insight 1: Putting Performance**
                Your putting average suggests room for improvement. Focus on distance control and reading greens more effectively.

                **Insight 2: Tee-to-Green Accuracy**
                With ${fairways} fairways hit, work on consistent ball striking and alignment from the tee.

                **Insight 3: Approach Play**
                Hitting ${greens} greens in regulation indicates you should practice your iron play to improve approach shot accuracy.

                **Practice Tips:**
                1. Spend 15 minutes daily on 3-6 foot putts to build confidence
                2. Work on alignment drills with alignment sticks at the driving range
                3. Practice half-swing shots from 50-100 yards to improve your scoring zone play

                Note: This is demo analysis. For real AI-powered analysis, please add a valid OpenAI API key.
                `
            });
        }
        
        // Create prompt for OpenAI
        const prompt = `You are a golf coach. Analyze these stats: Score: ${score}, Putts: ${putts}, Fairways Hit: ${fairways}, Greens in Regulation: ${greens}. Provide 3 specific insights and practice tips to improve.`;
        
        // Call OpenAI API with timeout
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('OpenAI API request timed out')), 15000)
        );
        
        const apiPromise = openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a professional golf coach providing concise, actionable advice." },
                { role: "user", content: prompt }
            ],
            max_tokens: 500
        });
        
        // Race between API call and timeout
        const completion = await Promise.race([apiPromise, timeoutPromise]);
        
        // Extract and send response
        const analysis = completion.choices[0].message.content;
        res.json({ 
          success: true,
          analysis 
        });
        
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(error.status || 500).json({ 
          error: 'API Error', 
          message: error.message || 'Failed to analyze golf stats',
          retry: error.status === 429 || error.message.includes('timeout')
        });
    }
});

// Transaction logging endpoint
app.post('/api/log-transaction', async (req, res) => {
  try {
    const { txHash, betType, amount, players } = req.body;
    
    // Validate input
    if (!txHash || !betType || !amount || !players) {
      return res.status(400).json({ 
        error: 'Validation Error', 
        message: 'Transaction hash, bet type, amount, and players are required' 
      });
    }
    
    // Here you would typically log the transaction to a database
    console.log(`Transaction logged: ${txHash} - ${betType} - ${amount} - ${players.join(', ')}`);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    res.json({ 
      success: true, 
      message: 'Transaction successfully logged',
      txHash
    });
  } catch (error) {
    console.error('Error logging transaction:', error);
    res.status(500).json({ 
      error: 'Server Error', 
      message: 'Failed to log transaction' 
    });
  }
});

// Placeholder routes for Stripe integration
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    // Validate request
    const { plan } = req.body;
    if (!plan) {
      return res.status(400).json({ error: 'Plan is required' });
    }
    
    res.json({ 
      success: true,
      url: process.env.STRIPE_LINK || '#' 
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ 
      error: 'Payment Error',
      message: error.message || 'Failed to create checkout session' 
    });
  }
});

app.post('/api/create-premium-session', async (req, res) => {
  try {
    res.json({ 
      success: true,
      url: process.env.STRIPE_PREMIUM_LINK || '#' 
    });
  } catch (error) {
    console.error('Error creating premium session:', error);
    res.status(500).json({ 
      error: 'Payment Error',
      message: error.message || 'Failed to create premium session' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Serve the frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}); 