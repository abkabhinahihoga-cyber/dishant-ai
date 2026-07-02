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

export default function CareerMentorPage() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/chat/history');
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
    } catch {
      console.error("Failed to load history");
    }
  };

  const loadConversation = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/chat/history/${id}`);
      if (!res.ok) throw new Error("Failed to load conversation");
      const data = await res.json();
      const loadedMessages = data.messages.map((m: { id: string; role: string; content: string }) => ({
        id: m.id,
        role: m.role,
        content: m.content
      }));
      setActiveConversationId(id);
      setIsMobileSidebarOpen(false);
      setMessages(loadedMessages.length > 0 ? loadedMessages : [WELCOME_MESSAGE]);
    } catch {
      toast.error("Could not load conversation.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConversation = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/chat/history/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete");
      setConversations(prev => prev.filter(c => c.id !== id));
      if (activeConversationId === id) startNewChat();
      toast.success("Conversation deleted");
    } catch {
      toast.error("Could not delete conversation.");
    }
  };

  const startNewChat = () => {
    setActiveConversationId(null);
    setMessages([WELCOME_MESSAGE]);
    setIsMobileSidebarOpen(false);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].filter(m => m.id !== 'welcome').map(m => ({
            role: m.role === "assistant" ? "model" : "user",
            content: m.content
          })),
          conversationId: activeConversationId,
          language
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error((errData as { error?: string }).error || "Failed to fetch");
      }

      const newConvId = response.headers.get("X-Conversation-Id");
      if (newConvId && newConvId !== activeConversationId) {
        setActiveConversationId(newConvId);
        fetchHistory();
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      const assistantMsgId = (Date.now() + 1).toString();
      setMessages((prev) => [...prev, { id: assistantMsgId, role: "assistant", content: "" }]);

      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId ? { ...msg, content: msg.content + chunk } : msg
            )
          );
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to get response from AI Mentor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Breakout of layout's padding — fixed full viewport, with navbar height offset
    <div className="fixed inset-0 top-0 flex bg-background z-10">
      {/* Mobile sidebar backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* History Sidebar */}
      <aside className={`
        flex flex-col w-72 shrink-0 border-r border-border/50 bg-card/80 backdrop-blur-xl
        fixed md:static inset-y-0 left-0 z-50 transition-transform duration-300
        ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        {/* Sidebar header */}
        <div className="flex items-center gap-2 p-4 pt-16 md:pt-4 border-b border-border/50">
          <BrainCircuit className="h-5 w-5 text-primary shrink-0" />
          <span className="font-heading font-bold text-sm truncate">{t("cm.title")}</span>
          <Button
            variant="ghost" size="icon"
            className="ml-auto md:hidden h-8 w-8"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="p-3 border-b border-border/50">
          <Button onClick={startNewChat} className="w-full gap-2 justify-start" variant="outline" size="sm">
            <Plus className="h-4 w-4" /> {t("cm.new_chat")}
          </Button>
        </div>

        {/* Conversation History */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => loadConversation(conv.id)}
                className={`
                  flex items-center justify-between group p-3 rounded-xl cursor-pointer transition-all
                  ${activeConversationId === conv.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"}
                `}
              >
                <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
                  <MessageSquare className="h-4 w-4 shrink-0 opacity-60" />
                  <div className="truncate min-w-0">
                    <p className="text-sm font-medium truncate">{conv.title}</p>
                    <p className="text-[10px] opacity-60">
                      {formatDistanceToNow(new Date(conv.updated_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost" size="icon"
                  onClick={(e) => deleteConversation(e, conv.id)}
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
            {conversations.length === 0 && (
              <div className="text-center p-6 text-sm text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-30" />
                {t("cm.no_history")}
              </div>
            )}
          </div>
        </ScrollArea>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Chat Top Bar */}
        <div className="flex items-center gap-3 px-4 h-14 border-b border-border/50 bg-background/80 backdrop-blur-xl shrink-0">
          <Button
            variant="ghost" size="icon"
            className="md:hidden h-9 w-9 shrink-0"
            onClick={() => setIsMobileSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
              <BrainCircuit className="h-4 w-4 text-primary" />
            </div>
            <span className="font-heading font-semibold text-sm">{t("cm.title")}</span>
          </div>
          <div className="ml-auto">
            <Button onClick={startNewChat} variant="outline" size="sm" className="gap-1.5 h-8 text-xs hidden sm:flex">
              <Plus className="h-3.5 w-3.5" /> New Chat
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto" ref={scrollRef}>
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 border border-primary/20 shrink-0 mt-1">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <Sparkles className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`rounded-2xl px-4 py-3 max-w-[85%] text-sm whitespace-pre-wrap leading-relaxed shadow-sm ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-muted/60 border border-border/50 rounded-tl-none text-foreground"
                  }`}
                >
                  {message.content}
                </div>

                {message.role === "user" && (
                  <Avatar className="h-8 w-8 border border-border shrink-0 mt-1">
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8 border border-primary/20 shrink-0 mt-1">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <Sparkles className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-2xl px-4 py-3 bg-muted/60 border border-border/50 rounded-tl-none flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">{t("cm.thinking")}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Bar */}
        <div className="shrink-0 border-t border-border/50 bg-background/80 backdrop-blur-xl px-4 py-3 pb-safe">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("cm.placeholder")}
              className="pr-12 rounded-full border-border bg-muted/30 focus-visible:ring-primary"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="absolute right-1.5 h-9 w-9 rounded-full shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-center text-[10px] text-muted-foreground mt-2">
            {t("cm.disclaimer")}
          </p>
        </div>
      </div>
    </div>
  );
}
