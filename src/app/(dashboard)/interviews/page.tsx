"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, MessageSquare, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/use-translation";

import TextInterviewPage from "./text-interview";
import LiveInterviewPage from "./live-interview";

export default function InterviewsGatewayPage() {
  const [mode, setMode] = useState<"select" | "text" | "live">("select");
  const { t } = useTranslation();

  if (mode === "text") {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => setMode("select")} className="mb-2">
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("int.back")}
        </Button>
        <TextInterviewPage />
      </div>
    );
  }

  if (mode === "live") {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => setMode("select")} className="mb-2">
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("int.back")}
        </Button>
        <LiveInterviewPage />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 animate-fade-in">
      <div className="text-center mb-12">
        <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Video className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-heading font-bold mb-4">{t("int.title")}</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          {t("int.gateway_subtitle")}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card 
          className="glass-card hover:shadow-2xl transition-all cursor-pointer group border-primary/20 hover:border-primary/50"
          onClick={() => setMode("live")}
        >
          <CardHeader>
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Video className="h-6 w-6 text-red-500" />
            </div>
            <CardTitle className="text-2xl">{t("int.live")}</CardTitle>
            <CardDescription className="text-base">
              {t("int.live_desc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground mb-6">
              <li>• {t("int.live_features.1")}</li>
              <li>• {t("int.live_features.2")}</li>
              <li>• {t("int.live_features.3")}</li>
            </ul>
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white">{t("int.start_video")}</Button>
          </CardContent>
        </Card>

        <Card 
          className="glass-card hover:shadow-2xl transition-all cursor-pointer group border-blue-500/20 hover:border-blue-500/50"
          onClick={() => setMode("text")}
        >
          <CardHeader>
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare className="h-6 w-6 text-blue-500" />
            </div>
            <CardTitle className="text-2xl">{t("int.text")}</CardTitle>
            <CardDescription className="text-base">
              {t("int.text_desc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground mb-6">
              <li>• {t("int.text_features.1")}</li>
              <li>• {t("int.text_features.2")}</li>
              <li>• {t("int.text_features.3")}</li>
            </ul>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">{t("int.start_text")}</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
