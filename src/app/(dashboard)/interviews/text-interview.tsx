"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Video, Send, Loader2, User, Sparkles, Mic, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLanguage } from "@/components/language-provider";
import { useTranslation } from "@/lib/i18n/use-translation";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export default function TextInterviewPage() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [role, setRole] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Reference to store the SpeechRecognition instance so we can stop it
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;

    setIsConnecting(true);
    try {
      const initialSystemMessage: Message = {
        role: "system",
        content: `You are an expert hiring manager at a top-tier tech company. The candidate is applying for the role of: ${role}. Conduct the entire interview in this language/style: ${language}. Start the interview by introducing yourself, asking them to introduce themselves, and then ask the first behavioral or technical question.`
      };
      
      const initialUserMessage: Message = {
        role: "user",
        content: "Hello, I am ready to start the interview."
      };

      const res = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [initialSystemMessage, initialUserMessage]
        })
      });

      if (!res.ok) throw new Error("Failed to start");
      const data = await res.json();
      
      setMessages([
        initialSystemMessage,
        initialUserMessage,
        { role: "assistant", content: data.reply }
      ]);
      setIsStarted(true);
    } catch {
      toast.error("Could not connect to the interviewer.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      });

      if (!res.ok) throw new Error("Failed to send");
      const data = await res.json();
      
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch {
      toast.error("Failed to send message.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnd = () => {
    const endMessage: Message = { 
      role: "user", 
      content: "I would like to end the interview now. Please give me your final feedback, score out of 100, and areas to improve." 
    };
    setInput(endMessage.content);
    setTimeout(() => handleSend(), 100);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      // @ts-ignore - SpeechRecognition is not fully typed in standard TS yet
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast.error("Your browser doesn't support speech recognition.");
        return;
      }

      const recognition = new SpeechRecognition();
      
      // Set language based on user selection
      if (language === "Hindi") recognition.lang = "hi-IN";
      else if (language === "Hinglish") recognition.lang = "en-IN";
      else recognition.lang = "en-US";
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognitionRef.current = recognition;

      recognition.onstart = () => {
        setIsListening(true);
        toast.info("Listening... speak now.");
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        // Append to existing input if they are continuing, or just set it
        // We'll just replace the current pending part so it doesn't duplicate if they pause
        // For simplicity in MVP, we just overwrite the input with the final transcript of the session
        // Wait, interim results overwrite it, so we append the final. 
        setInput((prev) => {
          // A bit hacky without complex state tracking, we just set the whole thing for the current sentence
          return currentTranscript;
        });
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        toast.error("Microphone error. Please check permissions.");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      toast.error("Failed to start microphone.");
    }
  };

  if (isStarted) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-10rem)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Video className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold font-heading">Mock Interview: {role}</h1>
          </div>
          <Button variant="destructive" onClick={handleEnd} disabled={isLoading}>
            End Interview & Get Feedback
          </Button>
        </div>

        <Card className="glass-card flex-1 flex flex-col overflow-hidden shadow-xl">
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.filter(m => m.role !== "system").map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className={msg.role === "assistant" ? "bg-primary text-primary-foreground" : "bg-muted"}>
                    {msg.role === "assistant" ? <Briefcase className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <div className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                  msg.role === "user" 
                    ? "bg-primary text-primary-foreground rounded-tr-none" 
                    : "bg-muted/50 border border-border/50 rounded-tl-none text-foreground"
                }`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-2xl px-4 py-3 bg-muted/50 border border-border/50 rounded-tl-none">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-border/50 bg-background/50 backdrop-blur-sm">
            <form onSubmit={handleSend} className="flex gap-2">
              <Textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your response here..."
                className="resize-none min-h-[44px] h-[44px] py-3 rounded-xl flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <Button 
                type="button" 
                size="icon" 
                variant={isListening ? "destructive" : "outline"} 
                className={`h-11 w-11 shrink-0 rounded-xl transition-all ${isListening ? "animate-pulse" : ""}`}
                onClick={toggleListening}
              >
                <Mic className={`h-5 w-5 ${isListening ? "text-white" : "text-muted-foreground"}`} />
              </Button>
              <Button type="submit" disabled={!input.trim() || isLoading} className="h-11 px-6 rounded-xl">
                <Send className="h-4 w-4 mr-2" /> Send
              </Button>
            </form>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-12 animate-fade-in">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Video className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-heading font-bold mb-2">{t("int.title")}</h1>
        <p className="text-muted-foreground">{t("int.subtitle")}</p>
      </div>

      <Card className="glass-card shadow-xl">
        <CardHeader>
          <CardTitle>{t("int.text")}</CardTitle>
          <CardDescription>{t("int.setup.role")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleStart} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("int.setup.role")}</label>
                <Input 
                  required
                  placeholder={t("int.setup.role_ph")} 
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="h-12"
                />
              </div>
            </div>
            
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex gap-3 text-sm text-muted-foreground">
              <Sparkles className="h-5 w-5 text-primary shrink-0" />
              <p>{t("int.text_desc")}</p>
            </div>

            <Button type="submit" className="w-full h-12 text-lg" disabled={isConnecting || !role}>
              {isConnecting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Video className="mr-2 h-5 w-5" />}
              {isConnecting ? t("int.setup.text_connecting") : t("int.setup.text_join")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
