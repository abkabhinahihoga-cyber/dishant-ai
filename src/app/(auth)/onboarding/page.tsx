"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { 
  ArrowRight, BookOpen, Target, GraduationCap, 
  Briefcase, Sparkles, Building2, Rocket, ArrowLeft, Loader2 
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    educationCategory: "",
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
    dreamCareer: "",
    language: "en"
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setCategory = (category: string) => {
    setFormData({ ...formData, educationCategory: category });
  };

  const handleNext = () => {
    if (step === 1 && !formData.educationCategory) {
      toast.error("कृपया एक option चुनें");
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

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-[#FAFAFA]">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 w-full h-[50vh] bg-gradient-to-b from-indigo-50 to-transparent" />
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-indigo-200/50 blur-[100px]" />
        <div className="absolute top-20 -left-20 w-72 h-72 rounded-full bg-violet-200/50 blur-[80px]" />
      </div>

      <div className="flex-1 w-full max-w-xl mx-auto flex flex-col py-6 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-heading font-black text-xl text-slate-900 tracking-tight">Dishant AI</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-500">
              {step} <span className="text-slate-300">/</span> {totalSteps}
            </span>
          </div>
        </div>

        <Progress value={progress} className="h-2 mb-8 bg-slate-100 [&>div]:bg-indigo-600" />

        {/* Content Area */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full"
            >
              {/* STEP 1: Choose Category */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2 mb-8">
                    <h1 className="text-3xl font-black font-heading text-slate-900 tracking-tight">
                      आप अभी क्या कर रहे हैं?
                    </h1>
                    <p className="text-base text-slate-500 font-medium">
                      Select your current education stage
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 'school', title: 'School (9-12)', icon: BookOpen, desc: 'CBSE, State Boards', color: 'bg-blue-500', light: 'bg-blue-50 border-blue-200' },
                      { id: 'entrance_exams', title: 'Entrance Exams', icon: Target, desc: 'JEE, NEET, CUET', color: 'bg-red-500', light: 'bg-red-50 border-red-200' },
                      { id: 'government_exams', title: 'Govt Exams', icon: Building2, desc: 'UPSC, SSC, Banking', color: 'bg-amber-500', light: 'bg-amber-50 border-amber-200' },
                      { id: 'graduation', title: 'College', icon: GraduationCap, desc: 'B.Tech, B.Sc, BCA', color: 'bg-indigo-500', light: 'bg-indigo-50 border-indigo-200' },
                      { id: 'diploma', title: 'Diploma/ITI', icon: Briefcase, desc: 'Polytechnic, ITI', color: 'bg-emerald-500', light: 'bg-emerald-50 border-emerald-200' },
                    ].map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => setCategory(item.id)}
                        className={cn(
                          "cursor-pointer rounded-2xl p-5 border-2 transition-all duration-300 group",
                          formData.educationCategory === item.id 
                            ? `${item.light} shadow-[0_8px_30px_rgb(0,0,0,0.04)] scale-[1.02] border-indigo-500` 
                            : "bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm"
                        )}
                      >
                        <div className={cn(
                          "h-12 w-12 rounded-2xl mb-4 flex items-center justify-center transition-colors",
                          formData.educationCategory === item.id ? item.color : "bg-slate-100 group-hover:bg-slate-200"
                        )}>
                          <item.icon className={cn("h-6 w-6", formData.educationCategory === item.id ? "text-white" : "text-slate-600")} />
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg mb-1">{item.title}</h3>
                        <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: Dynamic Details */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2 mb-8">
                    <h1 className="text-3xl font-black font-heading text-slate-900 tracking-tight">
                      Details बताएं
                    </h1>
                    <p className="text-base text-slate-500 font-medium">
                      Help us customize your learning path
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
                    {formData.educationCategory === 'school' && (
                      <div className="space-y-5">
                        <div className="space-y-2.5">
                          <label className="text-sm font-bold text-slate-700">Class (कक्षा)</label>
                          <Select value={formData.schoolClass} onValueChange={(v) => setFormData({...formData, schoolClass: v || ""})}>
                            <SelectTrigger className="h-14 rounded-2xl bg-slate-50/50 border-slate-200 font-medium text-base"><SelectValue placeholder="Select Class" /></SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="9th">Class 9th</SelectItem>
                              <SelectItem value="10th">Class 10th</SelectItem>
                              <SelectItem value="11th">Class 11th</SelectItem>
                              <SelectItem value="12th">Class 12th</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {(formData.schoolClass === '11th' || formData.schoolClass === '12th') && (
                          <div className="space-y-2.5">
                            <label className="text-sm font-bold text-slate-700">Stream</label>
                            <Select value={formData.schoolStream} onValueChange={(v) => setFormData({...formData, schoolStream: v || ""})}>
                              <SelectTrigger className="h-14 rounded-2xl bg-slate-50/50 border-slate-200 font-medium text-base"><SelectValue placeholder="Select Stream" /></SelectTrigger>
                              <SelectContent className="rounded-xl">
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
                      <div className="space-y-5">
                        <div className="space-y-2.5">
                          <label className="text-sm font-bold text-slate-700">किस exam की तैयारी कर रहे हैं?</label>
                          <Input name="examName" placeholder="e.g. JEE, NEET, NDA" value={formData.examName} onChange={handleChange} className="h-14 rounded-2xl bg-slate-50/50 border-slate-200 font-medium text-base" />
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-sm font-bold text-slate-700">Target Year</label>
                          <Input name="examYear" type="number" placeholder="e.g. 2025" value={formData.examYear} onChange={handleChange} className="h-14 rounded-2xl bg-slate-50/50 border-slate-200 font-medium text-base" />
                        </div>
                      </div>
                    )}

                    {formData.educationCategory === 'government_exams' && (
                      <div className="space-y-5">
                        <div className="space-y-2.5">
                          <label className="text-sm font-bold text-slate-700">किस Government Exam की तैयारी कर रहे हैं?</label>
                          <Input name="examName" placeholder="e.g. UPSC, SSC CGL, Bank PO" value={formData.examName} onChange={handleChange} className="h-14 rounded-2xl bg-slate-50/50 border-slate-200 font-medium text-base" />
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-sm font-bold text-slate-700">Target Year</label>
                          <Input name="examYear" type="number" placeholder="e.g. 2025" value={formData.examYear} onChange={handleChange} className="h-14 rounded-2xl bg-slate-50/50 border-slate-200 font-medium text-base" />
                        </div>
                      </div>
                    )}

                    {formData.educationCategory === 'graduation' && (
                      <div className="space-y-5">
                        <div className="space-y-2.5">
                          <label className="text-sm font-bold text-slate-700">Degree</label>
                          <Input name="degree" placeholder="e.g. B.Tech, B.Sc" value={formData.degree} onChange={handleChange} className="h-14 rounded-2xl bg-slate-50/50 border-slate-200 font-medium text-base" />
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-sm font-bold text-slate-700">Branch/Stream</label>
                          <Input name="branch" placeholder="e.g. Computer Science" value={formData.branch} onChange={handleChange} className="h-14 rounded-2xl bg-slate-50/50 border-slate-200 font-medium text-base" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2.5">
                            <label className="text-sm font-bold text-slate-700">Year</label>
                            <Select value={formData.gradYear} onValueChange={(v) => setFormData({...formData, gradYear: v || ""})}>
                              <SelectTrigger className="h-14 rounded-2xl bg-slate-50/50 border-slate-200 font-medium text-base"><SelectValue placeholder="Year" /></SelectTrigger>
                              <SelectContent className="rounded-xl">
                                <SelectItem value="1st">1st Year</SelectItem>
                                <SelectItem value="2nd">2nd Year</SelectItem>
                                <SelectItem value="3rd">3rd Year</SelectItem>
                                <SelectItem value="4th">4th Year</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2.5">
                            <label className="text-sm font-bold text-slate-700">Semester</label>
                            <Input name="gradSemester" type="number" placeholder="e.g. 3" value={formData.gradSemester} onChange={handleChange} className="h-14 rounded-2xl bg-slate-50/50 border-slate-200 font-medium text-base" />
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.educationCategory === 'diploma' && (
                      <div className="space-y-5">
                        <div className="space-y-2.5">
                          <label className="text-sm font-bold text-slate-700">Diploma Field / Trade</label>
                          <Input name="diplomaField" placeholder="e.g. Mechanical" value={formData.diplomaField} onChange={handleChange} className="h-14 rounded-2xl bg-slate-50/50 border-slate-200 font-medium text-base" />
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-sm font-bold text-slate-700">Year</label>
                          <Select value={formData.diplomaYear} onValueChange={(v) => setFormData({...formData, diplomaYear: v || ""})}>
                            <SelectTrigger className="h-14 rounded-2xl bg-slate-50/50 border-slate-200 font-medium text-base"><SelectValue placeholder="Year" /></SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="1st">1st Year</SelectItem>
                              <SelectItem value="2nd">2nd Year</SelectItem>
                              <SelectItem value="3rd">3rd Year</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: Career Goals */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2 mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-2">
                      <Rocket className="h-8 w-8 text-indigo-600" />
                    </div>
                    <h1 className="text-3xl font-black font-heading text-slate-900 tracking-tight">
                      Career Goals 🎯
                    </h1>
                    <p className="text-base text-slate-500 font-medium">
                      आपका सपना क्या है? Let&apos;s aim high!
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
                    <div className="space-y-2.5">
                      <label className="text-sm font-bold text-slate-700">Dream Career / Job</label>
                      <Input name="dreamCareer" placeholder="e.g. Software Engineer, Doctor, IAS" value={formData.dreamCareer} onChange={handleChange} className="h-14 rounded-2xl bg-slate-50/50 border-slate-200 focus:border-indigo-500 font-medium text-base" />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-sm font-bold text-slate-700">App Language Preference</label>
                      <Select value={formData.language} onValueChange={(v) => setFormData({...formData, language: v || ""})}>
                        <SelectTrigger className="h-14 rounded-2xl bg-slate-50/50 border-slate-200 focus:border-indigo-500 font-medium text-base">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="en">English (default)</SelectItem>
                          <SelectItem value="hi">Hindi (हिंदी)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="pt-8 pb-4 flex items-center justify-between mt-auto">
          <Button 
            variant="ghost" 
            onClick={handleBack} 
            disabled={step === 1} 
            className="h-14 rounded-2xl px-6 text-slate-500 font-bold hover:bg-slate-200 transition-colors disabled:opacity-0"
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Back
          </Button>
          
          {step < totalSteps ? (
            <Button 
              onClick={handleNext} 
              className="h-14 rounded-2xl px-8 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 font-bold text-base transition-all active:scale-95"
            >
              Continue <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={loading} 
              className="h-14 rounded-2xl px-8 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 font-bold text-base transition-all active:scale-95"
            >
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Complete Setup"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
