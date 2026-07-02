"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Heart, Leaf, Sun, Send, User, Loader2, X, Wind,
  Flame, Dumbbell, Brain, Moon, Zap, ArrowRight, Play, Pause
} from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: "Hi there 💚 I'm your Wellness Guide. I'm here to help you navigate stress, anxiety, and emotional challenges. Whether you need someone to talk to, a breathing exercise, or coping strategies — I'm here for you. How are you feeling today?",
};

const QUOTES = [
  { text: "You are stronger than you think.", icon: Sun },
  { text: "Rest is productive too.", icon: Moon },
  { text: "Every storm runs out of rain.", icon: Heart },
  { text: "Small steps every day lead to big changes.", icon: Zap },
  { text: "Breathe. You are exactly where you need to be.", icon: Leaf },
  { text: "Be gentle with yourself.", icon: Heart },
];

// ── Yoga / Exercise features ───────────────────────────────────────
const FEATURES = [
  {
    id: "breathing",
    label: "4-7-8 Breathing",
    description: "Calm anxiety in 2 minutes",
    icon: Wind,
    gradient: "from-teal-500 to-emerald-400",
    bg: "from-teal-950/30 to-emerald-950/20",
    border: "border-teal-500/20",
    phases: [
  { name: "Inhale", duration: 4000, scale: 1.6 },
  { name: "Hold", duration: 7000, scale: 1.6 },
  { name: "Exhale", duration: 8000, scale: 1 },
],
  },
  {
    id: "sun-salutation",
    label: "Surya Namaskar",
    description: "12-step morning yoga flow",
    icon: Sun,
    gradient: "from-orange-500 to-amber-400",
    bg: "from-orange-950/30 to-amber-950/20",
    border: "border-orange-500/20",
    steps: [
      "प्रणामासन — Prayer Pose",
      "हस्तोत्तानासन — Raised Arms",
      "हस्तपादासन — Hand to Foot",
      "अश्व संचालनासन — Equestrian",
      "दण्डासन — Stick Pose",
      "अष्टांग नमस्कार — 8-point",
      "भुजंगासन — Cobra Pose",
      "अधोमुख श्वानासन — Downward Dog",
      "अश्व संचालनासन — Equestrian",
      "हस्तपादासन — Hand to Foot",
      "हस्तोत्तानासन — Raised Arms",
      "प्रणामासन — Prayer Pose",
    ],
  },
  {
    id: "meditation",
    label: "Guided Meditation",
    description: "5-min mindfulness timer",
    icon: Brain,
    gradient: "from-violet-500 to-purple-400",
    bg: "from-violet-950/30 to-purple-950/20",
    border: "border-violet-500/20",
    duration: 300, // seconds
  },
  {
    id: "workout",
    label: "Quick Workout",
    description: "No equipment, 7 exercises",
    icon: Dumbbell,
    gradient: "from-rose-500 to-pink-400",
    bg: "from-rose-950/30 to-pink-950/20",
    border: "border-rose-500/20",
    exercises: [
      { name: "Jumping Jacks", reps: "30 sec", emoji: "🤸" },
      { name: "Push-ups", reps: "10 reps", emoji: "💪" },
      { name: "Squats", reps: "15 reps", emoji: "🦵" },
      { name: "Plank", reps: "30 sec", emoji: "🏋️" },
      { name: "High Knees", reps: "30 sec", emoji: "🏃" },
      { name: "Lunges", reps: "10 each", emoji: "🦾" },
      { name: "Mountain Climbers", reps: "20 reps", emoji: "⛰️" },
    ],
  },
];

