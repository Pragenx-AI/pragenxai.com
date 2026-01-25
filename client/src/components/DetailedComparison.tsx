import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";

export function DetailedComparison() {
    const features = [
        { name: "Proactive Suggestions", pragenx: true, legacy: false, chatbot: false },
        { name: "Context Awareness", pragenx: true, legacy: "Limited", chatbot: false },
        { name: "Zero-Knowledge Privacy", pragenx: true, legacy: false, chatbot: "Varies" },
        { name: "Cross-App Integration", pragenx: true, legacy: true, chatbot: false },
        { name: "Autonomous Execution", pragenx: true, legacy: false, chatbot: false },
        { name: "Personalized Learning", pragenx: true, legacy: "Basic", chatbot: false },
    ];

    return (
        <section className="py-24 bg-secondary/30">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-foreground">
                        Beyond the <span className="text-primary">Status Quo.</span>
                    </h2>
                    <p className="text-lg text-muted-foreground dark:text-foreground/80 max-w-2xl mx-auto">
                        See how Pragenx stacks up against traditional assistants and standard AI chatbots.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <div className="min-w-[800px] bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
                        <div className="grid grid-cols-4 bg-muted/50 p-6 text-sm font-bold text-foreground">
                            <div className="col-span-1">Feature</div>
                            <div className="col-span-1 text-center text-primary">PRAGENX AI</div>
                            <div className="col-span-1 text-center text-muted-foreground">Legacy Assistants</div>
                            <div className="col-span-1 text-center text-muted-foreground">Basic Chatbots</div>
                        </div>

                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="grid grid-cols-4 p-6 border-t border-border items-center hover:bg-muted/30 transition-colors"
                            >
                                <div className="col-span-1 font-medium text-foreground">{feature.name}</div>

                                {/* Pragenx Column */}
                                <div className="col-span-1 flex justify-center">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Check className="w-5 h-5 text-primary" />
                                    </div>
                                </div>

                                {/* Legacy Column */}
                                <div className="col-span-1 flex justify-center">
                                    {feature.legacy === true ? (
                                        <Check className="w-5 h-5 text-muted-foreground" />
                                    ) : feature.legacy === false ? (
                                        <X className="w-5 h-5 text-muted-foreground/50" />
                                    ) : (
                                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                                            {feature.legacy}
                                        </span>
                                    )}
                                </div>

                                {/* Chatbot Column */}
                                <div className="col-span-1 flex justify-center">
                                    {feature.chatbot === true ? (
                                        <Check className="w-5 h-5 text-muted-foreground" />
                                    ) : feature.chatbot === false ? (
                                        <X className="w-5 h-5 text-muted-foreground/50" />
                                    ) : (
                                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                                            {feature.chatbot}
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
