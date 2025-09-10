import Header from '@/components/Header';
import Hero from '@/components/Hero';
import EnhancedAbout from '@/components/EnhancedAbout';
import InteractiveServices from '@/components/InteractiveServices';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <EnhancedAbout />
        <InteractiveServices />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
