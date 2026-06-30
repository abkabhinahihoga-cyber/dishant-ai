"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Compass, Target, Sparkles, BrainCircuit, Users, Star, GraduationCap, Briefcase } from "lucide-react";
import { InstallBanner } from "@/components/install-banner";

const features = [
  { title: "AI Career Mentor", desc: "Chat with an intelligent guide in Hindi or English anytime you're confused.", icon: BrainCircuit },
  { title: "Skill Roadmaps", desc: "Month-by-month step-by-step plans to learn the exact skills companies want.", icon: Compass },
  { title: "Study Planner", desc: "Organize your college exams, assignments, and daily study schedule effortlessly.", icon: BookOpen },
  { title: "Mock Interviews", desc: "Practice with AI for HR and Technical rounds before your real campus placement.", icon: Target },
  { title: "ATS Resumes", desc: "Generate professional resumes that pass company screening software automatically.", icon: Sparkles },
  { title: "Job Board", desc: "Find the latest entry-level jobs and internships perfect for freshers.", icon: Briefcase }
];

const testimonials = [
  { name: "Rahul Sharma", college: "Govt Engineering College", text: "I was totally confused about which IT field to choose. The AI Mentor guided me in Hindi and gave me a clear web development roadmap." },
  { name: "Priya Patel", college: "Science College, Tier 3", text: "The ATS Resume builder helped me get shortlisted for my first internship. The mock interview practice gave me so much confidence!" },
  { name: "Amit Kumar", college: "B.Com Student", text: "Study planner helps me manage my college exams and skill learning together. It's like having a personal mentor 24/7. बिल्कुल मस्त ऐप है!" },
  { name: "Sneha Gupta", college: "BCA, 2nd Year", text: "Free and so powerful! The roadmap feature tells me exactly what to study every week." }
];

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    // If opened as a PWA, redirect to login (if not authenticated)
    // The middleware will handle redirecting authenticated users to dashboard
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500/30">
      
      {/* Ultra Premium Colorful Light Background */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none bg-slate-50">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-violet-400/40 blur-[100px] md:blur-[140px] mix-blend-multiply opacity-60 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-400/40 blur-[100px] md:blur-[140px] mix-blend-multiply opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[70vw] h-[70vw] rounded-full bg-fuchsia-400/30 blur-[100px] md:blur-[150px] mix-blend-multiply opacity-50 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>
      
      {/* Fixed Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200/50 bg-white/70 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-slate-900">Dishant AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="#features" className="transition-colors hover:text-indigo-600">Features</Link>
            <Link href="#testimonials" className="transition-colors hover:text-indigo-600">Reviews</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 hidden sm:inline-block">Log in</Link>
            <Link href="/signup">
              <Button className="rounded-full bg-slate-900 text-white hover:bg-slate-800 hover:scale-105 transition-all h-9 px-5 text-sm font-semibold shadow-md shadow-slate-900/10">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative py-16 md:py-32 flex flex-col items-center justify-center min-h-[85vh]">
          <div className="container px-4 md:px-6 text-center animate-fade-up z-10 relative">
            
            <div className="inline-flex items-center rounded-full border border-indigo-200 bg-white/60 px-4 py-1.5 text-xs sm:text-sm font-semibold text-indigo-700 mb-8 backdrop-blur-md shadow-sm">
              <Sparkles className="mr-2 h-4 w-4 text-indigo-500" />
              <span>AI-Powered Career Guide for Every Student</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tight mb-6 max-w-5xl mx-auto leading-[1.1] text-slate-900">
              सपनों को हकीकत बनाओ.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 drop-shadow-sm">
                Design Your Career.
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-2xl text-slate-600 mb-10 max-w-2xl mx-auto font-medium px-4">
              India&apos;s smartest AI mentor that helps you discover the perfect career, learn the right skills, and get hired.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 sm:px-0 w-full sm:w-auto">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="rounded-full px-8 h-14 text-lg w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500 shadow-[0_10px_40px_rgba(99,102,241,0.3)] hover:shadow-[0_15px_50px_rgba(99,102,241,0.4)] border-0 hover:-translate-y-1 transition-all duration-300 group font-bold">
                  शुरू करो (Start for Free) <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <div className="mt-16 pt-8 border-t border-slate-200 max-w-3xl mx-auto">
              <p className="text-xs md:text-sm text-slate-500 mb-6 uppercase tracking-widest font-semibold">Trusted by students across India</p>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-8 transition-all duration-500">
                <div className="flex items-center gap-2 text-slate-700"><Users className="h-5 w-5 text-indigo-500"/> <span className="font-bold text-sm md:text-base">10k+ Students</span></div>
                <div className="flex items-center gap-2 text-slate-700"><Target className="h-5 w-5 text-indigo-500"/> <span className="font-bold text-sm md:text-base">50+ Career Paths</span></div>
                <div className="flex items-center gap-2 text-slate-700"><GraduationCap className="h-5 w-5 text-indigo-500"/> <span className="font-bold text-sm md:text-base">Free Forever</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 relative z-10 bg-indigo-50/50 border-y border-indigo-100">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4 text-slate-900">सब कुछ जो आपको चाहिए</h2>
              <p className="text-base md:text-xl text-slate-600 max-w-2xl mx-auto px-4 md:px-0">
                A complete suite of AI-powered tools designed specifically for Indian students to navigate the modern job market.
              </p>
            </div>
            
            {/* Desktop Grid */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <div key={i} className="p-8 rounded-3xl transition-all duration-500 hover:-translate-y-2 shadow-xl shadow-indigo-200/50 hover:shadow-2xl hover:shadow-indigo-300/50 border border-white bg-white/90 backdrop-blur-md group">
                  <div className="h-14 w-14 rounded-2xl bg-indigo-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-200 transition-all border border-indigo-200">
                    <feature.icon className="h-7 w-7 text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Mobile Auto-Scroll Marquee (Foolproof Implementation) */}
            <div className="md:hidden overflow-hidden w-[100vw] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-indigo-100/50 py-4 border-y border-indigo-200/50">
              <div className="flex animate-marquee w-max hover:[animation-play-state:paused]">
                {/* First Set */}
                <div className="flex gap-4 px-2 shrink-0">
                  {features.map((feature, i) => (
                    <div key={`a-${i}`} className="w-[300px] p-6 rounded-3xl border border-white bg-white/90 backdrop-blur-md shadow-xl shadow-indigo-200/50 shrink-0 flex flex-col justify-between">
                      <div>
                        <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-4 border border-indigo-200">
                          <feature.icon className="h-6 w-6 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-slate-900">{feature.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Second Set (Duplicate for seamless loop) */}
                <div className="flex gap-4 px-2 shrink-0">
                  {features.map((feature, i) => (
                    <div key={`b-${i}`} className="w-[300px] p-6 rounded-3xl border border-white bg-white/90 backdrop-blur-md shadow-xl shadow-indigo-200/50 shrink-0 flex flex-col justify-between">
                      <div>
                        <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-4 border border-indigo-200">
                          <feature.icon className="h-6 w-6 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-slate-900">{feature.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-16 md:py-24 border-y border-violet-100 relative z-10 bg-violet-50/70 backdrop-blur-sm">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4 text-slate-900">Students Love Dishant AI</h2>
            </div>
            
            {/* Desktop Grid */}
            <div className="hidden md:grid md:grid-cols-4 gap-6">
              {testimonials.map((testimonial, i) => (
                <div key={i} className="bg-white/90 p-6 rounded-3xl border border-violet-100 relative shadow-xl shadow-violet-200/50 hover:-translate-y-1 transition-transform">
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map(star => <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-base mb-6 text-slate-700 leading-relaxed font-medium">&quot;{testimonial.text}&quot;</p>
                  <div className="mt-auto">
                    <p className="font-bold text-slate-900">{testimonial.name}</p>
                    <p className="text-sm text-violet-600 font-semibold">{testimonial.college}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Auto-Scroll Marquee (Reverse direction) */}
            <div className="md:hidden overflow-hidden w-[100vw] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] py-4 bg-violet-100/40 border-y border-violet-200/50">
              <div className="flex animate-marquee w-max [animation-direction:reverse] hover:[animation-play-state:paused]">
                {/* First Set */}
                <div className="flex gap-4 px-2 shrink-0">
                  {testimonials.map((testimonial, i) => (
                    <div key={`a-${i}`} className="w-[280px] bg-white/90 p-6 rounded-3xl border border-violet-100 relative shadow-lg shadow-violet-200/50 shrink-0 flex flex-col justify-between">
                      <div>
                        <div className="flex gap-1 mb-3">
                          {[1,2,3,4,5].map(star => <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                        </div>
                        <p className="text-sm mb-5 text-slate-700 leading-relaxed font-medium">&quot;{testimonial.text}&quot;</p>
                      </div>
                      <div className="mt-auto">
                        <p className="font-bold text-base text-slate-900">{testimonial.name}</p>
                        <p className="text-xs text-violet-600 font-semibold">{testimonial.college}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Second Set */}
                <div className="flex gap-4 px-2 shrink-0">
                  {testimonials.map((testimonial, i) => (
                    <div key={`b-${i}`} className="w-[280px] bg-white/90 p-6 rounded-3xl border border-violet-100 relative shadow-lg shadow-violet-200/50 shrink-0 flex flex-col justify-between">
                      <div>
                        <div className="flex gap-1 mb-3">
                          {[1,2,3,4,5].map(star => <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                        </div>
                        <p className="text-sm mb-5 text-slate-700 leading-relaxed font-medium">&quot;{testimonial.text}&quot;</p>
                      </div>
                      <div className="mt-auto">
                        <p className="font-bold text-base text-slate-900">{testimonial.name}</p>
                        <p className="text-xs text-violet-600 font-semibold">{testimonial.college}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 md:py-32 relative z-10 text-center">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-heading font-bold mb-6 text-slate-900">अपना Career आज ही बदलो</h2>
            <p className="text-base sm:text-lg md:text-2xl text-slate-600 mb-10 max-w-2xl mx-auto">
              Join thousands of students building their dream careers with Dishant AI. 100% Free to start.
            </p>
            <Link href="/signup">
              <Button size="lg" className="rounded-full px-10 md:px-12 h-14 md:h-16 text-lg md:text-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500 shadow-[0_10px_40px_rgba(99,102,241,0.3)] hover:shadow-[0_15px_50px_rgba(99,102,241,0.4)] border-0 hover:-translate-y-1 transition-all w-full sm:w-auto mx-4 sm:mx-0 font-bold">
                अभी Sign Up करें <ArrowRight className="ml-2 h-5 w-5 md:h-6 md:w-6" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 md:py-12 border-slate-200 relative z-10 bg-white/50 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            <span className="font-heading font-bold text-lg md:text-xl text-slate-900">Dishant AI</span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 text-center">
            © 2026 Dishant AI. Built for the youth of India.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs md:text-sm text-slate-500 hover:text-indigo-600 transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-xs md:text-sm text-slate-500 hover:text-indigo-600 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>

      {/* PWA Install Banner */}
      <div className="z-[100] relative">
        <InstallBanner />
      </div>
    </div>
  );
}
