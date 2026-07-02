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
4. Include Google Fonts 'Outfit' and 'Inter' (<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@500;700;800&display=swap" rel="stylesheet">).
5. Use a highly premium, state-of-the-art tech aesthetic. Use a dark mode theme (bg-slate-950 text-slate-200) with vibrant accents (e.g., text-indigo-400 or text-rose-500). Use 'font-family: Outfit' for headings and 'Inter' for body.
6. Layout Requirements:
   - A stunning Hero section with a gradient text heading for their name, their role, and a glowing CTA button linking to their social URL.
   - A Skills section using glassmorphism badge-like spans (bg-white/5 border border-white/10 backdrop-blur-md).
   - A Projects section using CSS Grid. Project cards should have hover effects (scale-up, border glow).
   - A simple Footer.
7. Add subtle CSS animations inside a <style> tag (e.g., a float animation or fade-in) and apply them to the hero section and cards.
8. Make it fully responsive (mobile-first).

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
