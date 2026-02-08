import { Suspense, lazy, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { motion } from "framer-motion";
import Lenis from "lenis";
import { VideoSection } from "@/components/VideoSection";

// Lazy load heavy sections
const Features = lazy(() => import("@/components/Features").then(module => ({ default: module.Features })));
const WhyPragenx = lazy(() => import("@/components/WhyPragenx").then(module => ({ default: module.WhyPragenx })));
const DetailedComparison = lazy(() => import("@/components/DetailedComparison").then(module => ({ default: module.DetailedComparison })));
const WaitlistSection = lazy(() => import("@/components/WaitlistSection").then(module => ({ default: module.WaitlistSection })));
const Footer = lazy(() => import("@/components/Footer").then(module => ({ default: module.Footer })));

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <motion.div
      className="min-h-screen text-foreground relative overflow-hidden bg-background"
    >
      {/* Dynamic Background Elements - Removed global splashes to reduce GPU overdraw with Hero */}
      {/* <div className="fixed inset-0 z-0 pointer-events-none">
        <BackgroundSplashes />
      </div> */}

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
          <Suspense fallback={<div className="h-96" />}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Features />
            </motion.div>
          </Suspense>

          <VideoSection />

          <Suspense fallback={<div className="h-96" />}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <WhyPragenx />
            </motion.div>
          </Suspense>

          <Suspense fallback={<div className="h-96" />}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <DetailedComparison />
            </motion.div>
          </Suspense>

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
