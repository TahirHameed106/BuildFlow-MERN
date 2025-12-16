const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

/* ================================
   ✅ 1. CORS (Express 5 & Vercel SAFE)
================================ */
app.use(
  cors({
    origin: "https://build-flow-mern.vercel.app", // Your Frontend
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// ✅ CRITICAL FIX: Handle Preflight Requests explicitly
// We use "(.*)" because "*" causes the "Missing parameter name" crash in newer Express
app.options("(.*)", cors());

/* ================================
   ✅ 2. Body Parsers
================================ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================================
   ✅ 3. API Routes
================================ */
app.use("/auth", require("./routes/authRoutes"));
app.use("/email", require("./routes/emailRoutes"));
app.use("/summary", require("./routes/summaryRoutes"));
app.use("/tasks", require("./routes/taskRoutes"));
app.use("/applications", require("./routes/applicationRoutes"));
app.use("/documents", require("./routes/documentRoutes"));

/* ================================
   ✅ 4. Static Files & Health Check
================================ */
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Add this back so you don't get a 404 when testing the backend URL
app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

module.exports = app;