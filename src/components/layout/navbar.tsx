"use client";

import Link from "next/link";
import { Sparkles, Bell, User, Settings, LogOut, ChevronDown, BookOpen, Target, GraduationCap, Briefcase, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

const CATEGORIES = [
  { id: 'school', title: 'School (9-12)', icon: BookOpen },
  { id: 'entrance_exams', title: 'Entrance Exams', icon: Target },
  { id: 'graduation', title: 'College', icon: GraduationCap },
  { id: 'diploma', title: 'Diploma/ITI', icon: Briefcase },
];

export function Navbar() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("student");
  const [educationCategory, setEducationCategory] = useState("graduation");
  const [profileOpen, setProfileOpen] = useState(false);
  const [stageModalOpen, setStageModalOpen] = useState(false);
  const [savingStage, setSavingStage] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setEmail(data.user.email || "");
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, role, education_category")
          .eq("auth_user_id", data.user.id)
          .single();
        if (profile) {
          setFullName(profile.full_name || "");
          setRole(profile.role || "student");
          if (profile.education_category) setEducationCategory(profile.education_category);
        }
      }
    };
    getUser();
  }, [supabase]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setProfileOpen(false);
    await supabase.auth.signOut();
    router.push("/login");
  };

  const currentCategory = CATEGORIES.find(c => c.id === educationCategory) || CATEGORIES[2];

  const updateStage = async (newId: string) => {
    if (newId === educationCategory) {
      setStageModalOpen(false);
      return;
    }
    
    setSavingStage(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({ education_category: newId })
        .eq('auth_user_id', user.id);
        
      if (!error) {
        setEducationCategory(newId);
        toast.success("Education stage updated!");
        setTimeout(() => window.location.reload(), 500); // Reload to update sidebar/features
      } else {
        toast.error("Failed to update stage");
      }
    }
    setSavingStage(false);
    setStageModalOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/30 bg-background/95 backdrop-blur-xl">
      <div className="flex h-16 items-center px-4 md:px-8 justify-between">
        
        {/* Left: Logo & Stage Switcher */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center">
            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-1.5 md:p-2 rounded-xl shadow-lg shadow-indigo-500/20 mr-2 md:mr-3">
              <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-base md:text-xl leading-none tracking-tight">Dishant AI</span>
              
              {/* Mobile Stage Switcher (Right below logo) */}
              <Dialog open={stageModalOpen} onOpenChange={setStageModalOpen}>
                <DialogTrigger className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors group outline-none">
                  <span className="truncate max-w-[120px]">{currentCategory.title}</span>
                  <ChevronDown className="h-3 w-3 group-hover:text-primary transition-colors" />
                </DialogTrigger>
                <DialogContent className="sm:max-w-md rounded-2xl">
                  <DialogHeader>
                    <DialogTitle className="font-heading text-xl">Select Education Stage</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 gap-3 py-4">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => updateStage(cat.id)}
                        disabled={savingStage}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                          educationCategory === cat.id 
                            ? "border-indigo-500 bg-indigo-50" 
                            : "border-border hover:border-indigo-200 hover:bg-slate-50"
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${educationCategory === cat.id ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-500"}`}>
                          <cat.icon className="h-5 w-5" />
                        </div>
                        <span className="font-semibold">{cat.title}</span>
                        {savingStage && educationCategory !== cat.id && <Loader2 className="ml-auto h-4 w-4 animate-spin text-muted-foreground" />}
                      </button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </Link>
        </div>
        
        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <LanguageToggle />
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground hidden sm:inline-flex">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background"></span>
          </Button>

          {/* Profile Dropdown (Desktop Only) - Mobile uses bottom nav */}
          <div className="relative hidden md:block" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="relative h-10 w-10 rounded-xl outline-none inline-flex items-center justify-center transition-colors hover:bg-accent"
            >
              <Avatar className="h-10 w-10 rounded-xl border border-border/50">
                <AvatarImage src="" alt="@user" />
                <AvatarFallback className="bg-gradient-to-br from-indigo-500/20 to-violet-500/5 text-indigo-600 rounded-xl">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-border/50 bg-popover text-popover-foreground shadow-xl ring-1 ring-foreground/5 z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-border/30 bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 rounded-xl border border-border/50 bg-white">
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500/20 to-violet-500/5 text-indigo-600 rounded-xl">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <p className="text-sm font-bold truncate">{fullName || "Student"}</p>
                      <p className="text-xs text-muted-foreground truncate">{email}</p>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 mt-0.5">{role}</span>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <Link href="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-slate-100 transition-colors">
                    <Settings className="h-4 w-4 text-slate-500" /> Settings
                  </Link>
                  {role === "admin" && (
                    <Link href="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-slate-100 transition-colors">
                      <Sparkles className="h-4 w-4 text-indigo-500" /> Admin Panel
                    </Link>
                  )}
                </div>

                <div className="border-t border-border/30 py-2">
                  <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left">
                    <LogOut className="h-4 w-4" /> Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
