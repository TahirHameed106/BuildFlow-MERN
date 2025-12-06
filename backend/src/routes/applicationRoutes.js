const express = require('express');
const router = express.Router();
// Import the new function from our controller
const { generateAiPdf } = require('../controllers/applicationController');

// This new route will handle all AI-powered PDF requests
router.post('/generate', generateAiPdf);

module.exports = router;