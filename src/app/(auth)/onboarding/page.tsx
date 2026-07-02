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
import { Sparkles, ArrowRight, ArrowLeft, Loader2, BookOpen, GraduationCap, Briefcase, Target } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Form State
  const [formData, setFormData] = useState({
    age: "",
    city: "",
    educationCategory: "",
    // Dynamic fields
    schoolClass: "",
    schoolStream: "",
    examName: "",
    examYear: "",
    degree: "",
    branch: "",
    gradYear: "",
    gradSemester: "",
    diplomaField: "",
    diplomaYear: "",
    // Shared
    dreamCareer: "",
    language: "en"
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setCategory = (category: string) => {
    setFormData({ ...formData, educationCategory: category });
  };

  const handleNext = () => {
    if (step === 2 && !formData.educationCategory) {
      toast.error("Please select an option to continue");
      return;
    }
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Not authenticated");
      router.push("/login");
      return;
    }

    // Build education details JSON
    let educationDetails = {};
    if (formData.educationCategory === 'school') {
      educationDetails = { class: formData.schoolClass, stream: formData.schoolStream };
    } else if (formData.educationCategory === 'entrance_exams') {
      educationDetails = { exam: formData.examName, target_year: formData.examYear };
    } else if (formData.educationCategory === 'graduation') {
      educationDetails = { degree: formData.degree, branch: formData.branch, year: formData.gradYear, semester: formData.gradSemester };
    } else if (formData.educationCategory === 'diploma') {
      educationDetails = { field: formData.diplomaField, year: formData.diplomaYear };
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        age: parseInt(formData.age) || null,
        city: formData.city,
        education_category: formData.educationCategory,
        education_details: educationDetails,
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50 py-12">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-400/20 blur-[100px] mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-violet-400/20 blur-[100px] mix-blend-multiply"></div>
      </div>

      <div className="w-full max-w-2xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-slate-900">Dishant AI</span>
          </div>
          <div className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Step {step} of {totalSteps}
          </div>
        </div>

        <Progress value={progress} className="h-2 mb-8 bg-indigo-100" />

        <Card className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl relative overflow-hidden min-h-[450px] rounded-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={slideVariants}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 p-8 flex flex-col"
            >
              {step === 1 && (
                <div className="flex-1 flex flex-col">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-3xl font-bold font-heading text-slate-900">अपने बारे में बताएँ</CardTitle>
                    <CardDescription className="text-base text-slate-500">Let&apos;s personalize your career journey.</CardDescription>
                  </CardHeader>
                  <CardContent className="px-0 flex-1 space-y-5 mt-4">
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Age (उम्र)</label>
                        <Input name="age" type="number" placeholder="e.g. 18" value={formData.age} onChange={handleChange} className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:border-indigo-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">City (शहर)</label>
                        <Input name="city" placeholder="e.g. Pune, Delhi" value={formData.city} onChange={handleChange} className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:border-indigo-500" />
                      </div>
                    </div>
                  </CardContent>
                </div>
              )}

              {step === 2 && (
                <div className="flex-1 flex flex-col">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-3xl font-bold font-heading text-slate-900">आप अभी क्या कर रहे हैं?</CardTitle>
                    <CardDescription className="text-base text-slate-500">Choose your current education stage so we can customize the app for you.</CardDescription>
                  </CardHeader>
                  <CardContent className="px-0 flex-1 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { id: 'school', title: 'School (Class 9-12)', icon: BookOpen, desc: 'Foundation & Boards' },
                        { id: 'entrance_exams', title: 'Entrance Exams', icon: Target, desc: 'JEE, NEET, CUET, GATE' },
                        { id: 'graduation', title: 'Graduation / College', icon: GraduationCap, desc: 'B.Tech, B.Sc, BCA, etc.' },
                        { id: 'diploma', title: 'Diploma / ITI', icon: Briefcase, desc: 'Polytechnic, ITI' },
                      ].map((item) => (
                        <div 
                          key={item.id}
                          onClick={() => setCategory(item.id)}
                          className={cn(
                            "cursor-pointer border-2 rounded-2xl p-4 transition-all duration-200",
                            formData.educationCategory === item.id 
                              ? "border-indigo-500 bg-indigo-50 shadow-md scale-[1.02]" 
                              : "border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50"
                          )}
                        >
                          <div className={cn(
                            "h-10 w-10 rounded-xl mb-3 flex items-center justify-center",
                            formData.educationCategory === item.id ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-500"
                          )}>
                            <item.icon className="h-5 w-5" />
                          </div>
                          <h3 className="font-bold text-slate-900">{item.title}</h3>
                          <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </div>
              )}

              {step === 3 && (
                <div className="flex-1 flex flex-col">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-3xl font-bold font-heading text-slate-900">More Details</CardTitle>
                    <CardDescription className="text-base text-slate-500">Tell us a bit more about your current studies.</CardDescription>
                  </CardHeader>
                  <CardContent className="px-0 flex-1 space-y-4 mt-4">
                    
                    {formData.educationCategory === 'school' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Class</label>
                          <Select value={formData.schoolClass} onValueChange={(v) => setFormData({...formData, schoolClass: v || ""})}>
                            <SelectTrigger className="h-12 rounded-xl bg-slate-50"><SelectValue placeholder="Select Class" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="9th">9th</SelectItem>
                              <SelectItem value="10th">10th</SelectItem>
                              <SelectItem value="11th">11th</SelectItem>
                              <SelectItem value="12th">12th</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {(formData.schoolClass === '11th' || formData.schoolClass === '12th') && (
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Stream</label>
                            <Select value={formData.schoolStream} onValueChange={(v) => setFormData({...formData, schoolStream: v || ""})}>
                              <SelectTrigger className="h-12 rounded-xl bg-slate-50"><SelectValue placeholder="Select Stream" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PCM">Science (PCM)</SelectItem>
                                <SelectItem value="PCB">Science (PCB)</SelectItem>
                                <SelectItem value="Commerce">Commerce</SelectItem>
                                <SelectItem value="Arts">Arts/Humanities</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    )}

                    {formData.educationCategory === 'entrance_exams' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Which exam are you preparing for?</label>
                          <Input name="examName" placeholder="e.g. JEE Mains, NEET, CUET" value={formData.examName} onChange={handleChange} className="h-12 rounded-xl bg-slate-50" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Target Year</label>
                          <Input name="examYear" type="number" placeholder="e.g. 2025" value={formData.examYear} onChange={handleChange} className="h-12 rounded-xl bg-slate-50" />
                        </div>
                      </div>
                    )}

                    {formData.educationCategory === 'graduation' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Degree</label>
                            <Input name="degree" placeholder="e.g. B.Tech, B.Sc, BCA" value={formData.degree} onChange={handleChange} className="h-12 rounded-xl bg-slate-50" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Branch/Stream</label>
                            <Input name="branch" placeholder="e.g. Computer Science" value={formData.branch} onChange={handleChange} className="h-12 rounded-xl bg-slate-50" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Year</label>
                            <Select value={formData.gradYear} onValueChange={(v) => setFormData({...formData, gradYear: v || ""})}>
                              <SelectTrigger className="h-12 rounded-xl bg-slate-50"><SelectValue placeholder="Select Year" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1st">1st Year</SelectItem>
                                <SelectItem value="2nd">2nd Year</SelectItem>
                                <SelectItem value="3rd">3rd Year</SelectItem>
                                <SelectItem value="4th">4th Year</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Semester (Optional)</label>
                            <Input name="gradSemester" type="number" placeholder="e.g. 3" value={formData.gradSemester} onChange={handleChange} className="h-12 rounded-xl bg-slate-50" />
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.educationCategory === 'diploma' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Diploma Field / Trade</label>
                          <Input name="diplomaField" placeholder="e.g. Mechanical, Electrician" value={formData.diplomaField} onChange={handleChange} className="h-12 rounded-xl bg-slate-50" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Year</label>
                          <Select value={formData.diplomaYear} onValueChange={(v) => setFormData({...formData, diplomaYear: v || ""})}>
                            <SelectTrigger className="h-12 rounded-xl bg-slate-50"><SelectValue placeholder="Select Year" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1st">1st Year</SelectItem>
                              <SelectItem value="2nd">2nd Year</SelectItem>
                              <SelectItem value="3rd">3rd Year</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                  </CardContent>
                </div>
              )}

              {step === 4 && (
                <div className="flex-1 flex flex-col">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-3xl font-bold font-heading text-slate-900">Career Goals</CardTitle>
                    <CardDescription className="text-base text-slate-500">Let&apos;s aim high. What&apos;s your destination?</CardDescription>
                  </CardHeader>
                  <CardContent className="px-0 flex-1 space-y-5 mt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Dream Career / Job</label>
                      <Input name="dreamCareer" placeholder="e.g. Software Engineer, Doctor, IAS" value={formData.dreamCareer} onChange={handleChange} className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:border-indigo-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">App Language Preference</label>
                      <Select value={formData.language} onValueChange={(v) => setFormData({...formData, language: v || ""})}>
                        <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:border-indigo-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English (default)</SelectItem>
                          <SelectItem value="hi">Hindi (हिंदी)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </div>
              )}

              <CardFooter className="px-0 pb-0 mt-auto flex justify-between pt-6 border-t border-slate-100">
                <Button variant="ghost" onClick={handleBack} disabled={step === 1} className="h-12 rounded-xl px-6 text-slate-500 font-bold hover:bg-slate-100">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                
                {step < totalSteps ? (
                  <Button onClick={handleNext} className="h-12 rounded-xl px-8 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 font-bold transition-all hover:scale-105">
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={loading} className="h-12 rounded-xl px-8 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 font-bold transition-all hover:scale-105">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Complete Setup"}
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
