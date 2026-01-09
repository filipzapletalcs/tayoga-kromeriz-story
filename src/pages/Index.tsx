import Hero from '@/components/Hero';
import EnhancedAbout from '@/components/EnhancedAbout';
import Instructor from '@/components/Instructor';
import StructuredData from '@/components/StructuredData';
import ExpectOnLessons from '@/components/ExpectOnLessons';
import IyengarQuote from '@/components/IyengarQuote';
import StudioUnique from '@/components/StudioUnique';
import Schedule from '@/components/Schedule';
import Contact from '@/components/Contact';
import { useSEO } from '@/hooks/use-seo';

// Note: With SSG (vite-react-ssg), lazy loading is not needed for the main page
// because all content is pre-rendered at build time into static HTML.
// Using lazy + Suspense would cause hydration mismatches (React error #421).

const Index = () => {
  // Dynamically update SEO metadata based on current URL (client-side only)
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
