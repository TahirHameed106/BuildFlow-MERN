const request = require("supertest");
const express = require("express"); // Import Express directly
const { summarize } = require("../src/controllers/summaryController");

// 1. MOCK OPENAI
jest.mock("openai", () => {
  return class OpenAI {
    constructor() {
      this.chat = {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{ message: { content: "This is a valid AI summary." } }]
          }),
        },
      };
    }
  };
});

// 2. CREATE A MINI-APP FOR TESTING
// This isolates the test from the rest of your broken/heavy app.js
const app = express();
app.use(express.json());

// 3. Fake Auth Middleware (Just for this test)
const mockAuth = (req, res, next) => {
    req.user = { id: "user_123", role: "Manager" };
    next();
};

// 4. Mount the route manually
app.post("/summary", mockAuth, summarize);

describe("AI Summary API (Isolated)", () => {

  it("POST /summary - should return an AI summary (Status 200)", async () => {
    const res = await request(app).post("/summary").send({
      tasks: ["Task 1", "Task 2"]
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("summary");
    expect(res.body.summary).toEqual("This is a valid AI summary.");
  });

  it("POST /summary - should fail if tasks are empty (Status 400)", async () => {
    const res = await request(app).post("/summary").send({
      tasks: [] 
    });

    expect(res.statusCode).toEqual(400);
  });
});