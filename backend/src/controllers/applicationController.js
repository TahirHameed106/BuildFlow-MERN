const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const OpenAI = require("openai");

// Initialize the AI client (it reads the key from your .env)
const client = new OpenAI(); 

// This is our text-wrapping helper function
function drawWrappedText(page, text, { x, y, size, font, lineHeight, maxWidth, color }) {
  const paragraphs = text.split('\n');
  let currentY = y;
  for (const paragraph of paragraphs) {
    const words = paragraph.split(' ');
    let currentLine = '';
    for (const word of words) {
      const testLine = currentLine.length === 0 ? word : `${currentLine} ${word}`;
      const testWidth = font.widthOfTextAtSize(testLine, size);
      if (testWidth < maxWidth) {
        currentLine = testLine;
      } else {
        page.drawText(currentLine, { x, y: currentY, size, font, color });
        currentLine = word;
        currentY -= lineHeight;
      }
    }
    page.drawText(currentLine, { x, y: currentY, size, font, color });
    currentY -= (lineHeight * 1.5); // Add extra space for new paragraph
  }
  return currentY;
}

// --- NEW AI-POWERED PDF GENERATOR ---
exports.generateAiPdf = async (req, res) => {
  try {
    // 1. Get the prompt and letter type from the frontend
    const { prompt, letterType, userName } = req.body;

    // 2. Define different instructions for the AI
    let systemPrompt = "";
    if (letterType === "leave_request") {
      systemPrompt = `
        You are a professional employee writing a formal leave of absence request.
        Write a clean, polite, and detailed letter of at least 200 words.
        Base the letter on the user's prompt. Invent reasonable dates or project names if needed.
        Sign the letter with the user's name: ${userName}.
        The output must be ONLY the full body of the letter, starting with "Dear Sir/Madam," or a similar greeting.
      `;
    } else if (letterType === "client_update") {
      systemPrompt = `
        You are a professional project manager at a construction company.
        Write a formal, clear, and reassuring status update letter to a client (at least 200 words).
        Base the letter on the user's prompt. Be polite and professional.
        Invent project names, dates, and milestones as needed.
        Sign the letter with the user's name: ${userName}.
        The output must be ONLY the full body of the letter, starting with "Dear [Client Name],"
      `;
    } else {
      return res.status(400).json({ message: "Invalid letter type" });
    }

    // 3. Call OpenAI to write the letter
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt } // The user's specific request
      ]
    });

    const aiGeneratedText = response.choices[0].message.content;

    // 4. Create the PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    const margin = 50;

    // 5. Draw the AI's text onto the PDF using our wrapper
    drawWrappedText(page, aiGeneratedText, {
      x: margin,
      y: height - margin,
      size: fontSize,
      font: font,
      lineHeight: 18,
      maxWidth: width - (margin * 2),
      color: rgb(0, 0, 0),
    });

    // 6. Save and send the PDF
    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${letterType}.pdf`);
    res.send(Buffer.from(pdfBytes));

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create AI PDF" });
  }
};