import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getMetadataForPath } from '@/lib/seo-metadata';

/**
 * Hook for error pages (404, 500) - sets noindex, nofollow and proper SEO
 * IMPORTANT: Error pages must not be indexed by search engines
 */
export const useErrorSEO = (type: '404' | '500') => {
  useEffect(() => {
    const title = type === '404'
      ? 'Stránka nenalezena | TaYoga Kroměříž'
      : 'Něco se pokazilo | TaYoga Kroměříž';

    // Set title
    document.title = title;

    // Set robots to noindex, nofollow - critical for SEO
    let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    const previousRobots = robots.getAttribute('content');
    robots.setAttribute('content', 'noindex, nofollow');

    // Set canonical to homepage
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://tayoga.cz/');

    // Clear OG tags - error pages shouldn't be shared
    const ogTags = ['og:title', 'og:description', 'og:image', 'og:url'];
    ogTags.forEach(tag => {
      const element = document.querySelector(`meta[property="${tag}"]`) as HTMLMetaElement;
      if (element) {
        element.setAttribute('content', '');
      }
    });

    // Cleanup - restore robots when navigating away
    return () => {
      if (robots && previousRobots) {
        robots.setAttribute('content', previousRobots);
      } else if (robots) {
        robots.setAttribute('content', 'index, follow');
      }
    };
  }, [type]);
};

export const useSEO = () => {
  const location = useLocation();

  useEffect(() => {
    const metadata = getMetadataForPath(location.pathname);

    // Update title
    document.title = metadata.title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', metadata.description);
    updateMetaTag('keywords', metadata.keywords);

    // Open Graph tags
    updateMetaTag('og:title', metadata.ogTitle, true);
    updateMetaTag('og:description', metadata.ogDescription, true);
    updateMetaTag('og:image', metadata.ogImage, true);
    updateMetaTag('og:url', `https://tayoga.cz${metadata.canonicalPath}`, true);
    updateMetaTag('og:type', 'website', true);

    // Twitter tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', metadata.ogTitle);
    updateMetaTag('twitter:description', metadata.ogDescription);
    updateMetaTag('twitter:image', metadata.ogImage);

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://tayoga.cz${metadata.canonicalPath}`);

  }, [location.pathname]);
};
