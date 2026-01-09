import { Button } from '@/components/ui/button';
import { ScrollReveal, fadeLeftVariants, Floating } from '@/components/ui/scroll-animations';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Lazy load video after page is interactive
  useEffect(() => {
    const loadVideo = () => {
      if (videoRef.current) {
        videoRef.current.src = '/tayoga_studio_kromeriz.mp4';
        videoRef.current.load();
        videoRef.current.play().catch(() => {
          // Autoplay blocked, user will need to interact
        });
        setVideoLoaded(true);
      }
    };

    // Load video after idle or after 2 seconds
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadVideo, { timeout: 2000 });
    } else {
      setTimeout(loadVideo, 1500);
    }
  }, []);

  return (
    <section id="home" className="min-h-screen relative overflow-hidden dark">
      {/* Background - Poster first, then video */}
      <div className="absolute inset-0">
        {/* Static poster image - loads immediately for LCP */}
        <img
          src="/Tayoga_Hero.jpg"
          alt=""
          width={1280}
          height={720}
          // @ts-expect-error - fetchpriority is valid HTML attribute
          fetchpriority="high"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoLoaded ? 'opacity-0' : 'opacity-100'}`}
        />
        {/* Video - lazy loaded */}
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          aria-label="Video TaYoga studia - jógová lekce v Kroměříži"
          title="TaYoga Kroměříž - jógové studio"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/55 to-background/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 h-screen flex items-center">
        <div className="max-w-2xl">
          <ScrollReveal variants={fadeLeftVariants}>
            <h1 className="text-6xl lg:text-7xl font-serif font-bold text-foreground mb-6 leading-tight">
              Tělo je
              <span className="text-primary block">chrám duše</span>
            </h1>
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
                  className="text-lg px-8 py-6 text-white border-white/50 hover:bg-white/10 hover:text-white"
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