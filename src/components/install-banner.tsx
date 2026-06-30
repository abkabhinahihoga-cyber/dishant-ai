"use client";

import { usePwaInstall } from "@/hooks/use-pwa-install";
import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function InstallBanner() {
  const { canInstall, installApp } = usePwaInstall();
  const [isVisible, setIsVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default true to avoid flash

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    // Only show if can install, not dismissed in this session, and NOT authenticated
    const hasDismissed = sessionStorage.getItem("pwa-banner-dismissed");
    if (canInstall && !hasDismissed && !isAuthenticated) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [canInstall, isAuthenticated]);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("pwa-banner-dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
      <div className="max-w-3xl mx-auto glass-card border border-primary/20 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="bg-primary/10 p-2 rounded-xl text-primary flex-shrink-0">
            <Download className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">Install Dishant AI</h4>
            <p className="text-xs text-muted-foreground">Add to your home screen for faster access.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button onClick={installApp} className="w-full sm:w-auto rounded-xl">
            Install App
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDismiss} className="flex-shrink-0 rounded-full h-9 w-9 text-muted-foreground">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
