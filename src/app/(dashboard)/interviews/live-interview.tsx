"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, PhoneOff, User, Loader2, Play } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}
import { useLanguage } from "@/components/language-provider";
import { useTranslation } from "@/lib/i18n/use-translation";

export default function LiveInterviewPage() {
  const [role, setRole] = useState("");
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [isStarted, setIsStarted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Live Captions
  const [aiCaption, setAiCaption] = useState("");
  const [userCaption, setUserCaption] = useState("");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);

  // Setup webcam stream
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (e) {
      console.error("Camera access denied", e);
      toast.error("Please allow camera and microphone access for the live interview.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const toggleMic = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach(track => {
        track.enabled = isMicMuted; // Toggle
      });
    }
    
    // Stop recognition if muting
    if (!isMicMuted) {
      recognitionRef.current?.stop();
    } else {
      if (!isAiSpeaking) startListening();
    }
    
    setIsMicMuted(!isMicMuted);
  };

  const toggleCam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach(track => {
        track.enabled = isCamOff; // Toggle
      });
    }
    setIsCamOff(!isCamOff);
  };

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    setAiCaption(text); // Set the caption to what the AI is about to say
    
    const voices = window.speechSynthesis.getVoices();
    let goodVoice;
    
    if (language === "Hindi") {
      goodVoice = voices.find(v => v.lang.includes("hi-IN") || v.name.includes("Hindi"));
    } else if (language === "Hinglish") {
      goodVoice = voices.find(v => v.lang.includes("en-IN") || v.name.includes("India"));
    }
    
    if (!goodVoice) {
      goodVoice = voices.find(v => v.name.includes("Google UK English Male") || v.name.includes("Samantha") || v.name.includes("Microsoft David"));
    }
    
    if (goodVoice) utterance.voice = goodVoice;
    
    utterance.onstart = () => {
      setIsAiSpeaking(true);
      // Stop listening while AI is speaking so it doesn't hear itself
      recognitionRef.current?.stop();
    };
    
    utterance.onend = () => {
      setIsAiSpeaking(false);
      setTimeout(() => setAiCaption(""), 2000); // Clear caption after 2 seconds
      // Resume listening
      if (!isMicMuted) {
        startListening();
      }
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (!window.speechSynthesis) return;
    if (isAiSpeaking) return; // Don't listen while AI speaks

    try {
      // @ts-expect-error - SpeechRecognition is not fully typed
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return;

      const recognition = new SpeechRecognition();
      
      // Set language based on user selection
      if (language === "Hindi") recognition.lang = "hi-IN";
      else if (language === "Hinglish") recognition.lang = "en-IN";
      else recognition.lang = "en-US";
      
      recognition.continuous = false; // Stop when they stop speaking a sentence
      recognition.interimResults = false;
      recognitionRef.current = recognition;

      recognition.onstart = () => {
        setIsUserSpeaking(true);
        setUserCaption("");
      };
      
      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setUserCaption(currentTranscript);
        
        if (event.results[0].isFinal) {
          handleUserReply(currentTranscript);
        }
      };
      
      recognition.onend = () => {
        setIsUserSpeaking(false);
        // We do not auto-restart here. Let them finish answering and wait for AI.
        // Actually, for a fluid conversation, we handleUserReply which fetches AI response, 
        // which triggers AI speaking, which triggers listening again after it finishes.
      };

      recognition.start();
    } catch (e) {
      console.error(e);
    }
  };

  // Keep voices loaded (Chrome quirk)
  useEffect(() => {
    window.speechSynthesis?.getVoices();
  }, []);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;

    setIsConnecting(true);
    await startCamera();

    try {
      const initialSystemMessage: Message = {
        role: "system",
        content: `You are an expert hiring manager conducting a live voice/video interview. The candidate is applying for: ${role}. Conduct the entire interview in this language/style: ${language}. Keep your responses VERY short and conversational (1-2 sentences maximum, like a real voice call). Start by introducing yourself and asking them to introduce themselves.`
      };

      const res = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [initialSystemMessage, { role: "user", content: "Hello, I am ready." }]
        })
      });

      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      
      setMessages([
        initialSystemMessage,
        { role: "assistant", content: data.reply }
      ]);
      
      setIsStarted(true);
      setIsConnecting(false);
      
      // Speak the first message
      speak(data.reply);
      
    } catch (e) {
      console.error(e);
      toast.error("Connection failed.");
      setIsConnecting(false);
      stopCamera();
    }
  };

  const handleUserReply = async (text: string) => {
    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);

    try {
      const res = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      });

      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
      speak(data.reply); // This triggers AI speaking -> then listening again
      
    } catch (e) {
      console.error(e);
      toast.error("Failed to process your response.");
      startListening(); // Try listening again if failed
    }
  };

  const handleEndCall = () => {
    stopCamera();
    recognitionRef.current?.stop();
    window.speechSynthesis?.cancel();
    setIsStarted(false);
    toast.success("Interview finished. Great job!");
  };

  if (!isStarted) {
    return (
      <div className="max-w-xl mx-auto py-12 animate-fade-in text-center">
        <div className="mx-auto w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <Video className="h-10 w-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-heading font-bold mb-4">{t("int.live")}</h1>
        <p className="text-muted-foreground mb-8">
          {t("int.live_desc")}
        </p>

        <Card className="glass-card shadow-xl text-left">
          <CardContent className="p-6">
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
              <Button type="submit" className="w-full h-12 text-lg bg-red-600 hover:bg-red-700 text-white" disabled={isConnecting || !role}>
                {isConnecting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Play className="mr-2 h-5 w-5" />}
                {isConnecting ? t("int.setup.connecting") : t("int.setup.join")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col max-w-6xl mx-auto animate-fade-in">
      <div className="flex-1 grid md:grid-cols-2 gap-4 mb-6">
        
        {/* AI Camera Feed (Simulated) */}
        <Card className="overflow-hidden bg-zinc-950 border-zinc-800 relative shadow-2xl flex items-center justify-center rounded-2xl group">
          <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg text-white/90 text-sm font-medium flex items-center gap-2">
            AI Hiring Manager
            {isAiSpeaking && <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>}
          </div>
          
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* Pulsing Avatar */}
            <div className={`relative flex items-center justify-center transition-transform duration-500 ${isAiSpeaking ? "scale-110" : "scale-100"}`}>
              <div className={`absolute inset-0 bg-primary/20 rounded-full blur-3xl transition-opacity duration-500 ${isAiSpeaking ? "opacity-100" : "opacity-0"}`}></div>
              <div className={`h-40 w-40 rounded-full bg-gradient-to-br from-primary/80 to-primary/20 flex items-center justify-center border-4 border-zinc-800/50 shadow-2xl relative z-10 ${isAiSpeaking ? "animate-pulse" : ""}`}>
                <User className="h-16 w-16 text-white" />
              </div>
            </div>
            
            {aiCaption ? (
              <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-md p-4 rounded-xl text-center shadow-lg border border-white/10 animate-fade-in">
                <p className="text-white text-lg font-medium leading-relaxed">{aiCaption}</p>
              </div>
            ) : (
              <p className="mt-8 text-zinc-400 text-center max-w-[80%]">
                {isAiSpeaking ? "Speaking..." : "Listening..."}
              </p>
            )}
          </div>
        </Card>

        {/* User Camera Feed */}
        <Card className="overflow-hidden bg-zinc-950 border-zinc-800 relative shadow-2xl rounded-2xl">
          <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg text-white/90 text-sm font-medium flex items-center gap-2">
            You
            {isUserSpeaking && <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>}
          </div>
          
          {isCamOff && (
            <div className="absolute inset-0 z-10 bg-zinc-900 flex items-center justify-center">
              <User className="h-20 w-20 text-zinc-700" />
            </div>
          )}

          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover transform -scale-x-100" // Mirror effect
          />
          
          {userCaption && (
            <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-md p-4 rounded-xl text-center shadow-lg border border-white/10 z-20 animate-fade-in">
              <p className="text-white text-lg font-medium leading-relaxed">{userCaption}</p>
            </div>
          )}
        </Card>
      </div>

      {/* Control Bar */}
      <div className="bg-zinc-950 rounded-2xl p-4 flex items-center justify-center gap-4 shadow-xl border border-border/10">
        <Button 
          variant="outline" 
          size="icon" 
          className={`h-14 w-14 rounded-full border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white ${isMicMuted ? "bg-red-500/20 text-red-500 border-red-500/30 hover:bg-red-500/30" : ""}`}
          onClick={toggleMic}
        >
          {isMicMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className={`h-14 w-14 rounded-full border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white ${isCamOff ? "bg-red-500/20 text-red-500 border-red-500/30 hover:bg-red-500/30" : ""}`}
          onClick={toggleCam}
        >
          {isCamOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
        </Button>
        <Button 
          variant="destructive" 
          size="icon" 
          className="h-14 w-14 rounded-full bg-red-600 hover:bg-red-700 ml-4"
          onClick={handleEndCall}
        >
          <PhoneOff className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