// ── Breathing component ─────────────────────────────────────────────
function BreathingExercise() {
  const [active, setActive] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const feature = FEATURES[0];
  const phases = feature.phases!;
  const currentPhase = phases[phaseIdx];

  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(() => {
      setPhaseIdx(i => (i + 1) % phases.length);
    }, currentPhase.duration);
    return () => clearTimeout(timer);
  }, [active, phaseIdx, currentPhase.duration, phases.length]);

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="relative flex items-center justify-center w-40 h-40">
        {/* Outer ring */}
        <div className={`absolute inset-0 rounded-full border-2 border-teal-400/30 transition-all duration-[4000ms] ease-in-out ${active && currentPhase.scale > 1 ? "scale-110 opacity-100" : "scale-100 opacity-50"}`} />
        {/* Glow ring */}
        <div className={`absolute rounded-full bg-gradient-to-br from-teal-400/20 to-emerald-400/10 transition-all ease-in-out ${
          active
            ? currentPhase.name === "Inhale" ? "w-36 h-36 duration-[4000ms]"
              : currentPhase.name === "Hold" ? "w-36 h-36 duration-[7000ms]"
              : "w-20 h-20 duration-[8000ms]"
            : "w-24 h-24"
        }`} />
        {/* Center */}
        <div className="relative z-10 flex flex-col items-center gap-1">
          <Leaf className={`transition-all duration-1000 ${active ? "text-teal-300 h-8 w-8" : "text-teal-500 h-6 w-6"}`} />
          <span className="text-sm font-semibold text-teal-300">
            {active ? currentPhase.name : "Ready"}
          </span>
          {active && (
            <span className="text-xs text-teal-400/70">
              {currentPhase.duration / 1000}s
            </span>
          )}
        </div>
      </div>
      <Button
        size="sm"
        onClick={() => { setActive(!active); setPhaseIdx(0); }}
        className={active
          ? "border-teal-400/50 text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 border"
          : "bg-gradient-to-r from-teal-500 to-emerald-500 hover:opacity-90 text-white"
        }
      >
        {active ? <><Pause className="h-3.5 w-3.5 mr-1.5" />Stop</> : <><Play className="h-3.5 w-3.5 mr-1.5" />Start</>}
      </Button>
    </div>
  );
}

// ── Surya Namaskar component ──────────────────────────────────────
function SuryaNamaskar() {
  const [step, setStep] = useState(0);
  const [active, setActive] = useState(false);
  const steps = FEATURES[1].steps!;

  useEffect(() => {
    if (!active) return;
    if (step >= steps.length) { setActive(false); setStep(0); return; }
    const t = setTimeout(() => setStep(s => s + 1), 3000);
    return () => clearTimeout(t);
  }, [active, step, steps.length]);

  return (
    <div className="flex flex-col gap-3 py-2">
      <div className="grid grid-cols-3 gap-1.5">
        {steps.map((s, i) => (
          <div key={i} className={`text-[10px] rounded-lg px-2 py-1.5 text-center transition-all duration-500 ${
            i < step ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
              : i === step && active ? "bg-orange-500/40 text-orange-200 border border-orange-400 scale-105 shadow-[0_0_12px_rgba(249,115,22,0.4)]"
              : "bg-white/5 text-muted-foreground border border-white/10"
          }`}>
            {s.split("—")[1]?.trim() || s}
          </div>
        ))}
      </div>
      {active && step < steps.length && (
        <p className="text-center text-sm font-medium text-orange-300 animate-pulse">{steps[step]}</p>
      )}
      {step >= steps.length && !active && (
        <p className="text-center text-sm text-emerald-400 font-semibold">🙏 Namaskar! Complete!</p>
      )}
      <Button
        size="sm"
        onClick={() => { if (active) { setActive(false); setStep(0); } else { setStep(0); setActive(true); } }}
        className={active
          ? "border-orange-400/50 text-orange-300 bg-orange-500/10 border"
          : "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:opacity-90"
        }
      >
        {active ? <><Pause className="h-3.5 w-3.5 mr-1.5"/>Stop</> : <><Play className="h-3.5 w-3.5 mr-1.5"/>Begin Flow</>}
      </Button>
    </div>
  );
}

// ── Meditation Timer ──────────────────────────────────────────────
function MeditationTimer() {
  const [remaining, setRemaining] = useState(300);
  const [active, setActive] = useState(false);
  const totalDuration = 300;

  useEffect(() => {
    if (!active) return;
    if (remaining <= 0) { setActive(false); toast.success("🧘 Meditation complete!"); return; }
    const t = setInterval(() => setRemaining(r => r - 1), 1000);
    return () => clearInterval(t);
  }, [active, remaining]);

  const pct = ((totalDuration - remaining) / totalDuration) * 100;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const circumference = 2 * Math.PI * 54;

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" width="144" height="144">
          <circle cx="72" cy="72" r="54" fill="none" stroke="currentColor" strokeWidth="6" className="text-violet-500/20" />
          <circle
            cx="72" cy="72" r="54" fill="none" stroke="url(#grad)" strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (pct / 100) * circumference}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
        </svg>
        <div className="text-center">
          <div className="text-2xl font-black text-violet-300">{String(mins).padStart(2,"0")}:{String(secs).padStart(2,"0")}</div>
          <div className="text-[10px] text-violet-400/70">remaining</div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm"
          onClick={() => setActive(!active)}
          className={active
            ? "border-violet-400/50 text-violet-300 bg-violet-500/10 border"
            : "bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:opacity-90"
          }
        >
          {active ? <><Pause className="h-3.5 w-3.5 mr-1"/>Pause</> : <><Play className="h-3.5 w-3.5 mr-1"/>Start</>}
        </Button>
        <Button size="sm" variant="outline" className="text-muted-foreground" onClick={() => { setActive(false); setRemaining(300); }}>
          Reset
        </Button>
      </div>
    </div>
  );
}

