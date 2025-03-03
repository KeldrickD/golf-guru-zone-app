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
            return res.status(400).json({ error: 'All golf stats are required' });
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
        
        // Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a professional golf coach providing concise, actionable advice." },
                { role: "user", content: prompt }
            ],
            max_tokens: 500
        });
        
        // Extract and send response
        const analysis = completion.choices[0].message.content;
        res.json({ analysis });
        
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(500).json({ error: 'Failed to analyze golf stats' });
    }
});

// Placeholder routes for Stripe integration
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    res.json({ url: process.env.STRIPE_LINK || '#' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/create-premium-session', async (req, res) => {
  try {
    res.json({ url: process.env.STRIPE_PREMIUM_LINK || '#' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve the frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 