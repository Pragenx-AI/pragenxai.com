import { Link } from "wouter";
import { Linkedin, Github } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="relative pt-32 pb-12 overflow-hidden bg-background">
      {/* Horizon Glow Effect */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 shadow-[0_0_50px_rgba(var(--primary),0.8)]" />
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ margin: "0px 0px -200px 0px" }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-0 left-0 right-0 h-[100px] bg-gradient-to-b from-primary/10 to-transparent blur-3xl pointer-events-none"
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/">
              <a className="inline-block">
                <h3 className="text-xl font-display font-bold mb-4 text-foreground dark:text-white hover:opacity-80 transition-opacity">
                  PRAGENX <span className="text-primary">AI</span>
                </h3>
              </a>
            </Link>
            <p className="text-muted-foreground dark:text-gray-400 text-sm leading-relaxed">
              Leading the autonomous revolution. Proactive intelligence for the modern individual.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground dark:text-white">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground dark:text-gray-400">
              <li><Link href="/product/vision" className="hover:text-primary transition-colors">Vision</Link></li>
              <li><Link href="/product/technology" className="hover:text-primary transition-colors">Technology</Link></li>
              <li><Link href="/product/security" className="hover:text-primary transition-colors">Security</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground dark:text-white">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground dark:text-gray-400">
              <li><Link href="/company/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/company/manifesto" className="hover:text-primary transition-colors">Manifesto</Link></li>
              <li><Link href="/company/careers" className="hover:text-primary transition-colors">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground dark:text-white">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground dark:text-gray-400">
              <li><Link href="/legal/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
              <li><Link href="/legal/terms" className="hover:text-primary transition-colors">Terms</Link></li>
              <li><Link href="/legal/ethics" className="hover:text-primary transition-colors">Ethics</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground dark:text-gray-500">
            © {new Date().getFullYear()} Pragenx AI Inc. • United Kingdom
          </p>

          <div className="flex items-center gap-6">

            <a href="https://www.linkedin.com/company/110455388/admin/dashboard/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
