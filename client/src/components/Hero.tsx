import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bell, Calendar, CreditCard, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useJoinWaitlist } from "@/hooks/use-waitlist";
import { z } from "zod";

// Floating card component for the right side visual
const FloatingCard = ({ icon: Icon, title, desc, delay, color }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20, x: -20 }}
    animate={{ opacity: 1, y: 0, x: 0 }}
    transition={{ delay, duration: 0.8, ease: "easeOut" }}
    className="absolute glass-card p-4 rounded-xl flex items-start gap-3 w-64 md:w-72 pointer-events-none select-none"
    style={{ 
      top: `${Math.random() * 60 + 10}%`, 
      right: `${Math.random() * 20}%`,
      zIndex: Math.floor(Math.random() * 10)
    }}
  >
    <div className={`p-2 rounded-lg ${color} bg-opacity-5`}>
      <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
    </div>
    <div>
      <h4 className="font-medium text-sm text-foreground">{title}</h4>
      <p className="text-xs text-muted-foreground mt-1">{desc}</p>
    </div>
  </motion.div>
);

export function Hero() {
  const [email, setEmail] = useState("");
  const joinWaitlist = useJoinWaitlist();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX - innerWidth / 2) / 25;
    const y = (clientY - innerHeight / 2) / 25;
    setMousePos({ x, y });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    joinWaitlist.mutate({ email });
    setEmail("");
  };

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-white"
    >
      {/* Futuristic Grid Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ 
             backgroundImage: 'linear-gradient(#800000 1px, transparent 1px), linear-gradient(90deg, #800000 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }} 
      />

      {/* Interactive Background Glows */}
      <motion.div 
        animate={{ x: mousePos.x * 2, y: mousePos.y * 2 }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" 
      />
      <motion.div 
        animate={{ x: -mousePos.x * 1.5, y: -mousePos.y * 1.5 }}
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[150px] -z-10" 
      />

      <div className="container mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Next-Gen Intelligence</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-9xl font-display font-bold leading-[1] mb-8 text-foreground">
            An AI That <br />
            <span className="text-primary">Thinks Ahead</span> <br />
            for You.
          </h1>
          
          <p className="text-xl md:text-3xl text-muted-foreground mb-12 leading-relaxed max-w-xl font-light">
            PRAGENX AI is a proactive personal assistant that predicts, reminds, and protects you from everyday stress.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:row gap-4 max-w-md mb-12">
            <div className="relative group flex-1">
              <Input 
                type="email" 
                placeholder="Secure access via email" 
                className="h-16 bg-white border-border text-lg px-6 focus:ring-2 focus:ring-primary/20 transition-all shadow-sm rounded-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              size="lg" 
              className="h-16 px-10 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={joinWaitlist.isPending}
            >
              {joinWaitlist.isPending ? "Connecting..." : "Get Access"}
            </Button>
          </form>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground/60 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Zero-Knowledge Encryption</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-border" />
            <span>Invite-only Beta</span>
          </div>
        </motion.div>

        {/* Right Visuals - Futuristic Wireframe Console */}
        <div className="relative h-[700px] hidden lg:flex items-center justify-center">
          <motion.div 
            style={{ x: mousePos.x, y: mousePos.y }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {/* Wireframe Circles */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute w-[550px] h-[550px] border border-dashed border-primary/10 rounded-full"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute w-[450px] h-[450px] border border-primary/5 rounded-full"
            />
            
            {/* Minimal Dashboard Mock */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5 }}
              className="relative z-10 w-[400px] aspect-square bg-white/40 backdrop-blur-3xl rounded-3xl border border-border/50 shadow-2xl p-8 flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary/20" />
                  <div className="w-3 h-3 rounded-full bg-border" />
                  <div className="w-3 h-3 rounded-full bg-border" />
                </div>
                <div className="h-6 w-20 bg-primary/5 rounded-full" />
              </div>

              <div className="space-y-4 flex-1">
                {[
                  { icon: CreditCard, title: "Risk Detected", label: "EMI due in 3 days", color: "text-red-500", bg: "bg-red-50" },
                  { icon: Calendar, title: "Overlap", label: "Two meetings tomorrow", color: "text-primary", bg: "bg-primary/5" },
                  { icon: Bell, title: "Travel", label: "Rain expected on Day 2", color: "text-amber-500", bg: "bg-amber-50" },
                  { icon: ArrowRight, title: "Health", label: "Water intake low", color: "text-blue-500", bg: "bg-blue-50" },
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className={`flex items-center gap-4 p-4 rounded-2xl ${item.bg} border border-white/50 shadow-sm`}
                  >
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    <div className="flex-1">
                      <div className="text-[10px] font-bold uppercase tracking-tighter opacity-50">{item.title}</div>
                      <div className="text-sm font-bold text-foreground">{item.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="h-2 w-full bg-border/20 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "65%" }}
                  transition={{ duration: 2, delay: 1 }}
                  className="h-full bg-primary" 
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
