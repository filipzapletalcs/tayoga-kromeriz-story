import { Link } from "react-router-dom";
import { Head } from "vite-react-ssg";
import { Button } from "@/components/ui/button";
import { Home, Calendar, Phone, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import logoSvg from "@/assets/TaYoga_Logo.svg";
import footerLogo from "@/assets/TaYoga_logo_footer.svg";

const NotFound = () => {
  // Head component handles SSR meta tags - critical for SEO on error pages

  return (
    <>
      {/* SSR-safe meta tags for 404 page - noindex is critical for SEO */}
      <Head>
        <title>Stránka nenalezena | TaYoga Kroměříž</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="Tato stránka neexistuje. Vraťte se na hlavní stránku TaYoga studia." />
        <link rel="canonical" href="https://tayoga.cz/" />
        {/* Clear OG tags - error pages shouldn't be shared */}
        <meta property="og:title" content="" />
        <meta property="og:description" content="" />
      </Head>

      <div className="min-h-screen flex flex-col bg-background">
        {/* Simplified header for error page */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <Link to="/" className="inline-flex items-center group">
            <img
              src={logoSvg}
              alt="TaYoga"
              className="h-10 w-auto transition-transform group-hover:scale-105"
            />
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center">
        <div className="container mx-auto px-6 py-16 md:py-24 text-center">
          {/* Animated floating logo */}
          <motion.div
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="mb-8"
          >
            <img
              src={logoSvg}
              alt=""
              aria-hidden="true"
              className="h-16 w-auto mx-auto opacity-40"
            />
          </motion.div>

          {/* Large 404 number */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-[8rem] md:text-[12rem] leading-none font-serif font-bold text-primary/20 select-none">
              404
            </h1>
          </motion.div>

          {/* Friendly message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="-mt-6 md:-mt-10"
          >
            <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-4">
              Tato stránka se ztratila v meditaci
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
              Omlouváme se, ale stránka, kterou hledáte, neexistuje
              nebo byla přesunuta. Pojďme vás navést zpět na správnou cestu.
            </p>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild size="lg" className="group">
              <Link to="/">
                <Home className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
                Zpět na úvod
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/rozvrh">
                <Calendar className="mr-2 h-5 w-5" />
                Prohlédnout rozvrh
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/kontakt">
                <Phone className="mr-2 h-5 w-5" />
                Kontaktovat nás
              </Link>
            </Button>
          </motion.div>

          {/* Helpful links section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-12 pt-8 border-t border-border"
          >
            <p className="text-sm text-muted-foreground mb-4">
              Možná hledáte:
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              <Link to="/o-studiu" className="text-primary hover:underline underline-offset-4">
                O studiu
              </Link>
              <Link to="/lektorka" className="text-primary hover:underline underline-offset-4">
                Lektorka
              </Link>
              <Link to="/lekce" className="text-primary hover:underline underline-offset-4">
                Lekce
              </Link>
              <Link to="/rezervace" className="text-primary hover:underline underline-offset-4">
                Rezervace
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Simplified footer */}
      <footer className="bg-muted dark:bg-card text-foreground py-8 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={footerLogo}
                alt="TaYoga"
                className="h-12 w-auto opacity-70"
              />
              <span className="text-muted-foreground text-sm">
                Jógové studio v srdci Kroměříže
              </span>
            </div>
            <div className="text-center md:text-right text-sm text-muted-foreground">
              <p>&copy; 2025 TaYoga Studio</p>
              <Link to="/" className="text-primary hover:underline inline-flex items-center gap-1 mt-1">
                <ArrowLeft className="h-3 w-3" />
                Zpět na hlavní stránku
              </Link>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
};

export default NotFound;
