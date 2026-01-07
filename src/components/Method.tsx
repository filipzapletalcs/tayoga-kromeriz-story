import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FadeIn, HoverCard } from '@/components/ui/micro-interactions';
import { motion } from 'framer-motion';
import { Blocks, Target, BookOpen, Scale, Activity, Layers, Circle } from 'lucide-react';

const Method = () => {
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

  const methodFeatures = [
    {
      title: "Pomůcky pro každého",
      description: "Využíváme nejrůznější pomůcky, které mohou praxi usnadnit, ale také prohloubit.",
      icon: Blocks
    },
    {
      title: "Důraz na detail",
      description: "Jóga s pomůckami klade důraz na detail a hloubku provedení jednotlivých ásán.",
      icon: Target
    },
    {
      title: "Podrobné instrukce",
      description: "Učitel podává podrobné instrukce vedoucí k správnému nastavení jednotlivých částí těla.",
      icon: BookOpen
    },
    {
      title: "Harmonický celek",
      description: "Každá část těla je nastavena tak, aby vytvořila harmonický celek.",
      icon: Scale
    }
  ];

  const asanaGroups = [
    { name: "Stojné pozice", description: "Základ stability a síly" },
    { name: "Obrácené pozice", description: "Stoj na hlavě a na ramenou" },
    { name: "Sedy", description: "Flexibilita a klid mysli" },
    { name: "Rotace", description: "Mobilita páteře" },
    { name: "Předklony", description: "Uklidnění nervového systému" },
    { name: "Záklony", description: "Energie a otevření hrudníku" },
    { name: "Balanční pozice", description: "Rovnováha těla i mysli" }
  ];

  const tools = [
    { name: "Pásky", use: "Pro dosažení správného protažení" },
    { name: "Lana", use: "Podpora při náročnějších pozicích" },
    { name: "Dřevěné cihly", use: "Úprava výšky a podpory" },
    { name: "Bolstery", use: "Podpora při relaxačních pozicích" },
    { name: "Židle", use: "Modifikace pozic pro různé úrovně" },
    { name: "Deky", use: "Pohodlí a správné nastavení" }
  ];

  return (
    <section id="method" ref={sectionRef} className="relative py-16 gradient-section overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-1/4 right-10 w-48 h-48 bg-primary/5 rounded-full"
          style={{ transform: `translateY(${scrollY * 0.12}px) rotate(${scrollY * 0.05}deg)` }}
        />
        <div 
          className="absolute bottom-1/3 left-20 w-36 h-36 bg-accent-gold/5 rounded-full"
          style={{ transform: `translateY(${scrollY * -0.08}px) rotate(${scrollY * -0.03}deg)` }}
        />
      </div>

      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6 leading-tight">
            Metoda
            <span className="text-primary block">jógy</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Co můžete očekávat na našich lekcích? Precizní přístup k józe s důrazem na správné provedení 
            a individuální potřeby každého cvičence.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {methodFeatures.map((feature, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <HoverCard>
                <Card className="h-full bg-card border-border card-shadow hover:card-hover-shadow group">
                  <CardContent className="p-6">
                    <motion.div 
                      className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4"
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      {React.createElement(feature.icon, { className: "w-6 h-6 text-primary" })}
                    </motion.div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </HoverCard>
            </FadeIn>
          ))}
        </div>

        {/* Detailed Info Tabs */}
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="practice" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="practice">Praxe</TabsTrigger>
              <TabsTrigger value="asanas">Ásány</TabsTrigger>
              <TabsTrigger value="tools">Pomůcky</TabsTrigger>
            </TabsList>

            <TabsContent value="practice" className="space-y-6">
              <Card className="bg-card border-border card-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif">Jak probíhá lekce</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    Na hodinách se cvičí navazující sekvence ásán všech skupin podle stupně pokročilosti cvičících. 
                    V ásánách studenti setrvávají po určený čas, což umožňuje hlubší pochopení a působení pozice.
                  </p>
                  <div className="bg-primary/5 p-6 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-3">Klíčové principy:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start space-x-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="text-muted-foreground">Preciznost v provedení každé ásány</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="text-muted-foreground">Postupné budování od jednodušších k složitějším pozicím</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="text-muted-foreground">Individuální přístup a úpravy podle potřeb</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="text-muted-foreground">Setrvání v pozicích pro maximální účinek</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="asanas" className="space-y-6">
              <Card className="bg-card border-border card-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif">Skupiny ásán</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    Cvičíme všechny skupiny ásán v promyšlených sekvencích:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {asanaGroups.map((group, index) => (
                      <div key={index} className="flex items-start space-x-3 p-4 bg-accent/30 rounded-lg">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <div>
                          <h4 className="font-semibold text-foreground">{group.name}</h4>
                          <p className="text-sm text-muted-foreground">{group.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tools" className="space-y-6">
              <Card className="bg-card border-border card-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif">Jógové pomůcky</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    Používáme množství nejrůznějších pomůcek, které umožňují lidem všech věkových 
                    kategorií i lidem s fyzickým omezením zaujmout jógové pozice a mít z nich plný užitek:
                  </p>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tools.map((tool, index) => (
                      <Card key={index} className="bg-accent/20 border-0">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-foreground mb-1">{tool.name}</h4>
                          <p className="text-sm text-muted-foreground">{tool.use}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default Method;