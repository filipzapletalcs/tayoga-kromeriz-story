import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import logoSvg from "@/assets/TaYoga_Logo.svg";

// ------------------------------------------------------------
// Tayoga Header – klidný, hravý, interaktivní
// - Sticky header s jemným blur a stínem po scrollu
// - Progres bar čtení (scroll progress)
// - Aktivní zvýraznění sekce dle IntersectionObserver
// - Mobile menu (bez dalších závislostí)
// - "Breath dot" mikropulz vedle loga
// ------------------------------------------------------------

type NavItem = { id: string; label: string };
const NAV: NavItem[] = [
  { id: "home", label: "Domů" },
  { id: "about", label: "O studiu" },
  { id: "instructor", label: "Lektorka" },
  { id: "lessons", label: "Lekce" },
  { id: "unique", label: "Unikátnost" },
  { id: "schedule", label: "Rozvrh" },
  { id: "contact", label: "Kontakt" },
];

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("home");
  const [progress, setProgress] = useState(0);

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

  // Active section highlight via IntersectionObserver
  useEffect(() => {
    const ids = NAV.map((n) => n.id);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-20% 0px -30% 0px", threshold: [0.1, 0.25, 0.5, 0.75] }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
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
            onClick={() => scrollToSection("home")}
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
                onClick={() => scrollToSection(item.id)}
                className={`relative text-foreground transition-colors duration-200 hover:text-primary ${
                  activeId === item.id ? "text-primary" : ""
                }`}
              >
                {item.label}
                {/* underline */}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] rounded bg-primary transition-all duration-300 ${
                    activeId === item.id ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                  aria-hidden
                />
              </button>
            ))}
          </nav>

          {/* CTA + theme toggle + mobile toggle */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button onClick={() => scrollToSection("contact")} variant="default" className="hidden sm:inline-flex">
              Rezervovat lekci <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <button
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border bg-background hover:bg-accent"
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
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center justify-between rounded-md px-2 py-3 text-left hover:bg-accent ${
                      activeId === item.id ? "text-primary" : "text-foreground"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="h-[2px] w-6 rounded bg-primary/60" aria-hidden />
                  </button>
                ))}
                <Button onClick={() => scrollToSection("contact")} className="mt-2">
                  <Phone className="mr-2 h-4 w-4" /> Rezervovat lekci
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};


export default Header;
