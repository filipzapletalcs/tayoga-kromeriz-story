import { lazy, Suspense, useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/hooks/use-theme';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import CookieConsent from '@/components/CookieConsent';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Lazy load CustomCursor - only needed on desktop
const CustomCursor = lazy(() => import('@/components/CustomCursor'));

// Desktop-only cursor wrapper - SSR safe
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

// Create QueryClient once
const queryClient = new QueryClient();

const Layout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="tayoga-ui-theme">
        <TooltipProvider>
          <ErrorBoundary>
            <DesktopCursor />
            <CookieConsent />
            <Toaster />
            <Sonner />
            <div className="min-h-screen">
              {/* Skip to content link for accessibility */}
              <a
                href="#home"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded focus:outline-none"
              >
                Přeskočit na obsah
              </a>
              <Header />
              <main>
                <Outlet />
              </main>
              <Footer />
            </div>
          </ErrorBoundary>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default Layout;
