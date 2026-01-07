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
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminClasses from "./pages/admin/AdminClasses";
import AdminOneTimeClasses from "./pages/admin/AdminOneTimeClasses";
import AdminWorkshops from "./pages/admin/AdminWorkshops";
import AdminCalendar from "./pages/admin/AdminCalendar";
import AdminVisitors from "./pages/admin/AdminVisitors";

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

                {/* Admin routes */}
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="classes" element={<AdminClasses />} />
                  <Route path="one-time" element={<AdminOneTimeClasses />} />
                  <Route path="workshops" element={<AdminWorkshops />} />
                  <Route path="calendar" element={<AdminCalendar />} />
                  <Route path="visitors" element={<AdminVisitors />} />
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
