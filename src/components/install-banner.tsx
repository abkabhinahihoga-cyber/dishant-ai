"use client";

import { usePwaInstall } from "@/hooks/use-pwa-install";
import { X, Download, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function InstallBanner() {
  const { canInstall, installApp, isInstalled } = usePwaInstall();
  const [isVisible, setIsVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default true to avoid flash
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Register Service Worker for Android Chrome PWA support
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error);
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const hasDismissed = sessionStorage.getItem("pwa-banner-dismissed");
    
    if (isInstalled || isAuthenticated || hasDismissed) {
      setIsVisible(false);
      return;
    }

    // Show if iOS, or if Android (based on userAgent), or if canInstall triggers
    const isAndroid = /android/i.test(window.navigator.userAgent);
    if (canInstall || isIOS || isAndroid) {
      setIsVisible(true);
    }
  }, [canInstall, isIOS, isAuthenticated, isInstalled]);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("pwa-banner-dismissed", "true");
  };

  const handleInstallClick = () => {
    if (canInstall) {
      installApp();
    } else {
      // Fallback for Android if beforeinstallprompt hasn't fired
      alert("To install the app, tap the browser menu (⋮) and select 'Install app' or 'Add to Home screen'.");
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-[100] animate-in slide-in-from-bottom-10 fade-in duration-300">
      <div className="max-w-3xl mx-auto glass-card border border-primary/20 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl bg-background/95 backdrop-blur-xl">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="bg-primary/10 p-2 rounded-xl text-primary flex-shrink-0">
            <Download className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">Install Dishant AI App</h4>
            <p className="text-xs text-muted-foreground">Add to your home screen for faster access.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {isIOS ? (
            <div className="text-xs text-muted-foreground flex items-center gap-1.5 bg-accent/50 px-3 py-2 rounded-lg border border-border/50">
              Tap <Share className="h-3.5 w-3.5" /> and select <b>Add to Home Screen</b>
            </div>
          ) : (
            <Button onClick={handleInstallClick} className="w-full sm:w-auto rounded-xl">
              Install App
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={handleDismiss} className="flex-shrink-0 rounded-full h-9 w-9 text-muted-foreground hover:bg-accent">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
