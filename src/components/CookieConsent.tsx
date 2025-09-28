import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const CONSENT_KEY = "tayoga-consent";

type ConsentState = "granted" | "denied" | null;

export default function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState<ConsentState>(null);

  useEffect(() => {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (raw === "granted" || raw === "denied") {
      setSaved(raw);
      applyConsent(raw);
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, []);

  const applyConsent = (state: Exclude<ConsentState, null>) => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: state === "granted" ? "granted" : "denied",
        // ponecháme reklamní souhlas zamítnutý (nepoužíváme reklamní služby)
        ad_personalization: "denied",
        ad_user_data: "denied",
        ad_storage: "denied",
      });
    }
  };

  const acceptAll = () => {
    localStorage.setItem(CONSENT_KEY, "granted");
    setSaved("granted");
    applyConsent("granted");
    setOpen(false);
  };

  const rejectAll = () => {
    localStorage.setItem(CONSENT_KEY, "denied");
    setSaved("denied");
    applyConsent("denied");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-4xl p-4 text-sm flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="text-gray-800 sm:flex-1">
          <p className="hidden sm:block">
            Používáme pouze analytické cookies pro zlepšení webu. Prosím
            potvrďte, zda s tím souhlasíte. Více informací najdete v zásadách
            ochrany osobních údajů.
          </p>
          <p className="sm:hidden">
            Používáme analytické cookies pro zlepšení webu. Souhlasíte?
          </p>
        </div>
        <div className="flex gap-2 sm:shrink-0 w-full sm:w-auto">
          <Button className="w-1/2 sm:w-auto" variant="outline" onClick={rejectAll}>Pouze nezbytné</Button>
          <Button className="w-1/2 sm:w-auto" onClick={acceptAll}>Povolit analytické</Button>
        </div>
      </div>
    </div>
  );
}
