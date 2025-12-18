const request = require("supertest");
const app = require("../src/app");

// Mock Mongoose
jest.mock("mongoose", () => {
  const mockModel = {
    create: jest.fn().mockResolvedValue({ _id: "123", status: "Applied" }),
    
    // ✅ FIX: Make find() return a "Promise-like" object
    // This allows 'await Application.find()' to return an array [] 
    // instead of the query object itself.
    find: jest.fn().mockImplementation(() => ({
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
      then: (resolve) => resolve([]) // <--- THIS LINE FIXES THE ERROR
    })),
  };

  return {
    connect: jest.fn(),
    model: jest.fn().mockReturnValue(mockModel),
    Schema: class { static get Types() { return { ObjectId: class { toString() { return "id"; } } }; } },
    Types: { ObjectId: class { toString() { return "id"; } } },
  };
});

// Mock Middlewares & OpenAI
jest.mock("../src/middlewares/authMiddleware", () => (req, res, next) => next());
jest.mock("openai", () => class { constructor() { this.chat = { completions: { create: jest.fn() } }; } });

describe("Applications API", () => {
  it("POST /applications - should create application", async () => {
    const res = await request(app).post("/applications").send({ jobId: "1", applicantName: "John" });
    expect(res.statusCode).toEqual(201);
  });

  it("GET /applications - should return list", async () => {
    const res = await request(app).get("/applications");
    expect(res.statusCode).toEqual(200);
    // This will now be TRUE because the mock returns []
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});