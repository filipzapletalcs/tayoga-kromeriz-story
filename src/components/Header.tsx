import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import logoSvg from "@/assets/TaYoga_Logo.svg";
import { useLocation, useNavigate, Link } from "react-router-dom";

// ------------------------------------------------------------
// Tayoga Header – klidný, hravý, interaktivní
// - Sticky header s jemným blur a stínem po scrollu
// - Progres bar čtení (scroll progress)
// - Aktivní zvýraznění sekce dle IntersectionObserver
// - Mobile menu (bez dalších závislostí)
// - URL se mění při scrollování i klikání
// ------------------------------------------------------------

type NavItem = { id: string; path: string; label: string };
const NAV: NavItem[] = [
  { id: "home", path: "/", label: "Domů" },
  { id: "o-studiu", path: "/o-studiu", label: "O studiu" },
  { id: "lektorka", path: "/lektorka", label: "Lektorka" },
  { id: "lekce", path: "/lekce", label: "Lekce" },
  { id: "unikatnost", path: "/unikatnost", label: "Unikátnost" },
  { id: "rozvrh", path: "/rozvrh", label: "Rozvrh" },
  { id: "kontakt", path: "/kontakt", label: "Kontakt" },
];

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("home");
  const [progress, setProgress] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const isNavigatingRef = useRef(false);
  const isInitialLoadRef = useRef(true);
  const navigationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll effects
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 50);
      const h = document.body.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(100, (y / h) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // When URL changes on initial load only, scroll to that section
  useEffect(() => {
    if (!isInitialLoadRef.current) return;

    const currentPath = location.pathname;
    const navItem = NAV.find(item => item.path === currentPath);

    if (navItem) {
      const sectionId = navItem.id;
      const el = document.getElementById(sectionId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
    isInitialLoadRef.current = false;
  }, [location.pathname]);

  // Active section highlight via IntersectionObserver + update URL
  useEffect(() => {
    const ids = NAV.map((n) => n.id);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Skip URL updates while user is navigating via click
        if (isNavigatingRef.current) return;

        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          const sectionId = visible.target.id;
          setActiveId(sectionId);

          // Update URL based on visible section
          const navItem = NAV.find(item => item.id === sectionId);
          if (navItem && location.pathname !== navItem.path) {
            navigate(navItem.path, { replace: true });
          }
        }
      },
      { rootMargin: "-20% 0px -30% 0px", threshold: [0.1, 0.25, 0.5, 0.75] }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [navigate, location.pathname]);

  const scrollToSection = (sectionId: string, path: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      // Block IntersectionObserver URL updates during navigation
      isNavigatingRef.current = true;

      // Clear any existing timeout
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }

      // Update URL and active state immediately
      setActiveId(sectionId);
      navigate(path, { replace: true });

      // Scroll to section
      el.scrollIntoView({ behavior: "smooth", block: "start" });

      // Re-enable IntersectionObserver after scroll completes (approx 1s for smooth scroll)
      navigationTimeoutRef.current = setTimeout(() => {
        isNavigatingRef.current = false;
      }, 1000);
    }
    setMobileOpen(false);
  };

  const isActive = (id: string) => {
    return activeId === id;
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-background/95 backdrop-blur-sm border-b border-border card-shadow" : "bg-transparent"
    }`}>
      {/* Skip link pro přístupnost */}
      <a href="#home" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] rounded bg-primary px-3 py-2 text-sm text-primary-foreground">
        Přeskočit na obsah
      </a>

      {/* Scroll progress bar */}
      <div
        className="absolute left-0 top-0 h-[1px] bg-primary/40 transition-[width] duration-500 ease-out"
        style={{ width: `${progress}%` }}
        aria-hidden
      />

      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollToSection("home", "/")}
            className="group inline-flex items-center"
            aria-label="TaYoga – Domů"
          >
            <img
              src={logoSvg}
              alt="TaYoga Kroměříž"
              className="h-10 w-auto"
            />
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id, item.path)}
                className={`relative transition-colors duration-200 hover:text-primary ${
                  isActive(item.id)
                    ? "text-primary"
                    : isScrolled
                      ? "text-foreground"
                      : "text-white dark:text-foreground"
                }`}
              >
                {item.label}
                {/* underline */}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] rounded bg-primary transition-all duration-300 ${
                    isActive(item.id) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                  aria-hidden
                />
              </button>
            ))}
          </nav>

          {/* CTA + theme toggle + mobile toggle */}
          <div className="flex items-center gap-3">
            <ThemeToggle
              className={!isScrolled ? "text-white hover:bg-white/10 dark:text-foreground dark:hover:bg-accent" : ""}
              iconClassName={!isScrolled ? "text-white dark:text-foreground" : ""}
            />
            <Link to="/rezervace">
              <Button variant="default" className="hidden sm:inline-flex">
                Rezervovat lekci <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <button
              className={`md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border transition-colors duration-200 ${
                isScrolled
                  ? "bg-background hover:bg-accent border-border"
                  : "bg-white/10 hover:bg-white/20 border-white/30 text-white dark:bg-background dark:hover:bg-accent dark:border-border dark:text-foreground"
              }`}
              onClick={() => setMobileOpen((s) => !s)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label="Otevřít menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm"
          >
            <div className="container mx-auto px-6 py-4">
              <div className="grid gap-2">
                {NAV.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id, item.path)}
                    className={`flex items-center justify-between rounded-md px-2 py-3 text-left hover:bg-accent ${
                      isActive(item.id) ? "text-primary" : "text-foreground"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="h-[2px] w-6 rounded bg-primary/60" aria-hidden />
                  </button>
                ))}
                <Link to="/rezervace" className="mt-2">
                  <Button className="w-full">
                    <Phone className="mr-2 h-4 w-4" /> Rezervovat lekci
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};


export default Header;
