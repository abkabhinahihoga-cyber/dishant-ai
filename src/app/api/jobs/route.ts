import { geminiModel } from "@/lib/ai/gemini";

export async function POST(req: Request) {
  try {
    const { jobs } = await req.json();

    if (!jobs || !Array.isArray(jobs)) {
      return new Response("Missing jobs array", { status: 400 });
    }

    // In a real app, we would fetch the user's actual profile, resume text, and career test results here.
    // For MVP, we will use a mock profile representing an entry-level frontend developer.
    const mockUserProfile = `
      Name: Student
      Education: B.S. Computer Science (Graduating 2024)
      Skills: React, Next.js, HTML, CSS, JavaScript, Tailwind, Git
      Experience: Built a responsive e-commerce web app for a local bakery using React and Firebase.
      Career Goal: Junior Frontend Developer or UX Engineer.
    `;

    const prompt = `You are an AI Recruitment Matchmaker.
I am going to provide you with a User Profile and a list of Job Postings.
For each job, calculate a "Match Score" from 0 to 100 based on how well the user's skills and experience align with the job requirements.
Also, write a 2-3 sentence "Match Reason" explaining why this score was given, highlighting strengths or missing skills.

User Profile:
${mockUserProfile}

Jobs:
${JSON.stringify(jobs, null, 2)}

Generate a JSON array of the evaluated jobs. Output EXACTLY this JSON format (no markdown):
[
  {
    "id": "1",
    "title": "Job Title",
    "company": "Company Name",
    "location": "Location",
    "type": "Type",
    "description": "Original Description",
    "matchScore": 85,
    "matchReason": "This is a great fit because..."
  }
]
`;

    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text();

    let jsonStr = responseText.trim();
    if (jsonStr.startsWith("```json")) jsonStr = jsonStr.substring(7);
    if (jsonStr.startsWith("```")) jsonStr = jsonStr.substring(3);
    if (jsonStr.endsWith("```")) jsonStr = jsonStr.substring(0, jsonStr.length - 3);

    const evaluatedJobs = JSON.parse(jsonStr.trim());

    return new Response(JSON.stringify(evaluatedJobs), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Job Matcher API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to analyze jobs" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
