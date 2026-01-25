import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Product", id: "product", path: "/product/vision" },
    { name: "Company", id: "company", path: "/company/about" },
    { name: "Legal", id: "legal", path: "/legal/privacy" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-background/10 backdrop-blur-xl border-b border-white/10 py-4 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
        : "bg-transparent py-6"
        }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 group cursor-none">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img src="/logo-icon.png" alt="Pragenx AI Logo" className="h-8 w-8 object-contain relative z-10" />
            </div>
            <span className="text-xl md:text-2xl font-display font-bold tracking-wider select-none text-foreground flex items-center">
              <AnimatePresence>
                {!scrolled && (
                  <motion.span
                    key="brand-name"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    PRAGENX&nbsp;
                  </motion.span>
                )}
              </AnimatePresence>
              <span className="text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.8)]">AI</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.path}>
              <a className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full box-shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
              </a>
            </Link>
          ))}
          <Button
            onClick={() => {
              const el = document.getElementById("join");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(var(--primary),0.5)] hover:shadow-[0_0_25px_rgba(var(--primary),0.8)] transition-all duration-300"
          >
            Get Started
          </Button>
          <ModeToggle />
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
        <div className="md:hidden ml-2">
          <ModeToggle />
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-4">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.path}>
                  <a onClick={() => setMobileMenuOpen(false)} className="text-left py-2 text-lg font-medium text-muted-foreground hover:text-primary">
                    {link.name}
                  </a>
                </Link>
              ))}
              <Button
                onClick={() => {
                  setMobileMenuOpen(false);
                  const el = document.getElementById("join");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full mt-2 bg-primary text-white"
              >
                Get Started
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
