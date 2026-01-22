import { Link } from "wouter";
import { Twitter, Linkedin, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card/30 border-t border-white/5 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-display font-bold mb-4 text-foreground">
              PRAGENX <span className="text-primary">AI</span>
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Leading the autonomous revolution. Proactive intelligence for the modern individual.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/product" className="hover:text-primary transition-colors">Vision</Link></li>
              <li><Link href="/product" className="hover:text-primary transition-colors">Technology</Link></li>
              <li><Link href="/product" className="hover:text-primary transition-colors">Security</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/company" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/company" className="hover:text-primary transition-colors">Manifesto</Link></li>
              <li><Link href="/company" className="hover:text-primary transition-colors">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/legal" className="hover:text-primary transition-colors">Privacy</Link></li>
              <li><Link href="/legal" className="hover:text-primary transition-colors">Terms</Link></li>
              <li><Link href="/legal" className="hover:text-primary transition-colors">Ethics</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Pragenx AI Inc. 
          </p>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
