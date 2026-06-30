"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Compass, Loader2, Play, CheckCircle2, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/components/language-provider";
import { useTranslation } from "@/lib/i18n/use-translation";

interface RoadmapResult {
  title: string;
  description: string;
  totalMonths: number;
  months: {
    month: number;
    focus: string;
    milestones: string[];
    resources: string[];
  }[];
}

export default function RoadmapPage() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [goal, setGoal] = useState("");
  const [currentSkills, setCurrentSkills] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState<RoadmapResult | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal) return;

    setIsGenerating(true);
    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal,
          currentSkills: currentSkills || "Beginner",
          language,
          durationMonths: 6 // default to 6 months for MVP
        })
      });

      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setRoadmap(data);
      toast.success("Roadmap generated!");
    } catch {
      toast.error("Failed to generate roadmap.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
          <Compass className="h-8 w-8 text-primary" />
          {t("rm.title")}
        </h1>
        <p className="text-muted-foreground mt-1">{t("rm.subtitle")}</p>
      </div>

      {!roadmap && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>{t("rm.create")}</CardTitle>
            <CardDescription>{t("rm.create_desc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("rm.goal")}</label>
                <Input 
                  placeholder={t("rm.goal_ph")} 
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("rm.skills")}</label>
                <Input 
                  placeholder={t("rm.skills_ph")} 
                  value={currentSkills}
                  onChange={(e) => setCurrentSkills(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={isGenerating || !goal} className="w-full">
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                {t("rm.generate")}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {isGenerating && !roadmap && (
        <div className="py-24 text-center flex flex-col items-center justify-center">
          <Compass className="h-16 w-16 text-primary animate-spin-slow mb-6 opacity-80" />
          <h2 className="text-2xl font-heading font-bold mb-2">{t("rm.charting")}</h2>
          <p className="text-muted-foreground">{t("rm.charting_desc")}</p>
        </div>
      )}

      {roadmap && (
        <div className="space-y-8 animate-fade-in">
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Compass className="h-32 w-32" />
            </div>
            <h2 className="text-3xl font-heading font-bold mb-2">{roadmap.title}</h2>
            <p className="text-lg text-muted-foreground mb-6">{roadmap.description}</p>
            <div className="inline-flex items-center gap-2 bg-background px-4 py-2 rounded-full text-sm font-medium">
              <Play className="h-4 w-4 text-primary" /> {roadmap.totalMonths} {t("common.journey")}
            </div>
          </div>

          <div className="relative border-l-2 border-primary/30 ml-4 md:ml-8 space-y-12 pb-8">
            {roadmap.months?.map((month, i: number) => (
              <div key={i} className="relative pl-8 md:pl-12">
                <div className="absolute -left-[11px] top-1 h-5 w-5 rounded-full bg-primary ring-4 ring-background"></div>
                <Card className="glass-card shadow-md">
                  <CardHeader className="pb-3">
                    <div className="text-sm font-bold text-primary mb-1 uppercase tracking-wider">{t("common.month")} {month.month}</div>
                    <CardTitle className="text-xl">{month.focus}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" /> {t("rm.milestones")}
                      </h4>
                      <ul className="space-y-2">
                        {month.milestones?.map((ms: string, j: number) => (
                          <li key={j} className="flex items-start gap-3 bg-muted/30 p-3 rounded-lg border border-border/50">
                            <div className="h-4 w-4 rounded-full border border-primary mt-0.5 shrink-0"></div>
                            <span className="text-sm">{ms}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2 text-primary">
                        <BookOpen className="h-4 w-4" /> {t("rm.resources")}
                      </h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {month.resources?.map((res: string, j: number) => (
                          <li key={j}>{res}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-8">
            <Button variant="outline" onClick={() => setRoadmap(null)}>{t("rm.another")}</Button>
          </div>
        </div>
      )}
    </div>
  );
}
