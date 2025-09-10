import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-yoga-studio.jpg';

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
        <div className="max-w-2xl animate-fade-in-up">
          <h2 className="text-6xl lg:text-7xl font-serif font-bold text-foreground mb-6 leading-tight">
            Objevte
            <span className="text-primary block">vnitřní klid</span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
            V našem studiu Tayoga v Kroměříži se věnujeme precizní metodě Iyengar jógy. 
            Každý pohyb je cesta k lepšímu porozumění sobě sama.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              onClick={() => scrollToSection('about')}
              className="text-lg px-8 py-6"
            >
              Náš příběh
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => scrollToSection('services')}
              className="text-lg px-8 py-6"
            >
              Prozkoumat lekce
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;