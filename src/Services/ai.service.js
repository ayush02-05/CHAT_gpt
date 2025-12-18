const { GoogleGenAI } = require("@google/genai");

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

async function generateResponse(content) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",

      contents: content,
    });

    return response.text;
  } catch (error) {
    console.error("Error occurred in ai services:", error.message || error);

    throw new Error(
      error.message ||
        "Failed to generate AI response due to an internal error."
    );
  }
}

async function generateVector(content) {
  if (typeof content !== "string") {
    console.error("Vector generation received non-string input:", content);
    throw new Error("Input for vector generation must be a string.");
  }
  try {
    const response = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: content,
      config: {
        outputDimensionality: 768,
      },
    });
    return response.embeddings[0].values;
  } catch (error) {
    console.error("Embedding error:", error);
    throw error;
  }
}

module.exports = { generateResponse, generateVector };
