import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API client
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// We will use the standard gemini-1.5-flash for most tasks (fast, efficient, free tier eligible)
export const geminiModel = genAI.getGenerativeModel(
  { model: "gemini-flash-lite-latest" }
);

// Helper function to stream chat responses
export async function streamChatResponse(prompt: string, history: {role: "user" | "model", parts: {text: string}[]}[] = []) {
  const chat = geminiModel.startChat({
    history: history,
  });

  const result = await chat.sendMessageStream(prompt);
  return result;
}

// Helper to generate structured JSON data (e.g. for Career Test or Roadmap generation)
export async function generateStructuredData(prompt: string) {
  // gemini-1.5-flash supports JSON schema output, but for simplicity we ask for JSON in the prompt
  const result = await geminiModel.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt + "\n\nProvide the response ONLY in valid JSON format without markdown code blocks." }] }],
    generationConfig: {
      responseMimeType: "application/json",
    }
  });
  
  const text = result.response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse Gemini JSON output", e, text);
    throw new Error("Invalid response from AI");
  }
}
