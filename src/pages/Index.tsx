import { lazy, Suspense } from 'react';
import Hero from '@/components/Hero';
import EnhancedAbout from '@/components/EnhancedAbout';
import Instructor from '@/components/Instructor';
import StructuredData from '@/components/StructuredData';
import { useSEO } from '@/hooks/use-seo';

// Lazy load below-fold components for better initial load performance
const ExpectOnLessons = lazy(() => import('@/components/ExpectOnLessons'));
const IyengarQuote = lazy(() => import('@/components/IyengarQuote'));
const StudioUnique = lazy(() => import('@/components/StudioUnique'));
const Schedule = lazy(() => import('@/components/Schedule'));
const Contact = lazy(() => import('@/components/Contact'));

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
      <Suspense fallback={<div className="min-h-screen" />}>
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
      </Suspense>
    </>
  );
};

export default Index;
