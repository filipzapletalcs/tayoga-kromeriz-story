import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-yoga-studio.jpg';
import { ScrollReveal, fadeUpVariants, fadeLeftVariants, Floating } from '@/components/ui/scroll-animations';
import { motion } from 'framer-motion';

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 h-screen flex items-center">
        <div className="max-w-2xl">
          <ScrollReveal variants={fadeLeftVariants}>
            <h2 className="text-6xl lg:text-7xl font-serif font-bold text-foreground mb-6 leading-tight">
              Tělo je
              <span className="text-primary block">chrám duše</span>
            </h2>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
              Vytvořili jsme místo setkávání pro společnou praxi jógy v historickém středu Kroměříže.
              Studio jsme nově otevřeli na konci září 2025 a věříme, že bude místem, kde se budeme všichni rádi vracet.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  onClick={() => scrollToSection('about')}
                  className="text-lg px-8 py-6"
                >
                  Náš příběh
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection('schedule')}
                  className="text-lg px-8 py-6"
                >
                  Prozkoumat lekce
                </Button>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Scroll indicator */}
      <Floating duration={2} className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <motion.div 
          className="w-6 h-10 border-2 border-primary rounded-full flex justify-center cursor-pointer"
          onClick={() => scrollToSection('about')}
          whileHover={{ scale: 1.1 }}
        >
          <motion.div 
            className="w-1 h-3 bg-primary rounded-full mt-2"
            animate={{ y: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </Floating>
    </section>
  );
};

export default Hero;