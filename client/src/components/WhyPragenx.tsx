import { motion } from "framer-motion";
import { BrainCircuit, Lock, Zap } from "lucide-react";

export function WhyPragenx() {
    const reasons = [
        {
            icon: BrainCircuit,
            title: "Proactive Intelligence",
            description: "Unlike passive tools that wait for commands, Pragenx anticipates your needs. It analyzes your schedule, habits, and goals to offer suggestions before you even ask.",
        },
        {
            icon: Lock,
            title: "Absolute Privacy",
            description: "Your data never leaves your device unencrypted. We use local-first processing and zero-knowledge architecture to ensure your personal life remains truly personal.",
        },
        {
            icon: Zap,
            title: "Seamless Integration",
            description: "Pragenx connects with your existing calendar, email, and task apps. It doesn't replace your ecosystem; it orchestrates it for maximum efficiency.",
        },
    ];

    return (
        <section className="py-32 bg-background relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 opacity-50 pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6">
                <div className="mb-20">
                    <span className="text-primary font-bold tracking-widest text-sm uppercase mb-4 block">Core Philosophy</span>
                    <h2 className="text-4xl md:text-6xl font-display font-bold text-foreground">
                        Why Choose <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500">Pragenx AI?</span>
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {reasons.map((reason, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2, duration: 0.8 }}
                            className="group p-8 rounded-3xl bg-card border border-border hover:border-primary/20 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-8 group-hover:bg-primary/10 transition-colors">
                                <reason.icon className="w-7 h-7 text-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-foreground">{reason.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {reason.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
