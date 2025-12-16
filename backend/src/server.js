require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./app");

/* ================================
   MongoDB connection
================================ */
if (mongoose.connection.readyState === 0) {
  mongoose
    .connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      bufferCommands: false
    })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Error:", err));
}

module.exports = app;
