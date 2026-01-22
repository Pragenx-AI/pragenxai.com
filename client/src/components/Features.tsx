import { motion } from "framer-motion";
import { Zap, Brain, Shield, Clock, Layers, Sparkles } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Seamless Flow",
    desc: "Automatically orchestrates your daily schedule by learning your natural rhythms and commitments.",
    color: "text-primary"
  },
  {
    icon: Brain,
    title: "Deep Awareness",
    desc: "Understands complex contexts, managing everything from meeting prep to insurance renewals.",
    color: "text-primary"
  },
  {
    icon: Shield,
    title: "Fortified Security",
    desc: "Your data is encrypted at rest and in transit, processed exclusively within secured enclaves.",
    color: "text-primary"
  },
  {
    icon: Zap,
    title: "Instant Action",
    desc: "Goes beyond alerts—handles rescheduling, bookings, and payments with your simple approval.",
    color: "text-primary"
  },
  {
    icon: Layers,
    title: "Harmonized Wellness",
    desc: "Monitors biomarkers to suggest lifestyle adjustments, ensuring peak mental and physical performance.",
    color: "text-primary"
  },
  {
    icon: Sparkles,
    title: "Refined Insights",
    desc: "Provides strategic financial and productivity reports to help you achieve long-term goals.",
    color: "text-primary"
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

export function Features() {
  return (
    <section id="features" className="py-32 relative overflow-hidden bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-display font-bold mb-8 text-foreground"
          >
            The New Standard in <br /><span className="text-primary">Personal AI</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground leading-relaxed"
          >
            While others provide chat, we provide agency. Pragenx is the invisible hand that keeps your life in perfect alignment.
          </motion.p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, i) => (
            <motion.div 
              key={i} 
              variants={item}
              whileHover={{ y: -5 }}
              className="bg-white p-10 rounded-2xl border border-border hover:border-primary/20 transition-all duration-500 shadow-sm hover:shadow-xl"
            >
              <div className={`w-14 h-14 rounded-xl bg-primary/5 flex items-center justify-center mb-8`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
