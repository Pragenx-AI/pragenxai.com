import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";

import GenericPage from "@/pages/GenericPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/product">
        <GenericPage title="Product" description="The technological foundation of proactive intelligence. Learn how PRAGENX AI orchestrates your digital life." />
      </Route>
      <Route path="/company">
        <GenericPage title="Company" description="We are on a mission to reclaim human focus. PRAGENX AI is built by a team dedicated to the future of autonomy." />
      </Route>
      <Route path="/legal">
        <GenericPage title="Legal" description="Your privacy is our priority. Explore our ethical frameworks and data protection standards." />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

import CustomCursor from "@/components/CustomCursor";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme" attribute="class">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <CustomCursor />
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
