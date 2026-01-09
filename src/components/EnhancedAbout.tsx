import { useEffect, useRef, useState } from 'react';

const EnhancedAbout = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = sectionRef.current?.getBoundingClientRect();
          if (rect) {
            const scrolled = Math.max(0, window.innerHeight - rect.top);
            setScrollY(scrolled);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll('.scroll-reveal');
            elements.forEach((el, index) => {
              setTimeout(() => {
                el.classList.add('revealed');
              }, index * 200);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative py-16 gradient-section overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-1/4 left-10 w-32 h-32 bg-primary/10 rounded-full floating-element"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        />
        <div 
          className="absolute top-3/4 right-20 w-24 h-24 bg-accent-gold/20 rounded-full floating-element"
          style={{ transform: `translateY(${scrollY * -0.15}px)` }}
        />
        <div 
          className="absolute top-1/2 left-1/3 w-16 h-16 bg-beige/30 rounded-full floating-element"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
      </div>

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Sticky Text Content */}
          <div className="sticky-section space-y-8">
            <div className="scroll-reveal">
              <h2 className="text-5xl lg:text-6xl font-serif font-bold text-foreground mb-8 leading-tight">
                Naše cesta k
                <span className="text-primary block">józe</span>
              </h2>
              
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Studio TaYoga vzniklo z lásky k józe a touhy sdílet tuto praxi
                s naší stále se rozrůstající jógovou rodinou. Specializujeme se na metodu jógy, která klade
                důraz na preciznost, vyrovnání a postupné budování síly.
              </p>

              <div className="flex items-center space-x-4 mb-8">
                <div className="w-16 h-0.5 bg-primary"></div>
                <span className="text-sm font-medium text-primary uppercase tracking-wider">Od roku 2024</span>
              </div>
            </div>

            <div className="scroll-reveal space-y-6">
              <div className="bg-card/80 backdrop-blur-sm p-8 rounded-2xl card-shadow border border-primary/10">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-6 h-6 bg-primary rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Jak vypadá naše jóga?
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Metoda, která se zaměřuje na přesné provedení 
                      ásán s pomocí podpůrných pomůcek. Vhodná pro všechny věkové kategorie 
                      a úrovně flexibility.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card/80 backdrop-blur-sm p-8 rounded-2xl card-shadow border border-accent-gold/20">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-6 h-6 bg-accent-gold rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Naše filozofie
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Věříme, že jóga je cesta k sebepoznání. V našem studiu vytváříme prostředí, 
                      kde se každý cítí vítán a podporován na své osobní cestě ke zdraví a vnitřnímu klidu.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Image Stack - z-20 to stay above sticky text */}
          <div className="scroll-reveal relative z-20">
            <div className="relative h-[800px]">
              {/* Main large image */}
              <div
                className="absolute inset-0 rounded-2xl overflow-hidden card-shadow"
                style={{ transform: `translateY(${scrollY * 0.1}px)` }}
              >
                <img
                  src="/yoga-nature.webp"
                  alt="Jóga v přírodě u vodopádu"
                  width={1200}
                  height={800}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent"></div>
              </div>

              {/* Floating secondary image - z-20 to stay above sticky text cards */}
              <div
                className="absolute top-20 right-0 lg:-right-10 w-64 h-80 rounded-xl overflow-hidden card-hover-shadow z-20 border-4 border-background"
                style={{ transform: `translateY(${scrollY * -0.05}px) rotate(5deg)` }}
              >
                <img
                  src="/studio-interior.webp"
                  alt="Studio prostředí"
                  width={1200}
                  height={800}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Decorative elements */}
              <div 
                className="absolute -bottom-8 left-0 lg:-left-8 w-32 h-32 bg-primary/20 rounded-full"
                style={{ 
                  transform: `translateY(${scrollY * 0.08}px) scale(${1 + scrollY * 0.0002})`,
                  animation: 'gentle-pulse 4s ease-in-out infinite'
                }}
              />
              <div 
                className="absolute -top-8 right-0 lg:-right-8 w-24 h-24 bg-accent-gold/30 rounded-full"
                style={{ 
                  transform: `translateY(${scrollY * -0.06}px) scale(${1 + scrollY * 0.0001})`,
                  animation: 'gentle-pulse 3s ease-in-out infinite'
                }}
              />

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedAbout;