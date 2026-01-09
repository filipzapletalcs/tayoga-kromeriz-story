import { Button } from "@/components/ui/button";
import { Head } from "vite-react-ssg";
import { RefreshCw, Home, Phone } from "lucide-react";
import { motion } from "framer-motion";
import logoSvg from "@/assets/TaYoga_Logo.svg";
import footerLogo from "@/assets/TaYoga_logo_footer.svg";

interface ErrorPageProps {
  error?: Error;
  resetError?: () => void;
}

/**
 * Full-page error component for runtime errors (500)
 * Used as fallback in ErrorBoundary
 * Head component handles SSR-safe meta tags
 */
const ErrorPage = ({ error, resetError }: ErrorPageProps) => {

  const handleRefresh = () => {
    if (resetError) {
      resetError();
    }
    window.location.reload();
  };

  return (
    <>
      {/* SSR-safe meta tags for error page - noindex is critical for SEO */}
      <Head>
        <title>Něco se pokazilo | TaYoga Kroměříž</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="Omlouváme se, došlo k neočekávané chybě." />
        <link rel="canonical" href="https://tayoga.cz/" />
        <meta property="og:title" content="" />
        <meta property="og:description" content="" />
      </Head>

      <div className="min-h-screen flex flex-col bg-background">
        {/* Simplified header */}
        <header className="border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <a href="/" className="inline-flex items-center group">
            <img
              src={logoSvg}
              alt="TaYoga"
              className="h-10 w-auto transition-transform group-hover:scale-105"
            />
          </a>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center">
        <div className="container mx-auto px-6 py-16 md:py-24 text-center">
          {/* Calming yoga icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <motion.span
                className="text-5xl"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                🧘
              </motion.span>
            </div>
          </motion.div>

          {/* Error message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
              Něco se pokazilo
            </h1>
            <p className="text-lg text-muted-foreground mb-2 max-w-md mx-auto leading-relaxed">
              Omlouváme se, došlo k neočekávané chybě.
              Nadechněte se a zkuste to znovu.
            </p>
            <p className="text-sm text-muted-foreground/70 mb-8">
              Pokud problém přetrvává, kontaktujte nás.
            </p>

            {/* Show error details in development */}
            {import.meta.env.DEV && error && (
              <details className="mt-4 mb-8 text-left max-w-lg mx-auto">
                <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                  Technické detaily (pouze pro vývojáře)
                </summary>
                <pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto text-left font-mono">
                  <span className="text-destructive font-semibold">{error.name}: </span>
                  {error.message}
                  {error.stack && (
                    <>
                      {'\n\n'}
                      <span className="text-muted-foreground">{error.stack}</span>
                    </>
                  )}
                </pre>
              </details>
            )}
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" onClick={handleRefresh} className="group">
              <RefreshCw className="mr-2 h-5 w-5 transition-transform group-hover:rotate-180" />
              Zkusit znovu
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="/">
                <Home className="mr-2 h-5 w-5" />
                Zpět na úvod
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="/kontakt">
                <Phone className="mr-2 h-5 w-5" />
                Kontaktovat nás
              </a>
            </Button>
          </motion.div>

          {/* Breathing exercise suggestion */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-12 pt-8 border-t border-border"
          >
            <p className="text-sm text-muted-foreground italic">
              "Při každém nádechu se uklidňuji, při každém výdechu se usmívám."
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              — Thich Nhat Hanh
            </p>
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
              <a
                href="mailto:barayoga001@gmail.com"
                className="text-primary hover:underline"
              >
                barayoga001@gmail.com
              </a>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
};

export default ErrorPage;
