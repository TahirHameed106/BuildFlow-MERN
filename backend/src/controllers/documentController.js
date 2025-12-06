const Document = require('../models/Document');

// 1. Upload a Document
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { userName, role } = req.body; // We get this from the frontend
    const filePath = `/uploads/${req.file.filename}`;

    // Save metadata to MongoDB
    const newDoc = await Document.create({
      fileName: req.file.originalname,
      filePath: filePath,
      uploadedBy: userName,
      role: role
    });

    res.status(201).json({ success: true, document: newDoc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// 2. Get Documents (Filtered by Role)
exports.getDocuments = async (req, res) => {
  try {
    const { role } = req.query; // We get the role from the URL query

    let query = {};
    
    // Logic: Managers see ALL. Others see only their OWN role's files.
    if (role !== 'Manager') {
      query = { role: role };
    }

    const documents = await Document.find(query).sort({ createdAt: -1 });
    res.json({ success: true, documents });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// 3. Delete Document
exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    await Document.findByIdAndDelete(id);
    // Note: In a real app, you'd also use fs.unlink to delete the file from the folder
    res.json({ success: true, message: "Document deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};