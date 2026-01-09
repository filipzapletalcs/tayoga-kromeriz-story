import { useEffect, useRef } from 'react';
import yogaPose from '@/assets/yoga-pose.jpg';

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);

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
    <section id="about" ref={sectionRef} className="py-20 gradient-section">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div className="scroll-reveal">
              <h2 className="text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
                Naše cesta k
                <span className="text-primary block">Iyengar józe</span>
              </h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Studio Tayoga vzniklo z lásky k józe a touhy sdílet tuto transformativní praxi 
                s komunitou v Kroměříži. Specializujeme se na metodu Iyengar jógy, která klade 
                důraz na preciznost, vyrovnání a postupné budování síly.
              </p>
            </div>

            <div className="scroll-reveal space-y-6">
              <div className="bg-card p-6 rounded-lg card-shadow">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Co je Iyengar jóga?
                </h3>
                <p className="text-muted-foreground">
                  Metoda vyvinutá B.K.S. Iyengarem, která se zaměřuje na přesné provedení 
                  ásán s pomocí podpůrných pomůcek. Vhodná pro všechny věkové kategorie 
                  a úrovně flexibility.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg card-shadow">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Naše filozofie
                </h3>
                <p className="text-muted-foreground">
                  Věříme, že jóga je cesta k sebepoznání. V našem studiu vytváříme prostředí, 
                  kde se každý cítí vítán a podporován na své osobní cestě k zdraví a vnitřnímu klidu.
                </p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="scroll-reveal">
            <div className="relative">
              <img
                src={yogaPose}
                alt="Iyengar jóga pozice"
                width={800}
                height={600}
                className="w-full h-[600px] object-cover rounded-lg card-shadow"
                loading="lazy"
              />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent-gold rounded-full opacity-20"></div>
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-primary rounded-full opacity-30"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;