import { createClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { data: profile } = await supabase.from('profiles').select('id').eq('auth_user_id', user.id).single();
    if (!profile) return new NextResponse("Profile not found", { status: 404 });

    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get('type');

    let query = supabase
      .from('ai_conversations')
      .select('id, title, updated_at')
      .eq('user_id', profile.id)
      .eq('is_archived', false);

    if (type) {
      query = query.eq('context_type', type);
    }

    const { data: conversations, error } = await query.order('updated_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ conversations });
  } catch (error: any) {
    console.error("Fetch history error:", error);
    return new NextResponse(JSON.stringify({ error: error?.message || "Failed to fetch history" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
