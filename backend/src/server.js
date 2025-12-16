// STEP 1: LOAD SECRETS. This MUST be the first line.
require("dotenv").config(); 

// STEP 2: Import other libraries
const mongoose = require("mongoose");
const app = require("./app"); // Now it's safe to import app

// STEP 3: Connect to the database
// We connect outside of the request handler to reuse the connection (Performance)
if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGO_URI, { 
    serverSelectionTimeoutMS: 30000, 
    bufferCommands: false 
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));
}

// 👇 HOMEPAGE ROUTE (So you know it's working)
app.get('/', (req, res) => {
    res.send("Backend is running successfully on Vercel! 🚀");
});

// 👇 CRITICAL FOR VERCEL: Export the app instead of listening
// Vercel handles the server starting automatically.
module.exports = app;