import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollReveal, fadeUpVariants } from '@/components/ui/scroll-animations';
import { motion } from 'framer-motion';
import { Users, Target, Heart, Sparkles } from 'lucide-react';

const ExpectOnLessons = () => {
  const features = [
    {
      icon: Target,
      title: "Důraz na detail",
      description: "Jóga s pomůckami klade důraz na detail a hloubku provedení jednotlivých ásan"
    },
    {
      icon: Users,
      title: "Podrobné instrukce",
      description: "Učitel podává podrobné instrukce a pokyny, které dovedou žáky ke správnému nastavení a srovnání částí těla v každé ásaně"
    },
    {
      icon: Heart,
      title: "Harmonický celek",
      description: "Vytváříme harmonický celek těla, mysli a duše pomocí správné techniky a zkušeností"
    },
    {
      icon: Sparkles,
      title: "Pro všechny úrovně",
      description: "Cvičení je vždy přizpůsobeno stupni pokročilosti cvičících"
    }
  ];

  return (
    <section id="lessons" className="py-20 px-4 bg-gradient-to-br from-background via-accent/5 to-background">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Co můžete očekávat na našich lekcích?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Využíváme nejrůznější pomůcky, které mohou praxi usnadnit, ale také prohloubit.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <ScrollReveal key={index} delay={index * 0.1} variants={fadeUpVariants}>
              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }} className="h-full">
                <Card className="h-full bg-card/90 backdrop-blur-sm border-primary/10 hover:shadow-xl hover:border-primary/30 transition-all duration-300 min-h-[180px]">
                  <CardContent className="p-8 h-full flex items-center">
                    <div className="flex items-start gap-5 w-full">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                        <feature.icon className="w-7 h-7 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                        <p className="text-muted-foreground leading-relaxed text-[15px]">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.4}>
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-serif font-semibold text-foreground mb-4">
                Struktura lekcí
              </h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Na hodinách se cvičí navazující sekvence ásan všech skupin - stojné pozice, obrácené
                  (stoj na hlavě a na ramenou), sedy, rotace, předklony, záklony a balanční pozice -
                  vždy však podle stupně pokročilosti cvičících. V ásanách studenti setrvávají po určený čas.
                </p>
                <p>
                  Používáme množství nejrůznějších pomůcek, např. pásky, lana, dřevěné cihly,
                  aby umožnily lidem všech věkových kategorií i lidem s nějakým fyzickým omezením
                  zaujmout jógové pozice a mít z nich plný užitek.
                </p>
              </div>

              <div className="mt-6 p-4 bg-background/50 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Proč cvičit jógu?</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Stabilita, zdraví a lehkost
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Zdroj duševní rovnováhy
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Rozvoj čilosti, výdrže a zdroj životní síly
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Cvičením ásan získáváme zdraví = stav naprosté rovnováhy těla, mysli a ducha
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        <ScrollReveal delay={0.5}>
          <div className="mt-12 text-center">
            <blockquote className="text-2xl font-serif text-foreground italic mb-4">
              "Každá pozice - ásana slouží jako most spojující tělo s myslí a mysl s duší"
            </blockquote>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Ásana v sobě spojuje úsilí, soustředění a rovnováhu, což nás nutí žít intenzivně v přítomném okamžiku.
              Správná metoda cvičení vytváří harmonickou jednotu těla, mysli a duše.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ExpectOnLessons;