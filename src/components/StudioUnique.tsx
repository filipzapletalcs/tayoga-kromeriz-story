import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollReveal, fadeUpVariants, fadeLeftVariants } from '@/components/ui/scroll-animations';
import { motion } from 'framer-motion';
import { Zap, Shield, Accessibility, ArrowUpRight, Heart, Anchor } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const StudioUnique = () => {
  const benefits = [
    {
      icon: Shield,
      title: "Odlehčení těla",
      description: "Lana nesou část váhy, což umožňuje déle a bezpečně setrvat v náročnějších ásanách. Pomáhají uvědomit si vztah těla k prostoru a gravitaci."
    },
    {
      icon: ArrowUpRight,
      title: "Prohloubení pozic",
      description: "Díky opoře se praktikující může dostat hlouběji do ásany, aniž by přetížil klouby nebo svaly. Vytvářejí jemný, ale stálý tah, který zlepšuje protažení páteře."
    },
    {
      icon: Accessibility,
      title: "Dostupnost pro všechny",
      description: "Umožňují praktikovat i lidem s menší silou či omezenou flexibilitou. Vhodné pro terapeutickou praxi, např. u problémů s páteří nebo při rekonvalescenci."
    },
    {
      icon: Zap,
      title: "Aktivní zapojení",
      description: "Při některých pozicích lana nutí svaly aktivně pracovat. Jindy poskytují hlubokou oporu a vedou k uvolnění, rozšíření dechu a regeneraci."
    }
  ];

  return (
    <section id="unique" className="py-20 px-4 bg-gradient-to-br from-secondary/10 via-background to-primary/5 dark:from-background dark:via-card/30 dark:to-background overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Main content */}
          <div>
            <ScrollReveal variants={fadeLeftVariants}>
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Unikátní přístup</Badge>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
                V čem je naše studio
                <span className="text-primary block">unikátní?</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                K cvičení používáme řadu pomůcek, například lana připevněná ke zdi, která cvičící
                používá k zavěšení či k oporám v různých pozicích.
              </p>

              <Card className="bg-primary/5 border-primary/10 mb-6">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-3">Proč používáme lana?</h3>
                  <p className="text-muted-foreground">
                    Lana umožňují variace postojů, záklonů, předklonů, rotací. Poskytují bezpečnou
                    podporu a zároveň vyžadují aktivní zapojení těla. Jsou vnímána jako
                    <span className="font-semibold text-foreground"> "prodloužená ruka učitele"</span> -
                    pomáhají vést, podporovat i korigovat tělo v ásaně.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>

          {/* Right column - Benefits grid */}
          <div>
            <div className="grid gap-4">
              {benefits.map((benefit, index) => (
                <ScrollReveal key={index} delay={index * 0.1} variants={fadeUpVariants}>
                  <motion.div
                    whileHover={{ scale: 1.02, translateX: 8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 hover:shadow-lg transition-all">
                      <CardContent className="p-5">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <benefit.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground mb-1">{benefit.title}</h4>
                            <p className="text-sm text-muted-foreground">{benefit.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom section - Additional benefits */}
        <ScrollReveal delay={0.5}>
          <Card className="mt-12 bg-gradient-to-r from-accent/20 via-primary/10 to-secondary/20 border-primary/10">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-serif font-semibold text-foreground mb-2">
                  Přednosti našeho přístupu
                </h3>
              </div>

              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <Anchor className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold text-foreground mb-2">Lepší nastavení</h4>
                  <p className="text-sm text-muted-foreground">
                    Podporují lepší nastavení těla, které je v józe zásadní
                  </p>
                </div>
                <div>
                  <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold text-foreground mb-2">Modifikace</h4>
                  <p className="text-sm text-muted-foreground">
                    Umožňují modifikace pro osoby s pohybovými obtížemi
                  </p>
                </div>
                <div>
                  <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold text-foreground mb-2">Posílení středu</h4>
                  <p className="text-sm text-muted-foreground">
                    Aktivní práce svalů - posílení středu těla a paží
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default StudioUnique;