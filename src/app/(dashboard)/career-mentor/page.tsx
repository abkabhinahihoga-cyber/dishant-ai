"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
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

  // Load history on mount
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
    } catch (error) {
      console.error("Failed to load history", error);
    }
  };

  const loadConversation = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/chat/history/${id}`);
      if (!res.ok) throw new Error("Failed to load conversation");
      const data = await res.json();
      
      const loadedMessages = data.messages.map((m: any) => ({
        id: m.id,
        role: m.role,
        content: m.content
      }));

      setActiveConversationId(id);
      setIsMobileSidebarOpen(false);
      setMessages(loadedMessages.length > 0 ? loadedMessages : [WELCOME_MESSAGE]);
    } catch (error) {
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
      if (activeConversationId === id) {
        startNewChat();
      }
      toast.success("Conversation deleted");
    } catch (error) {
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
          messages: [...messages, userMsg].filter(m => m.id !== 'welcome').map(m => ({ role: m.role === "assistant" ? "model" : "user", content: m.content })),
          conversationId: activeConversationId,
          language
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to fetch");
      }
      
      // Update active conversation ID if a new one was created
      const newConvId = response.headers.get("X-Conversation-Id");
      if (newConvId && newConvId !== activeConversationId) {
        setActiveConversationId(newConvId);
        fetchHistory(); // refresh history list to show the new chat
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
    <div className="flex h-[calc(100vh-6rem)] gap-6 animate-fade-in relative">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* History Sidebar */}
      <Card className={`w-72 flex-shrink-0 flex flex-col glass-card border-none shadow-xl overflow-hidden absolute md:relative z-50 h-full transition-transform duration-300 md:translate-x-0 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-[150%] md:flex md:translate-x-0'}`}>
        <div className="p-4 border-b bg-background/50 backdrop-blur-sm flex justify-between items-center">
          <Button onClick={startNewChat} className="flex-1 flex items-center gap-2" variant="default">
            <Plus className="h-4 w-4" />
            {t("cm.new_chat")}
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden ml-2" onClick={() => setIsMobileSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => loadConversation(conv.id)}
                className={`flex items-center justify-between group p-3 rounded-lg cursor-pointer transition-colors ${
                  activeConversationId === conv.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50 text-muted-foreground'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <div className="truncate">
                    <p className="text-sm font-medium truncate">{conv.title}</p>
                    <p className="text-[10px] opacity-70">
                      {formatDistanceToNow(new Date(conv.updated_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => deleteConversation(e, conv.id)}
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {conversations.length === 0 && (
              <div className="text-center p-4 text-sm text-muted-foreground">
                {t("cm.no_history")}
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        <div className="mb-4 flex items-center gap-3">
          <Button variant="outline" size="icon" className="md:hidden shrink-0" onClick={() => setIsMobileSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
              <BrainCircuit className="h-8 w-8 text-primary hidden sm:block" />
              {t("cm.title")}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">{t("cm.subtitle")}</p>
          </div>
        </div>

        <Card className="flex-1 flex flex-col glass-card border-none shadow-xl overflow-hidden relative min-h-0">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <BrainCircuit className="h-48 w-48 text-primary" />
          </div>
          
          <ScrollArea className="flex-1 min-h-0 p-4" ref={scrollRef}>
            <div className="space-y-6 max-w-4xl mx-auto pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-10 w-10 border border-primary/20 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <Sparkles className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`rounded-2xl px-5 py-3 max-w-[80%] whitespace-pre-wrap text-sm shadow-sm ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-muted/50 border border-border/50 rounded-tl-none text-foreground"
                    }`}
                  >
                    {message.content}
                  </div>

                  {message.role === "user" && (
                    <Avatar className="h-10 w-10 border border-primary/20 shrink-0">
                      <AvatarFallback className="bg-muted text-muted-foreground">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4 justify-start">
                  <Avatar className="h-10 w-10 border border-primary/20 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <Sparkles className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-2xl px-5 py-4 max-w-[80%] bg-muted/50 border border-border/50 rounded-tl-none flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">{t("cm.thinking")}</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t bg-background/50 backdrop-blur-sm z-10">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative flex items-center">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("cm.placeholder")}
                className="pr-12 py-6 rounded-full glass-card border-primary/20 focus-visible:ring-primary shadow-inner"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!input.trim() || isLoading}
                className="absolute right-1.5 h-9 w-9 rounded-full"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <div className="text-center mt-2">
              <span className="text-[10px] text-muted-foreground">{t("cm.disclaimer")}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
