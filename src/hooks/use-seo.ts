import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getMetadataForPath } from '@/lib/seo-metadata';

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
