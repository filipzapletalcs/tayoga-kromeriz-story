import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { AdminProvider } from "@/hooks/useAdmin";
import CustomCursor from "@/components/CustomCursor";
import CookieConsent from "@/components/CookieConsent";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Rezervace from "./pages/Rezervace";

// Lazy-loaded admin routes (reduces initial bundle by ~100-150KB)
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminClasses = lazy(() => import("./pages/admin/AdminClasses"));
const AdminOneTimeClasses = lazy(() => import("./pages/admin/AdminOneTimeClasses"));
const AdminWorkshops = lazy(() => import("./pages/admin/AdminWorkshops"));
const AdminCalendar = lazy(() => import("./pages/admin/AdminCalendar"));
const AdminVisitors = lazy(() => import("./pages/admin/AdminVisitors"));

// Loading fallback for admin routes
const AdminLoadingFallback = () => (
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
          <AdminProvider>
            <CustomCursor />
            <CookieConsent />
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Main website routes */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<Index />} />
                  <Route path="o-studiu" element={<Index />} />
                  <Route path="lektorka" element={<Index />} />
                  <Route path="lekce" element={<Index />} />
                  <Route path="unikatnost" element={<Index />} />
                  <Route path="rozvrh" element={<Index />} />
                  <Route path="kontakt" element={<Index />} />
                </Route>

                {/* Reservation page */}
                <Route path="/rezervace" element={<Rezervace />} />

                {/* Admin routes - lazy loaded */}
                <Route path="/admin" element={
                  <Suspense fallback={<AdminLoadingFallback />}>
                    <AdminLogin />
                  </Suspense>
                } />
                <Route path="/admin" element={
                  <Suspense fallback={<AdminLoadingFallback />}>
                    <AdminLayout />
                  </Suspense>
                }>
                  <Route path="dashboard" element={
                    <Suspense fallback={<AdminLoadingFallback />}>
                      <AdminDashboard />
                    </Suspense>
                  } />
                  <Route path="classes" element={
                    <Suspense fallback={<AdminLoadingFallback />}>
                      <AdminClasses />
                    </Suspense>
                  } />
                  <Route path="one-time" element={
                    <Suspense fallback={<AdminLoadingFallback />}>
                      <AdminOneTimeClasses />
                    </Suspense>
                  } />
                  <Route path="workshops" element={
                    <Suspense fallback={<AdminLoadingFallback />}>
                      <AdminWorkshops />
                    </Suspense>
                  } />
                  <Route path="calendar" element={
                    <Suspense fallback={<AdminLoadingFallback />}>
                      <AdminCalendar />
                    </Suspense>
                  } />
                  <Route path="visitors" element={
                    <Suspense fallback={<AdminLoadingFallback />}>
                      <AdminVisitors />
                    </Suspense>
                  } />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AdminProvider>
        </ErrorBoundary>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
