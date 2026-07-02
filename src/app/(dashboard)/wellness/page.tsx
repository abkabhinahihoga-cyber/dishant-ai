"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import dynamic from "next/dynamic";
const Player = dynamic(() => import("@lottiefiles/react-lottie-player").then(mod => mod.Player), { ssr: false });
import {
  Heart, Leaf, Sun, Send, User, Loader2, X, Wind,
  Flame, Dumbbell, Brain, ArrowRight, Play, Pause, ChevronRight, Activity, Mic, MicOff, MessageCircle
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/use-translation";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: "नमस्ते! मैं आपका Wellness Guide हूँ 💚 मैं तनाव (stress), चिंता (anxiety), और भावनाओं (emotions) को समझने में आपकी मदद करूँगा। आज आप कैसा महसूस कर रहे हैं?",
};

// Premium Lottie Animations for the exercises
const LOTTIE_URLS = {
  yoga: "https://lottie.host/8cd6d859-eefb-4bb8-8ddf-8e42621c3260/yM1yQ9X6g7.json", 
  meditation: "https://lottie.host/e288a6d6-0a0f-4886-9a29-b684eef10e75/O8sIqE5V6N.json",
  workout: "https://lottie.host/809a4739-c5c8-4796-bf9c-6a75168d1b11/2zZ0x1O1gO.json",
  breathing: "https://lottie.host/0233e7f4-b2cc-4a94-81cc-24b51829e05f/G5Z5K5O1b5.json"
};

const EXERCISES = [
  {
    id: "yoga",
    titleKey: "suryaNamaskar",
    defaultTitle: "Surya Namaskar",
    duration: "15 Min",
    calories: "45 kcal",
    youtube: "X-tK1jH_2i0", // 3D Animated Surya Namaskar
    gradient: "from-emerald-600 to-teal-600",
    bg: "bg-emerald-950/40",
    accent: "text-emerald-400"
  },
  {
    id: "workout",
    titleKey: "fullBodyFitness",
    defaultTitle: "Full Body Fitness",
    duration: "20 Min",
    calories: "120 kcal",
    youtube: "IODxDxX7oi4", // Animated Full Body Workout
    gradient: "from-rose-600 to-orange-600",
    bg: "bg-rose-950/40",
    accent: "text-rose-400"
  },
  {
    id: "breathing",
    titleKey: "deepBreathing",
    defaultTitle: "Deep Breathing",
    duration: "2 Min",
    calories: "0 kcal",
    youtube: "ENYYb5vIMkU", // Animated Breathing Guide
    gradient: "from-cyan-600 to-blue-600",
    bg: "bg-cyan-950/40",
    accent: "text-cyan-400"
  }
];

