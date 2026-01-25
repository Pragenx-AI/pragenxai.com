import { useState, useRef } from "react";
import { useJoinWaitlist } from "@/hooks/use-waitlist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

export function WaitlistSection() {
  const [email, setEmail] = useState("");
  const joinWaitlist = useJoinWaitlist();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    joinWaitlist.mutate({ email });
    setEmail("");
  };

  return (
    <section id="join" ref={containerRef} className="py-32 relative bg-background overflow-hidden">
      {/* Black Hole Effect */}
      <motion.div
        style={{ scale, rotate, opacity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/20 via-black to-primary/20 rounded-full blur-[100px] -z-10 pointer-events-none mix-blend-screen"
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto bg-card/10 backdrop-blur-xl rounded-3xl p-12 md:p-20 text-center border border-white/10 shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />

          <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 text-foreground drop-shadow-2xl">
            Experience the <br />
            <span className="text-primary">Autonomous Edge.</span>
          </h2>

          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join the exclusive list for early access. Pragenx is currently in invite-only beta.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto relative z-20">
            <Input
              type="email"
              placeholder="Email address"
              className="h-14 bg-background/50 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:bg-background/80 transition-all backdrop-blur-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button
              type="submit"
              size="lg"
              className="h-14 px-10 bg-primary hover:bg-primary/90 text-white font-bold whitespace-nowrap shadow-[0_0_20px_rgba(var(--primary),0.5)] hover:shadow-[0_0_40px_rgba(var(--primary),0.8)] transition-all duration-300"
              disabled={joinWaitlist.isPending}
            >
              {joinWaitlist.isPending ? "Sending..." : "Get Access"}
            </Button>
          </form>

          <p className="mt-8 text-sm text-muted-foreground font-medium">
            Next cohort starting soon.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
