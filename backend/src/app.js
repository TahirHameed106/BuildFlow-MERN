const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

/* ================================
   ✅ 1. CORS CONFIGURATION
================================ */
app.use(
  cors({
    origin: "https://build-flow-mern.vercel.app", // Your Frontend
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// ✅ CRITICAL MISSING LINE: Handle Preflight Requests
// We use "(.*)" because "*" crashes Express 5
app.options("(.*)", cors());

/* ================================
   ✅ 2. MIDDLEWARE
================================ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================================
   ✅ 3. ROUTES
================================ */
app.use("/auth", require("./routes/authRoutes"));
app.use("/email", require("./routes/emailRoutes"));
app.use("/summary", require("./routes/summaryRoutes"));
app.use("/tasks", require("./routes/taskRoutes"));
app.use("/applications", require("./routes/applicationRoutes"));
app.use("/documents", require("./routes/documentRoutes"));

/* ================================
   ✅ 4. STATIC FILES & HEALTH CHECK
================================ */
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

module.exports = app;