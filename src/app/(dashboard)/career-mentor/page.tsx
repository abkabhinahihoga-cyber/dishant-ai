"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BrainCircuit, Send, User, Sparkles, Loader2, MessageSquare, Plus, Trash2, Menu, X, ArrowLeft, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { useLanguage } from "@/components/language-provider";
import { useTranslation } from "@/lib/i18n/use-translation";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  content: "नमस्ते! मैं आपका AI Career Mentor हूँ। मैं आपकी करियर चुनने में मदद कर सकता हूँ, इंटरव्यू की तैयारी करवा सकता हूँ, या किसी भी जॉब-related सवाल का जवाब दे सकता हूँ। आज आप क्या पूछना चाहते हैं?"
};

const SUGGESTIONS: Record<string, string[]> = {
  Hindi: [
    "मेरे लिए कौन सा करियर सही है?",
    "इंटरव्यू कैसे क्रैक करें?",
    "2025 में कौन से skills सीखें?",
    "अच्छा resume कैसे लिखें?",
    "AI jobs का scope क्या है?",
  ],
  English: [
    "What career suits me?",
    "How to crack interviews?",
    "Best skills to learn in 2025",
    "How to write a good resume?",
    "What is the scope of AI jobs?",
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
  const router = useRouter();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);

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
      setIsSidebarOpen(false); // Close sidebar automatically on mobile
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
    setIsSidebarOpen(false);
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
        fetchHistory(); // Refresh history with new title
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

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setHasScrolled(e.currentTarget.scrollTop > 10);
  };

  // Default to Hindi suggestions if language is not set to English/Hinglish
  const suggestions = SUGGESTIONS[language] || SUGGESTIONS["Hindi"];
  const showSuggestions = messages.length === 1;

  return (
    // FULL SCREEN OVERLAY: Covers Navbar (z-40) and BottomNav (z-50) completely
    <div className="fixed inset-0 z-[100] flex bg-background font-sans overflow-hidden">
      
      {/* ── Sidebar (History) ────────────────────────────────────── */}
      <aside className={`
        flex flex-col w-72 shrink-0 border-r border-border/40 bg-muted/20
        fixed md:relative inset-y-0 left-0 z-[110] transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="flex items-center gap-3 p-4 h-16 border-b border-border/40 shrink-0">
          <Link href="/dashboard" className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted/60 transition-colors">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </Link>
          <span className="font-heading font-semibold text-base truncate flex-1">Dishant AI</span>
          <Button variant="ghost" size="icon" className="md:hidden h-8 w-8" onClick={() => setIsSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-3 shrink-0">
          <Button onClick={startNewChat} className="w-full gap-2 justify-start h-10 bg-background shadow-sm hover:bg-muted border border-border/50 text-foreground" variant="outline">
            <Plus className="h-4 w-4" /> New Chat
          </Button>
        </div>
        
        <ScrollArea className="flex-1 px-3 pb-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground mb-3 mt-2 px-2">History</div>
            {conversations.map((conv) => (
              <div key={conv.id} onClick={() => loadConversation(conv.id)}
                className={`flex items-center justify-between group p-2.5 rounded-lg cursor-pointer transition-colors ${
                  activeConversationId === conv.id ? "bg-primary/10 text-primary" : "hover:bg-muted/80 text-foreground/80 hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
                  <div className="truncate min-w-0">
                    <p className="text-sm font-medium truncate">{conv.title}</p>
                    <p className="text-[11px] opacity-60 mt-0.5">{formatDistanceToNow(new Date(conv.updated_at), { addSuffix: true })}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={(e) => deleteConversation(e, conv.id)}
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive hover:bg-destructive/10 shrink-0 z-10 relative">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {conversations.length === 0 && (
              <div className="text-center p-6 text-sm text-muted-foreground mt-4">
                No chat history yet.
              </div>
            )}
          </div>
        </ScrollArea>
      </aside>

      {/* Mobile backdrop for sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[105] md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* ── Main Chat Window ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative bg-background">
        
        {/* Top Header */}
        <header className={`
          absolute top-0 inset-x-0 h-16 px-4 flex items-center justify-between z-10 transition-all duration-300
          ${hasScrolled ? "bg-background/80 backdrop-blur-md border-b border-border/40" : "bg-transparent"}
        `}>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="md:hidden h-10 w-10 text-muted-foreground hover:bg-muted/60" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            {/* Show model info */}
            <div className="flex items-center gap-2 group cursor-pointer hover:bg-muted/50 px-3 py-1.5 rounded-lg transition-colors">
              <span className="font-heading font-semibold text-lg text-foreground tracking-tight">Career <span className="text-primary">Mentor</span></span>
              <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
          </div>
          
          <Button variant="ghost" size="icon" className="h-10 w-10 hidden md:flex" onClick={startNewChat}>
            <Plus className="h-5 w-5 text-muted-foreground" />
          </Button>
        </header>

        {/* Scrollable Message Area */}
        <div className="flex-1 overflow-y-auto" onScroll={handleScroll}>
          <div className="max-w-3xl mx-auto px-4 md:px-6 pt-24 pb-32">
            
            {/* Empty State Welcome */}
            {messages.length === 1 && (
              <div className="flex flex-col items-center justify-center py-12 md:py-20 text-center animate-fade-in">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 shadow-xl shadow-primary/5">
                  <BrainCircuit className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4 tracking-tight">
                  आज आप क्या सीखना <br className="md:hidden"/> चाहते हैं?
                </h2>
                <p className="text-lg text-muted-foreground max-w-lg mb-10">
                  {messages[0].content}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                  {suggestions.slice(0, 4).map((s, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(s)}
                      className="text-left p-4 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/60 transition-colors text-base text-foreground/80 hover:text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message Thread (Restored Chat Bubbles) */}
            {messages.length > 1 && (
              <div className="space-y-6">
                {messages.map((message) => {
                  if (message.id === "welcome") return null; 
                  
                  return (
                    <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      {message.role === "assistant" && (
                        <Avatar className="h-9 w-9 border border-primary/20 shrink-0 mt-1 shadow-sm">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            <Sparkles className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={`rounded-2xl px-5 py-3.5 max-w-[85%] text-[1.05rem] whitespace-pre-wrap leading-relaxed shadow-sm font-sans ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-none shadow-primary/20"
                          : "bg-muted border border-border/50 rounded-tl-none text-foreground"
                      }`}>
                        {message.content}
                      </div>

                      {message.role === "user" && (
                        <Avatar className="h-9 w-9 border border-border shrink-0 mt-1 shadow-sm">
                          <AvatarFallback className="bg-muted text-muted-foreground">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="h-9 w-9 border border-primary/20 shrink-0 mt-1 shadow-sm">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <Sparkles className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="rounded-2xl px-5 py-3.5 bg-muted border border-border/50 rounded-tl-none flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-[1.05rem] text-muted-foreground">Career Mentor is typing...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-4" />
              </div>
            )}
          </div>
        </div>

        {/* ── Input Area ─────────────────────────────────────────── */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-background via-background/90 to-transparent pt-10 pb-6 md:pb-8 px-4 pointer-events-none">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative pointer-events-auto">
            <div className="relative shadow-2xl shadow-black/5 dark:shadow-none rounded-[1.5rem] bg-background border border-border/50">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="अपने करियर के बारे में कुछ भी पूछें..."
                className="w-full pl-6 pr-14 py-8 rounded-[1.5rem] border-none bg-muted/20 focus-visible:ring-primary focus-visible:bg-background text-base md:text-lg shadow-none"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!input.trim() || isLoading}
                className={`absolute right-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full transition-all ${
                  input.trim() ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25" : "bg-muted text-muted-foreground"
                }`}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-3 px-4 drop-shadow-md">
              AI can make mistakes. Consider verifying important information.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
