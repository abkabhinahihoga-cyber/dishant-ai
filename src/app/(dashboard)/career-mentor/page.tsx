"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BrainCircuit, Send, User, Sparkles, Loader2, MessageSquare, Plus, Trash2, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { useLanguage } from "@/components/language-provider";
import { useTranslation } from "@/lib/i18n/use-translation";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  updated_at: string;
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: "Hello! I'm your AI Career Mentor. I'm here to help you navigate your career choices, prepare for interviews, or answer any questions about skills and jobs. What's on your mind today?"
};

// Language-specific suggestion chips
const SUGGESTIONS: Record<string, string[]> = {
  English: [
    "What career suits me?",
    "How to crack interviews?",
    "Best skills to learn in 2025",
    "How to write a good resume?",
    "What is the scope of AI jobs?",
  ],
  Hindi: [
    "मेरे लिए कौन सा करियर सही है?",
    "इंटरव्यू कैसे क्रैक करें?",
    "2025 में कौन से skills सीखें?",
    "अच्छा resume कैसे लिखें?",
    "AI jobs का scope क्या है?",
  ],
  Hinglish: [
    "Mere liye kaunsa career sahi hai?",
    "Interview kaise crack karein?",
    "2025 mein kaunsi skills seekhein?",
    "Acha resume kaise likhein?",
    "AI jobs ka scope kya hai?",
  ],
};

