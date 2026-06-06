// apiConfig.js
const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? "https://your-backend-name.onrender.com" // Your Render URL
    : "http://localhost:5000";

export default API_BASE_URL;