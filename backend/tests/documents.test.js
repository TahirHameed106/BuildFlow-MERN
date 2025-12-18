const { generateAiPdf } = require("../src/controllers/documentController");

// ✅ 1. MOCK PDF-LIB
// We fake the PDF engine so we don't need to generate real binary files in tests
jest.mock("pdf-lib", () => ({
  PDFDocument: {
    create: jest.fn().mockResolvedValue({
      addPage: jest.fn().mockReturnValue({
        getSize: jest.fn().mockReturnValue({ width: 600, height: 800 }),
        drawText: jest.fn(),
      }),
      embedFont: jest.fn().mockResolvedValue({
        widthOfTextAtSize: jest.fn().mockReturnValue(10),
      }),
      save: jest.fn().mockResolvedValue(new Uint8Array([10, 20, 30])), // Fake PDF bytes
    }),
  },
  StandardFonts: { Helvetica: "Helvetica" },
  rgb: jest.fn(),
}));

// ✅ 2. MOCK OPENAI
jest.mock("openai", () => {
  return class OpenAI {
    constructor() {
      this.chat = {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{ message: { content: "This is a fake AI generated letter." } }]
          }),
        },
      };
    }
  };
});

// ✅ 3. MOCK DOCUMENT MODEL (So upload/delete don't crash)
jest.mock("../src/models/Document", () => ({
  create: jest.fn(),
  find: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

describe("Document Controller", () => {

  // Helper to mock Express Request/Response
  const mockRequest = (body) => ({ body });
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.setHeader = jest.fn(); 
    res.send = jest.fn();      
    return res;
  };

  it("should generate a PDF for a valid leave request", async () => {
    const req = mockRequest({
      prompt: "I am sick",
      letterType: "leave_request",
      userName: "John Doe"
    });
    const res = mockResponse();

    await generateAiPdf(req, res);

    // Verify it tried to send a file
    expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "application/pdf");
    expect(res.send).toHaveBeenCalledWith(expect.any(Buffer)); // Checks if a Buffer (file) was sent
  });

  it("should return 400 for invalid letter type", async () => {
    const req = mockRequest({
      prompt: "Test",
      letterType: "invalid_type", 
      userName: "John"
    });
    const res = mockResponse();

    await generateAiPdf(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

});