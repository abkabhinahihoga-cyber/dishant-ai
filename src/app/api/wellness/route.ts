import { geminiModel } from "@/lib/ai/gemini";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { messages, conversationId } = await req.json();

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
        title: 'Wellness Chat',
        context_type: 'general',
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

    // Wellness-specific system prompt
    let prompt = lastMessage;
    if (history.length === 0) {
      prompt = `You are Dishant AI Wellness Guide, a compassionate and empathetic mental wellness companion for students. Help them manage academic stress, exam anxiety, burnout, and emotional challenges. Use calming language, suggest breathing exercises, mindfulness techniques, and healthy coping strategies. You are NOT a medical professional - always recommend professional help for serious concerns. Be warm, understanding, and supportive. Format responses with markdown.\n\nUser: ${lastMessage}`;
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

          // Award XP (+15 per wellness chat interaction)
          try {
            await supabase.rpc('award_xp', {
              p_user_id: profile.id,
              p_amount: 15,
              p_reason: 'wellness_chat'
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
    console.error("Wellness Chat API Error:", error);
    return new Response(JSON.stringify({ error: error?.message || "Failed to process wellness chat" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
