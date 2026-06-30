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
      <div className="mx-auto max-w-md relative overflow-hidden bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-400 border-2 border-yellow-200 rounded-3xl shadow-[0_20px_50px_rgba(251,191,36,0.5)] p-5 flex flex-col gap-5">
        
        {/* Decorative Pattern Overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
        <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-[-50px] left-[-50px] w-32 h-32 bg-orange-600/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Absolute Close Button at Top Right */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleDismiss} 
          className="absolute top-2 right-2 z-10 h-10 w-10 rounded-full bg-black/5 hover:bg-black/10 text-amber-950/70 hover:text-amber-950 transition-colors"
        >
          <X className="h-6 w-6" />
        </Button>

        <div className="flex items-start gap-4 relative z-10 pr-8">
          <div className="h-14 w-14 rounded-2xl bg-white text-orange-500 flex items-center justify-center shrink-0 shadow-xl shadow-orange-500/20">
            <Download className="h-7 w-7" />
          </div>
          <div className="pt-1">
            <h3 className="font-bold text-lg text-amber-950 leading-tight">ऐप इंस्टॉल करें</h3>
            <p className="text-sm text-amber-950/80 mt-1 leading-snug font-medium">
              Dishant AI को अपने फ़ोन में इंस्टॉल करें। यह तेज़ और आसान है!
            </p>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 relative z-10">
          {showFallback && !isIOS && !canInstall && (
            <div className="text-sm text-amber-950 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/50 w-full justify-center font-medium shadow-sm animate-in fade-in zoom-in duration-300">
              ऊपर मेनू (⋮) दबाएं और <b className="text-orange-600">Install App</b> चुनें
            </div>
          )}
          
          <div className="flex w-full gap-2">
            {isIOS ? (
              <div className="text-sm text-amber-950 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/50 w-full justify-center font-medium shadow-sm">
                नीचे <Share className="h-5 w-5 mx-1 text-orange-500" /> दबाएं और <b className="text-orange-600">Add to Home Screen</b> चुनें
              </div>
            ) : (
              <Button onClick={handleInstallClick} className="w-full rounded-2xl bg-amber-950 text-white hover:bg-black shadow-xl shadow-amber-950/20 h-14 text-base font-bold transition-transform active:scale-95">
                इंस्टॉल करें (Install)
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
