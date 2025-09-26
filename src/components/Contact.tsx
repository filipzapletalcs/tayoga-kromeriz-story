import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FormError, FormSuccess, FormFieldError } from '@/components/ui/form-error';
import { FadeIn, AnimatedButton } from '@/components/ui/micro-interactions';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Jméno je povinné';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email je povinný';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email není ve správném formátu';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Zpráva je povinná';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});
    setSubmitSuccess(false);

    try {
      // EmailJS konfigurace z environment proměnných
      const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      // Inicializace EmailJS (stačí jednou, můžete dát i do useEffect)
      emailjs.init(PUBLIC_KEY);

      // Odeslání emailu
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        message: formData.message,
        to_email: 'barayoga001@gmail.com'
      });

      setSubmitSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });

      // Po 5 sekundách skrýt success zprávu
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Email error:', error);
      setErrors({ submit: 'Nepodařilo se odeslat zprávu. Zkuste to prosím znovu.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="py-16 gradient-section">
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
                    Studio TaYoga
                  </CardTitle>
                  <CardDescription>
                    Vaše místo pro klid a rovnováhu v Kroměříži
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Adresa</h4>
                      <p className="text-muted-foreground">
                        Vodní ulice 53<br />
                        767 01 Kroměříž
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Telefon</h4>
                      <a href="tel:+420774515599" className="text-muted-foreground hover:text-primary transition-colors">+420 774 515 599</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Email</h4>
                      <a href="mailto:barayoga001@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">barayoga001@gmail.com</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Otevírací doba</h4>
                      <div className="text-muted-foreground space-y-1">
                        <p>Pondělí: Zavřeno</p>
                        <p>Úterý: 18:00 - 19:30</p>
                        <p>Středa: 8:00 - 9:30, 10:00 - 11:30</p>
                        <p>Čtvrtek: 16:15 - 17:45</p>
                        <p>Pátek: Zavřeno</p>
                      </div>
                    </div>
                  </div>
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
                <FadeIn>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {submitSuccess && (
                      <FormSuccess message="Zpráva byla úspěšně odeslána! Ozveme se vám co nejdříve." />
                    )}
                    
                    {errors.submit && (
                      <FormError message={errors.submit} />
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Jméno</Label>
                        <Input 
                          id="name" 
                          placeholder="Vaše jméno"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className={errors.name ? 'border-destructive' : ''}
                        />
                        <FormFieldError error={errors.name} />
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefon (volitelné)</Label>
                        <Input 
                          id="phone" 
                          type="tel" 
                          placeholder="+420 123 456 789"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="vas@email.cz"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={errors.email ? 'border-destructive' : ''}
                      />
                      <FormFieldError error={errors.email} />
                    </div>
                    
                    <div>
                      <Label htmlFor="message">Zpráva</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Napište nám svou zprávu nebo dotaz..."
                        rows={4}
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        className={errors.message ? 'border-destructive' : ''}
                      />
                      <FormFieldError error={errors.message} />
                    </div>
                    
                    <Button
                      type="submit" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Odesílám...' : 'Odeslat zprávu'}
                    </Button>
                  </form>
                </FadeIn>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;