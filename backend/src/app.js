const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

// --- 1. CORS CONFIGURATION (Critical Fix) ---
app.use(
  cors({
    origin: "https://build-flow-mern.vercel.app", // Your Frontend
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// --- 2. Allow "Preflight" Checks ---
app.options("*", cors());

// --- 3. Standard Setup ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 4. Routes ---
app.use("/auth", require("./routes/authRoutes"));
app.use("/email", require("./routes/emailRoutes"));
app.use("/summary", require("./routes/summaryRoutes"));
app.use("/tasks", require("./routes/taskRoutes"));
app.use("/applications", require("./routes/applicationRoutes"));
app.use("/documents", require("./routes/documentRoutes"));

// --- 5. Uploads & Health Check ---
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.get("/", (req, res) => res.send("Backend is running!"));

module.exports = app;