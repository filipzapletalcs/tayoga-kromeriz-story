import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const services = [
  {
    title: "Začátečnické lekce",
    description: "Ideální pro ty, kteří s jógou začínají",
    details: "Naučíte se základní pozice a dechové techniky v klidném tempu.",
    duration: "75 minut",
    price: "350 Kč",
    features: ["Základní pozice", "Dechové techniky", "Relaxace", "Individuální přístup"]
  },
  {
    title: "Pokročilé třídy",
    description: "Pro zkušené praktikující",
    details: "Hlubší práce s pokročilými ásánami a jejich variacemi.",
    duration: "90 minut", 
    price: "400 Kč",
    features: ["Pokročilé ásány", "Variace pozic", "Pranayama", "Meditace"]
  },
  {
    title: "Individuální lekce",
    description: "Personalizovaný přístup",
    details: "Lekce šité na míru vašim potřebám a možnostem.",
    duration: "60 minut",
    price: "800 Kč",
    features: ["Osobní přístup", "Terapeutické úpravy", "Flexibilní čas", "Rychlý pokrok"]
  },
  {
    title: "Terapeutická jóga",
    description: "Jóga pro zdraví a rehabilitaci",
    details: "Speciální program pro osoby s zdravotními omezeními.",
    duration: "60 minut",
    price: "450 Kč",
    features: ["Rehabilitace", "Posturální korekce", "Úleva od bolesti", "Zdravotní podpora"]
  }
];

const InteractiveServices = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCard, setActiveCard] = useState<number | null>(null);
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
              }, index * 150);
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
    <section id="services" ref={sectionRef} className="relative py-20 bg-background overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-20 right-10 w-40 h-40 bg-primary/5 rounded-full"
          style={{ transform: `translateY(${scrollY * 0.15}px) rotate(${scrollY * 0.1}deg)` }}
        />
        <div 
          className="absolute bottom-40 left-20 w-60 h-60 bg-accent-gold/5 rounded-full"
          style={{ transform: `translateY(${scrollY * -0.1}px) rotate(${scrollY * -0.05}deg)` }}
        />
      </div>

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Sticky Header */}
          <div className="lg:col-span-4 sticky-section">
            <div className="scroll-reveal">
              <h2 className="text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6 leading-tight">
                Naše
                <span className="text-primary block">služby</span>
              </h2>
              <div className="w-20 h-1 bg-primary mb-6"></div>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Nabízíme rozmanité lekce Iyengar jógy přizpůsobené různým úrovním 
                a potřebám našich studentů.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">✓</span>
                  </div>
                  <span className="text-muted-foreground">Certifikovaní instruktoři</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">✓</span>
                  </div>
                  <span className="text-muted-foreground">Malé skupiny max 8 osob</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">✓</span>
                  </div>
                  <span className="text-muted-foreground">Kompletní vybavení pomůckami</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Cards */}
          <div className="lg:col-span-8">
            <div className="grid md:grid-cols-2 gap-6">
              {services.map((service, index) => (
                <Card 
                  key={index} 
                  className={`scroll-reveal bg-card border-border card-shadow hover:card-hover-shadow transition-all duration-500 hover:-translate-y-2 cursor-pointer group ${
                    activeCard === index ? 'ring-2 ring-primary scale-105' : ''
                  }`}
                  onMouseEnter={() => setActiveCard(index)}
                  onMouseLeave={() => setActiveCard(null)}
                  style={{ 
                    transform: activeCard === index ? 'scale(1.02)' : 'scale(1)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <CardHeader className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
                    <CardTitle className="text-xl font-semibold text-foreground relative z-10">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground relative z-10">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <p className="text-sm text-muted-foreground">
                      {service.details}
                    </p>

                    {/* Features list - visible on hover */}
                    <div className={`space-y-2 transition-all duration-300 ${
                      activeCard === index ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0'
                    } overflow-hidden`}>
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          <span className="text-xs text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Délka:</span>
                        <span className="font-medium text-foreground">{service.duration}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Cena:</span>
                        <span className="text-2xl font-bold text-primary">{service.price}</span>
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
                      onClick={() => {
                        const element = document.getElementById('contact');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      Rezervovat
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Schedule Section */}
        <div className="mt-20 scroll-reveal">
          <div className="bg-gradient-to-r from-accent/50 via-primary/10 to-accent-gold/20 p-8 rounded-2xl card-shadow backdrop-blur-sm border border-primary/10">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-serif font-semibold text-foreground mb-4">
                Rozvrh hodin
              </h3>
              <div className="w-16 h-1 bg-primary mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { day: "Pondělí", classes: [{ time: "18:00", type: "Začátečníci" }, { time: "19:30", type: "Pokročilí" }] },
                { day: "Středa", classes: [{ time: "17:00", type: "Terapeutická" }, { time: "18:30", type: "Začátečníci" }] },
                { day: "Pátek", classes: [{ time: "18:00", type: "Pokročilí" }, { time: "19:30", type: "Začátečníci" }] }
              ].map((schedule, index) => (
                <div key={index} className="text-center p-6 bg-background/60 rounded-xl backdrop-blur-sm border border-primary/10">
                  <h4 className="font-bold text-xl text-foreground mb-4 text-primary">{schedule.day}</h4>
                  <div className="space-y-3">
                    {schedule.classes.map((cls, clsIndex) => (
                      <div key={clsIndex} className="flex justify-between items-center p-3 bg-accent/30 rounded-lg">
                        <span className="font-semibold text-foreground">{cls.time}</span>
                        <span className="text-sm text-muted-foreground">{cls.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveServices;