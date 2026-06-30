"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Compass, Target, Trophy, ArrowRight, Activity, Zap, Sparkles } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/use-translation";

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl glass p-8 shadow-md">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2">{t("dash.welcome")} 👋</h1>
            <p className="text-muted-foreground text-lg">{t("dash.overview")}</p>
          </div>
          <Link href="/career-mentor">
            <Button size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-all">
              <BrainCircuit className="mr-2 h-5 w-5" />
              {t("nav.mentor")}
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t("dash.xp")}</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">68</div>
            <Progress value={68} className="h-1 mt-3" />
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Level</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">Lvl 3</div>
            <Progress value={45} className="h-1 mt-3 bg-muted" />
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t("dash.streak")}</CardTitle>
            <Zap className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">4 Days</div>
          </CardContent>
        </Card>

        <Card className="glass-card bg-primary text-primary-foreground border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground/80">Premium Plan</CardTitle>
            <Sparkles className="h-4 w-4 text-primary-foreground/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">Free Tier</div>
            <Link href="/pricing">
              <Button variant="secondary" size="sm" className="w-full mt-3 rounded-full text-xs font-semibold">
                Upgrade for ₹199/mo
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Roadmap Widget */}
        <Card className="glass-card flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Compass className="h-5 w-5 text-primary" /> Active Roadmap
                </CardTitle>
                <CardDescription>Software Engineer Placement Prep</CardDescription>
              </div>
              <Link href="/roadmap">
                <Button variant="ghost" size="icon">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span>Overall Progress</span>
                  <span>35%</span>
                </div>
                <Progress value={35} className="h-2" />
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Current Milestones</h4>
                
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full border border-primary flex items-center justify-center shrink-0 mt-0.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Master Next.js App Router</p>
                    <p className="text-xs text-muted-foreground mt-1">Due in 3 days</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full border border-muted-foreground flex items-center justify-center shrink-0 mt-0.5">
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Build Full-stack Portfolio Project</p>
                    <p className="text-xs text-muted-foreground mt-1">Due next week</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardContent className="pt-0">
            <Link href="/roadmap">
              <Button variant="outline" className="w-full">View Full Roadmap</Button>
            </Link>
          </CardContent>
        </Card>

        {/* AI Suggestions / Career Test Widget */}
        <Card className="glass-card flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" /> Next Steps
                </CardTitle>
                <CardDescription>Recommended actions for you</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            
            <div className="p-4 rounded-xl border bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold">Take the Career Discovery Test</h4>
                  <p className="text-xs text-muted-foreground mt-1 mb-3">
                    Unlock your personalized career fit score and discover paths that match your personality.
                  </p>
                  <Link href="/career-test">
                    <Button size="sm">Start Assessment</Button>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-xl border bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold">Review your Resume</h4>
                  <p className="text-xs text-muted-foreground mt-1 mb-3">
                    Your resume needs more action verbs. Let the AI Mentor help you rewrite bullet points.
                  </p>
                  <Link href="/career-mentor">
                    <Button variant="secondary" size="sm">Ask AI Mentor</Button>
                  </Link>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
