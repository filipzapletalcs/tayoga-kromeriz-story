import Hero from '@/components/Hero';
import EnhancedAbout from '@/components/EnhancedAbout';
import Instructor from '@/components/Instructor';
import IyengarQuote from '@/components/IyengarQuote';
import ExpectOnLessons from '@/components/ExpectOnLessons';
import StudioUnique from '@/components/StudioUnique';
import Schedule from '@/components/Schedule';
import Contact from '@/components/Contact';
import StructuredData from '@/components/StructuredData';
import { useSEO } from '@/hooks/use-seo';

const Index = () => {
  // Dynamically update SEO metadata based on current URL
  useSEO();

  return (
    <>
      <StructuredData />
      <section id="home">
        <Hero />
      </section>
      <section id="o-studiu">
        <EnhancedAbout />
      </section>
      <section id="lektorka">
        <Instructor />
      </section>
      <section id="lekce">
        <ExpectOnLessons />
        <IyengarQuote />
      </section>
      <section id="unikatnost">
        <StudioUnique />
      </section>
      <section id="rozvrh">
        <Schedule />
      </section>
      <section id="kontakt">
        <Contact />
      </section>
    </>
  );
};

export default Index;
