import { geminiModel } from "@/lib/ai/gemini";

export async function POST(req: Request) {
  try {
    const { fullName, email, phone, linkedin, education, skills, experience } = await req.json();

    if (!fullName || !skills || !experience) {
      return new Response("Missing required fields", { status: 400 });
    }

    const prompt = `You are an elite, world-class Tech Recruiter and Resume Writer.
A student has provided raw, unstructured, and casual information about their background.
Your job is to transform this into a highly professional, ATS-optimized, elite resume.

Raw Information Provided:
- Name: ${fullName}
- Email: ${email}
- Phone: ${phone}
- LinkedIn/GitHub: ${linkedin}
- Education: ${education}
- Skills: ${skills}
- Experience & Projects: ${experience}

Instructions:
1. Write a strong, 2-3 sentence Professional Summary.
2. Group their skills logically (e.g. Frontend, Backend, Tools).
3. Transform their raw experience/projects into structured entries. For every project/job, write 2-4 highly professional bullet points. 
4. **CRUCIAL**: Every bullet point MUST start with a strong Action Verb (e.g., Developed, Engineered, Orchestrated, Designed) and should imply impact or metrics where reasonable. DO NOT use weak phrases like "I made" or "Helped with".

Output EXACTLY this JSON format (no markdown code blocks, just raw JSON):
{
  "fullName": "${fullName}",
  "email": "${email}",
  "phone": "${phone}",
  "linkedin": "${linkedin}",
  "summary": "Professional summary here...",
  "education": [
    { "degree": "e.g. B.S. Computer Science", "school": "University Name", "year": "2020 - 2024" }
  ],
  "skills": ["Frontend: React, Next.js", "Backend: Node, Python", "Tools: Git, Docker"],
  "experience": [
    {
      "role": "Software Engineering Intern (or Project Creator)",
      "company": "Company Name (or Project Name)",
      "duration": "Summer 2023",
      "points": [
        "Architected a scalable web application using React...",
        "Optimized database queries resulting in..."
      ]
    }
  ]
}`;

    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text();

    let jsonStr = responseText.trim();
    if (jsonStr.startsWith("```json")) jsonStr = jsonStr.substring(7);
    if (jsonStr.startsWith("```")) jsonStr = jsonStr.substring(3);
    if (jsonStr.endsWith("```")) jsonStr = jsonStr.substring(0, jsonStr.length - 3);

    const generatedResume = JSON.parse(jsonStr.trim());

    return new Response(JSON.stringify(generatedResume), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Resume Build API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to build resume" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
