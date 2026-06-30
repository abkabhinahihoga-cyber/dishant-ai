import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Compass, Target, Sparkles, BrainCircuit } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-heading font-bold text-xl tracking-tight">Dishant AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="#features" className="transition-colors hover:text-primary">Features</Link>
            <Link href="#how-it-works" className="transition-colors hover:text-primary">How it Works</Link>
            <Link href="#pricing" className="transition-colors hover:text-primary">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">Log in</Link>
            <Link href="/signup">
              <Button className="rounded-full">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 lg:py-32">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
          
          <div className="container px-4 md:px-6 text-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 animate-fade-in">
              <Sparkles className="mr-2 h-4 w-4" />
              <span>The Personal Career Operating System</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight mb-6 max-w-4xl mx-auto">
              From Confusion To <span className="text-gradient">Career.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Dishant AI is your intelligent mentor, guiding you to discover the right career, build essential skills, and achieve your goals with confidence.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="rounded-full px-8 h-12 text-base w-full sm:w-auto">
                  Start Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/career-test">
                <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base w-full sm:w-auto bg-background/50 backdrop-blur-md">
                  Take Career Test
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Everything you need to succeed</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                A complete suite of AI-powered tools designed specifically for Indian students to navigate the modern job market.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "AI Career Mentor", desc: "Chat with an intelligent guide tailored to your profile.", icon: BrainCircuit },
                { title: "Skill Roadmaps", desc: "Month-by-month plans to acquire the skills you need.", icon: Compass },
                { title: "Study Planner", desc: "Organize your subjects, exams, and daily schedule.", icon: BookOpen },
                { title: "Mock Interviews", desc: "Practice with AI for HR and Technical rounds.", icon: Target },
                { title: "ATS Resumes", desc: "Generate professional resumes that pass screeners.", icon: Sparkles },
                { title: "Mentor Marketplace", desc: "Connect with real industry experts for 1-on-1 guidance.", icon: ArrowRight }
              ].map((feature, i) => (
                <div key={i} className="glass-card p-6 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-2xl">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing CTA */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -z-10"></div>
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">Ready to find your direction?</h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of students building their dream careers with Dishant AI. Start for free today.
            </p>
            <Link href="/signup">
              <Button size="lg" className="rounded-full px-10 h-14 text-lg">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-heading font-bold text-lg">Dishant AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Dishant AI. Built for students.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
