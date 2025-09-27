import Header from '@/components/Header';
import Hero from '@/components/Hero';
import EnhancedAbout from '@/components/EnhancedAbout';
import Instructor from '@/components/Instructor';
import IyengarQuote from '@/components/IyengarQuote';
import ExpectOnLessons from '@/components/ExpectOnLessons';
import StudioUnique from '@/components/StudioUnique';
import Schedule from '@/components/Schedule';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <EnhancedAbout />
        <Instructor />
        <ExpectOnLessons />
        <IyengarQuote />
        <StudioUnique />
        <Schedule />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
