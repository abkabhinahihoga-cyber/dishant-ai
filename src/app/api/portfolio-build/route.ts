import { geminiModel } from "@/lib/ai/gemini";

export async function POST(req: Request) {
  try {
    const { fullName, role, bio, skills, projects, socialUrl } = await req.json();

    if (!fullName || !role) {
      return new Response("Missing required fields", { status: 400 });
    }

    const prompt = `You are an expert Frontend Developer and Web Designer.
Your task is to generate a complete, responsive, single-page HTML portfolio website for a student.

Student Data:
Name: ${fullName}
Role: ${role}
Bio: ${bio || "An aspiring software engineer passionate about building great products."}
Skills: ${skills || "HTML, CSS, JavaScript"}
Projects: ${projects || "Currently building my portfolio."}
Link: ${socialUrl || "#"}

Instructions for the HTML:
1. Output ONLY valid HTML code. Do NOT wrap it in markdown block like \`\`\`html.
2. The HTML must include the Tailwind CSS CDN (<script src="https://cdn.tailwindcss.com"></script>) in the <head>.
3. Add FontAwesome via CDN for icons (<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">).
4. Use a beautiful, modern, minimalist design. Use plenty of whitespace, a nice sans-serif font (like Inter from Google Fonts), and a clean color palette (e.g. slate-900 for text, slate-50 for background, and a primary color like indigo-600).
5. The layout must have:
   - A Hero section with their name, role, bio, and a button linking to their social URL.
   - A Skills section using nice badge-like spans.
   - A Projects section using CSS Grid (cards for each project).
   - A simple Footer.
6. Make it fully responsive (mobile-first).

Return ONLY the raw HTML string, starting with <!DOCTYPE html>.`;

    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text();

    let htmlCode = responseText.trim();
    if (htmlCode.startsWith("```html")) htmlCode = htmlCode.substring(7);
    if (htmlCode.startsWith("```")) htmlCode = htmlCode.substring(3);
    if (htmlCode.endsWith("```")) htmlCode = htmlCode.substring(0, htmlCode.length - 3);

    return new Response(JSON.stringify({ htmlCode: htmlCode.trim() }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Portfolio Build API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate portfolio" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
