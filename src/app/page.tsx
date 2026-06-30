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

export default function LandingPage() {
  return (
    <div className="dark flex flex-col min-h-screen overflow-x-hidden bg-[#030014] text-slate-100 font-sans selection:bg-indigo-500/30">
      
      {/* Ultra Premium Colorful Mesh Background */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-600/30 blur-[120px] mix-blend-screen opacity-50 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-600/30 blur-[120px] mix-blend-screen opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-indigo-600/20 blur-[150px] mix-blend-screen opacity-40 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>
      
      {/* Fixed Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-white/10 bg-[#030014]/60 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-white">Dishant AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link href="#features" className="transition-colors hover:text-white">Features</Link>
            <Link href="#testimonials" className="transition-colors hover:text-white">Reviews</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white hidden sm:inline-block">Log in</Link>
            <Link href="/signup">
              <Button className="rounded-full bg-white text-black hover:bg-slate-200 hover:scale-105 transition-all h-9 px-5 text-sm font-semibold shadow-[0_0_20px_rgba(255,255,255,0.15)]">
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
            
            <div className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs sm:text-sm font-medium text-indigo-300 mb-8 backdrop-blur-md">
              <Sparkles className="mr-2 h-4 w-4" />
              <span>AI-Powered Career Guide for Every Student</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tight mb-6 max-w-5xl mx-auto leading-[1.1] text-white">
              सपनों को हकीकत बनाओ.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400 drop-shadow-sm">
                Design Your Career.
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-2xl text-slate-400 mb-10 max-w-2xl mx-auto font-medium px-4">
              India&apos;s smartest AI mentor that helps you discover the perfect career, learn the right skills, and get hired.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 sm:px-0 w-full sm:w-auto">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="rounded-full px-8 h-14 text-lg w-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:from-indigo-400 hover:to-violet-500 shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:shadow-[0_0_60px_rgba(99,102,241,0.6)] border-0 hover:scale-105 transition-all duration-300 group font-bold">
                  शुरू करो (Start for Free) <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <div className="mt-16 pt-8 border-t border-white/10 max-w-3xl mx-auto">
              <p className="text-xs md:text-sm text-slate-500 mb-6 uppercase tracking-widest font-semibold">Trusted by students across India</p>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-8 opacity-80 transition-all duration-500">
                <div className="flex items-center gap-2 text-slate-300"><Users className="h-5 w-5 text-indigo-400"/> <span className="font-bold text-sm md:text-base">10k+ Students</span></div>
                <div className="flex items-center gap-2 text-slate-300"><Target className="h-5 w-5 text-indigo-400"/> <span className="font-bold text-sm md:text-base">50+ Career Paths</span></div>
                <div className="flex items-center gap-2 text-slate-300"><GraduationCap className="h-5 w-5 text-indigo-400"/> <span className="font-bold text-sm md:text-base">Free Forever</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 relative z-10">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4 text-white">सब कुछ जो आपको चाहिए</h2>
              <p className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto px-4 md:px-0">
                A complete suite of AI-powered tools designed specifically for Indian students to navigate the modern job market.
              </p>
            </div>
            
            {/* Desktop Grid */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <div key={i} className="p-8 rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] border border-white/10 bg-white/[0.02] backdrop-blur-md group">
                  <div className="h-14 w-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-500/30 transition-all border border-indigo-500/20">
                    <feature.icon className="h-7 w-7 text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-100">{feature.title}</h3>
                  <p className="text-slate-400 text-lg leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Mobile Auto-Scroll Marquee (Foolproof Implementation) */}
            <div className="md:hidden overflow-hidden w-[100vw] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
              <div className="flex animate-marquee w-max hover:[animation-play-state:paused]">
                {/* First Set */}
                <div className="flex gap-4 px-2 shrink-0">
                  {features.map((feature, i) => (
                    <div key={`a-${i}`} className="w-[300px] p-6 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-md shadow-lg shrink-0 flex flex-col justify-between">
                      <div>
                        <div className="h-12 w-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4 border border-indigo-500/20">
                          <feature.icon className="h-6 w-6 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Second Set (Duplicate for seamless loop) */}
                <div className="flex gap-4 px-2 shrink-0">
                  {features.map((feature, i) => (
                    <div key={`b-${i}`} className="w-[300px] p-6 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-md shadow-lg shrink-0 flex flex-col justify-between">
                      <div>
                        <div className="h-12 w-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4 border border-indigo-500/20">
                          <feature.icon className="h-6 w-6 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-16 md:py-24 border-y border-white/10 relative z-10 bg-white/[0.01]">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4 text-white">Students Love Dishant AI</h2>
            </div>
            
            {/* Desktop Grid */}
            <div className="hidden md:grid md:grid-cols-4 gap-6">
              {testimonials.map((testimonial, i) => (
                <div key={i} className="bg-[#0f172a]/50 p-6 rounded-3xl border border-white/10 relative shadow-xl hover:-translate-y-1 transition-transform backdrop-blur-sm">
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map(star => <Star key={star} className="h-4 w-4 fill-indigo-400 text-indigo-400" />)}
                  </div>
                  <p className="text-base mb-6 text-slate-300 leading-relaxed">&quot;{testimonial.text}&quot;</p>
                  <div className="mt-auto">
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-sm text-indigo-400">{testimonial.college}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Auto-Scroll Marquee (Reverse direction) */}
            <div className="md:hidden overflow-hidden w-[100vw] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
              <div className="flex animate-marquee w-max [animation-direction:reverse] hover:[animation-play-state:paused]">
                {/* First Set */}
                <div className="flex gap-4 px-2 shrink-0">
                  {testimonials.map((testimonial, i) => (
                    <div key={`a-${i}`} className="w-[280px] bg-[#0f172a]/80 p-6 rounded-3xl border border-white/10 relative shadow-lg shrink-0 flex flex-col justify-between">
                      <div>
                        <div className="flex gap-1 mb-3">
                          {[1,2,3,4,5].map(star => <Star key={star} className="h-4 w-4 fill-indigo-400 text-indigo-400" />)}
                        </div>
                        <p className="text-sm mb-5 text-slate-300 leading-relaxed">&quot;{testimonial.text}&quot;</p>
                      </div>
                      <div className="mt-auto">
                        <p className="font-bold text-base text-white">{testimonial.name}</p>
                        <p className="text-xs text-indigo-400">{testimonial.college}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Second Set */}
                <div className="flex gap-4 px-2 shrink-0">
                  {testimonials.map((testimonial, i) => (
                    <div key={`b-${i}`} className="w-[280px] bg-[#0f172a]/80 p-6 rounded-3xl border border-white/10 relative shadow-lg shrink-0 flex flex-col justify-between">
                      <div>
                        <div className="flex gap-1 mb-3">
                          {[1,2,3,4,5].map(star => <Star key={star} className="h-4 w-4 fill-indigo-400 text-indigo-400" />)}
                        </div>
                        <p className="text-sm mb-5 text-slate-300 leading-relaxed">&quot;{testimonial.text}&quot;</p>
                      </div>
                      <div className="mt-auto">
                        <p className="font-bold text-base text-white">{testimonial.name}</p>
                        <p className="text-xs text-indigo-400">{testimonial.college}</p>
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
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-heading font-bold mb-6 text-white">अपना Career आज ही बदलो</h2>
            <p className="text-base sm:text-lg md:text-2xl text-slate-400 mb-10 max-w-2xl mx-auto">
              Join thousands of students building their dream careers with Dishant AI. 100% Free to start.
            </p>
            <Link href="/signup">
              <Button size="lg" className="rounded-full px-10 md:px-12 h-14 md:h-16 text-lg md:text-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:from-indigo-400 hover:to-violet-500 shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_50px_rgba(99,102,241,0.6)] border-0 hover:scale-105 transition-all w-full sm:w-auto mx-4 sm:mx-0 font-bold">
                अभी Sign Up करें <ArrowRight className="ml-2 h-5 w-5 md:h-6 md:w-6" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 md:py-12 border-white/10 relative z-10 bg-[#030014]">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            <span className="font-heading font-bold text-lg md:text-xl text-white">Dishant AI</span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 text-center">
            © 2026 Dishant AI. Built for the youth of India.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs md:text-sm text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-xs md:text-sm text-slate-500 hover:text-white transition-colors">Terms of Service</Link>
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
