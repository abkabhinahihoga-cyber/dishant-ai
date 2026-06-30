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

  const [showFallback, setShowFallback] = useState(false);

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
      setShowFallback(true);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50 animate-in slide-in-from-bottom-full duration-500">
      <div className="mx-auto max-w-md bg-gradient-to-r from-yellow-50 to-amber-100 border-2 border-yellow-300 rounded-2xl shadow-2xl p-4 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-200">
            <Download className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-amber-950">ऐप इंस्टॉल करें (Install App)</h3>
            <p className="text-xs text-amber-900 mt-1 leading-relaxed font-medium">
              Dishant AI को अपने फ़ोन में इंस्टॉल करें। यह तेज़ और आसान है!
            </p>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          {showFallback && !isIOS && !canInstall && (
            <div className="text-xs text-amber-800 flex items-center gap-1.5 bg-white/70 px-3 py-2.5 rounded-xl border border-yellow-200 w-full justify-center font-medium shadow-sm animate-in fade-in zoom-in duration-300">
              ऊपर मेनू (⋮) दबाएं और <b className="mx-1 text-amber-950">Install App</b> चुनें
            </div>
          )}
          
          <div className="flex w-full gap-2">
            {isIOS ? (
              <div className="text-xs text-amber-800 flex items-center gap-1.5 bg-white/70 px-3 py-2.5 rounded-xl border border-yellow-200 w-full justify-center font-medium shadow-sm">
                नीचे <Share className="h-4 w-4 mx-1 text-amber-600" /> दबाएं और <b className="ml-1 text-amber-950">Add to Home Screen</b> चुनें
              </div>
            ) : (
              <Button onClick={handleInstallClick} className="w-full rounded-xl bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-200 h-11 text-sm font-bold">
                इंस्टॉल करें (Install)
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={handleDismiss} className="flex-shrink-0 rounded-xl h-11 w-11 text-amber-600 hover:bg-white/50 hover:text-amber-800">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
