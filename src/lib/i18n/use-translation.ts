"use client";

import { useLanguage } from "@/components/language-provider";
import { dictionaries, LanguageKey } from "./dictionaries";

export function useTranslation() {
  const { language } = useLanguage();

  const t = (key: LanguageKey): string => {
    // Safely get the dictionary for current language
    const dict = dictionaries[language] || dictionaries["English"];
    
    // Return translation or fallback to English, then to the key itself
    return dict[key] || dictionaries["English"][key] || key as string;
  };

  return { t, language };
}
