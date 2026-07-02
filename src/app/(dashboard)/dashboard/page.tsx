"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Compass, Target, ArrowRight, BookOpen, Search, Briefcase } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const [fullName, setFullName] = useState("");
  const [category, setCategory] = useState("graduation");
  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("full_name, education_category")
          .eq("auth_user_id", user.id)
          .single();
        if (data) {
          setFullName(data.full_name || "");
          if (data.education_category) setCategory(data.education_category);
        }
      }
    };
    fetchProfile();
  }, [supabase]);

  const firstName = fullName.split(' ')[0] || "Student";

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-4">
      {/* Personalized Greeting */}
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900 dark:text-slate-100">
          Hello, {firstName} 👋
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Let&apos;s continue your learning journey today.
        </p>
      </div>

      <div className="grid gap-4 md:gap-6 md:grid-cols-2">
        {/* Primary Action Card based on Category */}
        <Card className="glass-card flex flex-col border-indigo-100 shadow-md shadow-indigo-100/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-indigo-700">
                  {category === 'school' ? <BookOpen className="h-5 w-5" /> : 
                   category === 'entrance_exams' ? <Target className="h-5 w-5" /> : 
                   <Compass className="h-5 w-5" />} 
                  {category === 'school' ? "Today's Study Plan" : 
                   category === 'entrance_exams' ? "Mock Test Prep" : 
                   "Career Roadmap"}
                </CardTitle>
                <CardDescription className="mt-1">
                  {category === 'school' ? "Stay on top of your subjects" : 
                   category === 'entrance_exams' ? "Practice makes perfect" : 
                   "Your path to placement"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100/50">
              <div className="flex justify-between text-sm font-medium mb-2 text-indigo-900">
                <span>Current Progress</span>
                <span>35%</span>
              </div>
              <Progress value={35} className="h-2 bg-indigo-100" />
              <p className="text-xs text-indigo-600 mt-3 font-medium">Keep going! You&apos;re doing great.</p>
            </div>
          </CardContent>
          <CardContent className="pt-0">
            <Link href={category === 'school' ? "/study-planner" : category === 'entrance_exams' ? "/study-planner" : "/roadmap"}>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                Continue Learning <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* AI Mentor Quick Access */}
        <Card className="glass-card flex flex-col shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-violet-500" /> AI Career Mentor
            </CardTitle>
            <CardDescription>Get instant guidance & answers</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-3">
            <div className="p-3 rounded-xl border bg-slate-50/50 hover:bg-slate-100 transition-colors cursor-pointer group">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-violet-100 text-violet-600 shrink-0 group-hover:scale-110 transition-transform">
                  <Search className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-700">Ask a question</h4>
                  <p className="text-xs text-slate-500 mt-0.5">e.g. &quot;How to prepare for interviews?&quot;</p>
                </div>
              </div>
            </div>
            
            {(category === 'graduation' || category === 'diploma') && (
              <div className="p-3 rounded-xl border bg-slate-50/50 hover:bg-slate-100 transition-colors cursor-pointer group">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 shrink-0 group-hover:scale-110 transition-transform">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700">Resume Review</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Let AI improve your CV</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardContent className="pt-0">
            <Link href="/career-mentor">
              <Button variant="outline" className="w-full border-violet-200 text-violet-700 hover:bg-violet-50">
                Chat with Mentor
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
