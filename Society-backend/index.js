const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // 1. Import CORS

const app = express();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('./models/Admin'); // Adjust path if needed

// 2. IMPORTANT: Use CORS before any routes
app.use(cors({
    origin: ["http://localhost:5173", "https://society-hub-eight.vercel.app"], 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());

// ==========================================
// 1. SETUP ROUTE (Run this once to create the Admin)
// ==========================================
app.post('/api/admin/setup', async (req, res) => {
  try {
    // const adminExists = await Admin.findOne({ username: 'manit_admin' });
    // if (adminExists) return res.status(400).json({ message: "Admin already set up!" });

    // Hash the plain text password with 10 salt rounds
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash("Pralabh07", salt); // Choose your password here

    const newAdmin = new Admin({
      username: 'manit_admin',
      passwordHash: hashed,
      upsert: true,
      new: true
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin created successfully with a secure hash!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 2. LOGIN ROUTE (React will call this)
// ==========================================
app.post('/api/admin/login', async (req, res) => {
  const { password } = req.body;

  try {
    // Fetch the admin record
    const admin = await Admin.findOne({ username: 'manit_admin' });
    if (!admin) return res.status(404).json({ message: "Admin account not found." });

    // Compare raw input with the database hash
    const isMatch = await bcrypt.compare(password, admin.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Galat Password, Junior!" });
    }

    // Password is correct -> Issue a JWT Token
    const token = jwt.sign(
      { role: 'admin', username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expires automatically in 1 hour
    );

    res.json({ success: true, token, message: "Welcome to Admin Mode!" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected!"))
  .catch((err) => console.log("❌ Connection error:", err));

const Society = require('./models/Society');

// Routes
app.get('/api/societies', async (req, res) => {
    try {
        const allSocieties = await Society.find();
        res.json(allSocieties);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Single Society Route (Make sure you have this for the details page!)
app.get('/api/societies/:id', async (req, res) => {
    try {
        const society = await Society.findById(req.params.id);
        res.json(society);
    } catch (err) {
        res.status(404).json({ message: "Not found" });
    }
});

// 4. Route to POST (Create) a new society
app.post('/api/societies', async (req, res) => {
    // req.body contains the data sent from the React form
    const newSociety = new Society(req.body); 
    
    try {
        const savedSociety = await newSociety.save(); // Saves to MongoDB Atlas
        res.status(201).json(savedSociety); // 201 means "Created Successfuly"
    } catch (err) {
        // If data is missing or invalid, send a 400 error
        res.status(400).json({ message: err.message });
    }
});

// 5. Route to DELETE a society by ID
app.delete('/api/societies/:id', async (req, res) => {
    try {
        console.log("Delete request received for ID:", req.params.id); // Debug log
        const result = await Society.findByIdAndDelete(req.params.id);
        
        if (!result) {
            return res.status(404).json({ message: "Society not found in database" });
        }
        
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ message: err.message });
    }
});

// Update a Society
app.put('/api/societies/:id', async (req, res) => {
    try {
        const updatedSociety = await Society.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true } 
        );
        if (!updatedSociety) return res.status(404).json({ message: "Not found" });
        res.json(updatedSociety);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

const PORT = process.env.port || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});

// AI RECOMMENDATION ROUTE
app.post('/api/recommend', async (req, res) => {
  const { interests } = req.body;

  try {
    // 1. Log to see if request is arriving
    console.log("AI Request received for:", interests);

    const societies = await Society.find({}, 'name description type');
    const societyContext = societies.map(s => 
      `${s.name} (${s.type}): ${s.description}`
    ).join("\n");

    // 2. Use the most stable model string
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
      You are a super-chill, successful senior at NIT Bhopal. 
      A junior is looking for society recommendations. They say: "${interests}"
  
      Here is the context of available societies:
      ${societyContext}

      Instructions:
      - Language: Professional English mixed with "Cool Hindi" words (e.g., 'Solid', 'Dhamaal', 'Khatarnak', 'Sorted', 'Best hai').
      - Tone: Encouraging, knowledgeable, and energetic. Like a mentor who is also a friend.
      - Structure: Start with a cool greeting, give the recommendation, and end with a small "pro-tip."
      - Constraint: Only recommend societies from the provided list.
      - Length: Keep it under 100 words.
    `;

    // 3. Add a timeout/safety check
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("AI Response generated successfully!");
    res.json({ recommendation: text });

  } catch (error) {
    // THIS IS CRUCIAL: Look at your VS Code terminal for this output!
    console.error("DETAILED AI ERROR:", error.message);
    
    // Check specifically for API Key issues
    if (error.message.includes("API key")) {
        res.status(500).json({ recommendation: "Bhai, API Key ka scene hai. Check your .env file!" });
    } else {
        res.status(500).json({ recommendation: "AI thoda load le raha hai. Terminal check karo!" });
    }
  }
});