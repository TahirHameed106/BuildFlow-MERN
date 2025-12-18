const express = require("express");
const router = express.Router();
const { createApplication, getApplications } = require("../controllers/applicationController");
const authMiddleware = require("../middlewares/authMiddleware");

// POST /applications - Create new application
router.post("/", authMiddleware, createApplication);

// GET /applications - Read all applications
router.get("/", authMiddleware, getApplications);

module.exports = router;