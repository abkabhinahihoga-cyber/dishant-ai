"use client";

import Link from "next/link";
import { LayoutDashboard, Users, Settings, LogOut, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";

type AdminSidebarProps = React.HTMLAttributes<HTMLDivElement>;

export function AdminSidebar({ className, ...props }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className={cn("pb-12 h-screen flex flex-col", className)} {...props}>
      <div className="space-y-4 py-4 flex-1">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight font-heading text-primary">
            Admin Panel
          </h2>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link 
                href={item.href} 
                key={item.name}
                className={cn(
                  "flex items-center w-full justify-start px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  pathname === item.href ? "bg-primary/10 text-primary hover:bg-primary/20" : "text-muted-foreground"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      <div className="px-3 py-2 border-t border-border/50">
        <div className="space-y-1">
          <Link 
            href="/dashboard"
            className="flex items-center w-full justify-start px-4 py-2 text-sm font-medium rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to App
          </Link>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
}
