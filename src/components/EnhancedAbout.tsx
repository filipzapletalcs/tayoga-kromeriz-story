import { useEffect, useRef, useState } from 'react';
import yogaPose from '@/assets/yoga-pose.jpg';
import heroImage from '@/assets/hero-yoga-studio.jpg';

const EnhancedAbout = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (rect) {
        const scrolled = Math.max(0, window.innerHeight - rect.top);
        setScrollY(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
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
    <section id="about" ref={sectionRef} className="relative min-h-screen py-20 gradient-section overflow-hidden">
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
                <span className="text-primary block">Iyengar józe</span>
              </h2>
              
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Studio Tayoga vzniklo z lásky k józe a touhy sdílet tuto transformativní praxi 
                s komunitou v Kroměříži. Specializujeme se na metodu Iyengar jógy, která klade 
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
                      Co je Iyengar jóga?
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Metoda vyvinutá B.K.S. Iyengarem, která se zaměřuje na přesné provedení 
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
                      kde se každý cítí vítán a podporován na své osobní cestě k zdraví a vnitřnímu klidu.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Image Stack */}
          <div className="scroll-reveal">
            <div className="relative h-[800px]">
              {/* Main large image */}
              <div 
                className="absolute inset-0 rounded-2xl overflow-hidden card-shadow"
                style={{ transform: `translateY(${scrollY * 0.1}px)` }}
              >
                <img 
                  src={yogaPose}
                  alt="Iyengar jóga pozice"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent"></div>
              </div>

              {/* Floating secondary image */}
              <div 
                className="absolute top-20 -right-10 w-64 h-80 rounded-xl overflow-hidden card-hover-shadow z-10 border-4 border-background"
                style={{ transform: `translateY(${scrollY * -0.05}px) rotate(5deg)` }}
              >
                <img 
                  src={heroImage}
                  alt="Studio prostředí"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Decorative elements */}
              <div 
                className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/20 rounded-full"
                style={{ 
                  transform: `translateY(${scrollY * 0.08}px) scale(${1 + scrollY * 0.0002})`,
                  animation: 'gentle-pulse 4s ease-in-out infinite'
                }}
              />
              <div 
                className="absolute -top-8 -right-8 w-24 h-24 bg-accent-gold/30 rounded-full"
                style={{ 
                  transform: `translateY(${scrollY * -0.06}px) scale(${1 + scrollY * 0.0001})`,
                  animation: 'gentle-pulse 3s ease-in-out infinite'
                }}
              />

              {/* Text overlay on image */}
              <div 
                className="absolute bottom-8 left-8 right-8 bg-background/90 backdrop-blur-md p-6 rounded-xl"
                style={{ transform: `translateY(${scrollY * -0.02}px)` }}
              >
                <p className="text-sm text-muted-foreground mb-2">Překrásné prostředí</p>
                <h4 className="text-lg font-semibold text-foreground">Studio v srdci Kroměříže</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedAbout;