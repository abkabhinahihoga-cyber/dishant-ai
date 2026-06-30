import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Compass, Target, Sparkles, BrainCircuit, Users, Star, GraduationCap, Briefcase } from "lucide-react";
import { InstallBanner } from "@/components/install-banner";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Premium Dark Grid Background */}
      <div className="fixed inset-0 -z-20 bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-6 md:px-8">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-heading font-bold text-xl tracking-tight">Dishant AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="#features" className="transition-colors hover:text-primary">Features</Link>
            <Link href="#testimonials" className="transition-colors hover:text-primary">Reviews</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4 hidden sm:inline-block">Log in</Link>
            <Link href="/signup">
              <Button className="rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-105">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 lg:py-32 flex flex-col items-center justify-center min-h-[90vh]">
          {/* Animated Background Orbs (Enhanced for mobile visibility) */}
          <div className="absolute top-1/4 left-1/4 -z-10 w-64 h-64 sm:w-96 sm:h-96 bg-primary/30 rounded-full blur-[80px] sm:blur-[100px] mix-blend-screen animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 -z-10 w-56 h-56 sm:w-80 sm:h-80 bg-violet-500/30 rounded-full blur-[80px] sm:blur-[100px] mix-blend-screen animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 -z-10 w-56 h-56 sm:w-80 sm:h-80 bg-blue-500/30 rounded-full blur-[80px] sm:blur-[100px] mix-blend-screen animate-blob animation-delay-4000"></div>
          
          <div className="container px-4 md:px-6 text-center animate-fade-up">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(var(--primary),0.2)]">
              <Sparkles className="mr-2 h-4 w-4" />
              <span>AI-Powered Career Guide for Every Student</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tight mb-6 max-w-5xl mx-auto leading-tight">
              सपनों को हकीकत बनाओ.<br />
              <span className="text-gradient drop-shadow-sm">Design Your Career.</span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto font-medium">
              India&apos;s smartest AI mentor that helps you discover the perfect career, learn the right skills, and get hired.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="rounded-full px-8 h-14 text-lg w-full shadow-xl shadow-primary/20 hover:scale-105 transition-all duration-300 group">
                  शुरू करो (Start for Free) <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <div className="mt-16 pt-8 border-t border-border/30 max-w-3xl mx-auto">
              <p className="text-sm text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Trusted by students across India</p>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2"><Users className="h-5 w-5 sm:h-6 sm:w-6"/> <span className="font-bold text-sm sm:text-lg">10,000+ Students</span></div>
                <div className="flex items-center gap-2"><Target className="h-5 w-5 sm:h-6 sm:w-6"/> <span className="font-bold text-sm sm:text-lg">50+ Career Paths</span></div>
                <div className="flex items-center gap-2"><GraduationCap className="h-5 w-5 sm:h-6 sm:w-6"/> <span className="font-bold text-sm sm:text-lg">Free Forever</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 relative">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-6">सब कुछ जो आपको चाहिए</h2>
              <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
                A complete suite of AI-powered tools designed specifically for Indian students to navigate the modern job market.
              </p>
            </div>
            
            <div className="flex overflow-x-auto pb-8 snap-x snap-mandatory gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:overflow-visible custom-scrollbar px-4 md:px-0 -mx-4 md:mx-0">
              {[
                { title: "AI Career Mentor", desc: "Chat with an intelligent guide in Hindi or English anytime you're confused.", icon: BrainCircuit, delay: "0s" },
                { title: "Skill Roadmaps", desc: "Month-by-month step-by-step plans to learn the exact skills companies want.", icon: Compass, delay: "0.1s" },
                { title: "Study Planner", desc: "Organize your college exams, assignments, and daily study schedule effortlessly.", icon: BookOpen, delay: "0.2s" },
                { title: "Mock Interviews", desc: "Practice with AI for HR and Technical rounds before your real campus placement.", icon: Target, delay: "0.3s" },
                { title: "ATS Resumes", desc: "Generate professional resumes that pass company screening software automatically.", icon: Sparkles, delay: "0.4s" },
                { title: "Job Board", desc: "Find the latest entry-level jobs and internships perfect for freshers.", icon: Briefcase, delay: "0.5s" }
              ].map((feature, i) => (
                <div key={i} className="min-w-[85vw] sm:min-w-[320px] md:min-w-0 snap-center glass-card p-6 sm:p-8 rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border border-white/10 dark:border-white/5 animate-fade-up group bg-background/50 backdrop-blur-md" style={{ animationDelay: feature.delay }}>
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-lg">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-24 bg-muted/20 border-y border-border/40">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-heading font-bold mb-4">Students Love Dishant AI</h2>
            </div>
            
            <div className="flex overflow-x-auto pb-8 snap-x snap-mandatory gap-6 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible custom-scrollbar px-4 md:px-0 -mx-4 md:mx-0">
              {[
                { name: "Rahul Sharma", college: "Govt Engineering College", text: "I was totally confused about which IT field to choose. The AI Mentor guided me in Hindi and gave me a clear web development roadmap." },
                { name: "Priya Patel", college: "Science College, Tier 3", text: "The ATS Resume builder helped me get shortlisted for my first internship. The mock interview practice gave me so much confidence!" },
                { name: "Amit Kumar", college: "B.Com Student", text: "Study planner helps me manage my college exams and skill learning together. It's like having a personal mentor 24/7. बिल्कुल मस्त ऐप है!" }
              ].map((testimonial, i) => (
                <div key={i} className="min-w-[85vw] sm:min-w-[320px] md:min-w-0 snap-center bg-background p-6 sm:p-8 rounded-3xl border border-border/50 relative shadow-xl shadow-black/5 hover:shadow-primary/5 transition-all">
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map(star => <Star key={star} className="h-5 w-5 fill-primary text-primary" />)}
                  </div>
                  <p className="text-lg mb-6 italic text-muted-foreground">&quot;{testimonial.text}&quot;</p>
                  <div>
                    <p className="font-bold text-lg">{testimonial.name}</p>
                    <p className="text-sm text-primary">{testimonial.college}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-background to-background -z-10"></div>
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-heading font-bold mb-6">अपना Career आज ही बदलो</h2>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of students building their dream careers with Dishant AI. 100% Free to start.
            </p>
            <Link href="/signup">
              <Button size="lg" className="rounded-full px-12 h-16 text-xl shadow-[0_0_30px_rgba(var(--primary),0.3)] hover:shadow-[0_0_40px_rgba(var(--primary),0.5)] hover:scale-105 transition-all">
                अभी Sign Up करें <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-background border-border/40">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-heading font-bold text-xl">Dishant AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Dishant AI. Built for the youth of India.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </footer>

      {/* PWA Install Banner */}
      <InstallBanner />
    </div>
  );
}
