const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require('fs');

// 1. Configure Multer to save files to the 'uploads' folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Tell multer where to save the files
  },
  filename: (req, file, cb) => {
    // Create a unique filename to prevent files from being overwritten
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// 2. Initialize Multer with this storage configuration
const upload = multer({ storage: storage });

// 3. Create the Upload Route
router.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file was uploaded." });
    }

    // If successful, send back the path to the newly uploaded file
    res.json({
      message: "File uploaded successfully",
      filePath: `/uploads/${req.file.filename}`,
    });
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({ message: "Error uploading file" });
  }
});

module.exports = router;
// --- NEW: ROUTE TO DELETE A FILE ---
// We expect a URL like: /files/delete/file-123.jpg
router.delete("/delete/:filename", (req, res) => {
  // 1. Get the filename from the URL
  const { filename } = req.params;

  // 2. Create the full path to the file
  // (Goes from src/routes -> src -> backend -> uploads)
  const filePath = path.join(__dirname, "../../uploads", filename); 

  // 3. Use 'fs.unlink' to delete the file
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      // This can happen if the file is already deleted or not found
      return res.status(500).json({ success: false, message: "Could not delete file." });
    }

    res.json({ success: true, message: "File deleted successfully." });
  });
});