export default function CareerMentorPage() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/chat/history');
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
    } catch { console.error("Failed to load history"); }
  };

  const loadConversation = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/chat/history/${id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const loaded = data.messages.map((m: { id: string; role: string; content: string }) => ({
        id: m.id, role: m.role, content: m.content
      }));
      setActiveConversationId(id);
      setIsMobileSidebarOpen(false);
      setMessages(loaded.length > 0 ? loaded : [WELCOME_MESSAGE]);
    } catch { toast.error("Could not load conversation."); }
    finally { setIsLoading(false); }
  };

  const deleteConversation = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await fetch(`/api/chat/history/${id}`, { method: 'DELETE' });
      setConversations(prev => prev.filter(c => c.id !== id));
      if (activeConversationId === id) startNewChat();
      toast.success("Conversation deleted");
    } catch { toast.error("Could not delete conversation."); }
  };

  const startNewChat = () => {
    setActiveConversationId(null);
    setMessages([WELCOME_MESSAGE]);
    setIsMobileSidebarOpen(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].filter(m => m.id !== 'welcome').map(m => ({
            role: m.role === "assistant" ? "model" : "user", content: m.content
          })),
          conversationId: activeConversationId,
          language
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error || "Failed");
      }

      const newConvId = response.headers.get("X-Conversation-Id");
      if (newConvId && newConvId !== activeConversationId) {
        setActiveConversationId(newConvId);
        fetchHistory();
      }

      if (!response.body) throw new Error("No body");
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      const aId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: aId, role: "assistant", content: "" }]);

      let done = false;
      while (!done) {
        const { value, done: rd } = await reader.read();
        done = rd;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          setMessages(prev => prev.map(m => m.id === aId ? { ...m, content: m.content + chunk } : m));
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to get response.");
    } finally { setIsLoading(false); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const suggestions = SUGGESTIONS[language] || SUGGESTIONS["English"];
  const showSuggestions = messages.length === 1; // only show on fresh chat

  return (
    // fixed: starts at top-16 (below navbar h-16), full width/height
    <div className="fixed left-0 right-0 bottom-0 top-16 flex bg-background z-10">

      {/* Mobile backdrop */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsMobileSidebarOpen(false)} />
      )}

      {/* ── History Sidebar ────────────────────────────────────── */}
      <aside className={`
        flex flex-col w-72 shrink-0 border-r border-border/40 bg-card/80 backdrop-blur-xl
        fixed md:static inset-y-0 left-0 z-50 transition-transform duration-300
        top-16 md:top-auto
        ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="flex items-center gap-2 p-4 border-b border-border/40">
          <BrainCircuit className="h-4 w-4 text-primary shrink-0" />
          <span className="font-heading font-semibold text-sm truncate">{t("cm.title")}</span>
          <Button variant="ghost" size="icon" className="ml-auto md:hidden h-7 w-7" onClick={() => setIsMobileSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-3 border-b border-border/40">
          <Button onClick={startNewChat} className="w-full gap-2 justify-start" variant="outline" size="sm">
            <Plus className="h-4 w-4" /> {t("cm.new_chat")}
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-0.5">
            {conversations.map((conv) => (
              <div key={conv.id} onClick={() => loadConversation(conv.id)}
                className={`flex items-center justify-between group p-3 rounded-xl cursor-pointer transition-all ${
                  activeConversationId === conv.id ? "bg-primary/10 text-primary" : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
                  <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-60" />
                  <div className="truncate min-w-0">
                    <p className="text-xs font-medium truncate">{conv.title}</p>
                    <p className="text-[10px] opacity-50">{formatDistanceToNow(new Date(conv.updated_at), { addSuffix: true })}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={(e) => deleteConversation(e, conv.id)}
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive shrink-0">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {conversations.length === 0 && (
              <div className="text-center p-6 text-xs text-muted-foreground">
                <MessageSquare className="h-7 w-7 mx-auto mb-2 opacity-25" />
                {t("cm.no_history")}
              </div>
            )}
          </div>
        </ScrollArea>
      </aside>

      {/* ── Main Chat ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 h-12 border-b border-border/40 bg-background/80 backdrop-blur-xl shrink-0">
          <Button variant="ghost" size="icon" className="md:hidden h-8 w-8 shrink-0" onClick={() => setIsMobileSidebarOpen(true)}>
            <Menu className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
              <BrainCircuit className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="font-heading font-semibold text-sm">{t("cm.title")}</span>
          </div>
          <div className="ml-auto">
            <Button onClick={startNewChat} variant="ghost" size="sm" className="gap-1.5 h-7 text-xs text-muted-foreground hidden sm:flex">
              <Plus className="h-3.5 w-3.5" /> New Chat
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 border border-primary/20 shrink-0 mt-0.5">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <Sparkles className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className={`rounded-2xl px-4 py-2.5 max-w-[85%] text-sm whitespace-pre-wrap leading-relaxed shadow-sm ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-muted/60 border border-border/50 rounded-tl-none"
                }`}>
                  {message.content}
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8 border border-border shrink-0 mt-0.5">
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {/* Suggestion chips — shown only on fresh chat */}
            {showSuggestions && !isLoading && (
              <div className="flex flex-wrap gap-2 mt-2 pl-11">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s)}
                    className="text-xs px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 hover:bg-primary/15 text-primary transition-all hover:scale-[1.03] active:scale-95"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8 border border-primary/20 shrink-0 mt-0.5">
                  <AvatarFallback className="bg-primary/10 text-primary"><Sparkles className="h-4 w-4" /></AvatarFallback>
                </Avatar>
                <div className="rounded-2xl px-4 py-3 bg-muted/60 border border-border/50 rounded-tl-none flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">{t("cm.thinking")}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ── Input bar — padded above bottom nav on mobile ── */}
        <div className="shrink-0 border-t border-border/40 bg-background/90 backdrop-blur-xl px-4 pt-3 pb-20 md:pb-4">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative flex items-center">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("cm.placeholder")}
              className="pr-12 rounded-full border-border/60 bg-muted/30 focus-visible:ring-primary text-sm"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={!input.trim() || isLoading}
              className="absolute right-1.5 h-8 w-8 rounded-full shrink-0">
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
          <p className="text-center text-[10px] text-muted-foreground mt-1.5">{t("cm.disclaimer")}</p>
        </div>
      </div>
    </div>
  );
}
