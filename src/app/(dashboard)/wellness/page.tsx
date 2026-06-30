"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, Leaf, Sun, Send, User, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const MOTIVATIONAL_QUOTES = [
  { text: "You are stronger than you think, braver than you believe.", icon: Sun },
  { text: "It's okay to take a break. Rest is productive too.", icon: Leaf },
  { text: "Every storm runs out of rain. Keep going.", icon: Heart },
  { text: "Your mental health is a priority. Your happiness is essential.", icon: Sun },
  { text: "Breathe. You are exactly where you need to be.", icon: Leaf },
  { text: "Small steps every day lead to big changes.", icon: Heart },
  { text: "Be gentle with yourself. You're doing the best you can.", icon: Sun },
  { text: "This feeling is temporary. Better days are ahead.", icon: Leaf },
];

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi there 💚 I'm your Wellness Guide. I'm here to help you navigate stress, anxiety, and emotional challenges. Whether you need someone to talk to, a breathing exercise, or coping strategies — I'm here for you. How are you feeling today?",
};

export default function WellnessPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Breathing exercise state
  const [breathPhase, setBreathPhase] = useState<"in" | "hold" | "out">("in");
  const [isBreathing, setIsBreathing] = useState(false);

  // Quote rotation
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Breathing cycle
  useEffect(() => {
    if (!isBreathing) return;

    const phases: Array<{ phase: "in" | "hold" | "out"; duration: number }> = [
      { phase: "in", duration: 4000 },
      { phase: "hold", duration: 4000 },
      { phase: "out", duration: 4000 },
    ];

    let phaseIdx = 0;
    setBreathPhase(phases[0].phase);

    const advance = () => {
      phaseIdx = (phaseIdx + 1) % phases.length;
      setBreathPhase(phases[phaseIdx].phase);
    };

    // Start the cycling
    let timeout: NodeJS.Timeout;
    const cycle = () => {
      timeout = setTimeout(() => {
        advance();
        cycle();
      }, phases[phaseIdx].duration);
    };
    cycle();

    return () => clearTimeout(timeout);
  }, [isBreathing]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/wellness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg]
            .filter((m) => m.id !== "welcome")
            .map((m) => ({
              role: m.role === "assistant" ? "model" : "user",
              content: m.content,
            })),
          conversationId,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to fetch");
      }

      const newConvId = response.headers.get("X-Conversation-Id");
      if (newConvId && newConvId !== conversationId) {
        setConversationId(newConvId);
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      const assistantMsgId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        { id: assistantMsgId, role: "assistant", content: "" },
      ]);

      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? { ...msg, content: msg.content + chunk }
                : msg
            )
          );
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to get response from Wellness Guide."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex];
  const QuoteIcon = currentQuote.icon;

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-fade-in gap-4">
      {/* Top Section: Breathing Exercise + Quote */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-shrink-0">
        {/* Breathing Exercise Card */}
        <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-6">
          <div className="absolute top-2 right-2 opacity-10 pointer-events-none">
            <Leaf className="h-24 w-24 text-emerald-500" />
          </div>
          <div className="flex flex-col items-center gap-3">
            <h3 className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 tracking-wide uppercase">
              Breathing Exercise
            </h3>
            <div className="relative flex items-center justify-center">
              <div
                className={`rounded-full transition-all duration-[4000ms] ease-in-out flex items-center justify-center ${
                  isBreathing
                    ? breathPhase === "in"
                      ? "h-28 w-28 bg-emerald-400/30 shadow-[0_0_40px_rgba(52,211,153,0.3)]"
                      : breathPhase === "hold"
                      ? "h-28 w-28 bg-emerald-500/30 shadow-[0_0_50px_rgba(52,211,153,0.4)]"
                      : "h-16 w-16 bg-emerald-300/20 shadow-[0_0_20px_rgba(52,211,153,0.15)]"
                    : "h-20 w-20 bg-emerald-200/30"
                }`}
              >
                <div
                  className={`rounded-full transition-all duration-[4000ms] ease-in-out flex items-center justify-center ${
                    isBreathing
                      ? breathPhase === "in"
                        ? "h-16 w-16 bg-emerald-400/50"
                        : breathPhase === "hold"
                        ? "h-16 w-16 bg-emerald-500/50"
                        : "h-8 w-8 bg-emerald-300/40"
                      : "h-12 w-12 bg-emerald-300/30"
                  }`}
                >
                  <Leaf
                    className={`transition-all duration-[4000ms] ${
                      isBreathing
                        ? breathPhase === "out"
                          ? "h-4 w-4"
                          : "h-6 w-6"
                        : "h-5 w-5"
                    } text-emerald-600 dark:text-emerald-400`}
                  />
                </div>
              </div>
            </div>
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 h-5">
              {isBreathing
                ? breathPhase === "in"
                  ? "Breathe In..."
                  : breathPhase === "hold"
                  ? "Hold..."
                  : "Breathe Out..."
                : "Press Start to begin"}
            </p>
            <Button
              variant={isBreathing ? "outline" : "default"}
              size="sm"
              onClick={() => setIsBreathing(!isBreathing)}
              className={
                isBreathing
                  ? "border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-300"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }
            >
              {isBreathing ? "Stop" : "Start Breathing"}
            </Button>
          </div>
        </Card>

        {/* Motivational Quote Card */}
        <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 p-6 flex flex-col items-center justify-center">
          <div className="absolute top-2 right-2 opacity-10 pointer-events-none">
            <Sun className="h-24 w-24 text-purple-500" />
          </div>
          <h3 className="text-sm font-semibold text-purple-700 dark:text-purple-300 tracking-wide uppercase mb-4">
            Daily Affirmation
          </h3>
          <div className="flex items-center gap-3 transition-all duration-500">
            <QuoteIcon className="h-8 w-8 text-purple-500 dark:text-purple-400 shrink-0" />
            <p className="text-base md:text-lg font-medium text-purple-800 dark:text-purple-200 italic leading-relaxed">
              &ldquo;{currentQuote.text}&rdquo;
            </p>
          </div>
          <div className="flex gap-1.5 mt-4">
            {MOTIVATIONAL_QUOTES.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === quoteIndex
                    ? "w-6 bg-purple-500"
                    : "w-1.5 bg-purple-300/50"
                }`}
              />
            ))}
          </div>
        </Card>
      </div>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col border-none shadow-xl overflow-hidden relative min-h-0 bg-gradient-to-b from-white to-emerald-50/30 dark:from-background dark:to-emerald-950/10">
        <div className="absolute top-0 right-0 p-4 opacity-[0.05] pointer-events-none">
          <Heart className="h-48 w-48 text-emerald-500" />
        </div>

        {/* Chat Header */}
        <div className="p-4 border-b bg-gradient-to-r from-emerald-500/10 to-purple-500/10 backdrop-blur-sm flex items-center gap-3">
          <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-full">
            <Heart className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg">Wellness Guide</h2>
            <p className="text-xs text-muted-foreground">
              Your safe space to talk, breathe, and feel better
            </p>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 min-h-0 p-4" ref={scrollRef}>
          <div className="space-y-6 max-w-4xl mx-auto pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-10 w-10 border border-emerald-200 dark:border-emerald-800 shrink-0">
                    <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
                      <Leaf className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`rounded-2xl px-5 py-3 max-w-[80%] whitespace-pre-wrap text-sm shadow-sm ${
                    message.role === "user"
                      ? "bg-emerald-600 text-white rounded-tr-none"
                      : "bg-white/80 dark:bg-muted/50 border border-emerald-100 dark:border-emerald-900/50 rounded-tl-none text-foreground"
                  }`}
                >
                  {message.content}
                </div>

                {message.role === "user" && (
                  <Avatar className="h-10 w-10 border border-purple-200 dark:border-purple-800 shrink-0">
                    <AvatarFallback className="bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4 justify-start">
                <Avatar className="h-10 w-10 border border-emerald-200 dark:border-emerald-800 shrink-0">
                  <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
                    <Leaf className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-2xl px-5 py-4 max-w-[80%] bg-white/80 dark:bg-muted/50 border border-emerald-100 dark:border-emerald-900/50 rounded-tl-none flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                  <span className="text-sm text-muted-foreground">
                    Wellness Guide is here for you...
                  </span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t bg-white/50 dark:bg-background/50 backdrop-blur-sm z-10">
          <form
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto relative flex items-center"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share what's on your mind... this is a safe space 💚"
              className="pr-12 py-6 rounded-full border-emerald-200 dark:border-emerald-800 focus-visible:ring-emerald-500 shadow-inner bg-white dark:bg-background"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="absolute right-1.5 h-9 w-9 rounded-full bg-emerald-600 hover:bg-emerald-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <div className="text-center mt-2">
            <span className="text-[10px] text-muted-foreground">
              I&apos;m an AI companion, not a medical professional. For serious
              concerns, please reach out to a counselor or helpline.
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
