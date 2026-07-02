"use client";

import { useLanguage } from "@/components/language-provider";
import { dictionaries, LanguageKey } from "./dictionaries";

export function useTranslation() {
  const { language } = useLanguage();

  const t = (key: string, fallback?: string): string => {
    // Safely get the dictionary for current language
    const dict = dictionaries[language] || dictionaries["English"];
    
    // Return translation or fallback to English, then to the fallback string, then to the key itself
    return (dict as any)[key] || (dictionaries["English"] as any)[key] || fallback || key;
  };

  return { t, language };
}
