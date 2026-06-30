"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/components/language-provider";
import { useTranslation } from "@/lib/i18n/use-translation";

const QUESTIONS = [
  {
    id: "q1",
    question: "When faced with a complex problem, what is your first instinct?",
    options: [
      "Break it down into smaller, logical steps.",
      "Brainstorm creative and out-of-the-box solutions.",
      "Discuss it with others to get different perspectives.",
      "Look for established rules or frameworks to apply."
    ]
  },
  {
    id: "q2",
    question: "Which type of working environment do you prefer?",
    options: [
      "Fast-paced and constantly changing.",
      "Structured, quiet, and predictable.",
      "Highly collaborative and team-oriented.",
      "Independent with minimal supervision."
    ]
  },
  {
    id: "q3",
    question: "What kind of tasks do you find most rewarding?",
    options: [
      "Building or creating something tangible (code, design, etc).",
      "Helping, teaching, or mentoring others.",
      "Analyzing data, researching, and finding patterns.",
      "Organizing, planning, and managing projects."
    ]
  }
];

interface CareerResult {
  personalityType: string;
  strengths: string[];
  recommendedCareers: {
    title: string;
    matchScore: number;
    reason: string;
    nextSteps: string[];
  }[];
}

export default function CareerTestPage() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<CareerResult | null>(null);

  const handleSelect = (option: string) => {
    setAnswers({ ...answers, [QUESTIONS[currentQ].id]: option });
  };

  const handleNext = async () => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // Submit
      setIsAnalyzing(true);
      try {
        const res = await fetch("/api/career-test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers,
            language,
            profile: { degree: "B.Tech", branch: "Computer Science", year: 3 } // Mock profile for now
          })
        });
        
        if (!res.ok) throw new Error("API Error");
        const data = await res.json();
        setResult(data);
      } catch {
        toast.error("Failed to analyze results. Please try again.");
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const progress = ((currentQ + 1) / QUESTIONS.length) * 100;

  if (result) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <div className="text-center space-y-4 mb-12">
          <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-heading font-bold">{t("ct.result_title")}</h1>
          <p className="text-xl text-muted-foreground">{t("ct.result_desc")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>{t("ct.personality")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium text-primary">{result.personalityType}</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>{t("ct.strengths")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {result.strengths?.map((s: string, i: number) => <li key={i}>{s}</li>)}
              </ul>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-heading font-bold mt-12 mb-6">{t("ct.careers")}</h2>
        <div className="space-y-6">
          {result.recommendedCareers?.map((career, i: number) => (
            <Card key={i} className="glass-card overflow-hidden relative">
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary"></div>
              <CardContent className="p-6 ml-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <h3 className="text-xl font-bold">{career.title}</h3>
                  <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
                    <Target className="h-4 w-4" /> {career.matchScore}% Match
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{career.reason}</p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold mb-2">{t("ct.next_steps")}:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {career.nextSteps?.map((step: string, j: number) => (
                      <li key={j} className="flex items-start gap-2">
                        <ArrowRight className="h-3 w-3 mt-1 shrink-0 text-primary" /> {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="mb-8 text-center">
        <Target className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-heading font-bold mb-2">{t("ct.title")}</h1>
        <p className="text-muted-foreground">{t("ct.subtitle")}</p>
      </div>

      <Progress value={isAnalyzing ? 100 : progress} className="h-2 mb-8" />

      <Card className="glass-card shadow-xl min-h-[400px] flex flex-col relative overflow-hidden">
        {isAnalyzing ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 p-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div>
              <h3 className="text-xl font-bold font-heading mb-2">{t("ct.analyzing")}</h3>
              <p className="text-muted-foreground">{t("ct.analyzing_desc")}</p>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col p-6 absolute inset-0"
            >
              <div className="text-sm font-medium text-primary mb-4">{t("ct.q_of")} {currentQ + 1} / {QUESTIONS.length}</div>
              <h2 className="text-2xl font-semibold mb-8">{QUESTIONS[currentQ].question}</h2>
              
              <div className="space-y-3 flex-1">
                {QUESTIONS[currentQ].options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(option)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      answers[QUESTIONS[currentQ].id] === option
                        ? "border-primary bg-primary/10 ring-1 ring-primary"
                        : "border-border/50 bg-background/50 hover:bg-muted/50"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <Button 
                  onClick={handleNext} 
                  disabled={!answers[QUESTIONS[currentQ].id]}
                  className="w-full md:w-auto"
                >
                  {currentQ < QUESTIONS.length - 1 ? t("ct.next_q") : t("ct.analyze")}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </Card>
    </div>
  );
}
