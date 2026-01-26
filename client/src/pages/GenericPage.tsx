import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundSplashes } from "@/components/ui/BackgroundSplashes";
import { motion } from "framer-motion";

export default function GenericPage({ title, description }: { title: string, description: string }) {
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
            <h1 className="text-4xl md:text-7xl font-display font-bold mb-8 text-foreground">
              {title}
            </h1>
            <div className="max-w-3xl">
              <p className="text-xl text-muted-foreground leading-relaxed mb-12">
                {description}
              </p>

              <div className="prose prose-lg prose-maroon max-w-none">
                <p>This page is currently being updated with the latest information about PRAGENX AI. Check back soon for deeper insights into our mission and technology.</p>
                <div className="grid md:grid-cols-2 gap-8 mt-12">
                  <div className="p-8 rounded-2xl bg-secondary border border-border">
                    <h3 className="text-xl font-bold mb-4">Core Principles</h3>
                    <p className="text-muted-foreground">Autonomy, Privacy, and Predictive Intelligence are at the heart of everything we build.</p>
                  </div>
                  <div className="p-8 rounded-2xl bg-secondary border border-border">
                    <h3 className="text-xl font-bold mb-4">Current Status</h3>
                    <p className="text-muted-foreground">We are currently in a closed beta phase, refining the engine for a global release.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
