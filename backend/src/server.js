// STEP 1: LOAD SECRETS. This MUST be the first line.
require("dotenv").config(); 

// STEP 2: Import other libraries
const mongoose = require("mongoose");
const app = require("./app"); // Now it's safe to import app

const PORT = process.env.PORT || 5000;

// STEP 3: Connect to the database
mongoose.connect(process.env.MONGO_URI, { 
    serverSelectionTimeoutMS: 30000, 
    bufferCommands: false // This is a good setting, keep it
  })
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    
    // STEP 4: Start the server ONLY AFTER the DB is connected
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  })
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });