import { geminiModel } from "@/lib/ai/gemini";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { messages, conversationId, language } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response("Missing messages", { status: 400 });
    }

    const supabase = await createClient();
    
    // get user ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // get profile id
    const { data: profile } = await supabase.from('profiles').select('id').eq('auth_user_id', user.id).single();
    if (!profile) return new Response("Profile not found", { status: 404 });

    let activeConversationId = conversationId;

    // if no activeConversationId, create one
    if (!activeConversationId) {
      const { data: newConv, error } = await supabase.from('ai_conversations').insert({
        user_id: profile.id,
        title: 'Career Chat',
        context_type: 'career_mentor',
        model_used: 'gemini-flash-lite-latest'
      }).select().single();
      
      if (newConv) {
        activeConversationId = newConv.id;
      }
    }

    // Save the user message to DB
    const lastUserMessage = messages[messages.length - 1];
    const isFirstMessage = messages.filter((m: any) => m.role === 'user').length <= 1;
    if (activeConversationId) {
      await supabase.from('ai_messages').insert({
        conversation_id: activeConversationId,
        role: 'user',
        content: lastUserMessage.content
      });

      // Auto-title conversation from first message
      if (isFirstMessage) {
        const title = lastUserMessage.content.slice(0, 60) + (lastUserMessage.content.length > 60 ? '...' : '');
        await supabase.from('ai_conversations').update({ title }).eq('id', activeConversationId);
      }
    }

    // Convert OpenAI-style messages to Gemini format
    let history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));
    
    // Gemini API requires the history to start with a 'user' message, not 'model'.
    while (history.length > 0 && history[0].role === "model") {
      history.shift();
    }
    
    const lastMessage = lastUserMessage.content;

    // Provide systemic instructions by injecting it into the first prompt if history is empty
    let prompt = lastMessage;
    if (history.length === 0) {
      prompt = `You are Dishant AI, a highly empathetic and expert Career Mentor for students. Guide them from confusion to clarity. Be encouraging, professional, and practical. Keep your answers well-formatted with markdown.\nGenerate the response in this language/style: ${language || 'Hinglish'}.\n\nUser: ${lastMessage}`;
    }

    const chat = geminiModel.startChat({
      history,
    });

    const result = await chat.sendMessageStream(prompt);

    // Create a ReadableStream to stream the response
    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = "";
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            fullResponse += chunkText;
            controller.enqueue(new TextEncoder().encode(chunkText));
          }
        } finally {
          controller.close();
          
          // Save the assistant response asynchronously AFTER stream completes
          if (activeConversationId) {
            await supabase.from('ai_messages').insert({
              conversation_id: activeConversationId,
              role: 'assistant',
              content: fullResponse
            });
          }

          // Award XP (+10 per chat interaction)
          try {
            await supabase.rpc('award_xp', {
              p_user_id: profile.id,
              p_amount: 10,
              p_reason: 'career_mentor_chat'
            });
          } catch (xpErr) {
            console.error('XP award failed (non-blocking):', xpErr);
          }
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Conversation-Id": activeConversationId || ""
      },
    });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: error?.message || "Failed to process chat" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

