const multer = require("multer");
const path = require("path");

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure this folder exists or create it manually in your project root
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

module.exports = upload;