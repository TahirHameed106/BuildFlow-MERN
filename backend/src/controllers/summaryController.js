// 1. Import the new OpenAI library
const OpenAI = require("openai");

// 2. Initialize it. It automatically finds your OPENAI_API_KEY from the .env file
const client = new OpenAI(); 

// 3. This is your new summarize function
exports.summarize = async (req, res) => {
  try {
    // Get the meeting notes from the Postman request
    const { text } = req.body;

    // 4. Call the OpenAI API using the new library
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // Use a fast and cheap model
      messages: [
        { 
          role: "system", 
          content: "You are a helpful assistant. Summarize the following meeting notes, focusing on key decisions and action items." 
        },
        { 
          role: "user", 
          content: text 
        }
      ]
    });

    // 5. Send the summary back to Postman
    const summary = response.choices[0].message.content;
    res.json({ summary: summary });

  } catch (err) {
    // 6. Handle errors
    console.error("Summary error:", err);
    res.status(500).json({ message: "Failed to summarize text" });
  }
};