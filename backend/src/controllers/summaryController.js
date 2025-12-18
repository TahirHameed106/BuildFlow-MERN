const OpenAI = require("openai");

// Initialize OpenAI safely
// (In tests, this is replaced by the Mock)
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-testing", 
});

exports.summarize = async (req, res) => {
  try {
    const { tasks } = req.body;

    // ✅ VALIDATION: This forces the 400 error the test is looking for
    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ message: "No tasks provided" });
    }

    // 1. Prepare the prompt from the tasks array
    const prompt = `Summarize these tasks into a short plan:\n${tasks.join("\n")}`;

    // 2. Call OpenAI
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo", // or gpt-4o-mini
      messages: [
        { 
          role: "system", 
          content: "You are a helpful assistant. Summarize these tasks." 
        },
        { 
          role: "user", 
          content: prompt 
        }
      ]
    });

    // 3. Send the summary back
    const summary = response.choices[0].message.content;
    res.json({ summary });

  } catch (err) {
    console.error("Summary error:", err);
    res.status(500).json({ message: "Failed to summarize text" });
  }
};