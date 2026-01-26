import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  Lock,
  Zap,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useJoinWaitlist } from "@/hooks/use-waitlist";

export function Hero() {
  const [email, setEmail] = useState("");
  const joinWaitlist = useJoinWaitlist();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [wordIndex, setWordIndex] = useState(0);

  const words = [
    { text: "Thinks Ahead", color: "text-primary" },
    { text: "Anticipates", color: "text-primary dark:text-rose-500" },
    { text: "Simplifies", color: "text-primary dark:text-rose-500" },
    { text: "Protects", color: "text-primary dark:text-rose-500" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX - innerWidth / 2) / 40;
    const y = (clientY - innerHeight / 2) / 40;
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
      className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-background"
    >
      {/* RICH ANIMATED BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Base Gradient - Light/Dark support */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-background to-background opacity-80 dark:from-slate-900 dark:via-background dark:to-background" />

        {/* Moving Blobs - Adjusted for Dark Mode */}
        {/* We use mix-blend-multiply for light mode (subtractive) and mix-blend-screen for dark mode (additive) */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -right-[10%] w-[1000px] h-[1000px] bg-gradient-to-br from-primary/20 via-rose-500/10 to-transparent rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen dark:from-primary/30 dark:via-rose-600/10"
        />

        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[20%] -left-[10%] w-[800px] h-[800px] bg-gradient-to-tr from-primary/15 via-rose-500/10 to-transparent rounded-full blur-[80px] mix-blend-multiply dark:mix-blend-screen dark:from-primary/20 dark:via-rose-500/10"
        />

        <motion.div
          animate={{
            x: [0, 50, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[0%] right-[20%] w-[600px] h-[600px] bg-gradient-to-tl from-primary/15 via-rose-500/10 to-transparent rounded-full blur-[90px] mix-blend-multiply dark:mix-blend-screen dark:from-primary/15 dark:via-rose-600/10"
        />

        {/* Noise overlay for premium texture */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 mix-blend-overlay" />

        {/* Subtle Grid - White/Grey for structure */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">

        {/* Left Content - Glass backing for readability */}
        <motion.div className="max-w-2xl relative">
          {/* Spotlight effect behind text */}
          <div className="absolute -inset-10 bg-white/40 dark:bg-black/40 blur-3xl -z-10 rounded-full opacity-0 lg:opacity-100" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 dark:bg-white/5 border border-primary/10 mb-8 backdrop-blur-md shadow-sm"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Next-Gen Intelligence</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[1.1] mb-8 text-foreground tracking-tight drop-shadow-sm">
            An AI That<br />
            <div className="h-[1.1em] overflow-hidden relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={wordIndex}
                  initial={{ y: 50, opacity: 0, filter: "blur(10px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: -50, opacity: 0, filter: "blur(10px)" }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`${words[wordIndex].color} drop-shadow-sm`}
                >
                  {words[wordIndex].text}
                </motion.div>
              </AnimatePresence>
            </div>
            for You.
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed max-w-lg font-light">
            More than just automation. A proactive partner that understands your intent and secures your digital life.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:row gap-4 max-w-md mb-12">
            <div className="relative group flex-1">
              <Input
                type="email"
                placeholder="Enter your email for access"
                className="h-16 bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 text-lg px-6 focus:ring-2 focus:ring-primary/20 transition-all shadow-lg rounded-2xl backdrop-blur-xl hover:bg-white/80 dark:hover:bg-white/10 dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-16 px-8 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98] animate-pulse-slow"
              disabled={joinWaitlist.isPending}
            >
              {joinWaitlist.isPending ? "Connecting..." : "Get Access"}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </form>

          <div className="flex items-center gap-6 text-sm text-muted-foreground/80 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span>Bank-Grade Security</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-border" />
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Invite-only Beta</span>
            </div>
          </div>
        </motion.div>

        {/* Right Visuals - Interactive Brain/Dashboard */}
        <div className="relative h-[500px] lg:h-[700px] flex items-center justify-center perspective-1000 w-full mt-10 lg:mt-0">
          <motion.div
            style={{
              rotateX: window.innerWidth > 1024 ? mousePos.y * 2 : 0,
              rotateY: window.innerWidth > 1024 ? mousePos.x * 2 : 0,
            }}
            className="relative w-full h-full flex items-center justify-center transition-transform duration-200 ease-out"
          >
            {/* Orbital Rings - Responsive */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
              className="absolute w-[300px] h-[300px] lg:w-[600px] lg:h-[600px] border border-dashed border-primary/20 rounded-full shadow-[0_0_40px_rgba(128,0,0,0.05)]"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
              className="absolute w-[250px] h-[250px] lg:w-[500px] lg:h-[500px] border border-primary/10 rounded-full"
            />

            {/* Glass Dashboard Card - Responsive Width */}
            <div className="relative z-10 w-full max-w-[340px] lg:max-w-[420px] bg-white/60 dark:bg-black/60 backdrop-blur-2xl rounded-[2rem] lg:rounded-[2.5rem] border border-white/40 dark:border-white/10 shadow-2xl overflow-hidden ring-1 ring-white/50 dark:ring-white/10 mx-4">
              {/* Header */}
              <div className="p-6 lg:p-8 border-b border-white/20 dark:border-white/5 flex justify-between items-center bg-white/20 dark:bg-white/5">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-red-500/80 shadow-sm" />
                  <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-amber-500/80 shadow-sm" />
                  <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-green-500/80 shadow-sm" />
                </div>
                <div className="h-1.5 lg:h-2 w-16 lg:w-20 bg-primary/10 dark:bg-white/10 rounded-full" />
              </div>

              {/* Content - Live Cards */}
              <div className="p-6 lg:p-8 space-y-3 lg:space-y-4">
                {[
                  { icon: Zap, title: "Proactive Action", label: "Meeting rescheduled to avoid conflict", color: "text-amber-500", bg: "bg-amber-500/10" },
                  { icon: ShieldCheck, title: "Security Alert", label: "Phishing attempt blocked", color: "text-primary", bg: "bg-primary/10" },
                  { icon: CreditCard, title: "Finance", label: "Subscription optimized: Saved $45", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02, x: 5, backgroundColor: "rgba(255,255,255,0.1)" }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.2 }}
                    className={`flex items-center gap-3 lg:gap-4 p-3 lg:p-4 rounded-xl lg:rounded-2xl ${item.bg} border border-transparent hover:border-white/40 dark:hover:border-white/20 transition-all cursor-pointer group shadow-sm hover:shadow-md`}
                  >
                    <div className={`p-1.5 lg:p-2 rounded-lg lg:rounded-xl bg-white/60 dark:bg-white/10 ${item.color} shadow-sm`}>
                      <item.icon className="w-4 h-4 lg:w-5 lg:h-5" />
                    </div>
                    <div>
                      <div className="text-[9px] lg:text-[10px] font-bold uppercase tracking-wider opacity-60 mb-0.5">{item.title}</div>
                      <div className="font-semibold text-xs lg:text-sm text-foreground line-clamp-1">{item.label}</div>
                    </div>
                    <ChevronDown className="w-3 h-3 lg:w-4 lg:h-4 ml-auto opacity-0 group-hover:opacity-50 transition-opacity -rotate-90 hidden sm:block" />
                  </motion.div>
                ))}
              </div>

              {/* Bottom Activity Bar */}
              <div className="px-6 lg:px-8 pb-6 lg:pb-8 pt-2 lg:pt-4">
                <div className="text-xs font-medium text-muted-foreground mb-2 lg:mb-3 flex justify-between">
                  <span>System Load</span>
                  <span className="text-primary font-bold">Optimal</span>
                </div>
                <div className="h-1.5 w-full bg-muted/40 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: ["30%", "45%", "35%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-primary to-amber-500 rounded-full shadow-[0_0_10px_rgba(128,0,0,0.3)]"
                  />
                </div>
              </div>
            </div>

            {/* Floating Elements - Responsive Position */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-2 lg:-right-8 top-10 lg:top-20 glass-card p-3 lg:p-4 rounded-xl lg:rounded-2xl flex items-center gap-2 lg:gap-3 pr-6 lg:pr-8 shadow-xl bg-white/80 dark:bg-black/50 border border-white/50 dark:border-white/10 scale-90 lg:scale-100 z-20"
            >
              <div className="bg-green-500/20 p-1.5 lg:p-2 rounded-full text-green-500">
                <Lock className="w-3 h-3 lg:w-4 lg:h-4" />
              </div>
              <div>
                <div className="text-[10px] lg:text-xs font-bold text-green-500">Encrypted</div>
                <div className="text-[10px] lg:text-xs font-semibold">256-bit AES</div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 2, duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground/50"
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>

    </section>
  );
}
