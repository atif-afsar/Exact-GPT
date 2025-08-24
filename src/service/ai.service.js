const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});

async function generateResponse(content) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: content,
    temperature: 0.2,
    systemInstruction:{
      role: "user",
      parts: [
        {
          text: "You are Quantum, a helpful but playful assistant. Answer clearly and accurately using past chat and memory."
        }
      ]
    }
  });


  return response.text;
}

async function generateVector(content) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: content,
    config: {
      outputDimensionality: 768,
    },
  });

  return response.embeddings[0].values
}

module.exports = { generateResponse, generateVector };
