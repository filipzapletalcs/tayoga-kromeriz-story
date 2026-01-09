import { useState, useEffect } from "react";

// Extend Window interface for dataLayer and gtag
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

// Cookie consent types
interface ConsentSettings {
  analytics: boolean;
  preferences: boolean;
}

const CONSENT_STORAGE_KEY = "cookieConsent_v1";

// Initialize gtag function globally - MUST use function() and arguments, not arrow function
// GTM requires the arguments object, not an array
const initGtag = () => {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };
  }
};

// Update Google Consent Mode V2 and push event to dataLayer
const setConsent = (analytics: boolean, preferences: boolean) => {
  // Initialize gtag if not already done
  initGtag();

  // Build consent payload for Consent Mode V2
  // Note: marketing cookies are not used on this site
  const consentPayload = {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: analytics ? "granted" : "denied",
    personalization_storage: preferences ? "granted" : "denied",
    functionality_storage: "granted",
    security_storage: "granted",
  };

  // CRITICAL: Call gtag consent update - this is what GTM needs to see
  window.gtag("consent", "update", consentPayload);

  // Save to localStorage for persistence
  const saved = {
    marketing: false, // Always false - not used
    analytics: !!analytics,
    preferences: !!preferences,
    ts: new Date().getTime(),
  };
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(saved));

  // Push consent_updated event to dataLayer (for custom triggers)
  window.dataLayer.push({
    event: "consent_updated",
    marketing: false,
    analytics: saved.analytics,
    preferences: saved.preferences,
  });
};

// Load consent from localStorage
const loadConsent = (): ConsentSettings | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    return {
      analytics: !!saved.analytics,
      preferences: !!saved.preferences,
    };
  } catch {
    return null;
  }
};

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [settings, setSettings] = useState<ConsentSettings>({
    analytics: false,
    preferences: false,
  });

  useEffect(() => {
    const savedConsent = loadConsent();
    if (savedConsent) {
      setSettings(savedConsent);
      // Apply saved consent on load
      setConsent(savedConsent.analytics, savedConsent.preferences);
    } else {
      setIsVisible(true);
    }
  }, []);

  // Accept all cookies
  const acceptAll = () => {
    setConsent(true, true);
    setIsVisible(false);
  };

  // Reject all optional cookies
  const rejectAll = () => {
    setConsent(false, false);
    setIsVisible(false);
  };

  // Save custom settings
  const saveSettings = () => {
    setConsent(settings.analytics, settings.preferences);
    setIsVisible(false);
    setShowDetails(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[9999] sm:left-auto sm:right-4 sm:max-w-sm">
      <div className="bg-background rounded-xl p-5 border border-border">
        {!showDetails ? (
          <>
            <h3 className="text-lg font-semibold mb-3 text-foreground">
              Nastavení cookies
            </h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Používáme pouze analytické cookies pro zlepšení vašeho
              uživatelského prostředí. Přečtěte si naše{" "}
              <a
                href="/cookies"
                className="text-foreground font-semibold hover:underline"
              >
                zásady používání cookies
              </a>
              .
            </p>
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={rejectAll}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Odmítnout vše
              </button>
              <button
                onClick={() => setShowDetails(true)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Vlastní
              </button>
              <button
                onClick={acceptAll}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Přijmout vše
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-3 text-foreground">
              Vlastní nastavení
            </h3>
            <div className="space-y-3 mb-4">
              {/* Necessary - always on */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Nezbytné</span>
                <div className="w-10 h-5 bg-primary rounded-full relative cursor-not-allowed">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-background rounded-full" />
                </div>
              </div>
              {/* Analytics */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Analytické</span>
                <button
                  onClick={() =>
                    setSettings((s) => ({ ...s, analytics: !s.analytics }))
                  }
                  className={`w-10 h-5 rounded-full relative transition-colors ${
                    settings.analytics ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 bg-background rounded-full transition-all ${
                      settings.analytics ? "right-0.5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
              {/* Preferences */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Preferenční</span>
                <button
                  onClick={() =>
                    setSettings((s) => ({ ...s, preferences: !s.preferences }))
                  }
                  className={`w-10 h-5 rounded-full relative transition-colors ${
                    settings.preferences ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 bg-background rounded-full transition-all ${
                      settings.preferences ? "right-0.5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => setShowDetails(false)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Zpět
              </button>
              <button
                onClick={saveSettings}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Uložit nastavení
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CookieConsent;
