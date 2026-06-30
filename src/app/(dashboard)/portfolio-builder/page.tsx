"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Code2, Download, ExternalLink, Globe } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PortfolioBuilderPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [portfolioCode, setPortfolioCode] = useState<string | null>(null);

  // Inputs
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [projects, setProjects] = useState("");
  const [socialUrl, setSocialUrl] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !role) {
      toast.error("Please fill out the required fields");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/portfolio-build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName, role, bio, skills, projects, socialUrl
        })
      });

      if (!res.ok) throw new Error("Failed to generate portfolio");
      const data = await res.json();
      setPortfolioCode(data.htmlCode);
      toast.success("Portfolio generated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!portfolioCode) return;
    const blob = new Blob([portfolioCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "index.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (portfolioCode) {
    return (
      <div className="max-w-6xl mx-auto flex flex-col h-[calc(100vh-10rem)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold font-heading">Your New Portfolio</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setPortfolioCode(null)}>
              Edit Details
            </Button>
            <Button onClick={handleDownload} className="gap-2">
              <Download className="h-4 w-4" /> Download index.html
            </Button>
          </div>
        </div>

        <Tabs defaultValue="preview" className="flex-1 flex flex-col min-h-0">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger value="preview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">
              Preview
            </TabsTrigger>
            <TabsTrigger value="code" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">
              Code
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="flex-1 min-h-0 m-0 mt-4 border rounded-xl overflow-hidden shadow-xl bg-white">
            <iframe 
              srcDoc={portfolioCode}
              title="Portfolio Preview"
              className="w-full h-full bg-white"
              sandbox="allow-scripts"
            />
          </TabsContent>
          
          <TabsContent value="code" className="flex-1 min-h-0 m-0 mt-4 border rounded-xl overflow-hidden shadow-xl bg-[#1e1e1e]">
            <pre className="p-4 h-full overflow-auto text-sm text-green-400 font-mono">
              {portfolioCode}
            </pre>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-12 animate-fade-in">
      <div className="mb-8 text-center">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Code2 className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-heading font-bold mb-2">1-Click Portfolio Generator</h1>
        <p className="text-muted-foreground">Turn your resume into a gorgeous, responsive website in seconds.</p>
      </div>

      <form onSubmit={handleGenerate} className="space-y-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>The Basics</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name *</label>
              <Input required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="e.g. Sarah Connor" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Headline / Target Role *</label>
              <Input required value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Full-Stack Developer" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Short Bio (optional)</label>
              <Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="I love building products that solve real problems..." />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Primary Link (GitHub or LinkedIn)</label>
              <Input value={socialUrl} onChange={e => setSocialUrl(e.target.value)} placeholder="https://github.com/username" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Skills & Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Top Skills (comma separated)</label>
              <Input value={skills} onChange={e => setSkills(e.target.value)} placeholder="React, Node.js, Python, AWS..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Featured Projects</label>
              <Textarea 
                className="min-h-[120px]"
                value={projects} 
                onChange={e => setProjects(e.target.value)} 
                placeholder="1. E-Commerce App: Built with React and Firebase... 2. Weather Bot..." 
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full text-lg h-14" disabled={isGenerating}>
          {isGenerating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Code2 className="mr-2 h-5 w-5" />}
          {isGenerating ? "Coding your website..." : "Generate My Portfolio"}
        </Button>
      </form>
    </div>
  );
}
