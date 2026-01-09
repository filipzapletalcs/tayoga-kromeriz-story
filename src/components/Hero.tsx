import { Button } from '@/components/ui/button';
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

  // Lazy load video after page is interactive (only on fast connections)
  useEffect(() => {
    const loadVideo = () => {
      // Check for slow connection - skip video on 2G/3G or data saver mode
      const connection = (navigator as any).connection;
      const isSlowConnection = connection && (
        connection.saveData ||
        connection.effectiveType === '2g' ||
        connection.effectiveType === 'slow-2g' ||
        connection.effectiveType === '3g'
      );

      if (isSlowConnection || !videoRef.current) {
        return; // Don't load video on slow connections
      }

      videoRef.current.src = '/tayoga_studio_kromeriz.mp4';
      videoRef.current.load();
      videoRef.current.play().catch(() => {
        // Autoplay blocked, user will need to interact
      });
      setVideoLoaded(true);
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
        {/* Static poster image with responsive variants - loads immediately for LCP */}
        <picture>
          <source
            media="(max-width: 640px)"
            srcSet="/Tayoga_Hero_mobile.webp"
            type="image/webp"
          />
          <source
            srcSet="/Tayoga_Hero.webp"
            type="image/webp"
          />
          <img
            src="/Tayoga_Hero.jpg"
            alt=""
            width={1280}
            height={720}
            // @ts-expect-error - fetchpriority is valid HTML attribute
            fetchpriority="high"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoLoaded ? 'opacity-0' : 'opacity-100'}`}
          />
        </picture>
        {/* Video - lazy loaded on fast connections only */}
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

      {/* Content - using CSS animations instead of Framer Motion */}
      <div className="relative z-10 container mx-auto px-6 h-screen flex items-center">
        <div className="max-w-2xl">
          <h1 className="text-6xl lg:text-7xl font-serif font-bold text-foreground mb-6 leading-tight animate-fade-in-left">
            Tělo je
            <span className="text-primary block">chrám duše</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl animate-fade-in-left animate-delay-200">
            Vytvořili jsme místo setkávání pro společnou praxi jógy v historickém středu Kroměříže.
            Studio jsme nově otevřeli na konci září 2025 a věříme, že bude místem, kde se budeme všichni rádi vracet.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-left animate-delay-400">
            <Button
              size="lg"
              onClick={() => scrollToSection('o-studiu')}
              className="text-lg px-8 py-6 transition-transform hover:scale-105 active:scale-95"
            >
              Náš příběh
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('rozvrh')}
              className="text-lg px-8 py-6 text-white border-white/50 hover:bg-white/10 hover:text-white transition-transform hover:scale-105 active:scale-95"
            >
              Prozkoumat lekce
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator - CSS animation instead of Framer Motion */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 floating-element">
        <div
          className="w-6 h-10 border-2 border-primary rounded-full flex justify-center cursor-pointer transition-transform hover:scale-110"
          onClick={() => scrollToSection('o-studiu')}
        >
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
