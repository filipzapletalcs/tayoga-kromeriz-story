import React from 'react';
import { Calendar, Clock, CreditCard, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollReveal, fadeUpVariants } from '@/components/ui/scroll-animations';
import { motion } from 'framer-motion';

const Schedule = () => {
  const weeklySchedule = [
    { day: 'Pondělí', slots: [] },
    { day: 'Úterý', slots: [{ time: '18:00 - 19:30', type: 'kurz', label: 'Kurz pokročilí' }] },
    { day: 'Středa', slots: [
      { time: '8:00 - 9:30', type: 'kurz', label: 'Kurz senioři' },
      { time: '10:00 - 11:30', type: 'kurz', label: 'Kurz začátečníci' }
    ]},
    { day: 'Čtvrtek', slots: [
      { time: '16:15 - 17:45', type: 'kurz', label: 'Kurz pokročilí' },
      { time: '18:15 - 19:30', type: 'kurz', label: 'Otevřená lekce' }
    ]},
    { day: 'Pátek', slots: [] },
  ];

  // Detailní rozpis termínů pro 1. pololetí 2025/26
  const detailedSchedule = {
    tuesday: [
      { month: 'Září', dates: '23, 30' },
      { month: 'Říjen', dates: '7, 14, 21' },
      { month: 'Listopad', dates: '4, 11, 18, 25' },
      { month: 'Prosinec', dates: '2, 9, 16' },
      { month: 'Leden', dates: '6, 13, 20' }
    ],
    wednesday: [
      { month: 'Září', dates: '24' },
      { month: 'Říjen', dates: '1, 8, 15, 22, 29' },
      { month: 'Listopad', dates: '5, 12, 19, 26' },
      { month: 'Prosinec', dates: '3, 10, 17' },
      { month: 'Leden', dates: '7, 14, 21' }
    ],
    thursday: [
      { month: 'Září', dates: '25' },
      { month: 'Říjen', dates: '2, 9, 16, 23, 30' },
      { month: 'Listopad', dates: '13, 20, 27' },
      { month: 'Prosinec', dates: '4, 11, 18' },
      { month: 'Leden', dates: '8, 15, 22' }
    ]
  };


  return (
    <section id="schedule" className="relative py-20 px-4 bg-gradient-to-br from-secondary/20 via-background to-accent/10 dark:from-background dark:via-card/50 dark:to-background">
      <div className="max-w-7xl mx-auto">
        {/* Nadpis sekce */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Rozvrh lekcí
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Kurzy jógy s pomůckami pod vedením Barbory Zapletalové
            </p>
          </div>
        </ScrollReveal>

        {/* Grid layout s sticky levým panelem */}
        <div className="lg:grid lg:grid-cols-[450px,1fr] lg:gap-8 lg:items-start">
          {/* Levý sticky panel - Týdenní rozvrh */}
          <div className="lg:sticky lg:top-24 mb-8 lg:mb-0">
            <ScrollReveal delay={0.1} variants={fadeUpVariants}>
              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 bg-card/90 backdrop-blur-sm border-primary/10">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-2xl font-serif text-foreground">
                    <Calendar className="w-6 h-6 text-primary" />
                    Týdenní rozvrh
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">Pravidelné lekce během týdne</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {weeklySchedule.map((day, dayIdx) => (
                      <motion.div
                        key={day.day}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: dayIdx * 0.05 }}
                        className="flex border-b border-border/50 pb-3 last:border-0"
                      >
                        <div className="w-28 font-semibold text-foreground">{day.day}</div>
                        <div className="flex-1">
                          {day.slots.length > 0 ? (
                            <div className="space-y-2">
                              {day.slots.map((slot, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                  <Clock className="w-4 h-4 text-primary/60" />
                                  <span className="text-muted-foreground">{slot.time}</span>
                                  <Badge
                                    variant={slot.type === 'open' ? 'default' : 'secondary'}
                                    className={slot.type === 'open' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-accent text-accent-foreground'}
                                  >
                                    {slot.label}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground/50">-</span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <Alert className="mt-6 bg-primary/10 border-primary/30 dark:bg-primary/20">
                    <Info className="h-4 w-4 text-primary" />
                    <AlertDescription className="text-sm font-medium">
                      <strong className="text-foreground">Rezervace předem nutná!</strong>
                      <br />
                      <span className="text-muted-foreground">Na otevřené lekce se prosím hlaste telefonicky nebo emailem.</span>
                    </AlertDescription>
                  </Alert>
                </CardContent>
                </Card>
              </motion.div>
            </ScrollReveal>
          </div>

          {/* Pravý scrollovací panel - Detailní rozpis */}
          <ScrollReveal delay={0.2} variants={fadeUpVariants}>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm border-accent/10">
                <CardHeader className="bg-gradient-to-r from-accent/10 to-secondary/10 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-2xl font-serif text-foreground">
                    <Clock className="w-6 h-6 text-primary" />
                    Detailní rozpis kurzů
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">1. pololetí 2025/26</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {/* Úterý kurz */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full"/>
                        Úterý kurz (18:00 - 19:30)
                      </h4>
                      <div className="pl-4">
                        {detailedSchedule.tuesday.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-3 text-sm py-1">
                            <span className="text-muted-foreground min-w-[70px]">{item.month}:</span>
                            <span className="text-foreground font-medium">{item.dates}</span>
                          </div>
                        ))}
                        <Badge className="mt-2 bg-primary/10 text-primary border-primary/20">15 lekcí</Badge>
                      </div>
                    </div>

                    {/* Středeční kurzy */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <span className="w-2 h-2 bg-accent-gold rounded-full"/>
                        Středeční kurzy
                      </h4>
                      <div className="pl-4 space-y-3">
                        <div>
                          <p className="text-sm font-medium text-foreground mb-1">8:00 - 9:30 / 10:00 - 11:30</p>
                          {detailedSchedule.wednesday.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3 text-sm py-1">
                              <span className="text-muted-foreground min-w-[70px]">{item.month}:</span>
                              <span className="text-foreground font-medium">{item.dates}</span>
                            </div>
                          ))}
                          <Badge className="mt-2 bg-primary/10 text-primary border-primary/20">16 lekcí</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Čtvteční kurz */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <span className="w-2 h-2 bg-secondary rounded-full"/>
                        Čtvteční kurz (16:15 - 17:45)
                      </h4>
                      <div className="pl-4">
                        {detailedSchedule.thursday.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-3 text-sm py-1">
                            <span className="text-muted-foreground min-w-[70px]">{item.month}:</span>
                            <span className="text-foreground font-medium">{item.dates}</span>
                          </div>
                        ))}
                        <Badge className="mt-2 bg-primary/10 text-primary border-primary/20">15 lekcí</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </ScrollReveal>
        </div>

        {/* Ceník - pod oběma panely */}
        <ScrollReveal delay={0.4} variants={fadeUpVariants} className="mt-12">
          <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.3 }}>
            <Card className="mt-8 shadow-xl bg-gradient-to-br from-primary/5 via-card to-accent/5 dark:from-card dark:to-card/80 border-primary/10">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent-gold/10 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-3xl font-serif text-foreground">
                  <CreditCard className="w-7 h-7 text-primary" />
                  Ceník
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl" />
                    <div className="relative p-6 bg-card/90 backdrop-blur-sm rounded-xl border border-primary/20 shadow-md hover:shadow-lg transition-all duration-300">
                      <h4 className="font-serif text-xl mb-4 text-foreground flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        Otevřená lekce
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-end">
                          <span className="text-muted-foreground font-medium">75 minut</span>
                          <div className="text-right">
                            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent-gold bg-clip-text text-transparent">250</span>
                            <span className="text-lg text-muted-foreground ml-1">Kč</span>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-border/50">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Pro frekventanty kurzů:</span>
                            <span className="font-semibold text-lg text-primary">210 Kč</span>
                          </div>
                          <Badge className="mt-2 bg-primary/10 text-primary border-primary/20">Ušetříte 40 Kč</Badge>
                        </div>
                        <div className="mt-3 p-2 bg-accent/5 rounded-lg">
                          <p className="text-xs text-muted-foreground">
                            <strong>Noví zájemci:</strong> 3 zkušební lekce za 210 Kč
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05, rotate: -1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-secondary/20 blur-2xl" />
                    <div className="relative p-6 bg-card/90 backdrop-blur-sm rounded-xl border border-accent/20 shadow-md hover:shadow-lg transition-all duration-300">
                      <h4 className="font-serif text-xl mb-4 text-foreground flex items-center gap-2">
                        <span className="w-2 h-2 bg-accent-gold rounded-full animate-pulse" />
                        Individuální lekce
                      </h4>
                      <div className="flex justify-between items-end">
                        <span className="text-muted-foreground font-medium">60 minut</span>
                        <div className="text-right">
                          <span className="text-3xl font-bold bg-gradient-to-r from-accent-gold to-primary bg-clip-text text-transparent">1000</span>
                          <span className="text-lg text-muted-foreground ml-1">Kč</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-border/50">
                        <Badge className="bg-accent/10 text-accent-foreground border-accent/20">Osobní přístup</Badge>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Schedule;