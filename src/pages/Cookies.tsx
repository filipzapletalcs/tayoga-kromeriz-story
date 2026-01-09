import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Cookies = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-6 pt-24 pb-16 max-w-3xl">
          <h1 className="text-3xl font-bold text-foreground mb-8">
            Zásady používání cookies
          </h1>

          <div className="prose prose-gray max-w-none space-y-8">
            {/* Co jsou cookies */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Co jsou cookies?
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Cookies jsou malé textové soubory, které se ukládají do vašeho
                prohlížeče při návštěvě webových stránek. Pomáhají nám zlepšovat
                vaše uživatelské prostředí a analyzovat návštěvnost webu.
              </p>
            </section>

            {/* Nezbytné cookies */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Nezbytné cookies
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Tyto cookies jsou nutné pro správné fungování webu a nelze je
                vypnout. Zahrnují:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Ukládání vašich preferencí ohledně cookies</li>
                <li>Zabezpečení a autentizaci (rezervační systém)</li>
                <li>Základní funkčnost webu</li>
              </ul>
            </section>

            {/* Analytické cookies */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Analytické cookies
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Používáme Google Analytics pro anonymní sledování návštěvnosti.
                Tyto cookies nám pomáhají pochopit, jak návštěvníci používají náš
                web, abychom ho mohli vylepšovat.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>
                  <strong>Google Analytics</strong> - sledování návštěvnosti s
                  anonymizovanou IP adresou
                </li>
                <li>
                  <strong>Google Tag Manager</strong> - správa analytických kódů
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3 text-sm">
                Data jsou zpracovávána anonymně a nejsou sdílena s třetími
                stranami pro reklamní účely.
              </p>
            </section>

            {/* Preferenční cookies */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Preferenční cookies
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Tyto cookies ukládají vaše preference, jako je zvolené barevné
                schéma (světlý/tmavý režim), aby se web zobrazoval podle vašich
                představ při další návštěvě.
              </p>
            </section>

            {/* Správa cookies */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Jak spravovat cookies?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Můžete kdykoli změnit nebo odvolat svůj souhlas s cookies. Stačí
                smazat cookies ve vašem prohlížeči a při další návštěvě se vám
                znovu zobrazí dialog pro nastavení.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Většina prohlížečů umožňuje správu cookies v nastavení. Více
                informací najdete v nápovědě vašeho prohlížeče:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
                <li>
                  <a
                    href="https://support.google.com/chrome/answer/95647"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.mozilla.org/cs/kb/povoleni-zakazani-cookies"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.apple.com/cs-cz/guide/safari/sfri11471/mac"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Safari
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.microsoft.com/cs-cz/microsoft-edge/odstran%C4%9Bn%C3%AD-soubor%C5%AF-cookie-v-aplikaci-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Microsoft Edge
                  </a>
                </li>
              </ul>
            </section>

            {/* Kontakt */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Kontakt
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Máte-li dotazy ohledně zpracování cookies nebo osobních údajů,
                kontaktujte nás:
              </p>
              <div className="mt-3 text-muted-foreground">
                <p>
                  <strong>TaYoga Studio</strong>
                </p>
                <p>Vodní ulice 53, 767 01 Kroměříž</p>
                <p>
                  E-mail:{" "}
                  <a
                    href="mailto:barayoga001@gmail.com"
                    className="text-primary hover:underline"
                  >
                    barayoga001@gmail.com
                  </a>
                </p>
                <p>
                  Telefon:{" "}
                  <a
                    href="tel:+420774515599"
                    className="text-primary hover:underline"
                  >
                    +420 774 515 599
                  </a>
                </p>
              </div>
            </section>

            {/* Datum aktualizace */}
            <section className="border-t border-border pt-6 mt-8">
              <p className="text-sm text-muted-foreground">
                Poslední aktualizace: 9. ledna 2026
              </p>
            </section>
          </div>

          <div className="mt-8">
            <Link
              to="/"
              className="text-primary hover:underline font-medium"
            >
              &larr; Zpět na hlavní stránku
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cookies;
