import { Suspense, lazy } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { Check, X } from "lucide-react";
import { Features } from "@/components/Features";
import { WhyPragenx } from "@/components/WhyPragenx";
import { DetailedComparison } from "@/components/DetailedComparison";

// Lazy load heavy sections (keep heavy interactive sections lazy if needed, but text content should be eager for mobile scroll)
const WaitlistSection = lazy(() => import("@/components/WaitlistSection").then(module => ({ default: module.WaitlistSection })));
const Footer = lazy(() => import("@/components/Footer").then(module => ({ default: module.Footer })));

export default function Home() {
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["rgb(255, 255, 255)", "rgb(255, 245, 245)", "rgb(255, 255, 255)"]
  );

  return (
    <motion.div
      className="min-h-screen text-foreground relative overflow-hidden"
      style={{ backgroundColor }}
    >
      {/* Dynamic Background Elements */}
      <motion.div
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          y: backgroundY,
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(128, 0, 0, 0.1), transparent 70%)'
        }}
      />

      <div className="relative z-10">
        <Navbar />
        <main>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Hero />
          </motion.div>

          {/* Static sections for smooth scroll */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Features />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <WhyPragenx />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <DetailedComparison />
          </motion.div>

          {/* Lazy loaded interactive sections */}
          <Suspense fallback={<div className="h-96" />}>
            <div className="relative">
              {/* Footer Reveal Gateway */}
              <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-background z-20 pointer-events-none" />

              <motion.div
                initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 1 }}
              >
                <WaitlistSection />
              </motion.div>
            </div>
          </Suspense>
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </motion.div>
  );
}
