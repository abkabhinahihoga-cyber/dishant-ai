"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n/use-translation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Building2, Search, ExternalLink, Calendar, MapPin, BookOpen, Users, Star, TrendingUp, ArrowRight, Clock, FileText } from "lucide-react";
import Link from "next/link";

// Popular Govt Exams Data
const GOVT_EXAMS = [
  {
    id: "upsc",
    name: "UPSC CSE",
    fullName: "Union Public Service Commission - Civil Services",
    description: "IAS, IPS, IFS और अन्य केंद्रीय सेवाओं के लिए परीक्षा।",
    descEn: "Exam for IAS, IPS, IFS and other central services.",
    vacancies: "1000+",
    eligibility: "Graduation",
    frequency: "Yearly",
    website: "https://upsc.gov.in",
    gradient: "from-amber-500 to-orange-600",
    icon: Star,
  },
  {
    id: "ssc-cgl",
    name: "SSC CGL",
    fullName: "Staff Selection Commission - Combined Graduate Level",
    description: "केंद्र सरकार के Group B और C पदों के लिए।",
    descEn: "For Group B and C posts in Central Government.",
    vacancies: "7000+",
    eligibility: "Graduation",
    frequency: "Yearly",
    website: "https://ssc.nic.in",
    gradient: "from-blue-500 to-indigo-600",
    icon: FileText,
  },
  {
    id: "ssc-chsl",
    name: "SSC CHSL",
    fullName: "Staff Selection Commission - Combined Higher Secondary Level",
    description: "LDC, DEO, PA/SA पदों के लिए 12वीं पास उम्मीदवारों के लिए।",
    descEn: "For LDC, DEO, PA/SA posts for 12th pass candidates.",
    vacancies: "4000+",
    eligibility: "12th Pass",
    frequency: "Yearly",
    website: "https://ssc.nic.in",
    gradient: "from-cyan-500 to-blue-600",
    icon: FileText,
  },
  {
    id: "ibps-po",
    name: "IBPS PO",
    fullName: "Institute of Banking Personnel Selection - Probationary Officer",
    description: "सार्वजनिक क्षेत्र के बैंकों में PO पद के लिए।",
    descEn: "For PO posts in Public Sector Banks.",
    vacancies: "3500+",
    eligibility: "Graduation",
    frequency: "Yearly",
    website: "https://ibps.in",
    gradient: "from-emerald-500 to-teal-600",
    icon: Building2,
  },
  {
    id: "rbi-grade-b",
    name: "RBI Grade B",
    fullName: "Reserve Bank of India - Grade B Officer",
    description: "RBI में Grade B अधिकारी पद के लिए।",
    descEn: "For Grade B Officer post in Reserve Bank of India.",
    vacancies: "300+",
    eligibility: "Graduation",
    frequency: "Yearly",
    website: "https://rbi.org.in",
    gradient: "from-violet-500 to-purple-600",
    icon: TrendingUp,
  },
  {
    id: "railway",
    name: "RRB NTPC",
    fullName: "Railway Recruitment Board - Non-Technical Popular Categories",
    description: "रेलवे में विभिन्न गैर-तकनीकी पदों के लिए।",
    descEn: "For various non-technical posts in Railways.",
    vacancies: "10000+",
    eligibility: "12th / Graduation",
    frequency: "As per vacancy",
    website: "https://rrbcdg.gov.in",
    gradient: "from-rose-500 to-red-600",
    icon: Users,
  },
];

const RESOURCES = [
  { name: "Sarkari Result", url: "https://www.sarkariresult.com/", desc: "Latest Govt Job Notifications" },
  { name: "SSC Official", url: "https://ssc.nic.in/", desc: "SSC Exam Updates" },
  { name: "UPSC Official", url: "https://upsc.gov.in/", desc: "UPSC Exam Calendar" },
  { name: "IBPS Official", url: "https://ibps.in/", desc: "Banking Exam Updates" },
];

export default function GovtJobsPage() {
  const { t, language } = useTranslation();
  const [search, setSearch] = useState("");

  const filtered = GOVT_EXAMS.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-black tracking-tight flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            {t("govtJobs", "Government Jobs")}
          </h1>
          <p className="text-muted-foreground mt-1.5 font-medium">
            {language === "Hindi"
              ? "सरकारी नौकरी परीक्षाओं की पूरी जानकारी"
              : "Complete information about Government Job Exams"}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={language === "Hindi" ? "परीक्षा खोजें..." : "Search exams..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-12 rounded-xl bg-card border-border/50 text-base"
        />
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((exam) => (
          <Card
            key={exam.id}
            className="group overflow-hidden border-border/40 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 bg-card"
          >
            <CardContent className="p-0">
              {/* Gradient Header */}
              <div className={`bg-gradient-to-r ${exam.gradient} p-5 text-white relative overflow-hidden`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs font-bold backdrop-blur-sm">
                      {exam.name}
                    </Badge>
                    <exam.icon className="h-5 w-5 text-white/60" />
                  </div>
                  <h3 className="font-heading font-bold text-lg leading-tight">{exam.fullName}</h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {language === "Hindi" ? exam.description : exam.descEn}
                </p>

                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2.5 rounded-lg bg-muted/50">
                    <Users className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                    <p className="text-xs font-bold text-foreground">{exam.vacancies}</p>
                    <p className="text-[10px] text-muted-foreground">{language === "Hindi" ? "पद" : "Posts"}</p>
                  </div>
                  <div className="text-center p-2.5 rounded-lg bg-muted/50">
                    <BookOpen className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                    <p className="text-xs font-bold text-foreground">{exam.eligibility}</p>
                    <p className="text-[10px] text-muted-foreground">{language === "Hindi" ? "योग्यता" : "Eligibility"}</p>
                  </div>
                  <div className="text-center p-2.5 rounded-lg bg-muted/50">
                    <Clock className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                    <p className="text-xs font-bold text-foreground">{exam.frequency}</p>
                    <p className="text-[10px] text-muted-foreground">{language === "Hindi" ? "आवृत्ति" : "Frequency"}</p>
                  </div>
                </div>

                <a
                  href={exam.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors"
                >
                  {language === "Hindi" ? "आधिकारिक वेबसाइट" : "Official Website"}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Search className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-lg font-semibold text-muted-foreground">
            {language === "Hindi" ? "कोई परीक्षा नहीं मिली" : "No exams found"}
          </p>
        </div>
      )}

      {/* Quick Resources */}
      <div className="space-y-4">
        <h2 className="text-xl font-heading font-bold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          {language === "Hindi" ? "उपयोगी लिंक" : "Useful Links"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {RESOURCES.map((r) => (
            <a
              key={r.name}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/50 hover:border-primary/30 transition-all group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{r.name}</p>
                <p className="text-xs text-muted-foreground truncate">{r.desc}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
