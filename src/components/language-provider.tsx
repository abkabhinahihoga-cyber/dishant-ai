"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "Hinglish" | "English" | "Hindi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("Hinglish");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("app-language") as Language;
    if (saved && ["Hinglish", "English", "Hindi"].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app-language", lang);
  };

  // Prevent hydration mismatch by returning null until mounted, 
  // or just render with default but we are safe since language doesn't drastically change layout
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    // Return default if used outside provider for some reason
    return { language: "Hinglish" as Language, setLanguage: () => {} };
  }
  return context;
}
