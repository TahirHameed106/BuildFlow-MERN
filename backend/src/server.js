require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

// Global variable to cache the DB connection
let isConnected = false;

module.exports = async (req, res) => {
  // 1. Connect to Database (if not already connected)
  if (!isConnected) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000, // Timeout fast if it fails
        bufferCommands: false,
      });
      isConnected = true;
      console.log("✅ MongoDB Connected");
    } catch (error) {
      console.error("❌ Database Connection Error:", error);
      // This prevents the hard crash and tells you exactly what failed
      return res.status(500).send(`Database Error: ${error.message}`);
    }
  }

  // 2. Hand off the request to Express
  return app(req, res);
};