const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");

// --- MOCKS ---
// 1. Mock OpenAI (so it doesn't crash)
jest.mock("openai", () => {
  return class OpenAI {
    chat = { completions: { create: jest.fn() } };
  };
});

// 2. Mock User Model (Database)
jest.mock("../src/models/User", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

// 3. Mock Bcrypt (Password security)
// We force it to say "True" (password matches) for testing
jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashed_password_123"),
  compare: jest.fn().mockResolvedValue(true), // Always say password is correct
}));

// 4. Mock JWT (Token generation)
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("fake_token_12345"),
}));

describe("Auth API Endpoints", () => {
  
  // --- TEST 1: REGISTER ---
  it("POST /auth/register - should register a user successfully", async () => {
    User.findOne.mockResolvedValue(null); // User doesn't exist
    User.create.mockResolvedValue({
      _id: "123",
      name: "Test User",
      email: "test@example.com",
      role: "Engineer"
    });

    const res = await request(app).post("/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      role: "Engineer"
    });

    expect(res.statusCode).toEqual(200);
  });

  // --- TEST 2: LOGIN (NEW) ---
  it("POST /auth/login - should login successfully", async () => {
    // Fake a user existing in the database
    User.findOne.mockResolvedValue({
      _id: "123",
      name: "Test User",
      email: "test@example.com",
      password: "hashed_password_123",
      role: "Engineer"
    });

    const res = await request(app).post("/auth/login").send({
      email: "test@example.com",
      password: "password123"
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token", "fake_token_12345");
  });

  // --- TEST 3: LOGIN FAIL ---
  it("POST /auth/login - should fail if user not found", async () => {
    User.findOne.mockResolvedValue(null); // Database returns nothing

    const res = await request(app).post("/auth/login").send({
      email: "wrong@email.com",
      password: "password123"
    });

    expect(res.statusCode).toEqual(401); // Unauthorized
  });
});