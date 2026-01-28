import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const SupabaseConfigNotice = () => (
  <div className="min-h-screen bg-background flex items-center justify-center p-6">
    <div className="max-w-lg text-center space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Configuração necessária</h1>
      <p className="text-muted-foreground">
        Para acessar o app no GitHub Pages, defina as variáveis de ambiente
        <span className="font-semibold text-foreground"> VITE_SUPABASE_URL</span> e
        <span className="font-semibold text-foreground"> VITE_SUPABASE_PUBLISHABLE_KEY</span> no build.
      </p>
      <p className="text-muted-foreground">
        Sem essas variáveis o Supabase não pode inicializar e o app não carrega.
      </p>
    </div>
  </div>
);

const App = () => (
  !isSupabaseConfigured ? (
    <SupabaseConfigNotice />
  ) : (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
);

export default App;
