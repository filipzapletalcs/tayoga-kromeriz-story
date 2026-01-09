import { lazy, Suspense, useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import CookieConsent from "@/components/CookieConsent";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load CustomCursor - only needed on desktop
const CustomCursor = lazy(() => import("@/components/CustomCursor"));

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

// Desktop-only cursor wrapper
const DesktopCursor = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Only show on desktop (min-width: 769px and has fine pointer)
    const checkDesktop = () => {
      const hasPointer = window.matchMedia('(pointer: fine)').matches;
      const isWide = window.matchMedia('(min-width: 769px)').matches;
      setIsDesktop(hasPointer && isWide);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  if (!isDesktop) return null;

  return (
    <Suspense fallback={null}>
      <CustomCursor />
    </Suspense>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="tayoga-ui-theme">
      <TooltipProvider>
        <ErrorBoundary>
          <DesktopCursor />
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
