"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Loader2, Target, ExternalLink, MapPin, Building2, Clock, Bell, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  matchScore?: number;
  matchReason?: string;
}

export default function JobMatcherPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("education_category")
          .eq("auth_user_id", user.id)
          .single();
        if (data) {
          setCategory(data.education_category);
        }
      }
      setLoadingProfile(false);
    };
    fetchProfile();
  }, [supabase]);

  // We're mocking a few typical entry-level tech jobs for the MVP.
  const MOCK_JOBS: Job[] = [
    {
      id: "1",
      title: "Junior Frontend Developer",
      company: "TechNova Solutions",
      location: "Remote",
      type: "Full-time",
      description: "Looking for an entry-level developer with React and Next.js experience to join our core product team."
    },
    {
      id: "2",
      title: "Data Analyst Intern",
      company: "DataMetrics Inc",
      location: "New York, NY",
      type: "Internship",
      description: "Summer internship analyzing user behavior data. Requires basic Python and SQL knowledge."
    },
    {
      id: "3",
      title: "Software Engineering New Grad",
      company: "Global Systems",
      location: "Austin, TX",
      type: "Full-time",
      description: "Join our new grad rotational program. Looking for strong fundamentals in Java, C++, or Python."
    }
  ];

  const handleMatch = async () => {
    setIsMatching(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobs: MOCK_JOBS })
      });

      if (!res.ok) throw new Error("Failed to match jobs");
      const matchedJobs = await res.json();
      
      const sortedJobs = matchedJobs.sort((a: Job, b: Job) => (b.matchScore || 0) - (a.matchScore || 0));
      setJobs(sortedJobs);
      setHasSearched(true);
      toast.success("Jobs matched to your profile!");
    } catch {
      toast.error("Failed to analyze jobs. Please try again.");
    } finally {
      setIsMatching(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // --- Sarkari Result Style UI for Entrance Exams & School ---
  if (category === 'entrance_exams' || category === 'school') {
    return (
      <div className="max-w-6xl mx-auto py-6 animate-fade-in space-y-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-[#9F1239] mb-2 uppercase tracking-wide flex items-center justify-center gap-3">
            <Bell className="h-8 w-8 fill-[#9F1239]" />
            Exam Updates & Alerts
            <Bell className="h-8 w-8 fill-[#9F1239]" />
          </h1>
          <p className="text-slate-600 font-medium">Your one-stop destination for all competitive exam notifications</p>
        </div>

        {/* Ticker Tape */}
        <div className="bg-[#9F1239] text-white p-2 rounded-lg flex items-center shadow-md overflow-hidden">
          <span className="font-bold shrink-0 mr-4 bg-white text-[#9F1239] px-2 py-0.5 rounded text-sm animate-pulse">LATEST</span>
          <div className="overflow-hidden flex-1">
            <div className="text-sm font-medium whitespace-nowrap animate-[ticker_18s_linear_infinite]">
              JEE Main 2026 Session 1 Registration Started &nbsp;|&nbsp; NEET UG 2026 Notification Expected Next Week &nbsp;|&nbsp; CUET UG 2026 Syllabus Revised - Check Now! &nbsp;|&nbsp; JEE Main 2026 Session 1 Registration Started &nbsp;|&nbsp; NEET UG 2026 Notification Expected Next Week
            </div>
          </div>
        </div>

        {/* 3 Columns Sarkari Style */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Results Column */}
          <div className="border-2 border-[#9F1239]/20 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-[#9F1239] text-white text-center py-3 font-bold text-lg border-b-4 border-[#881337]">
              Results
            </div>
            <ul className="divide-y divide-slate-100 p-2">
              {[
                { title: "CBSE Class 12th Result 2025", new: false },
                { title: "JEE Main Session 2 Result Out", new: true },
                { title: "UPSC NDA I Final Result", new: false },
                { title: "NEET UG 2025 Scorecard", new: false },
                { title: "SSC CHSL Tier 1 Result", new: true }
              ].map((item, i) => (
                <li key={i} className="py-2.5 px-3 hover:bg-slate-50 transition-colors">
                  <a href="#" className="text-sm font-medium text-blue-700 hover:text-red-600 hover:underline flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
                    <span>
                      {item.title}
                      {item.new && <span className="ml-2 inline-block bg-red-600 text-white text-[10px] px-1.5 rounded animate-pulse">New</span>}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Admit Card Column */}
          <div className="border-2 border-[#15803D]/20 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-[#15803D] text-white text-center py-3 font-bold text-lg border-b-4 border-[#166534]">
              Admit Card
            </div>
            <ul className="divide-y divide-slate-100 p-2">
              {[
                { title: "CUET UG 2026 City Intimation Slip", new: true },
                { title: "BITSAT 2026 Slot Booking / Admit Card", new: true },
                { title: "MHT CET 2026 PCM Admit Card", new: false },
                { title: "NDA II Exam Call Letter", new: false },
                { title: "VITEEE 2026 Admit Card Download", new: false }
              ].map((item, i) => (
                <li key={i} className="py-2.5 px-3 hover:bg-slate-50 transition-colors">
                  <a href="#" className="text-sm font-medium text-blue-700 hover:text-green-700 hover:underline flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
                    <span>
                      {item.title}
                      {item.new && <span className="ml-2 inline-block bg-red-600 text-white text-[10px] px-1.5 rounded animate-pulse">New</span>}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Latest Jobs / Forms Column */}
          <div className="border-2 border-[#1D4ED8]/20 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-[#1D4ED8] text-white text-center py-3 font-bold text-lg border-b-4 border-[#1E3A8A]">
              Latest Forms
            </div>
            <ul className="divide-y divide-slate-100 p-2">
              {[
                { title: "JEE Advanced 2026 Online Form", new: true },
                { title: "Indian Navy B.Tech Entry Scheme", new: true },
                { title: "SSC GD Constable Application", new: false },
                { title: "UPPSC RO/ARO Pre Online Form", new: false },
                { title: "Railway RRB NTPC Recruitment", new: false }
              ].map((item, i) => (
                <li key={i} className="py-2.5 px-3 hover:bg-slate-50 transition-colors">
                  <a href="#" className="text-sm font-medium text-blue-700 hover:text-blue-900 hover:underline flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
                    <span>
                      {item.title}
                      {item.new && <span className="ml-2 inline-block bg-red-600 text-white text-[10px] px-1.5 rounded animate-pulse">New</span>}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // --- College / Diploma / Professional UI (Job Matcher) ---
  return (
    <div className="max-w-5xl mx-auto py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-2 mb-2">
            <Briefcase className="h-8 w-8 text-primary" />
            Smart Job Matcher
          </h1>
          <p className="text-muted-foreground">We analyze your resume and career test results to find the perfect roles.</p>
        </div>
        <Button onClick={handleMatch} disabled={isMatching} size="lg" className="shrink-0 shadow-lg shadow-primary/25">
          {isMatching ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Target className="mr-2 h-5 w-5" />}
          {isMatching ? "Analyzing Fit..." : "Find My Matches"}
        </Button>
      </div>

      {!hasSearched && !isMatching && (
        <Card className="glass-card text-center py-24 border-primary/10 bg-gradient-to-b from-background to-primary/5">
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 border border-primary/20 shadow-inner">
              <Briefcase className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-3xl font-bold font-heading">Ready to land your first role?</h2>
            <p className="text-muted-foreground max-w-md mx-auto text-lg">
              Click the button above. Our AI will scan open roles and calculate exactly how well you match based on your skills and profile.
            </p>
          </CardContent>
        </Card>
      )}

      {isMatching && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="glass-card animate-pulse border-primary/10">
              <CardContent className="p-6">
                <div className="h-6 bg-primary/10 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-primary/5 rounded w-1/4 mb-6"></div>
                <div className="h-20 bg-primary/5 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {hasSearched && !isMatching && (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="glass-card overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300">
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-6 md:p-8">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-bold font-heading mb-2 text-foreground">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1 font-medium text-foreground"><Building2 className="h-4 w-4" /> {job.company}</span>
                        <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md"><MapPin className="h-4 w-4" /> {job.location}</span>
                        <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md"><Clock className="h-4 w-4" /> {job.type}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed text-sm">{job.description}</p>
                  
                  <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 shadow-inner">
                    <h4 className="text-sm font-semibold flex items-center gap-2 mb-2 text-primary">
                      <Target className="h-4 w-4" /> AI Match Analysis
                    </h4>
                    <p className="text-sm text-muted-foreground">{job.matchReason}</p>
                  </div>
                </div>
                
                <div className="md:w-72 bg-gradient-to-br from-muted/50 to-muted/20 border-l border-border/50 p-6 md:p-8 flex flex-col justify-center items-center text-center">
                  <div className="relative w-28 h-28 mb-4 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90 drop-shadow-md">
                      <circle cx="56" cy="56" r="52" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/50" />
                      <circle 
                        cx="56" cy="56" r="52" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="8" 
                        strokeDasharray={326}
                        strokeDashoffset={326 - (326 * (job.matchScore || 0)) / 100}
                        strokeLinecap="round"
                        className={
                          (job.matchScore || 0) >= 80 ? "text-emerald-500" : 
                          (job.matchScore || 0) >= 60 ? "text-amber-500" : "text-rose-500"
                        }
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold font-heading">{job.matchScore}%</span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mt-1">Match</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full gap-2 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all"
                    onClick={() => toast.success(`Successfully applied to ${job.company}!`)}
                  >
                    Apply Now <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
