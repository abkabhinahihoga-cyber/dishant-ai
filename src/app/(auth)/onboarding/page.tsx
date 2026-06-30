"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { Sparkles, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Form State
  const [formData, setFormData] = useState({
    age: "",
    city: "",
    college: "",
    degree: "",
    branch: "",
    year: "",
    skills: "",
    interests: "",
    dreamCareer: "",
    language: "en"
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // In a real app, we'd get the user ID here and update their profile.
    // Assuming auth session exists:
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Not authenticated");
      router.push("/login");
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        age: parseInt(formData.age) || null,
        city: formData.city,
        college: formData.college,
        degree: formData.degree,
        branch: formData.branch,
        year_of_study: parseInt(formData.year) || null,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        interests: formData.interests.split(',').map(s => s.trim()).filter(Boolean),
        dream_career: formData.dreamCareer,
        preferred_language: formData.language,
        onboarding_completed: true
      })
      .eq('auth_user_id', user.id);

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      toast.success("Profile created successfully!");
      router.push("/dashboard");
    }
  };

  const slideVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-muted/30 py-12">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>

      <div className="w-full max-w-2xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-heading font-bold text-xl">Dishant AI</span>
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            Step {step} of {totalSteps}
          </div>
        </div>

        <Progress value={progress} className="h-2 mb-8" />

        <Card className="glass-card border-none shadow-2xl relative overflow-hidden min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={slideVariants}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 p-6 flex flex-col"
            >
              {step === 1 && (
                <div className="flex-1 flex flex-col">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-3xl font-heading">Tell us about yourself</CardTitle>
                    <CardDescription>Let&apos;s personalize your career journey.</CardDescription>
                  </CardHeader>
                  <CardContent className="px-0 flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Age</label>
                        <Input name="age" type="number" placeholder="e.g. 20" value={formData.age} onChange={handleChange} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">City</label>
                        <Input name="city" placeholder="e.g. Pune" value={formData.city} onChange={handleChange} />
                      </div>
                    </div>
                  </CardContent>
                </div>
              )}

              {step === 2 && (
                <div className="flex-1 flex flex-col">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-3xl font-heading">Your Education</CardTitle>
                    <CardDescription>Where and what are you studying?</CardDescription>
                  </CardHeader>
                  <CardContent className="px-0 flex-1 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">College / University</label>
                      <Input name="college" placeholder="Enter your college name" value={formData.college} onChange={handleChange} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Degree</label>
                        <Input name="degree" placeholder="e.g. B.Tech, BCA" value={formData.degree} onChange={handleChange} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Branch / Specialization</label>
                        <Input name="branch" placeholder="e.g. Computer Science" value={formData.branch} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Current Year</label>
                      <Select value={formData.year} onValueChange={(v) => setFormData({...formData, year: v || ""})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1st Year</SelectItem>
                          <SelectItem value="2">2nd Year</SelectItem>
                          <SelectItem value="3">3rd Year</SelectItem>
                          <SelectItem value="4">4th Year</SelectItem>
                          <SelectItem value="5">Graduated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </div>
              )}

              {step === 3 && (
                <div className="flex-1 flex flex-col">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-3xl font-heading">Skills & Interests</CardTitle>
                    <CardDescription>What do you know and what do you love?</CardDescription>
                  </CardHeader>
                  <CardContent className="px-0 flex-1 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Current Skills (comma separated)</label>
                      <Input name="skills" placeholder="e.g. Python, Public Speaking, Design" value={formData.skills} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Interests (comma separated)</label>
                      <Input name="interests" placeholder="e.g. AI, Space, Marketing, Gaming" value={formData.interests} onChange={handleChange} />
                    </div>
                  </CardContent>
                </div>
              )}

              {step === 4 && (
                <div className="flex-1 flex flex-col">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-3xl font-heading">Career Goals</CardTitle>
                    <CardDescription>Let&apos;s aim high. What&apos;s your destination?</CardDescription>
                  </CardHeader>
                  <CardContent className="px-0 flex-1 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Dream Career</label>
                      <Input name="dreamCareer" placeholder="e.g. AI Researcher, Product Manager" value={formData.dreamCareer} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Preferred Communication Language</label>
                      <Select value={formData.language} onValueChange={(v) => setFormData({...formData, language: v || ""})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">Hindi (हिंदी)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </div>
              )}

              <CardFooter className="px-0 pb-0 mt-auto flex justify-between pt-6 border-t border-border/50">
                <Button variant="ghost" onClick={handleBack} disabled={step === 1}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                
                {step < totalSteps ? (
                  <Button onClick={handleNext}>
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Complete Profile"}
                  </Button>
                )}
              </CardFooter>
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}
