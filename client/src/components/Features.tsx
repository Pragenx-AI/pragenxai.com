import { motion } from "framer-motion";
import { Brain, CreditCard, Calendar, Plane, Activity, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Proactive Intelligence",
    desc: "AI that alerts you before problems happen — not after.",
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    icon: CreditCard,
    title: "Bills & EMI Management",
    desc: "Track EMIs and utility bills with smart reminders that prevent late fees.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    icon: Calendar,
    title: "Smart Meetings",
    desc: "Never miss a meeting. Detect conflicts and get timely follow-ups.",
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    icon: Plane,
    title: "Travel Awareness",
    desc: "Trips, check-ins, and weather alerts — handled automatically.",
    color: "text-sky-500",
    bg: "bg-sky-500/10"
  },
  {
    icon: Activity,
    title: "Health & Habit Nudges",
    desc: "Gentle reminders to stay consistent with water, habits, and wellness.",
    color: "text-rose-500",
    bg: "bg-rose-500/10"
  },
  {
    icon: BarChart3,
    title: "Financial Insights",
    desc: "Understand your spending with simple, stress-free summaries.",
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export function Features() {
  return (
    <section id="features" className="py-32 relative overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <motion.div
        className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"
        animate={{ x: [0, 50, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 15, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-foreground tracking-tight">
              Everything You Need to <span className="text-primary">Stay Ahead</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Pragenx AI proactively manages your life, so you don’t have to.
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={item}
              whileHover={{ y: -5 }}
              className="group relative bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden"
            >
              {/* Soft glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-6 ring-1 ring-inset ring-black/5`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>

                <h3 className="text-xl font-bold mb-3 text-card-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
