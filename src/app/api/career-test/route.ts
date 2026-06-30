import { geminiModel } from "@/lib/ai/gemini";

export async function POST(req: Request) {
  try {
    const { answers, profile, language } = await req.json();

    if (!answers) {
      return new Response("Missing answers", { status: 400 });
    }

    const prompt = `You are an expert career psychologist and AI profiling engine.
Generate the response in this language/style: ${language || 'Hinglish'}.
Analyze the following test answers from a student:
${JSON.stringify(answers, null, 2)}

User Profile Context (if any):
${JSON.stringify(profile, null, 2)}

Based on this psychometric and skill data, generate a highly accurate career profile.
Output EXACTLY this JSON format (no markdown code blocks, just raw JSON):
{
  "personalityType": "e.g., The Architect (INTJ) or The Innovator",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "recommendedCareers": [
    {
      "title": "Job Title",
      "matchScore": 95,
      "reason": "Why this is a good fit",
      "nextSteps": ["Step 1", "Step 2"]
    }
  ]
}
Ensure there are exactly 3 recommended careers.`;

    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text();

    let jsonStr = responseText.trim();
    if (jsonStr.startsWith("```json")) jsonStr = jsonStr.substring(7);
    if (jsonStr.startsWith("```")) jsonStr = jsonStr.substring(3);
    if (jsonStr.endsWith("```")) jsonStr = jsonStr.substring(0, jsonStr.length - 3);

    const careerData = JSON.parse(jsonStr.trim());

    return new Response(JSON.stringify(careerData), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Career Test API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate profile" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
