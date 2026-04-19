// NexTrade Global Configuration
const CONFIG = {
    // Replace this with your actual Render backend URL after deployment
    // Example: "https://nextrade-api.onrender.com"
    API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:5010' 
        : 'https://nextrade-0-2.onrender.com', // Change this to your Render URL
};

// Log configuration status
console.log(`NexTrade: Using API Base URL -> ${CONFIG.API_BASE_URL}`);
