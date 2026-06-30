"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Download, ArrowLeft, FileEdit } from "lucide-react";
import { toast } from "sonner";

interface GeneratedResume {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  summary: string;
  education: { degree: string; school: string; year: string }[];
  skills: string[];
  experience: { role: string; company: string; duration: string; points: string[] }[];
}

export default function ResumeBuilderPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [resume, setResume] = useState<GeneratedResume | null>(null);

  // Raw inputs
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !skills || !experience) {
      toast.error("Please fill out the required fields");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/resume-build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName, email, phone, linkedin, education, skills, experience
        })
      });

      if (!res.ok) throw new Error("Failed to generate resume");
      const data = await res.json();
      setResume(data);
      toast.success("Resume generated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  if (resume) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in print:max-w-none print:m-0 print:p-0">
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Button variant="ghost" onClick={() => setResume(null)} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Edit Details
          </Button>
          <Button onClick={() => window.print()} className="gap-2">
            <Download className="h-4 w-4" /> Download PDF
          </Button>
        </div>

        {/* The Printable Resume */}
        <div id="printable-resume" className="bg-white text-black p-10 md:p-16 min-h-[11in] shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-serif font-bold uppercase tracking-wider text-black">{resume.fullName}</h1>
            <div className="flex items-center justify-center gap-4 text-sm mt-2 text-gray-700">
              {resume.email && <span>{resume.email}</span>}
              {resume.phone && <span>&bull; {resume.phone}</span>}
              {resume.linkedin && <span>&bull; {resume.linkedin}</span>}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold border-b-2 border-black uppercase pb-1 mb-2">Professional Summary</h2>
            <p className="text-sm text-gray-800 leading-relaxed">{resume.summary}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold border-b-2 border-black uppercase pb-1 mb-2">Skills</h2>
            <p className="text-sm text-gray-800 leading-relaxed">
              {resume.skills.join(" \u2022 ")}
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold border-b-2 border-black uppercase pb-1 mb-2">Experience &amp; Projects</h2>
            <div className="space-y-4">
              {resume.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-base">{exp.role} {exp.company && <span className="font-normal italic">| {exp.company}</span>}</h3>
                    <span className="text-sm font-medium">{exp.duration}</span>
                  </div>
                  <ul className="list-disc pl-5 text-sm space-y-1 text-gray-800">
                    {exp.points.map((point, j) => (
                      <li key={j}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold border-b-2 border-black uppercase pb-1 mb-2">Education</h2>
            <div className="space-y-2">
              {resume.education.map((edu, i) => (
                <div key={i} className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-bold text-base">{edu.degree}</h3>
                    <p className="text-sm text-gray-800 italic">{edu.school}</p>
                  </div>
                  <span className="text-sm font-medium">{edu.year}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-12 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
          <FileEdit className="h-8 w-8 text-primary" />
          AI Resume Builder
        </h1>
        <p className="text-muted-foreground mt-1">Don&apos;t worry about formatting or action verbs. Just dump your info below, and our AI will write a perfect, ATS-friendly resume for you.</p>
      </div>

      <form onSubmit={handleGenerate} className="space-y-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Contact Info</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name *</label>
              <Input required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email (optional)</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone (optional)</label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 234 567 8900" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">LinkedIn/GitHub URL (optional)</label>
              <Input value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="linkedin.com/in/johndoe" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Education</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <label className="text-sm font-medium">Where did you study? (optional)</label>
              <Textarea 
                value={education} 
                onChange={e => setEducation(e.target.value)} 
                placeholder="e.g. BS Computer Science at XYZ University, 2020-2024. GPA 3.8." 
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <label className="text-sm font-medium">List your tools and technologies *</label>
              <Textarea 
                required
                value={skills} 
                onChange={e => setSkills(e.target.value)} 
                placeholder="e.g. React, Next.js, Python, SQL, Git, Figma, Communication" 
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Experience & Projects</CardTitle>
            <CardDescription>Tell us what you did casually. Our AI will make it sound professional.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <label className="text-sm font-medium">Your raw experience *</label>
              <Textarea 
                required
                className="min-h-[150px]"
                value={experience} 
                onChange={e => setExperience(e.target.value)} 
                placeholder="e.g. I made a website for a local bakery using React and Firebase. It lets people order cakes online. It increased their sales by a lot. I also worked at McDonald's as a cashier for 2 years." 
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full text-lg" disabled={isGenerating}>
          {isGenerating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
          {isGenerating ? "AI is writing your resume..." : "Generate Professional Resume"}
        </Button>
      </form>
    </div>
  );
}
