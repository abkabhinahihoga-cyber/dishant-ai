"use client";

import Link from "next/link";
import { Sparkles, Menu, Bell, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/layout/sidebar";

export function Navbar() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("student");
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setEmail(data.user.email || "");
        // Fetch profile details
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("auth_user_id", data.user.id)
          .single();
        if (profile) {
          setFullName(profile.full_name || "");
          setRole(profile.role || "student");
        }
      }
    };
    getUser();
  }, [supabase]);

  // Close dropdown when clicking outside
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

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/30 bg-background/80 backdrop-blur-xl">
      <div className="flex h-14 md:h-16 items-center px-4 md:px-8 gap-4">
        <Sheet>
          <SheetTrigger className="md:hidden h-9 w-9 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50">
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <Sidebar className="w-full border-none" />
          </SheetContent>
        </Sheet>
        
        <Link href="/dashboard" className="flex items-center gap-2.5 mr-4">
          <div className="bg-gradient-to-br from-primary to-primary/70 p-1.5 rounded-lg shadow-sm">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-lg hidden sm:inline-block tracking-tight">Dishant AI</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <LanguageToggle />
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background"></span>
          </Button>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="relative h-9 w-9 rounded-xl outline-none inline-flex items-center justify-center transition-colors hover:bg-accent"
            >
              <Avatar className="h-9 w-9 rounded-xl border border-border/50">
                <AvatarImage src="" alt="@user" />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary rounded-xl">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-border/50 bg-popover text-popover-foreground shadow-lg ring-1 ring-foreground/5 z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
                {/* Profile Header */}
                <div className="px-4 py-3 border-b border-border/30">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 rounded-xl border border-border/50">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary rounded-xl">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <p className="text-sm font-semibold truncate">{fullName || "Student"}</p>
                      <p className="text-xs text-muted-foreground truncate">{email}</p>
                      <span className="text-[10px] font-medium uppercase tracking-wider text-primary mt-0.5">{role}</span>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1.5">
                  <Link
                    href="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors cursor-pointer"
                  >
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    Profile & Settings
                  </Link>
                  {role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4 text-muted-foreground" />
                      Admin Panel
                    </Link>
                  )}
                </div>

                <div className="border-t border-border/30 py-1.5">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
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
