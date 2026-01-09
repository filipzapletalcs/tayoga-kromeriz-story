import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import CustomCursor from "@/components/CustomCursor";
import CookieConsent from "@/components/CookieConsent";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy-loaded pages with Supabase (defers ~48KB supabase bundle)
const Rezervace = lazy(() => import("./pages/Rezervace"));
const Cookies = lazy(() => import("./pages/Cookies"));

// Lazy-loaded admin routes with AdminProvider (defers Supabase + admin code)
const AdminRoutes = lazy(() => import("./pages/admin/AdminRoutes"));

// Loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-muted-foreground">Načítání...</div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="tayoga-ui-theme">
      <TooltipProvider>
        <ErrorBoundary>
          <CustomCursor />
          <CookieConsent />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Main website routes - no Supabase dependency */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="o-studiu" element={<Index />} />
                <Route path="lektorka" element={<Index />} />
                <Route path="lekce" element={<Index />} />
                <Route path="unikatnost" element={<Index />} />
                <Route path="rozvrh" element={<Index />} />
                <Route path="kontakt" element={<Index />} />
              </Route>

              {/* Reservation page - lazy loaded with Supabase */}
              <Route path="/rezervace" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Rezervace />
                </Suspense>
              } />

              {/* Cookies policy page */}
              <Route path="/cookies" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Cookies />
                </Suspense>
              } />

              {/* Admin routes - lazy loaded with AdminProvider + Supabase */}
              <Route path="/admin/*" element={
                <Suspense fallback={<LoadingFallback />}>
                  <AdminRoutes />
                </Suspense>
              } />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
