import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/micro-interactions';
import instructorImage from '@/assets/IMG_4946 2.webp';

const Instructor = () => {
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
      description: "Na podnět mé vzácné učitelky a přítelkyně Lidmily Brabcové jsem se stala lektorkou jógy"
    },
    {
      year: "Současnost",
      title: "Učitel ve výcviku jógy",
      description: "V současné době jsem učitelem ve výcviku jógy. Výcvik na učitele trvá v případě jógy léta a adepti k němu přistupují až po vlastní mnohaleté praxi"
    },
    {
      year: "1999-2021",
      title: "Studium u Edgara Ta",
      description: "Tajemství lidského těla i duše byly mými tématy odjakživa. Edgar Ta vytvořil metodiku unikátních masáží, předmětem studia byla také ajurvéda a východní nauky, přírodní medicína, zásady zdravého stravování, principy přírodních zákonitostí a psychologie člověka"
    },
    {
      year: "Vzdělání",
      title: "Vzdělání",
      description: "Vystudovala jsem ekonomickou školu a sociální pedagogiku"
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
        <div className="lg:flex lg:gap-12 lg:relative">
          {/* Left column - STICKY */}
          <div className="lg:w-[40%] mb-12 lg:mb-0 lg:relative">
            <div className="lg:sticky lg:top-24 lg:bottom-auto">
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
                    <Card className="scroll-reveal bg-card border-border card-shadow hover:card-hover-shadow transition-all duration-300 group">
                      <CardContent className="p-8">
                        <div className="flex items-start space-x-6">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <span className="text-xs font-bold text-primary">{item.year}</span>
                            </div>
                          </div>
                          <div className="flex-grow">
                            <h3 className="text-xl font-semibold text-foreground mb-2">
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
              <Card className="bg-gradient-to-r from-accent/50 via-primary/10 to-accent-gold/20 card-shadow backdrop-blur-sm border border-primary/10 overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={instructorImage}
                      alt="Barbora Zapletalová - lektorka jógy"
                      className="w-full h-[400px] object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
                      <blockquote className="text-3xl font-serif text-foreground italic mb-3">
                        "Tělo je chrám duše"
                      </blockquote>
                      <p className="text-lg text-muted-foreground">
                        Tato filozofie prostupuje celou naší praxí
                      </p>
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