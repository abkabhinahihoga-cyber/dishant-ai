import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { data: profile } = await supabase.from('profiles').select('id').eq('auth_user_id', user.id).single();
    if (!profile) return new NextResponse("Profile not found", { status: 404 });

    // Ensure user owns this conversation
    const { data: conv } = await supabase.from('ai_conversations')
      .select('id')
      .eq('id', id)
      .eq('user_id', profile.id)
      .single();
      
    if (!conv) {
      return new NextResponse("Conversation not found", { status: 404 });
    }

    const { data: messages, error } = await supabase
      .from('ai_messages')
      .select('id, role, content, created_at')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ messages });
  } catch (error: any) {
    console.error("Fetch messages error:", error);
    return new NextResponse(JSON.stringify({ error: error?.message || "Failed to fetch messages" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { data: profile } = await supabase.from('profiles').select('id').eq('auth_user_id', user.id).single();
    if (!profile) return new NextResponse("Profile not found", { status: 404 });

    // Delete conversation (RLS or explicit check)
    const { error } = await supabase
      .from('ai_conversations')
      .delete()
      .eq('id', id)
      .eq('user_id', profile.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete conversation error:", error);
    return new NextResponse(JSON.stringify({ error: error?.message || "Failed to delete conversation" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
