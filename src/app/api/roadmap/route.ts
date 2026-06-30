import { geminiModel } from "@/lib/ai/gemini";

export async function POST(req: Request) {
  try {
    const { goal, currentSkills, durationMonths, language } = await req.json();

    if (!goal) {
      return new Response("Missing goal", { status: 400 });
    }

    const months = durationMonths || 6;

    const prompt = `You are an expert career counselor and education planner. 
Generate the response in this language/style: ${language || 'Hinglish'}.
A user wants a detailed, month-by-month roadmap to achieve their career goal.

User Goal: ${goal}
Current Skills/Experience: ${currentSkills || "Beginner"}
Duration: ${months} months

Generate a highly structured JSON roadmap. The JSON must exactly match this format:
{
  "title": "A catchy title for the roadmap (e.g. The Next.js Master Plan)",
  "description": "A short, encouraging 2-sentence overview of the journey.",
  "totalMonths": ${months},
  "months": [
    {
      "month": 1,
      "focus": "The primary focus or theme for this month",
      "milestones": ["Milestone 1", "Milestone 2", "Milestone 3"],
      "resources": ["Resource 1 (e.g. FreeCodeCamp HTML/CSS)", "Resource 2"]
    }
    // ... generate an entry for EVERY month from 1 to ${months}
  ]
}

Return ONLY valid JSON. Do not wrap it in markdown code blocks like \`\`\`json. Just output the raw JSON string.`;

    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text();

    // Clean up potential markdown formatting from Gemini
    let jsonStr = responseText.trim();
    if (jsonStr.startsWith("```json")) {
      jsonStr = jsonStr.substring(7);
    }
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.substring(3);
    }
    if (jsonStr.endsWith("```")) {
      jsonStr = jsonStr.substring(0, jsonStr.length - 3);
    }

    const roadmapData = JSON.parse(jsonStr.trim());

    return new Response(JSON.stringify(roadmapData), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Roadmap API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate roadmap" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
