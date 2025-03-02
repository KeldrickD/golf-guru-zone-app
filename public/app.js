// Golf Guru Zone - Frontend JavaScript

// Constants
const API_ENDPOINT = window.location.hostname === 'localhost' ? '/api/analyze' : '/.netlify/functions/analyze';
const STRIPE_CHECKOUT_URL = 'https://buy.stripe.com/live_aEU5lO0Ot1Ij0QU000?client_reference_id=prod_RrzrUPZR6iErsd'; // Stripe checkout URL for the premium subscription
const DAILY_LIMIT = 5;
const STORAGE_KEY = 'golfGuruUsage';

// DOM Elements
const form = document.getElementById('golf-stats-form');
const resultsContainer = document.getElementById('results-container');
const analysisResults = document.getElementById('analysis-results');
const loadingIndicator = document.getElementById('loading');
const limitMessage = document.getElementById('limit-message');
const upgradeBtn = document.getElementById('upgrade-btn');

// Initialize usage tracking
let usageData = loadUsageData();

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Check if user has reached daily limit
    checkUsageLimit();
    
    // Form submission
    form.addEventListener('submit', handleFormSubmit);
    
    // Upgrade button
    upgradeBtn.addEventListener('click', handleUpgradeClick);
});

// Functions
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Check if user has reached daily limit
    if (hasReachedLimit()) {
        showLimitMessage();
        return;
    }
    
    // Get form data
    const formData = {
        score: parseInt(document.getElementById('score').value),
        putts: parseInt(document.getElementById('putts').value),
        fairways: parseInt(document.getElementById('fairways').value),
        greens: parseInt(document.getElementById('greens').value)
    };
    
    // Show loading indicator
    loadingIndicator.style.display = 'block';
    resultsContainer.style.display = 'block';
    analysisResults.innerHTML = '';
    
    // Send data to API
    fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Hide loading indicator
        loadingIndicator.style.display = 'none';
        
        // Display results
        displayResults(data);
        
        // Update usage count
        incrementUsageCount();
    })
    .catch(error => {
        console.error('Error:', error);
        loadingIndicator.style.display = 'none';
        analysisResults.innerHTML = `<p class="error">Sorry, there was an error analyzing your stats. Please try again later.</p>`;
    });
}

function displayResults(data) {
    // Format the analysis response
    const formattedResponse = data.analysis
        .replace(/\n\n/g, '<br><br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    analysisResults.innerHTML = formattedResponse;
}

function handleUpgradeClick(e) {
    e.preventDefault();
    
    // Open Stripe checkout in new tab
    window.open(STRIPE_CHECKOUT_URL, '_blank');
}

function loadUsageData() {
    const today = new Date().toDateString();
    const storedData = localStorage.getItem(STORAGE_KEY);
    
    if (storedData) {
        const parsedData = JSON.parse(storedData);
        
        // Reset count if it's a new day
        if (parsedData.date !== today) {
            return { date: today, count: 0 };
        }
        
        return parsedData;
    }
    
    // Initialize new usage data
    return { date: today, count: 0 };
}

function incrementUsageCount() {
    usageData.count += 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usageData));
    
    // Check if user has now reached the limit
    checkUsageLimit();
}

function hasReachedLimit() {
    return usageData.count >= DAILY_LIMIT;
}

function checkUsageLimit() {
    if (hasReachedLimit()) {
        showLimitMessage();
    }
}

function showLimitMessage() {
    limitMessage.style.display = 'block';
    form.style.display = 'none';
}

// Initialize Stripe checkout
upgradeBtn.href = STRIPE_CHECKOUT_URL; 