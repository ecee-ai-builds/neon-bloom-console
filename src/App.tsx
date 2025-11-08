import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, RefreshCcw } from "lucide-react";
import Index from "./pages/Index";
import Plants from "./pages/Plants";
import Systems from "./pages/Systems";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="flex flex-col min-h-screen">
            {/* Top Header */}
            <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 flex-shrink-0">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-foreground hover:text-primary" />
                <div className="text-sm">
                  <span className="text-muted-foreground uppercase">TACTICAL COMMAND / </span>
                  <span className="text-primary uppercase font-bold">OVERVIEW</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground uppercase">
                  LAST UPDATE: {new Date().toLocaleString('en-US', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })} UTC
                </span>
                <button className="text-muted-foreground hover:text-primary transition-colors">
                  <Bell className="w-5 h-5" />
                </button>
                <button className="text-muted-foreground hover:text-primary transition-colors">
                  <RefreshCcw className="w-5 h-5" />
                </button>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/plants" element={<Plants />} />
                <Route path="/systems" element={<Systems />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
