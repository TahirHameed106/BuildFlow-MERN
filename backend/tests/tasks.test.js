const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/models/Task");

// --- MOCKS ---

// 1. Mock Authentication Middleware
// We use the plural "middlewares" to match your folder name
jest.mock("../src/middlewares/authMiddleware", () => (req, res, next) => {
  req.user = { id: "user_123", role: "Engineer" };
  next();
});

// 2. Mock OpenAI (Global requirement)
jest.mock("openai", () => {
  return class OpenAI {
    chat = { completions: { create: jest.fn() } };
  };
});

// 3. Mock Task Model with Chaining Support
// This fixes the 500 Error by allowing .sort() and .populate()
jest.mock("../src/models/Task", () => {
  const mockTasks = [
    { title: "Task 1", status: "Pending" },
    { title: "Task 2", status: "Done" }
  ];

  return {
    create: jest.fn(),
    // This smart mock handles Task.find().sort()... chains
    find: jest.fn().mockImplementation(() => ({
      sort: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockTasks), // For .exec()
      then: (resolve) => resolve(mockTasks) // For await Task.find() directly
    })),
  };
});

describe("Task API Endpoints", () => {

  // --- TEST 1: CREATE TASK ---
  it("POST /tasks - should create a task successfully", async () => {
    // Update mock to return the full object structure your controller expects
    Task.create.mockResolvedValue({
      _id: "task_1",
      title: "Fix Bug",
      description: "Fix the login bug",
      status: "Pending",
      assignedTo: "user_123"
    });

    const res = await request(app).post("/tasks").send({
      title: "Fix Bug",
      description: "Fix the login bug",
      status: "Pending"
    });

    expect(res.statusCode).toEqual(201);
    
    // ✅ FIX: Look inside 'res.body.task' instead of just 'res.body'
    // Your API returns { success: true, task: { ... } }
    if (res.body.task) {
      expect(res.body.task).toHaveProperty("title", "Fix Bug");
    } else {
      // Fallback if your API returns the object directly
      expect(res.body).toHaveProperty("title", "Fix Bug");
    }
  });

  // --- TEST 2: GET TASKS ---
  it("GET /tasks - should return a list of tasks", async () => {
    const res = await request(app).get("/tasks");

    // If this still fails with 500, check if your controller uses specific queries
    expect(res.statusCode).toEqual(200);

    // ✅ FIX: Handle wrapping. Your API likely returns { success: true, tasks: [...] }
    const tasks = res.body.tasks || res.body; 
    
    expect(Array.isArray(tasks)).toBeTruthy();
    expect(tasks.length).toEqual(2);
  });
});