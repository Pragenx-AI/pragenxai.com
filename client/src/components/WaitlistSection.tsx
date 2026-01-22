import { useState } from "react";
import { useJoinWaitlist } from "@/hooks/use-waitlist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { ArrowRight } from "lucide-react";

export function WaitlistSection() {
  const [email, setEmail] = useState("");
  const joinWaitlist = useJoinWaitlist();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    joinWaitlist.mutate({ email });
    setEmail("");
  };

  return (
    <section id="join" className="py-32 relative bg-background">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto bg-card rounded-3xl p-12 md:p-20 text-center border border-border shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary" />

          <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 text-foreground">
            Experience the <br />
            <span className="text-primary">Autonomous Edge.</span>
          </h2>

          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join the exclusive list for early access. Pragenx is currently in invite-only beta.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <Input
              type="email"
              placeholder="Email address"
              className="h-14 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button
              type="submit"
              size="lg"
              className="h-14 px-10 bg-primary hover:bg-primary/90 text-white font-bold whitespace-nowrap"
              disabled={joinWaitlist.isPending}
            >
              {joinWaitlist.isPending ? "Sending..." : "Get Access"}
            </Button>
          </form>

          <p className="mt-8 text-sm text-muted-foreground font-medium">
            Next cohort starting soon.
          </p>
        </div>
      </div>
    </section>
  );
}
