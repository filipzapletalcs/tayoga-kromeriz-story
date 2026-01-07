import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/micro-interactions';
import { Award, Heart, BookOpen, Calendar } from 'lucide-react';
import instructorImage from '@/assets/IMG_4946 2.webp';

const Instructor = () => {
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

  const education = [
    {
      year: "Od 2018",
      title: "Lektorka jógy",
      description: "Na podnět mé vzácné učitelky a přítelkyně Lidmily Brabcové jsem se stala lektorkou jógy",
      icon: Heart,
      color: "bg-primary/20 group-hover:bg-primary/30",
      iconColor: "text-primary"
    },
    {
      year: "Současnost",
      title: "Učitel ve výcviku jógy",
      description: "V současné době jsem učitelem ve výcviku jógy. Výcvik na učitele trvá v případě jógy léta a adepti k němu přistupují až po vlastní mnohaleté praxi",
      icon: Award,
      color: "bg-accent-gold/30 group-hover:bg-accent-gold/40",
      iconColor: "text-accent-gold"
    },
    {
      year: "1999-2021",
      title: "Studium u Edgara Ta",
      description: "Tajemství lidského těla i duše byly mými tématy odjakživa. Můj učitel Mistr Edgar Ta, který významně ovlivnil můj život, vytvořil metodiku unikátních masáží, předmětem studia byla také ajurvéda a východní nauky, přírodní medicína, zásady zdravého stravování, principy přírodních zákonitostí a psychologie člověka",
      icon: BookOpen,
      color: "bg-secondary/30 group-hover:bg-secondary/40",
      iconColor: "text-foreground"
    },
    {
      year: "2000s",
      title: "Formální vzdělání",
      description: "Vystudovala jsem ekonomickou školu a sociální pedagogiku",
      icon: Calendar,
      color: "bg-primary/10 group-hover:bg-primary/20",
      iconColor: "text-primary"
    }
  ];

  const teachers = [
    "Gabriella Guibilaro – Itálie",
    "David Meloni – Itálie",
    "Michael Forbes – Německo"
  ];

  return (
    <section id="instructor" ref={sectionRef} className="py-16 bg-background">
      <div className="container mx-auto px-6">
        {/* Desktop layout with sticky */}
        <div className="lg:flex lg:gap-12">
          {/* Left column - STICKY */}
          <div className="lg:w-[40%] mb-12 lg:mb-0">
            <div className="lg:sticky lg:top-24">
                <h2 className="text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6 leading-tight">
                O naší
                <span className="text-primary block">lektorce</span>
              </h2>
              <div className="w-20 h-1 bg-primary mb-6"></div>
              
              <div className="text-xl text-muted-foreground leading-relaxed mb-8 space-y-4">
                <p>
                  Jmenuji se Barbora Zapletalová a na cestu jógy mě přivedla moje vzácná učitelka a přítelkyně Lidmila Brabcová. Na její podnět jsem se od roku 2018 stala lektorkou jógy.
                </p>
                <p>
                  Mými dalšími učiteli byli a dosud jsou MUDr. Jan Černý, Mgr. Pavla Vyskočilová a Ing. Jana Vrbková.
                </p>
              </div>

              <Card className="bg-primary text-primary-foreground card-shadow">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3 text-lg">Pravidelné vzdělávání</h4>
                  <p className="text-sm opacity-90 mb-4">
                    Pravidelně se vzdělávám na workshopech s předními světovými učiteli:
                  </p>
                  <div className="space-y-2">
                    {teachers.map((teacher, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full"></div>
                        <span className="text-sm">{teacher}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right column - Timeline */}
          <div className="lg:flex-1">
            <StaggerContainer className="space-y-6">
              {education.map((item, index) => (
                <StaggerItem key={index}>
                  <FadeIn>
                    <Card className="scroll-reveal bg-card border-border card-shadow hover:card-hover-shadow transition-all duration-300 group hover:scale-[1.02] relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full" />
                      <CardContent className="p-8 relative">
                        <div className="flex items-start space-x-6">
                          <div className="flex-shrink-0">
                            <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                              <item.icon className={`w-7 h-7 ${item.iconColor}`} />
                            </div>
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                                {item.year}
                              </span>
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </FadeIn>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Philosophy quote with image */}
            <div className="mt-8 scroll-reveal">
              <Card className="bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 card-shadow backdrop-blur-sm border-2 border-primary/20 overflow-hidden group hover:card-hover-shadow transition-all duration-500">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img
                      src={instructorImage}
                      alt="Barbora Zapletalová - certifikovaná lektorka jógy v TaYoga Kroměříž, učitelka Iyengar jógy"
                      className="w-full h-[450px] object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                    {/* Decorative elements */}
                    <div className="absolute top-4 right-4 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse" />
                    <div className="absolute top-12 left-8 w-16 h-16 bg-accent/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />

                    <div className="absolute bottom-0 left-0 right-0 p-10 text-center">
                      <div className="backdrop-blur-md bg-background/90 rounded-2xl p-8 border border-primary/10">
                        <blockquote className="text-3xl md:text-4xl font-serif text-foreground italic mb-4 leading-tight">
                          "Tělo je chrám duše"
                        </blockquote>
                        <div className="w-16 h-0.5 bg-primary mx-auto mb-4" />
                        <p className="text-lg text-muted-foreground">
                          Tato filozofie prostupuje celou naší praxí
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Instructor;