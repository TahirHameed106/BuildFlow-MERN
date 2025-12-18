const Document = require('../models/Document');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const OpenAI = require("openai");

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "dummy" });

// Helper to wrap text
function drawWrappedText(page, text, { x, y, size, font, lineHeight, maxWidth, color }) {
  const paragraphs = text.split('\n');
  let currentY = y;
  for (const p of paragraphs) {
    const words = p.split(' ');
    let line = '';
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (font.widthOfTextAtSize(test, size) < maxWidth) line = test;
      else { page.drawText(line, { x, y: currentY, size, font, color }); line = w; currentY -= lineHeight; }
    }
    page.drawText(line, { x, y: currentY, size, font, color });
    currentY -= lineHeight * 1.5;
  }
}

// 1. Upload
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file" });
    const newDoc = await Document.create({
      fileName: req.file.originalname,
      filePath: `/uploads/${req.file.filename}`,
      uploadedBy: req.body.userName,
      role: req.body.role
    });
    res.status(201).json({ success: true, document: newDoc });
  } catch (e) { res.status(500).json({ message: "Error" }); }
};

// 2. Get
exports.getDocuments = async (req, res) => {
  try {
    const query = req.query.role !== 'Manager' ? { role: req.query.role } : {};
    const docs = await Document.find(query).sort({ createdAt: -1 });
    res.json({ success: true, documents: docs });
  } catch (e) { res.status(500).json({ message: "Error" }); }
};

// 3. Delete
exports.deleteDocument = async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ message: "Error" }); }
};

// 4. AI PDF Generator (The code you provided)
exports.generateAiPdf = async (req, res) => {
  try {
    const { prompt, letterType, userName } = req.body;
    let sysPrompt = letterType === "leave_request" 
      ? `Write a formal leave request for ${userName}.` 
      : `Write a client update letter from ${userName}.`;

    if (letterType !== "leave_request" && letterType !== "client_update") {
      return res.status(400).json({ message: "Invalid letter type" });
    }

    const aiRes = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: sysPrompt }, { role: "user", content: prompt }]
    });

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    drawWrappedText(page, aiRes.choices[0].message.content, {
      x: 50, y: page.getSize().height - 50, size: 12, font, lineHeight: 18, maxWidth: 500, color: rgb(0,0,0)
    });

    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (e) { res.status(500).json({ message: "Error" }); }
};