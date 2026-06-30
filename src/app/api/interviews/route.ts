import { geminiModel } from "@/lib/ai/gemini";
import { Content } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response("Missing or invalid messages array", { status: 400 });
    }

    const history: any[] = [];

    for (const msg of messages) {
      if (msg.role === "system") {
        history.push({
          role: "user",
          parts: [{ text: `SYSTEM INSTRUCTION (Adopt this persona): ${msg.content}` }]
        });
        history.push({
          role: "model",
          parts: [{ text: "Understood. I will act as the hiring manager based on these instructions." }]
        });
      } else {
        history.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }]
        });
      }
    }

    const result = await geminiModel.generateContent({
      contents: history
    });

    const reply = result.response.text();

    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Interview API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to process interview" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
