import React from 'react';
import { ScrollReveal, fadeUpVariants } from '@/components/ui/scroll-animations';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const IyengarQuote = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-background via-secondary/5 to-background dark:from-card/50 dark:via-background dark:to-card/50">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal variants={fadeUpVariants}>
          <div className="relative">
            {/* Main content card */}
            <div className="bg-card/60 backdrop-blur-sm rounded-3xl overflow-hidden border border-primary/10 shadow-2xl">
              <div className="grid md:grid-cols-2 items-center">
                {/* Image side */}
                <div className="relative h-[500px] md:h-[600px] overflow-hidden">
                  <img
                    src="/Screenshot 2025-09-24 at 17.34.55.png"
                    alt="B.K.S. Iyengar"
                    className="w-full h-full object-cover filter sepia-[30%]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-serif font-bold mb-1">B.K.S. Iyengar</h3>
                    <p className="text-sm opacity-90">1918 – 2014</p>
                  </div>
                </div>

                {/* Quote side */}
                <div className="p-8 md:p-12">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6"
                  >
                    <Quote className="w-12 h-12 text-primary/30" />
                  </motion.div>

                  <blockquote className="text-xl md:text-2xl font-serif text-foreground mb-6 leading-relaxed">
                    "Tajemství zdravého těla a mysli nespočívá v truchlení nad minulostí
                    ani ve strachu o budoucnost, ale ve vědomém a plném prožitku přítomnosti."
                  </blockquote>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-[2px] bg-primary" />
                    <p className="text-muted-foreground font-medium">B.K.S. Iyengar</p>
                  </div>

                  <motion.div
                    className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-sm text-muted-foreground">
                      Zakladatel Iyengar jógy, jeden z nejváženějších učitelů jógy 20. století,
                      který zpřístupnil jógu milionům lidí po celém světě.
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.3, 0.5]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/10 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default IyengarQuote;