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
    console.error("AI Error : ", error);
  }
}

module.exports = {
  generateResponse,
};
