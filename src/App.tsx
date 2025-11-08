import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, RefreshCcw } from "lucide-react";
import Index from "./pages/Index";
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
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            
            <div className="flex-1 flex flex-col">
              {/* Top Header */}
              <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
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
                  <Route path="/systems" element={<Systems />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
