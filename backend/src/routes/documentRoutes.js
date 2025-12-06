const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadDocument, getDocuments, deleteDocument } = require('../controllers/documentController');

// Configure Multer (File Upload)
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
// We use 'upload.single' to handle the file, then our controller handles the DB
router.post('/upload', upload.single('file'), uploadDocument);

// GET /api/documents?role=Engineer
router.get('/', getDocuments);

// DELETE /api/documents/:id
router.delete('/:id', deleteDocument);

module.exports = router;