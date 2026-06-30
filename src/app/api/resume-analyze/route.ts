import { geminiModel } from "@/lib/ai/gemini";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const { data: profile } = await supabase
      .from("profiles")
      .select("resume_url")
      .eq("auth_user_id", user.id)
      .single();

    if (!profile || !profile.resume_url) {
      return new Response(JSON.stringify({ error: "No resume found. Please upload a resume first." }), { 
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Download the file from private Supabase storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("resumes")
      .download(profile.resume_url);

    if (downloadError || !fileData) {
      throw new Error("Failed to download resume file from storage.");
    }

    // Convert Blob to base64 for Gemini inline data
    const arrayBuffer = await fileData.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    // Use Gemini's native multimodal capability to read the PDF directly
    const result = await geminiModel.generateContent([
      {
        inlineData: {
          mimeType: "application/pdf",
          data: base64Data,
        },
      },
      {
        text: `You are an elite Tech Recruiter and AI Resume Screener.
Analyze the resume PDF provided above.

Generate a structured critique of this resume. Output EXACTLY this JSON format (no markdown code blocks, just raw JSON):
{
  "score": 85,
  "summary": "A 2-sentence overall impression of the resume.",
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "actionableTips": ["Tip 1", "Tip 2", "Tip 3"]
}`
      },
    ]);

    const responseText = result.response.text();

    let jsonStr = responseText.trim();
    if (jsonStr.startsWith("\`\`\`json")) jsonStr = jsonStr.substring(7);
    if (jsonStr.startsWith("\`\`\`")) jsonStr = jsonStr.substring(3);
    if (jsonStr.endsWith("\`\`\`")) jsonStr = jsonStr.substring(0, jsonStr.length - 3);

    const analysisData = JSON.parse(jsonStr.trim());

    return new Response(JSON.stringify(analysisData), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Resume Analysis Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to analyze resume" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
