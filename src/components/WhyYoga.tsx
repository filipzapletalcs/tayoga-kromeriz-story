import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/micro-interactions';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Target, 
  Heart, 
  Brain, 
  Clock, 
  Flower2,
  Link2,
  Infinity
} from 'lucide-react';

const WhyYoga = () => {
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

  const benefits = [
    {
      title: "Most mezi tělem a myslí",
      description: "Každá ásana slouží jako most spojující tělo s myslí a mysl s duší.",
      icon: Link2
    },
    {
      title: "Dokonalost praxe",
      description: "Pomocí správné techniky a zkušeností zaujme naše tělo určitou polohu. Opětovným opakováním pozice najdeme dokonalost a udržujeme ji.",
      icon: Target
    },
    {
      title: "Úsilí bez úsilí",
      description: "Na začátku je ke zvládnutí ásan zapotřebí vynaložit úsilí. Zvládnutou se ásana stává ve chvíli, kdy se snaha stane úsilím bez úsilí.",
      icon: Infinity
    },
    {
      title: "Rozšíření vědomí",
      description: "Při provádění ásan se inteligence a vědomí rozšiřuje do všech buněk v těle.",
      icon: Brain
    },
    {
      title: "Život v přítomnosti",
      description: "Ásana v sobě spojuje úsilí, soustředění a rovnováhu, což nás nutí žít intenzivně v přítomném okamžiku.",
      icon: Clock
    },
    {
      title: "Očista a transformace",
      description: "Na fyzické úrovni se zbavujeme nemocí, v mentální rovině se naše mysl zbavuje stagnujících myšlenek a předsudků.",
      icon: Flower2
    }
  ];

  const quote = {
    text: "Když je hledající blíž své duši, přichází protažení, uvolnění a vyrovnanost v ásaně okamžitě.",
    subtext: "Ásana pomáhá proměně tím, že směřuje vědomí od těla k duši.",
    author: "B.K.S. Iyengar",
    source: "Výklad Pataňdžaliho jógasúter"
  };

  return (
    <section id="why-yoga" ref={sectionRef} className="relative py-16 bg-background overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-1/3 left-10 w-64 h-64 bg-primary/3 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
        <div 
          className="absolute bottom-1/4 right-10 w-48 h-48 bg-accent-gold/5 rounded-full blur-2xl"
          style={{ transform: `translateY(${scrollY * -0.08}px)` }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6 leading-tight">
            Proč cvičit
            <span className="text-primary block">jógu?</span>
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Jóga není jen cvičení těla, je to cesta k hlubšímu poznání sebe sama 
            a harmonii mezi tělem, myslí a duší.
          </p>
        </div>

        {/* Main Quote Card */}
        <div className="max-w-4xl mx-auto mb-16 scroll-reveal">
          <Card className="bg-gradient-to-br from-primary/10 via-accent/10 to-accent-gold/10 border-primary/20 card-shadow">
            <CardContent className="p-12">
              <div className="text-center">
                <motion.div 
                  className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="w-8 h-8 text-primary" />
                </motion.div>
                <blockquote className="text-2xl md:text-3xl font-serif text-foreground italic mb-6 leading-relaxed">
                  "{quote.text}"
                </blockquote>
                <p className="text-lg text-muted-foreground mb-4">
                  {quote.subtext}
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-8 h-px bg-primary"></div>
                  <span className="text-sm font-medium text-primary">
                    {quote.author}
                  </span>
                  <div className="w-8 h-px bg-primary"></div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {quote.source}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Grid */}
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <StaggerItem key={index}>
              <FadeIn>
                <Card className="h-full bg-card border-border card-shadow hover:card-hover-shadow transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <motion.div 
                          className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300"
                          whileHover={{ scale: 1.1 }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {React.createElement(benefit.icon, { className: "w-6 h-6 text-primary" })}
                        </motion.div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {benefit.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Bottom CTA */}
        <div className="text-center mt-8 scroll-reveal">
          <Card className="bg-primary text-primary-foreground card-shadow max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-serif font-semibold mb-4">
                Začněte svou cestu k harmonii
              </h3>
              <p className="text-sm opacity-90 mb-6">
                Na velmi vysoké úrovni nás přítomný okamžik učí okamžitému správnému konání. 
                Přijďte objevit transformační sílu jógy v našem studiu.
              </p>
              <button 
                onClick={() => {
                  const element = document.getElementById('contact');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-primary-foreground text-primary px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Rezervovat první lekci zdarma
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WhyYoga;