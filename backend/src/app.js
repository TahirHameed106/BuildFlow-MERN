const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

/* ================================
   ✅ CORS (Express 5 SAFE)
================================ */
app.use(
  cors({
    origin: "https://build-flow-mern.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

/* ================================
   Body parsers
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
   Static uploads
================================ */
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

module.exports = app;
