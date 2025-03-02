# Golf Guru Zone

An AI-powered golf performance analysis tool that provides personalized insights and coaching tips based on your golf stats.

## Features

- Input your golf stats (Score, Putts, Fairways Hit, Greens in Regulation)
- Get AI-generated analysis and coaching tips
- Free tier with 5 analyses per day
- Premium tier with unlimited analyses for $4.99/month

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js with Express
- AI: OpenAI API
- Payments: Stripe

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- OpenAI API key
- Stripe account with a product set up

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd golf-guru-zone
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. The `.env` file is already set up with the provided API keys. If you want to use your own keys, update the following variables:
   ```
   OPENAI_API_KEY=your_openai_api_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_PRODUCT_ID=your_stripe_product_id
   PORT=3000
   ```

### Running Locally

1. Start the server:
   ```
   npm start
   ```

   For development with auto-restart:
   ```
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. Enter your golf stats and click "Analyze My Game" to get personalized coaching tips.

4. You can use the app 5 times per day for free. After that, you'll be prompted to upgrade to the premium tier.

## Deployment

### Deploying to Vercel

1. Install Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Deploy to Vercel:
   ```
   vercel
   ```

3. Follow the prompts to complete the deployment.

4. Set up environment variables in the Vercel dashboard.

### Deploying to Netlify

1. Install Netlify CLI:
   ```
   npm install -g netlify-cli
   ```

2. Deploy to Netlify:
   ```
   netlify deploy
   ```

3. Follow the prompts to complete the deployment.

4. Set up environment variables in the Netlify dashboard.

## Project Structure

```
golf-guru-zone/
├── public/                  # Static frontend files
│   ├── index.html           # Main HTML file
│   ├── styles.css           # CSS styles
│   └── app.js               # Frontend JavaScript
├── server/                  # Express server
│   └── server.js            # Server code
├── netlify/                 # Netlify functions
│   └── functions/           
│       └── analyze.js       # Serverless function for Netlify
├── .env                     # Environment variables
├── package.json             # Project dependencies
├── vercel.json              # Vercel configuration
├── netlify.toml             # Netlify configuration
└── README.md                # Project documentation
```

## Future Improvements

- User authentication
- Save and track progress over time
- More detailed golf stats analysis
- Mobile app version
- Detailed analytics dashboard

## License

MIT #   G o l f - G u r u - Z o n e  
 #   G o l f - G u r u - Z o n e  
 