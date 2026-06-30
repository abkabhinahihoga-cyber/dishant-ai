"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { Sparkles, Loader2, Mail, CheckCircle2, ArrowLeft, User } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"details" | "otp">("details");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: {
          full_name: fullName,
        },
        shouldCreateUser: true,
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("OTP sent to your email!");
      setStep("otp");
    }
    
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Successfully verified! Let's get you set up.");
      router.push("/onboarding");
    }
    
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50">
      {/* Colorful Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-emerald-400/25 blur-[100px] mix-blend-multiply animate-blob"></div>
        <div className="absolute bottom-[-10%] left-[-15%] w-[50vw] h-[50vw] rounded-full bg-violet-400/30 blur-[100px] mix-blend-multiply animate-blob animation-delay-2000"></div>
        <div className="absolute top-[30%] left-[40%] w-[40vw] h-[40vw] rounded-full bg-amber-400/20 blur-[100px] mix-blend-multiply animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Top Logo */}
      <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-heading font-bold text-xl text-slate-900">Dishant AI</span>
        </Link>
      </div>

      {/* Signup Card */}
      <div className="w-full max-w-md mx-4 relative z-10">
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-violet-200/30 border border-white/60 overflow-hidden">
          {/* Card Header with Gradient */}
          <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-8 py-8 text-center">
            <h1 className="text-2xl font-bold text-white font-heading">
              {step === "details" ? "अपना Career शुरू करो 🚀" : "OTP Verify करें"}
            </h1>
            <p className="text-emerald-50 text-sm mt-2">
              {step === "details"
                ? "Free में Sign Up करें और AI Mentor से guidance पाएं"
                : `${email} पर 6-digit code भेजा गया है`}
            </p>
          </div>
          
          {/* Card Body */}
          <div className="px-8 py-8">
            <div className="grid gap-4">
              {step === "details" && (
                <>
                  <Button 
                    variant="outline" 
                    onClick={handleGoogleSignup} 
                    className="w-full h-13 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all text-base font-medium"
                  >
                    <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google से Sign Up करें
                  </Button>
                  
                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t-2 border-slate-100" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white/80 px-4 text-slate-400 font-semibold tracking-wider">
                        या Email से
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="अपना नाम लिखें"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="h-13 rounded-2xl border-2 border-slate-200 focus:border-emerald-400 bg-white/50 text-base pl-12 pr-5 transition-colors"
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="apna@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-13 rounded-2xl border-2 border-slate-200 focus:border-emerald-400 bg-white/50 text-base pl-12 pr-5 transition-colors"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-13 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 text-base font-bold transition-all hover:-translate-y-0.5" 
                      disabled={loading || !email || !fullName}
                    >
                      {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Mail className="mr-2 h-5 w-5" />}
                      Verification Code भेजें
                    </Button>
                  </form>
                </>
              )}

              {step === "otp" && (
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <Input
                    id="otp"
                    type="text"
                    placeholder="● ● ● ● ● ●"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={8}
                    className="h-16 text-center text-3xl tracking-[0.5em] font-mono rounded-2xl border-2 border-slate-200 focus:border-emerald-400 bg-white/50 transition-colors"
                  />
                  <Button 
                    type="submit" 
                    className="w-full h-13 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/20 text-base font-bold transition-all hover:-translate-y-0.5" 
                    disabled={loading || otp.length < 6}
                  >
                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle2 className="mr-2 h-5 w-5" />}
                    Verify & Continue
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="w-full rounded-2xl text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 h-12" 
                    onClick={() => setStep("details")}
                    disabled={loading}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Email बदलें
                  </Button>
                </form>
              )}
            </div>
          </div>
          
          {/* Card Footer */}
          {step === "details" && (
            <div className="px-8 pb-8 text-center">
              <p className="text-sm text-slate-500">
                पहले से Account है?{" "}
                <Link href="/login" className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline transition-colors">
                  Log In करें
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
