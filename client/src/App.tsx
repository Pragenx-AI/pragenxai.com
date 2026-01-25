import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";

import ContentPage from "@/pages/ContentPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      {/* Product Routes */}
      <Route path="/product">
        <ContentPage
          title="Vision"
          subtitle="A future where technology serves humanity, not the other way around."
        >
          <div className="space-y-6">
            <h3>The Autonomous Future</h3>
            <p>At PRAGENX AI, we envision a world where distinct AI agents handle the noise of digital existence, liberating humans to focus on what truly matters: creativity, connection, and distinctive thought.</p>
            <p>We are moving beyond simple automation into the era of proactive intelligence—systems that understand intent, anticipate needs, and execute complex workflows without constant supervision.</p>
          </div>
        </ContentPage>
      </Route>
      <Route path="/product/vision">
        <ContentPage
          title="Vision"
          subtitle="A future where technology serves humanity, not the other way around."
        >
          <div className="space-y-6">
            <h3>The Autonomous Future</h3>
            <p>At PRAGENX AI, we envision a world where distinct AI agents handle the noise of digital existence, liberating humans to focus on what truly matters: creativity, connection, and distinctive thought.</p>
            <p>We are moving beyond simple automation into the era of proactive intelligence—systems that understand intent, anticipate needs, and execute complex workflows without constant supervision.</p>
          </div>
        </ContentPage>
      </Route>
      <Route path="/product/technology">
        <ContentPage
          title="Technology"
          subtitle="Built on the cutting edge of large language models and neural architecture."
        >
          <div className="space-y-6">
            <h3>Core Architecture</h3>
            <p>Our proprietary neural engine processes context at an unprecedented scale, allowing for long-horizon planning and execution.</p>
            <ul>
              <li><strong>Contextual Awareness:</strong> Deep understanding of user history and preferences.</li>
              <li><strong>Secure Execution:</strong> Sandboxed environments for safe autonomous actions.</li>
              <li><strong>Real-time Adaptation:</strong> specific learning models that evolve with your usage.</li>
            </ul>
          </div>
        </ContentPage>
      </Route>
      <Route path="/product/security">
        <ContentPage
          title="Security"
          subtitle="Uncompromising protection for your digital autonomy."
        >
          <div className="space-y-6">
            <h3>Zero-Trust Architecture</h3>
            <p>We operate on a strict zero-trust basis. Your data is encrypted at rest and in transit, with keys that you control.</p>
            <h3>Privacy First</h3>
            <p>Our models are designed to learn from your data without exposing it to the wider network. We employ federated learning techniques to ensure your personal information never leaves your secure environment.</p>
          </div>
        </ContentPage>
      </Route>

      {/* Company Routes */}
      <Route path="/company">
        <ContentPage
          title="About Us"
          subtitle="We are a collective of researchers, engineers, and designers building the next generation of AI."
        >
          <div className="space-y-6">
            <p>Founded in Belfast, Northern Ireland, PRAGENX AI was born from a simple observation: technology has become a burden rather than a tool. We are here to change that.</p>
            <p>Our team brings together expertise from top research labs and design studios, united by a singular focus on human-centric autonomy.</p>
          </div>
        </ContentPage>
      </Route>
      <Route path="/company/about">
        <ContentPage
          title="About Us"
          subtitle="We are a collective of researchers, engineers, and designers building the next generation of AI."
        >
          <div className="space-y-6">
            <p>Founded in Belfast, Northern Ireland, PRAGENX AI was born from a simple observation: technology has become a burden rather than a tool. We are here to change that.</p>
            <p>Our team brings together expertise from top research labs and design studios, united by a singular focus on human-centric autonomy.</p>
          </div>
        </ContentPage>
      </Route>
      <Route path="/company/manifesto">
        <ContentPage
          title="Manifesto"
          subtitle="Our pledge to the future of human-AI interaction."
        >
          <div className="space-y-6">
            <h3>1. Human Agency First</h3>
            <p>AI should amplify human capability, not replace it. We build tools that extend your reach, not your replacement.</p>
            <h3>2. Transparency by Design</h3>
            <p>You should always know when you are interacting with an AI, and understand the logic behind its decisions.</p>
            <h3>3. Privacy as a Right</h3>
            <p>Your thoughts, data, and digital footprint belong to you. We are merely the custodians of the tools you use to manage them.</p>
          </div>
        </ContentPage>
      </Route>
      <Route path="/company/careers">
        <ContentPage
          title="Careers"
          subtitle="Join us in building the autonomous future."
        >
          <div className="space-y-6">
            <p>We are always looking for exceptional talent to join our team. If you are passionate about AI, design, or systems engineering, we want to hear from you.</p>
            <p>Current openings:</p>
            <ul>
              <li>Full Stack Developer Intern</li>
            </ul>
            <p>If any are there, please mail to pragenxai@gmail.com</p>
          </div>
        </ContentPage>
      </Route>

      {/* Legal Routes */}
      <Route path="/legal">
        <ContentPage
          title="Privacy Policy"
          subtitle="Last updated: January 2026"
        >
          <div className="space-y-6">
            <h3>Introduction</h3>
            <p>Your privacy is important to us. It is Pragenx AI's policy to respect your privacy regarding any information we may collect from you across our website and other sites we own and operate.</p>
            <h3>Information We Collect</h3>
            <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.</p>
            <h3>Data Retention</h3>
            <p>We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.</p>
          </div>
        </ContentPage>
      </Route>
      <Route path="/legal/privacy">
        <ContentPage
          title="Privacy Policy"
          subtitle="Last updated: January 2026"
        >
          <div className="space-y-6">
            <h3>Introduction</h3>
            <p>Your privacy is important to us. It is Pragenx AI's policy to respect your privacy regarding any information we may collect from you across our website and other sites we own and operate.</p>
            <h3>Information We Collect</h3>
            <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.</p>
            <h3>Data Retention</h3>
            <p>We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.</p>
          </div>
        </ContentPage>
      </Route>
      <Route path="/legal/terms">
        <ContentPage
          title="Terms of Service"
          subtitle="Last updated: January 2026"
        >
          <div className="space-y-6">
            <h3>1. Terms</h3>
            <p>By accessing the website at pragenxai.com, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
            <h3>2. Use License</h3>
            <p>Permission is granted to temporarily download one copy of the materials (information or software) on Pragenx AI's website for personal, non-commercial transitory viewing only.</p>
            <h3>3. Disclaimer</h3>
            <p>The materials on Pragenx AI's website are provided on an 'as is' basis. Pragenx AI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
          </div>
        </ContentPage>
      </Route>
      <Route path="/legal/ethics">
        <ContentPage
          title="Ethics Policy"
          subtitle="Our commitment to responsible AI development."
        >
          <div className="space-y-6">
            <h3>Responsible Development</h3>
            <p>We serve humanity. We will not build technologies that harm, deceive, or manipulate users.</p>
            <h3>Bias Mitigation</h3>
            <p>We actively work to identify and mitigate biases in our datasets and models to ensure fair and equitable outcomes for all users.</p>
            <h3>Societal Impact</h3>
            <p>We constantly evaluate the societal impact of our technology and engage with ethicists, policymakers, and the public to shape a positive future.</p>
          </div>
        </ContentPage>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}



function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme" attribute="class">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>

          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
