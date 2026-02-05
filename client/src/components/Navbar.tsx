import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Menu, X, Sparkles, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSignupPopup, setShowSignupPopup] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        handleClosePopup();
      }
    };

    if (showSignupPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSignupPopup]);

  const navLinks = [
    { name: "Product", id: "product", path: "/product/vision" },
    { name: "Company", id: "company", path: "/company/about" },
    { name: "Legal", id: "legal", path: "/legal/privacy" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setShowSuccess(true);
    setFormData({ name: "", email: "" });
  };

  const handleClosePopup = () => {
    setShowSignupPopup(false);
    setShowSuccess(false);
    setFormData({ name: "", email: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

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

          {/* Get Started Button with Dropdown Popup */}
          <div className="relative">
            <Button
              ref={buttonRef}
              onClick={() => setShowSignupPopup(!showSignupPopup)}
              className="bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(var(--primary),0.5)] hover:shadow-[0_0_25px_rgba(var(--primary),0.8)] transition-all duration-300"
            >
              Get Started
            </Button>

            {/* Small Popup Dropdown */}
            <AnimatePresence>
              {showSignupPopup && (
                <motion.div
                  ref={popupRef}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ type: "spring", damping: 25, stiffness: 400 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-background/95 backdrop-blur-2xl rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border border-primary/10 p-5 z-[100]"
                >
                  {/* Arrow pointer */}
                  <div className="absolute -top-2 right-8 w-4 h-4 bg-background/95 border-l border-t border-primary/10 transform rotate-45" />

                  {!showSuccess ? (
                    <>
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20">
                          <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-foreground">Get Started</h3>
                          <p className="text-xs text-muted-foreground">Join the future of AI today</p>
                        </div>
                      </div>

                      {/* Form */}
                      <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="space-y-3">
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Full Name"
                            className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-primary/10 text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all text-sm"
                          />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Email Address"
                            className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-primary/10 text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all text-sm"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm mt-2"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Connecting...
                            </>
                          ) : (
                            "Submit"
                          )}
                        </button>
                      </form>

                      <div className="mt-3 text-center">
                        <p className="text-[10px] text-muted-foreground/60">
                          Invite-only beta access
                        </p>
                      </div>
                    </>
                  ) : (
                    /* Success State */
                    <div className="text-center py-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 mb-3"
                      >
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      </motion.div>

                      <h3 className="text-base font-bold text-foreground mb-1">
                        You're on the list!
                      </h3>
                      <p className="text-xs text-muted-foreground mb-4">
                        Keep an eye on your inbox.
                      </p>

                      <button
                        onClick={handleClosePopup}
                        className="w-full px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-medium text-xs transition-all"
                      >
                        Close
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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

              {/* Mobile Form */}
              <div className="mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-purple-600">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">Get Started</span>
                </div>

                {!showSuccess ? (
                  <form onSubmit={handleSubmit} className="space-y-2">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Full Name"
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 text-sm"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Email Address"
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 text-sm"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2 rounded-lg bg-gradient-to-r from-rose-500 to-purple-600 text-white font-medium text-sm disabled:opacity-70"
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-2">
                    <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Success!</p>
                    <p className="text-xs text-gray-500">We'll be in touch soon.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