// ── Exercise Player Modal ─────────────────────────────────────────────
function ExercisePlayer({ exercise, onClose }: { exercise: typeof EXERCISES[0], onClose: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-[120] bg-black flex flex-col animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between p-4 border-b border-white/10 text-white relative z-10 bg-black/50 backdrop-blur-md">
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full text-white hover:bg-white/20">
          <X className="h-6 w-6" />
        </Button>
        <span className="font-heading font-semibold">{t(exercise.titleKey, exercise.defaultTitle)}</span>
        <div className="w-10" />
      </div>

      <div className={`flex-1 flex flex-col w-full relative`}>
        {/* Animated Video Embed filling the screen — no YouTube branding visible */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${exercise.youtube}?autoplay=1&loop=1&playlist=${exercise.youtube}&controls=0&showinfo=0&rel=0&modestbranding=1&disablekb=1&fs=0&iv_load_policy=3&cc_load_policy=0`}
            title="Exercise Guide"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="w-[300%] h-[300%] border-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          ></iframe>
        </div>
        {/* Gradient overlay at bottom to mask any remaining YouTube UI */}
        <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-black to-transparent pointer-events-none" />
      </div>
    </div>
  );
}


// ── Chat Overlay (ChatGPT Style) ──────────────────────────────────────────────────
function WellnessChatOverlay({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: t('wellnessGreeting', "नमस्ते! मैं आपका Wellness Guide हूँ 💚 मैं तनाव, चिंता, और भावनाओं को समझने में आपकी मदद करूँगा। आज आप कैसा महसूस कर रहे हैं?"),
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Web Speech API
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error("Voice input is not supported in this browser.");
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN'; // Defaulting wellness to Hindi
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      toast.info("Listening...");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev ? prev + " " + transcript : transcript);
    };

    recognition.onerror = () => {
      toast.error("Could not recognize voice. Please try again.");
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setHasScrolled(e.currentTarget.scrollTop > 10);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/wellness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].filter(m => m.id !== "welcome").map(m => ({
            role: m.role === "assistant" ? "model" : "user", content: m.content,
          })),
          conversationId,
        }),
      });
      if (!response.ok) throw new Error("Failed");
      const newConvId = response.headers.get("X-Conversation-Id");
      if (newConvId && newConvId !== conversationId) setConversationId(newConvId);
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
    } catch { toast.error("Failed to reach Wellness Guide."); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-background animate-in slide-in-from-bottom-4 duration-300 font-sans overflow-hidden">
      
      {/* Header */}
      <header className={`
        absolute top-0 inset-x-0 h-16 px-4 flex items-center justify-between z-10 transition-all duration-300
        ${hasScrolled ? "bg-background/80 backdrop-blur-md border-b border-emerald-500/20 shadow-sm" : "bg-transparent"}
      `}>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/60" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-2 group cursor-pointer hover:bg-emerald-500/10 px-3 py-1.5 rounded-lg transition-colors">
            <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Heart className="h-3.5 w-3.5 text-emerald-500" />
            </div>
            <span className="font-heading font-semibold text-lg text-foreground tracking-tight">{t('wellnessGuide', 'Wellness Guide')}</span>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto" onScroll={handleScroll}>
        <div className="max-w-3xl mx-auto px-4 md:px-6 pt-24 pb-32">
          
          {/* Welcome State */}
          {messages.length === 1 && (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
              <div className="h-24 w-24 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/5 relative">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping opacity-20" />
                <Heart className="h-12 w-12 text-emerald-500 fill-emerald-500/20" />
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4 tracking-tight">
                {t('safeSpace', 'This is a safe space.')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-lg mb-10 leading-relaxed">
                {messages[0].content}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                {[
                  t('suggestionStress', "मुझे बहुत स्ट्रेस हो रहा है।"),
                  t('suggestionSleep', "नींद नहीं आ रही, क्या करूँ?"),
                  t('suggestionAnxiety', "एंग्जायटी से कैसे बचें?"),
                  t('suggestionSad', "मुझे अच्छा महसूस नहीं हो रहा।")
                ].map((s, i) => (
                  <button
                    key={i}
                    onClick={() => { setInput(s); document.querySelector("form")?.requestSubmit(); }}
                    className="text-left p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/10 hover:bg-emerald-950/30 transition-colors text-base text-foreground/80 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Thread View */}
          {messages.length > 1 && (
            <div className="space-y-6">
              {messages.map((message) => {
                if (message.id === "welcome") return null;
                return (
                  <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    {message.role === "assistant" && (
                      <Avatar className="h-9 w-9 border border-emerald-500/30 shrink-0 mt-1 shadow-sm">
                        <AvatarFallback className="bg-emerald-500/10 text-emerald-500"><Leaf className="h-4 w-4" /></AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`rounded-2xl px-5 py-3.5 max-w-[85%] text-[1.05rem] whitespace-pre-wrap leading-relaxed shadow-sm font-sans ${
                      message.role === "user"
                        ? "bg-emerald-600 text-white rounded-tr-none shadow-emerald-900/20"
                        : "bg-muted border border-border/50 rounded-tl-none text-foreground"
                    }`}>
                      {message.content}
                    </div>

                    {message.role === "user" && (
                      <Avatar className="h-9 w-9 border border-border shrink-0 mt-1 shadow-sm">
                        <AvatarFallback className="bg-muted text-muted-foreground"><User className="h-4 w-4" /></AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-9 w-9 border border-emerald-500/30 shrink-0 mt-1 shadow-sm">
                    <AvatarFallback className="bg-emerald-500/10 text-emerald-500"><Leaf className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                  <div className="rounded-2xl px-5 py-3.5 bg-muted border border-border/50 rounded-tl-none flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                    <span className="text-[1.05rem] text-muted-foreground">{t('wellnessTyping', 'Wellness Guide is typing...')}</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-background via-background/90 to-transparent pt-10 pb-6 md:pb-8 px-4 pointer-events-none">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative pointer-events-auto">
          <div className="relative shadow-2xl shadow-emerald-900/10 dark:shadow-none rounded-[1.5rem] bg-background border border-emerald-500/20">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('wellnessPlaceholder', "अपनी परेशानी यहाँ साझा करें... 💚")}
              className="w-full pl-6 pr-24 py-8 rounded-[1.5rem] border-none bg-background focus-visible:ring-emerald-500 text-base md:text-lg shadow-inner shadow-black/5 dark:shadow-white/5"
              disabled={isLoading}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <Button 
                type="button" 
                size="icon" 
                variant="ghost"
                onClick={startListening}
                className={`h-11 w-11 rounded-full transition-colors ${isListening ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 animate-pulse" : "text-muted-foreground hover:bg-muted/80"}`}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              <Button 
                type="submit" 
                size="icon" 
                disabled={!input.trim() || isLoading}
                className={`h-11 w-11 rounded-full transition-all ${
                  input.trim() ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-900/30" : "bg-muted text-muted-foreground"
                }`}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-3 px-4 drop-shadow-md">
            {t('wellnessDisclaimer', "I'm an AI companion, not a medical professional. For serious concerns, please reach out to a counselor.")}
          </p>
        </form>
      </div>
    </div>
  );
}

// ── MAIN PAGE (Premium Fitness App Style) ─────────────────────────────────────────────────────
export default function WellnessPage() {
  const { t } = useTranslation();
  const [chatOpen, setChatOpen] = useState(false);
  const [activeExercise, setActiveExercise] = useState<typeof EXERCISES[0] | null>(null);

  return (
    <>
      {chatOpen && <WellnessChatOverlay onClose={() => setChatOpen(false)} />}
      {activeExercise && <ExercisePlayer exercise={activeExercise} onClose={() => setActiveExercise(null)} />}

      <div className="max-w-md mx-auto pb-24 space-y-6 animate-fade-in font-sans">
        
        {/* Header */}
        <div className="pt-6 px-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-black">{t('wellbeing', 'Wellbeing')}</h1>
            <p className="text-muted-foreground font-medium">{t('wellbeingDesc', 'Your daily fitness & mind space')}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <Flame className="h-6 w-6 text-emerald-500" />
          </div>
        </div>

        {/* AI Guide Interactive Chat Box Redesign */}
        <div className="px-4">
          <div className="rounded-[2rem] bg-gradient-to-br from-emerald-600 to-teal-800 p-1 shadow-2xl shadow-emerald-900/20">
            <div className="bg-background/95 rounded-[1.85rem] p-5 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <Brain className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-foreground text-lg">{t('talkToAiGuide', 'AI Wellness Guide')}</h3>
                  <p className="text-muted-foreground text-xs">{t('aiAvailable', 'Available 24/7 for you')}</p>
                </div>
              </div>
              
              <div 
                onClick={() => setChatOpen(true)}
                className="bg-muted/50 hover:bg-emerald-500/10 border border-border/50 hover:border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3 cursor-text transition-colors"
              >
                <MessageCircle className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground flex-1">{t('wellnessPlaceholder', "अपनी परेशानी यहाँ साझा करें... 💚")}</span>
                <Button size="icon" className="h-8 w-8 rounded-full bg-emerald-600 hover:bg-emerald-700 shrink-0">
                  <ArrowRight className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Categories / Exercises */}
        <div className="px-4 mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-bold">{t('dailyRoutines', 'Daily Routines')}</h2>
            <Link href="#" className="text-sm text-primary font-medium">{t('seeAll', 'See All')}</Link>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {EXERCISES.map((ex) => (
              <div 
                key={ex.id}
                onClick={() => setActiveExercise(ex)}
                className={`cursor-pointer group flex items-center gap-4 p-4 rounded-3xl border border-border/40 bg-card hover:bg-muted/50 transition-colors shadow-sm`}
              >
                <div className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${ex.gradient} flex items-center justify-center shrink-0 shadow-inner relative overflow-hidden`}>
                  <Play className="h-8 w-8 text-white/80 absolute z-10 drop-shadow-md" />
                  <div className="absolute inset-0 bg-black/20" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-bold text-lg mb-1">{t(ex.titleKey, ex.defaultTitle)}</h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                    <span className="flex items-center gap-1"><Activity className="h-3.5 w-3.5" /> {ex.duration}</span>
                    <span className="flex items-center gap-1"><Flame className="h-3.5 w-3.5" /> {ex.calories}</span>
                  </div>
                </div>

                <div className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted-foreground group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-all">
                  <Play className="h-4 w-4 ml-0.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
