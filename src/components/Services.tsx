import { useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const services = [
  {
    title: "Začátečnické lekce",
    description: "Ideální pro ty, kteří s jógou začínají",
    details: "Naučíte se základní pozice a dechové techniky v klidném tempu.",
    duration: "75 minut",
    price: "350 Kč"
  },
  {
    title: "Pokročilé třídy",
    description: "Pro zkušené praktikující",
    details: "Hlubší práce s pokročilými ásánami a jejich variacemi.",
    duration: "90 minut", 
    price: "400 Kč"
  },
  {
    title: "Individuální lekce",
    description: "Personalizovaný přístup",
    details: "Lekce šité na míru vašim potřebám a možnostem.",
    duration: "60 minut",
    price: "800 Kč"
  },
  {
    title: "Terapeutická jóga",
    description: "Jóga pro zdraví a rehabilitaci",
    details: "Speciální program pro osoby s zdravotními omezeními.",
    duration: "60 minut",
    price: "450 Kč"
  }
];

const Services = () => {
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
    <section id="services" ref={sectionRef} className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
            Naše
            <span className="text-primary"> služby</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Nabízíme rozmanité lekce Iyengar jógy přizpůsobené různým úrovním 
            a potřebám našich studentů.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="scroll-reveal bg-card border-border card-shadow hover:card-hover-shadow transition-all duration-300 hover:-translate-y-2"
            >
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {service.details}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Délka:</span>
                    <span className="font-medium text-foreground">{service.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Cena:</span>
                    <span className="text-lg font-bold text-primary">{service.price}</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full mt-4"
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

        <div className="text-center mt-16 scroll-reveal">
          <div className="bg-accent p-8 rounded-lg card-shadow max-w-4xl mx-auto">
            <h3 className="text-2xl font-serif font-semibold text-foreground mb-4">
              Rozvrh hodin
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Pondělí</h4>
                <p className="text-sm text-muted-foreground">18:00 - Začátečníci</p>
                <p className="text-sm text-muted-foreground">19:30 - Pokročilí</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Středa</h4>
                <p className="text-sm text-muted-foreground">17:00 - Terapeutická</p>
                <p className="text-sm text-muted-foreground">18:30 - Začátečníci</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Pátek</h4>
                <p className="text-sm text-muted-foreground">18:00 - Pokročilí</p>
                <p className="text-sm text-muted-foreground">19:30 - Začátečníci</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;