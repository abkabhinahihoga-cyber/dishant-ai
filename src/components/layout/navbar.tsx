"use client";

import Link from "next/link";
import { Sparkles, Menu, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/layout/sidebar";

export function Navbar() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setEmail(data.user.email || "");
      }
    };
    getUser();
  }, [supabase.auth]);

  const handleLogout = async () => {
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

          <DropdownMenu>
            <DropdownMenuTrigger className="relative h-9 w-9 rounded-xl outline-none p-0 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50">
              <Avatar className="h-9 w-9 rounded-xl border border-border/50">
                <AvatarImage src="" alt="@user" />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary rounded-xl">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 rounded-xl" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Student</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                Profile & Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
