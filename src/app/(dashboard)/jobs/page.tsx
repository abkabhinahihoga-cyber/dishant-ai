"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Loader2, Target, ExternalLink, MapPin, Building2, Clock } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

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

  // In a real app, these would come from an external API or database.
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
    },
    {
      id: "4",
      title: "UX/UI Design Intern",
      company: "Creative Studio",
      location: "Remote",
      type: "Internship",
      description: "Help design beautiful web interfaces. Figma skills required. HTML/CSS is a plus."
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
      
      // Sort by match score descending
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
        <Button onClick={handleMatch} disabled={isMatching} size="lg" className="shrink-0">
          {isMatching ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Target className="mr-2 h-5 w-5" />}
          {isMatching ? "Analyzing Fit..." : "Find My Matches"}
        </Button>
      </div>

      {!hasSearched && !isMatching && (
        <Card className="glass-card text-center py-24">
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Briefcase className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold font-heading">Ready to land your first role?</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Click the button above. Our AI will scan open roles and calculate exactly how well you match based on your skills, experience, and personality profile.
            </p>
          </CardContent>
        </Card>
      )}

      {isMatching && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="glass-card animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-muted rounded w-1/4 mb-6"></div>
                <div className="h-20 bg-muted rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {hasSearched && !isMatching && (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="glass-card overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-6 md:p-8">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-bold font-heading mb-2">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1 font-medium text-foreground"><Building2 className="h-4 w-4" /> {job.company}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
                        <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {job.type}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{job.description}</p>
                  
                  <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                    <h4 className="text-sm font-semibold flex items-center gap-2 mb-2 text-primary">
                      <Target className="h-4 w-4" /> AI Match Analysis
                    </h4>
                    <p className="text-sm text-muted-foreground">{job.matchReason}</p>
                  </div>
                </div>
                
                <div className="md:w-64 bg-muted/30 border-l border-border/50 p-6 md:p-8 flex flex-col justify-center items-center text-center">
                  <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r="45" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted" />
                      <circle 
                        cx="48" cy="48" r="45" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="6" 
                        strokeDasharray={283}
                        strokeDashoffset={283 - (283 * (job.matchScore || 0)) / 100}
                        className={
                          (job.matchScore || 0) >= 80 ? "text-green-500" : 
                          (job.matchScore || 0) >= 60 ? "text-yellow-500" : "text-red-500"
                        }
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-2xl font-bold">{job.matchScore}%</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium mb-6">Match Score</p>
                  <Button 
                    className="w-full gap-2"
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
