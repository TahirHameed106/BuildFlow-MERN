require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        bufferCommands: false,
      });
      isConnected = true;
      console.log("✅ MongoDB Connected");
    } catch (error) {
      console.error("❌ Database Connection Error:", error);
      return res.status(500).send(`Database Error: ${error.message}`);
    }
  }
  return app(req, res);
};