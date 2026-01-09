import footerLogo from '@/assets/TaYoga_logo_footer.svg';
import { Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-muted dark:bg-card text-foreground dark:text-foreground py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Logo - na mobilu poslední, na desktopu první */}
          <div className="text-center order-3 md:order-1">
            <img
              src={footerLogo}
              alt="TaYoga"
              width={160}
              height={160}
              className="h-40 w-auto mb-6 mx-auto"
            />
            <p className="text-muted-foreground leading-relaxed text-base">
              Jógové studio v srdci Kroměříže, kde se tradice jógy
              setkává s moderním přístupem ke zdraví.
            </p>
          </div>

          {/* Rychlé odkazy - na mobilu druhé, na desktopu druhé */}
          <div className="order-2 md:order-2">
            <h4 className="font-semibold mb-4">Rychlé odkazy</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById('home');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-foreground transition-colors"
                >
                  Domů
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById('about');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-foreground transition-colors"
                >
                  O studiu
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById('instructor');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-foreground transition-colors"
                >
                  Lektorka
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById('lessons');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-foreground transition-colors"
                >
                  Lekce
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById('unique');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-foreground transition-colors"
                >
                  Unikátnost
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById('schedule');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-foreground transition-colors"
                >
                  Rozvrh
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById('contact');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-foreground transition-colors"
                >
                  Kontakt
                </button>
              </li>
            </ul>
          </div>

          {/* Kontakt - na mobilu první, na desktopu třetí */}
          <div className="order-1 md:order-3">
            <h4 className="font-semibold mb-4">Kontakt</h4>
            <div className="space-y-2 text-muted-foreground">
              <p>Vodní ulice 53</p>
              <p>767 01 Kroměříž</p>
              <a href="tel:+420774515599" className="block hover:text-foreground transition-colors">+420 774 515 599</a>
              <a href="mailto:barayoga001@gmail.com" className="block hover:text-foreground transition-colors">barayoga001@gmail.com</a>
            </div>
            <div className="mt-5">
              <p className="text-sm font-medium text-foreground mb-2">Sledujte nás</p>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.facebook.com/profile.php?id=61581015224519"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook TaYoga"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://www.instagram.com/taygoga_kromeriz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram TaYoga"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-muted-foreground">
          <p>&copy; 2025 TaYoga Studio. Všechna práva vyhrazena.</p>
          <p className="mt-2 text-sm">
            <Link to="/cookies" className="hover:text-foreground transition-colors">
              Zásady cookies
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