// ── Quick Workout ─────────────────────────────────────────────────
function QuickWorkout() {
  const [current, setCurrent] = useState(-1);
  const [done, setDone] = useState<number[]>([]);
  const exercises = FEATURES[3].exercises!;

  const next = () => {
    const nextIdx = current + 1;
    if (current >= 0) setDone(d => [...d, current]);
    if (nextIdx >= exercises.length) { setCurrent(-2); return; }
    setCurrent(nextIdx);
  };

  const reset = () => { setCurrent(-1); setDone([]); };

  return (
    <div className="flex flex-col gap-2 py-2">
      <div className="space-y-1.5">
        {exercises.map((ex, i) => (
          <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-300 ${
            done.includes(i) ? "bg-rose-500/10 border-rose-500/20 opacity-60"
              : i === current ? "bg-rose-500/20 border-rose-400 shadow-[0_0_16px_rgba(244,63,94,0.3)] scale-[1.02]"
              : "bg-white/5 border-white/10"
          }`}>
            <span className="text-lg">{ex.emoji}</span>
            <div className="flex-1">
              <p className={`text-sm font-medium ${i === current ? "text-rose-200" : done.includes(i) ? "text-muted-foreground line-through" : ""}`}>{ex.name}</p>
              <p className="text-[10px] text-muted-foreground">{ex.reps}</p>
            </div>
            {done.includes(i) && <span className="text-emerald-400 text-sm">✓</span>}
          </div>
        ))}
      </div>
      {current === -2 ? (
        <div className="text-center py-2">
          <p className="text-emerald-400 font-semibold mb-2">💪 Workout Complete!</p>
          <Button size="sm" variant="outline" onClick={reset}>Start Again</Button>
        </div>
      ) : (
        <Button size="sm" onClick={next}
          className="bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:opacity-90 mt-1">
          {current === -1 ? <><Play className="h-3.5 w-3.5 mr-1.5"/>Start Workout</> : <><ArrowRight className="h-3.5 w-3.5 mr-1.5"/>Next Exercise</>}
        </Button>
      )}
    </div>
  );
}

// ── Chat Overlay ──────────────────────────────────────────────────
function WellnessChatOverlay({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

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
    <div className="fixed inset-0 z-50 flex flex-col bg-background animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-emerald-500/20 bg-gradient-to-r from-emerald-950/50 to-background shrink-0">
        <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <Heart className="h-4 w-4 text-emerald-400" />
        </div>
        <div>
          <h2 className="font-heading font-bold text-sm">Wellness Guide</h2>
          <p className="text-[10px] text-emerald-400/70">Your safe space 💚</p>
        </div>
        <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 text-muted-foreground hover:text-foreground" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <Avatar className="h-8 w-8 border border-emerald-500/30 shrink-0 mt-0.5">
                  <AvatarFallback className="bg-emerald-500/10 text-emerald-400"><Leaf className="h-4 w-4" /></AvatarFallback>
                </Avatar>
              )}
              <div className={`rounded-2xl px-4 py-2.5 max-w-[85%] text-sm whitespace-pre-wrap leading-relaxed shadow-sm ${
                msg.role === "user"
                  ? "bg-emerald-600 text-white rounded-tr-none"
                  : "bg-emerald-950/40 border border-emerald-500/20 rounded-tl-none"
              }`}>
                {msg.content}
              </div>
              {msg.role === "user" && (
                <Avatar className="h-8 w-8 border border-border shrink-0 mt-0.5">
                  <AvatarFallback className="bg-muted text-muted-foreground"><User className="h-4 w-4" /></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8 border border-emerald-500/30 shrink-0">
                <AvatarFallback className="bg-emerald-500/10 text-emerald-400"><Leaf className="h-4 w-4" /></AvatarFallback>
              </Avatar>
              <div className="rounded-2xl px-4 py-3 bg-emerald-950/40 border border-emerald-500/20 rounded-tl-none flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                <span className="text-sm text-emerald-400/70">Wellness Guide is here...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-emerald-500/20 bg-background/90 backdrop-blur-xl px-4 pt-3 pb-20 md:pb-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative flex items-center">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share what's on your mind... 💚"
            className="pr-12 rounded-full border-emerald-500/30 bg-emerald-950/20 focus-visible:ring-emerald-500 text-sm"
            disabled={isLoading}
            autoFocus
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isLoading}
            className="absolute right-1.5 h-8 w-8 rounded-full bg-emerald-600 hover:bg-emerald-700 shrink-0">
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
        <p className="text-center text-[10px] text-muted-foreground mt-1.5">
          I&apos;m an AI companion, not a medical professional.
        </p>
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────
export default function WellnessPage() {
  const [chatOpen, setChatOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setQuoteIndex(i => (i + 1) % QUOTES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const quote = QUOTES[quoteIndex];
  const QuoteIcon = quote.icon;

  return (
    <>
      {chatOpen && <WellnessChatOverlay onClose={() => setChatOpen(false)} />}

      <div className="max-w-5xl mx-auto pb-24 md:pb-8 space-y-6 animate-fade-in">

        {/* ── Hero Banner ────────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950/60 via-teal-950/40 to-background border border-emerald-500/20 p-6 md:p-8">
          {/* Animated orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Heart className="h-4 w-4 text-emerald-400 fill-emerald-400/30" />
                </div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">Wellness Hub</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-foreground mb-1">
                Mind, Body & Soul 🧘
              </h1>
              <p className="text-sm text-muted-foreground max-w-sm">
                Yoga, meditation, breathing exercises, and your personal wellness guide — all in one place.
              </p>
            </div>

            {/* Rotating Quote */}
            <div className="flex items-start gap-3 bg-emerald-950/50 border border-emerald-500/20 rounded-xl p-4 max-w-xs">
              <QuoteIcon className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-200/80 italic leading-snug">
                &ldquo;{quote.text}&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* ── Wellness Guide CTA ─────────────────────────────────── */}
        <div
          onClick={() => setChatOpen(true)}
          className="cursor-pointer group relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 p-5 flex items-center gap-4 shadow-lg shadow-emerald-900/30 transition-all duration-300 hover:shadow-emerald-900/50 hover:scale-[1.01]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_rgba(255,255,255,0.1),_transparent_60%)] pointer-events-none" />
          <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Heart className="h-6 w-6 text-white fill-white/40" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-bold text-white text-lg">Chat with Wellness Guide</h3>
            <p className="text-emerald-100/80 text-sm">Talk to your AI wellness companion about stress, emotions & more</p>
          </div>
          <ArrowRight className="h-5 w-5 text-white/70 group-hover:translate-x-1 transition-transform shrink-0" />
        </div>

        {/* ── Feature Cards Grid ─────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            const isOpen = activeFeature === feature.id;
            return (
              <div
                key={feature.id}
                className={`rounded-2xl border bg-gradient-to-br ${feature.bg} ${feature.border} overflow-hidden transition-all duration-300 ${isOpen ? "shadow-xl" : "hover:shadow-md"}`}
              >
                {/* Card Header */}
                <button
                  onClick={() => setActiveFeature(isOpen ? null : feature.id)}
                  className="w-full flex items-center gap-4 p-4 text-left group"
                >
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-bold text-sm text-foreground">{feature.label}</h3>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                  <div className={`h-6 w-6 rounded-full border border-white/20 flex items-center justify-center transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  </div>
                </button>

                {/* Expanded Content */}
                {isOpen && (
                  <div className="px-4 pb-4 border-t border-white/10 pt-4 animate-fade-in">
                    {feature.id === "breathing" && <BreathingExercise />}
                    {feature.id === "sun-salutation" && <SuryaNamaskar />}
                    {feature.id === "meditation" && <MeditationTimer />}
                    {feature.id === "workout" && <QuickWorkout />}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Mood Tracker Chips ──────────────────────────────────── */}
        <div className="rounded-2xl border border-border/40 bg-card/50 p-5">
          <h3 className="font-heading font-bold mb-3 flex items-center gap-2">
            <Flame className="h-4 w-4 text-amber-400" /> How are you feeling today?
          </h3>
          <div className="flex flex-wrap gap-2">
            {["😊 Happy", "😰 Anxious", "😔 Sad", "😤 Stressed", "😴 Tired", "🔥 Motivated", "😌 Calm", "🤔 Confused"].map((mood) => (
              <button
                key={mood}
                onClick={() => { setChatOpen(true); }}
                className="text-sm px-4 py-2 rounded-full border border-border/60 bg-background/50 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all active:scale-95"
              >
                {mood}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">Tap any mood to talk with your Wellness Guide</p>
        </div>
      </div>
    </>
  );
}
