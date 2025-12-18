const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// ✅ ADDED: generateAiPdf to the import list
const { uploadDocument, getDocuments, deleteDocument, generateAiPdf } = require('../controllers/documentController');

// Configure Multer (YOUR EXISTING CODE)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// --- ROUTES ---

// POST /api/documents/upload
router.post('/upload', upload.single('file'), uploadDocument);

// GET /api/documents?role=Engineer
router.get('/', getDocuments);

// DELETE /api/documents/:id
router.delete('/:id', deleteDocument);

// ✅ NEW ROUTE: Generate AI PDF
router.post('/generate-ai-pdf', generateAiPdf);

module.exports = router;