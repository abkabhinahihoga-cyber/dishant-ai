"use client";

import * as React from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={language} onValueChange={(v: any) => setLanguage(v)}>
        <SelectTrigger className="h-9 w-[110px] bg-background border-border/50 focus:ring-primary/20">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Hinglish">Hinglish</SelectItem>
          <SelectItem value="English">English</SelectItem>
          <SelectItem value="Hindi">Hindi</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
