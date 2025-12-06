const express = require("express");
const cors = require("cors");
const path = require("path"); 
const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- API ROUTES ---
app.use("/auth", require("./routes/authRoutes"));
app.use("/email", require("./routes/emailRoutes"));
app.use("/summary", require("./routes/summaryRoutes"));
app.use("/tasks", require("./routes/taskRoutes"));
app.use("/applications", require("./routes/applicationRoutes"));

// --- NEW: Document Routes (This was the missing line!) ---
app.use("/documents", require("./routes/documentRoutes")); 

// --- SERVE UPLOADED FILES ---
// This makes the 'uploads' folder public so you can view the files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

module.exports = app;