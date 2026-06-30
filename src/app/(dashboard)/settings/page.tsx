"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Save, Link as LinkIcon, Upload, FileText, Loader2, User, BrainCircuit } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [resumePath, setResumePath] = useState("");
  const [uploadingResume, setUploadingResume] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resumeFeedback, setResumeFeedback] = useState<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("github_url, linkedin_url, resume_url")
        .eq("auth_user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      
      if (data) {
        setGithubUrl(data.github_url || "");
        setLinkedinUrl(data.linkedin_url || "");
        // If it's an old public URL, extract the filename. Otherwise use as is.
        let path = data.resume_url || "";
        if (path.includes('/public/resumes/')) {
          path = path.split('/public/resumes/')[1];
        }
        setResumePath(path);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Could not load profile settings");
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          github_url: githubUrl,
          linkedin_url: linkedinUrl,
        })
        .eq("auth_user_id", user.id);

      if (error) throw error;
      toast.success("Profile saved successfully");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingResume(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Ensure PDF
      if (file.type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be under 5MB");
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Secure Practice: We store the raw filename, NOT a public URL
      await supabase
        .from("profiles")
        .update({ resume_url: fileName })
        .eq("auth_user_id", user.id);

      setResumePath(fileName);
      toast.success("Resume uploaded securely");
      
    } catch (error: any) {
      console.error("Error uploading resume:", error);
      toast.error(error.message || "Failed to upload resume.");
    } finally {
      setUploadingResume(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleViewResume = async () => {
    try {
      // Securely generate a temporary, expiring URL
      const { data, error } = await supabase.storage
        .from('resumes')
        .createSignedUrl(resumePath, 60); // Valid for 60 seconds

      if (error) throw error;
      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank");
      }
    } catch (error) {
      console.error("Error generating secure link:", error);
      toast.error("Could not access secure file");
    }
  };

  const handleAnalyzeResume = async () => {
    try {
      setIsAnalyzing(true);
      const res = await fetch('/api/resume-analyze', { method: 'POST' });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Analysis failed");
      }
      const data = await res.json();
      setResumeFeedback(data);
      toast.success("Resume analyzed successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to analyze resume");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
          <User className="h-8 w-8 text-primary" />
          Advanced Profile
        </h1>
        <p className="text-muted-foreground mt-1">
          Link your professional presence and upload your resume for hyper-personalized AI mentoring.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 glass-card border-none shadow-xl space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Resume & Career
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload your latest resume (PDF, max 5MB). The AI Career Mentor will use this to provide highly tailored interview prep and career pathing.
            </p>
            
            <div className="flex flex-col gap-4">
              {resumePath ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/50">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm truncate">Secure Resume File</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleViewResume}>
                      View Securely
                    </Button>
                  </div>
                  
                  {!resumeFeedback ? (
                    <Button 
                      variant="secondary" 
                      className="w-full gap-2 bg-primary/10 text-primary hover:bg-primary/20"
                      onClick={handleAnalyzeResume}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4" />}
                      Get AI Resume Score
                    </Button>
                  ) : (
                    <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold flex items-center gap-2"><BrainCircuit className="h-4 w-4 text-primary" /> AI Score</span>
                        <span className="text-lg font-bold text-primary">{resumeFeedback.score}/100</span>
                      </div>
                      <p className="text-sm text-muted-foreground italic">&ldquo;{resumeFeedback.summary}&rdquo;</p>
                      
                      <div>
                        <span className="text-xs font-semibold text-emerald-500 uppercase">Strengths</span>
                        <ul className="text-xs text-muted-foreground list-disc pl-4 mt-1">
                          {resumeFeedback.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                      
                      <div>
                        <span className="text-xs font-semibold text-primary uppercase">Actionable Tips</span>
                        <ul className="text-xs text-muted-foreground list-disc pl-4 mt-1 space-y-1">
                          {resumeFeedback.actionableTips.map((t: string, i: number) => <li key={i}>{t}</li>)}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm p-4 text-center border-2 border-dashed border-border/50 rounded-lg text-muted-foreground">
                  No resume uploaded yet.
                </div>
              )}
              
              <div className="flex gap-2">
                <Input 
                  type="file" 
                  accept="application/pdf" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleResumeUpload}
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={uploadingResume}
                  className="w-full gap-2"
                >
                  {uploadingResume ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {resumePath ? "Upload New Version" : "Upload Secure Resume"}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 glass-card border-none shadow-xl space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Social Links
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">LinkedIn URL</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="https://linkedin.com/in/yourprofile" 
                    className="pl-9 bg-background/50"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">GitHub URL</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="https://github.com/yourusername" 
                    className="pl-9 bg-background/50"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                  />
                </div>
              </div>

              <Button 
                onClick={saveProfile} 
                disabled={saving}
                className="w-full gap-2 mt-4"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
