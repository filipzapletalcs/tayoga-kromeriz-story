import { useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const Contact = () => {
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
    <section id="contact" ref={sectionRef} className="py-20 gradient-section">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
            Spojte se
            <span className="text-primary"> s námi</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Rádi odpovíme na vaše otázky a pomůžeme vám najít cestu k józe.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="scroll-reveal">
              <Card className="bg-card border-border card-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif text-foreground">
                    Studio Tayoga
                  </CardTitle>
                  <CardDescription>
                    Vaše místo pro klid a rovnováhu v Kroměříži
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">📍 Adresa</h4>
                    <p className="text-muted-foreground">
                      Velké náměstí 123<br />
                      767 01 Kroměříž
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">📞 Telefon</h4>
                    <p className="text-muted-foreground">+420 123 456 789</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">✉️ Email</h4>
                    <p className="text-muted-foreground">info@tayoga.cz</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">🕐 Otevírací doba</h4>
                    <div className="text-muted-foreground space-y-1">
                      <p>Pondělí - Pátek: 17:00 - 21:00</p>
                      <p>Sobota: 9:00 - 12:00</p>
                      <p>Neděle: Zavřeno</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="scroll-reveal">
              <Card className="bg-primary text-primary-foreground card-shadow">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3">První lekce zdarma!</h4>
                  <p className="text-sm opacity-90">
                    Přijďte si vyzkoušet Iyengar jógu v našem studiu. 
                    První lekce je pro nové studenty zcela zdarma.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div className="scroll-reveal">
            <Card className="bg-card border-border card-shadow">
              <CardHeader>
                <CardTitle className="text-2xl font-serif text-foreground">
                  Napište nám
                </CardTitle>
                <CardDescription>
                  Zanechte nám zprávu a my se vám ozveme co nejdříve
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Jméno</Label>
                      <Input id="firstName" placeholder="Vaše jméno" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Příjmení</Label>
                      <Input id="lastName" placeholder="Vaše příjmení" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="vas@email.cz" />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Telefon (volitelné)</Label>
                    <Input id="phone" type="tel" placeholder="+420 123 456 789" />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Zpráva</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Napište nám svou zprávu nebo dotaz..."
                      rows={4}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Odeslat zprávu
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;