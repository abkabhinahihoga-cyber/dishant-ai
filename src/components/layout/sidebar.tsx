"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, BrainCircuit, Compass, Target, BookOpen, Heart, Settings, Zap, FileEdit, Briefcase, Video, Code2, MonitorPlay, LogOut, Download, Building2, Info, ExternalLink, GraduationCap, Wrench, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "@/lib/i18n/use-translation";
import { usePwaInstall } from "@/hooks/use-pwa-install";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t, language } = useTranslation();
  const { canInstall, installApp } = usePwaInstall();

  const links = [
    { name: t("nav.dashboard"), href: "/dashboard", icon: LayoutDashboard },
    { name: t("nav.mentor"), href: "/career-mentor", icon: BrainCircuit },
    { name: t("nav.test"), href: "/career-test", icon: Target },
    { name: t("nav.resume"), href: "/resume-builder", icon: FileEdit },
    { name: t("nav.portfolio"), href: "/portfolio-builder", icon: Code2 },
    { name: t("nav.interviews"), href: "/interviews", icon: Video },
    { name: t("nav.jobs"), href: "/jobs", icon: Briefcase },
    { name: t("nav.govtJobs", "Govt Jobs"), href: "/govt-jobs", icon: Building2 },
    { name: t("nav.roadmap"), href: "/roadmap", icon: Compass },
    { name: "Study Planner", href: "/study-planner", icon: BookOpen },
    { name: t("nav.wellness"), href: "/wellness", icon: Heart },
  ];

  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [category, setCategory] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('xp, level, education_category')
          .eq('auth_user_id', user.id)
          .single();
        if (profile) {
          setXp(profile.xp || 0);
          setLevel(profile.level || 1);
          setCategory(profile.education_category);
        }
      }
    };
    fetchData();
  }, [pathname]);

  // Filter links dynamically based on user category
  const filteredLinks = links.filter((link) => {
    // These are core features everyone sees
    const coreLinks = ["/dashboard", "/career-mentor", "/roadmap", "/wellness", "/study-planner"];
    if (coreLinks.includes(link.href)) return true;

    // School & Entrance Exam Prep
    if (category === 'school' || category === 'entrance_exams') {
      if (link.href === '/career-test') return true;
      if (link.href === '/govt-jobs') return true;
      return false; // Hide resume, portfolio, jobs, interviews
    }

    // Government Exams
    if (category === 'government_exams') {
      if (link.href === '/career-test') return true;
      if (link.href === '/govt-jobs') return true;
      return false;
    }

    // Graduation & Diploma (or not set)
    if (category === 'graduation' || category === 'diploma' || !category) {
      return true; // Show everything
    }

    return true;
  });

  const xpForNextLevel = level * 100;
  const progressPercentage = (xp % 100) / 100 * 100;

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const APP_URL = "https://dishant-ai.vercel.app";

  const handleShare = async () => {
    const shareTitle = "Dishant AI - Your Career Companion";
    const shareText = language === "Hindi"
      ? "🚀 Dishant AI - तुम्हारा AI Career Mentor!\n\n✅ Career Guidance & Roadmap\n✅ Resume & Portfolio Builder\n✅ Mock Interviews\n✅ Govt Job Preparation\n✅ Wellness & Fitness Guide\n\nअभी free में try करो 👇"
      : "🚀 Dishant AI - Your AI Career Mentor!\n\n✅ Career Guidance & Roadmap\n✅ Resume & Portfolio Builder\n✅ Mock Interviews\n✅ Govt Job Preparation\n✅ Wellness & Fitness Guide\n\nTry it for free 👇";

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: APP_URL,
        });
      } catch (err) {
        // User cancelled share - do nothing
      }
    } else {
      // Fallback: copy to clipboard
      const fullMessage = `${shareText}\n${APP_URL}`;
      await navigator.clipboard.writeText(fullMessage);
      toast.success(language === "Hindi" ? "लिंक कॉपी हो गया! 🎉" : "Link copied to clipboard! 🎉");
    }
  };

  return (
    <div className={cn("pb-12 flex flex-col h-full", className)}>
      <div className="space-y-4 py-4 flex-1">
        <div className="px-3 py-2">
          <h2 className="mb-3 px-4 text-[11px] font-semibold tracking-widest text-muted-foreground/70 uppercase">
            Platform
          </h2>
          <div className="space-y-1">
            {filteredLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                  pathname.startsWith(link.href) 
                    ? "bg-gradient-to-r from-primary/15 to-primary/5 text-primary shadow-sm border border-primary/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <link.icon className={cn("h-[18px] w-[18px]", pathname.startsWith(link.href) && "text-primary")} />
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Gamification Panel */}
      <div className="px-4 py-4 mx-3 mb-2 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10">
        <div className="flex justify-between items-center mb-2.5">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-primary to-primary/70 p-1.5 rounded-lg shadow-sm">
              <Zap className="h-3 w-3 text-primary-foreground fill-primary-foreground" />
            </div>
            <span className="text-sm font-bold text-foreground">Level {level}</span>
          </div>
          <span className="text-[10px] font-medium text-muted-foreground">{xp % 100} / 100 XP</span>
        </div>
        <Progress value={progressPercentage} className="h-1.5 bg-primary/10" />
      </div>

      <div className="px-3 py-2 space-y-1">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted/50",
            pathname === "/settings" && "bg-gradient-to-r from-primary/15 to-primary/5 text-primary shadow-sm border border-primary/10"
          )}
        >
          <Settings className="h-[18px] w-[18px]" />
          {t("common.settings")}
        </Link>

        {/* About Founder */}
        <Dialog>
          <DialogTrigger className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted/50 text-left">
            <Info className="h-[18px] w-[18px]" />
            {t('about', 'About')}
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-2xl border-border/50 overflow-hidden p-0">
            <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-6 py-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_60%)]" />
              <div className="relative z-10">
                <div className="h-20 w-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 border border-white/30 shadow-lg">
                  <GraduationCap className="h-10 w-10 text-white" />
                </div>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-heading font-black text-white tracking-tight">Vaibhav Patel</DialogTitle>
                </DialogHeader>
                <p className="text-white/80 text-sm mt-1 font-medium">Mechanical Engineering Student</p>
                <p className="text-white/60 text-xs mt-0.5">KNIT Sultanpur</p>
              </div>
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('aboutDesc', 'Passionate about building tech solutions that empower students and rural communities. Creator of multiple impactful applications.')}
              </p>
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Other Projects</p>
                <a
                  href="http://dehati-sathi.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-all group"
                >
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                    <Wrench className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">Dehati Sathi</p>
                    <p className="text-xs text-muted-foreground truncate">dehati-sathi.vercel.app</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-emerald-500 transition-colors shrink-0" />
                </a>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Share App */}
        <button
          onClick={handleShare}
          className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 text-muted-foreground hover:text-blue-600 hover:bg-blue-500/10 text-left"
        >
          <Share2 className="h-[18px] w-[18px]" />
          {t('shareApp', 'Share App')}
        </button>

        {canInstall && (
          <button
            onClick={installApp}
            className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 text-muted-foreground hover:text-primary hover:bg-primary/10 text-left"
          >
            <Download className="h-[18px] w-[18px]" />
            Install App
          </button>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-left"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Log Out
        </button>
      </div>
    </div>
  );
}
