const {GoogleGenAI} = require('@google/genai');

const ai = new GoogleGenAI({});


async function main(content) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: content
  });

  return response.text;
}

const generateResponse = async (content) => await main(content);

module.exports = { generateResponse }