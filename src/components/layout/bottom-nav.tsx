"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BrainCircuit, BookOpen, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Sidebar } from "@/components/layout/sidebar";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Guidance", href: "/career-mentor", icon: BrainCircuit },
    { name: "Study", href: "/study-planner", icon: BookOpen },
    { name: "Wellness", href: "/wellness", icon: Heart },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/30 pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <div className="absolute top-0 w-8 h-1 bg-primary rounded-b-full shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
              )}
              <item.icon className={cn("h-5 w-5", isActive && "fill-primary/20")} />
              <span className="text-[10px] font-medium tracking-wide">{item.name}</span>
            </Link>
          );
        })}

        {/* Profile / Menu Trigger */}
        <Sheet>
          <SheetTrigger className="flex flex-col items-center justify-center w-full h-full space-y-1 text-muted-foreground hover:text-foreground transition-colors outline-none">
            <User className="h-5 w-5" />
            <span className="text-[10px] font-medium tracking-wide">Profile</span>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <Sidebar className="w-full border-none h-full" />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
