import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { WaitlistSection } from "@/components/WaitlistSection";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

function ComparisonSection() {
  return (
    <section className="py-32 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 text-foreground">
              Evolutionary <br />Intelligence.
            </h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Pragenx learns your lifestyle without intrusive tracking. It synthesizes your digital footprint to provide high-fidelity assistance.
            </p>
            
            <div className="space-y-6">
              {[
                { old: "Passive Observation", new: "Active Anticipation" },
                { old: "Manual Coordination", new: "Automated Orchestration" },
                { old: "Basic Retrieval", new: "Strategic Insight" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-white border border-border shadow-sm">
                  <div className="flex items-center gap-4 opacity-40">
                    <X className="w-5 h-5 text-foreground" />
                    <span className="text-base line-through">{item.old}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Check className="w-5 h-5 text-primary" />
                    <span className="text-base font-bold text-foreground">{item.new}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="order-1 md:order-2 relative">
             <div className="absolute inset-0 bg-primary/5 blur-[100px] -z-10" />
             <div className="bg-white p-10 rounded-3xl border border-border shadow-2xl relative">
                <div className="absolute -top-4 -right-4 bg-primary text-white text-xs font-bold px-6 py-2 rounded-full shadow-lg">
                  AUTONOMOUS AGENT
                </div>
                
                <div className="space-y-8">
                  <div className="flex gap-5">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-bold">P</span>
                    </div>
                    <div className="bg-secondary/50 p-6 rounded-2xl rounded-tl-none border border-border flex-1">
                      <p className="text-base text-foreground font-medium">I've noticed your focus time is usually at 10 AM, but your calendar has 3 conflicts. I've drafted reschedule requests for the non-essential ones. Shall I send?</p>
                      
                      <div className="flex gap-3 mt-6">
                        <Button size="sm" className="bg-primary text-white font-bold">Execute</Button>
                        <Button size="sm" variant="outline">Dismiss</Button>
                      </div>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <ComparisonSection />
        <WaitlistSection />
      </main>
      <Footer />
    </div>
  );
}
