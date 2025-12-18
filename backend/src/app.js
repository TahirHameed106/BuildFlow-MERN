const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

/* ================================
   CORS SETUP
================================ */
app.use(
  cors({
    origin: ["https://build-flow-mern.vercel.app", "http://localhost:5173"], 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// ✅ SAFE FIX: Handle Preflight Manually (Avoids the "*" crash)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

/* ================================
   Body Parsers
================================ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================================
   API Routes
================================ */
app.use("/auth", require("./routes/authRoutes"));
app.use("/email", require("./routes/emailRoutes"));
app.use("/summary", require("./routes/summaryRoutes"));
app.use("/tasks", require("./routes/taskRoutes"));
app.use("/applications", require("./routes/applicationRoutes"));
app.use("/documents", require("./routes/documentRoutes"));

/* ================================
   Static Uploads
================================ */
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

/* ================================
   Health Check
================================ */
app.get("/", (req, res) => {
  res.status(200).send("Backend is running successfully!");
});

module.exports = app;s