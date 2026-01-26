import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundSplashes } from "@/components/ui/BackgroundSplashes";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ContentPageProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
}

export default function ContentPage({ title, subtitle, children }: ContentPageProps) {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <BackgroundSplashes />
            <main className="pt-32 pb-20 relative z-10">
                <div className="container mx-auto px-4 md:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 text-foreground">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-xl text-muted-foreground leading-relaxed mb-12 max-w-3xl">
                                {subtitle}
                            </p>
                        )}

                        <div className="prose prose-lg max-w-4xl prose-headings:text-primary prose-p:text-foreground prose-strong:text-primary prose-li:text-foreground">
                            {children}
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
