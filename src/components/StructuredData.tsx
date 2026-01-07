import { useEffect } from 'react';

const StructuredData = () => {
  useEffect(() => {
    // LocalBusiness Schema - Jógové studio
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "HealthAndBeautyBusiness",
      "@id": "https://tayoga.cz/#organization",
      "name": "TaYoga",
      "alternateName": "TaYoga Kroměříž",
      "description": "Jógové studio v Kroměříži specializující se na jógu s pomůckami. Kurzy pro začátečníky, pokročilé i seniory. Lektorka Barbora Zapletalová.",
      "url": "https://tayoga.cz",
      "telephone": "+420774515599",
      "email": "barayoga001@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Vodní 53",
        "addressLocality": "Kroměříž",
        "postalCode": "767 01",
        "addressCountry": "CZ"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 49.2988,
        "longitude": 17.3929
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "Tuesday",
          "opens": "18:00",
          "closes": "19:30"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "Wednesday",
          "opens": "08:00",
          "closes": "11:30"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "Thursday",
          "opens": "16:15",
          "closes": "19:30"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Friday", "Saturday", "Sunday"],
          "opens": "00:00",
          "closes": "00:00"
        }
      ],
      "priceRange": "210 Kč - 800 Kč",
      "image": "https://tayoga.cz/og-image.jpg",
      "logo": "https://tayoga.cz/favicon.svg",
      "sameAs": [
        "https://www.facebook.com/profile.php?id=61581015224519",
        "https://www.instagram.com/taygoga_kromeriz/"
      ],
      "founder": {
        "@type": "Person",
        "name": "Barbora Zapletalová"
      },
      "foundingDate": "2024-09",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Jógové kurzy a lekce",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Kurz pro začátečníky",
              "description": "Základní pozice a dechové techniky v pohodovém tempu",
              "provider": {
                "@id": "https://tayoga.cz/#organization"
              }
            },
            "price": "350",
            "priceCurrency": "CZK"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Kurz pro pokročilé",
              "description": "Hluboká práce s pokročilými ásanami a variacemi",
              "provider": {
                "@id": "https://tayoga.cz/#organization"
              }
            },
            "price": "400",
            "priceCurrency": "CZK"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Individuální lekce",
              "description": "Personalizovaná výuka přizpůsobená vašim potřebám",
              "provider": {
                "@id": "https://tayoga.cz/#organization"
              }
            },
            "price": "800",
            "priceCurrency": "CZK"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Terapeutická jóga",
              "description": "Speciální program pro osoby se zdravotními omezeními",
              "provider": {
                "@id": "https://tayoga.cz/#organization"
              }
            },
            "price": "450",
            "priceCurrency": "CZK"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Otevřené lekce",
              "description": "Jednotlivé lekce pro stávající studenty i příchozí",
              "provider": {
                "@id": "https://tayoga.cz/#organization"
              }
            },
            "price": "250",
            "priceCurrency": "CZK"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Zkušební balíček",
              "description": "3 úvodní lekce pro nové účastníky",
              "provider": {
                "@id": "https://tayoga.cz/#organization"
              }
            },
            "price": "210",
            "priceCurrency": "CZK"
          }
        ]
      }
    };

    // Person Schema - Lektorka Barbora Zapletalová
    const personSchema = {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": "https://tayoga.cz/#person",
      "name": "Barbora Zapletalová",
      "jobTitle": "Certifikovaná lektorka jógy",
      "description": "Certifikovaná lektorka jógy od roku 2018, dlouholetá studentka Edgara Ta (1999-2021), v současnosti se vzdělává na učitelku učitelů jógy.",
      "worksFor": {
        "@id": "https://tayoga.cz/#organization"
      },
      "knowsAbout": [
        "Jóga",
        "Ayurveda",
        "Východní nauky",
        "Přírodní medicína",
        "Terapeutická jóga"
      ],
      "alumniOf": [
        {
          "@type": "EducationalOrganization",
          "name": "Sociální pedagogika"
        },
        {
          "@type": "EducationalOrganization",
          "name": "Ekonomie"
        }
      ]
    };

    // WebSite Schema
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://tayoga.cz/#website",
      "url": "https://tayoga.cz",
      "name": "TaYoga - Jógové studio Kroměříž",
      "description": "Jógové studio v Kroměříži specializující se na jógu s pomůckami pro všechny úrovně",
      "publisher": {
        "@id": "https://tayoga.cz/#organization"
      },
      "inLanguage": "cs-CZ"
    };

    // Service Schema
    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Jógové lekce a kurzy",
      "name": "Jóga s pomůckami",
      "description": "Specializované jógové lekce s pomůckami pro začátečníky, pokročilé i seniory. Malé skupiny, individuální přístup.",
      "provider": {
        "@id": "https://tayoga.cz/#organization"
      },
      "areaServed": {
        "@type": "City",
        "name": "Kroměříž",
        "containedIn": {
          "@type": "Country",
          "name": "Česká republika"
        }
      },
      "availableChannel": {
        "@type": "ServiceChannel",
        "serviceUrl": "https://tayoga.cz/kontakt",
        "servicePhone": {
          "@type": "ContactPoint",
          "telephone": "+420774515599",
          "contactType": "Rezervace",
          "areaServed": "CZ",
          "availableLanguage": "Czech"
        },
        "servicePostalAddress": {
          "@type": "PostalAddress",
          "streetAddress": "Vodní 53",
          "addressLocality": "Kroměříž",
          "postalCode": "767 01",
          "addressCountry": "CZ"
        }
      }
    };

    // BreadcrumbList Schema - pro navigaci
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Domů",
          "item": "https://tayoga.cz/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "O studiu",
          "item": "https://tayoga.cz/o-studiu"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Lektorka",
          "item": "https://tayoga.cz/lektorka"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Lekce",
          "item": "https://tayoga.cz/lekce"
        },
        {
          "@type": "ListItem",
          "position": 5,
          "name": "Rozvrh",
          "item": "https://tayoga.cz/rozvrh"
        },
        {
          "@type": "ListItem",
          "position": 6,
          "name": "Kontakt",
          "item": "https://tayoga.cz/kontakt"
        }
      ]
    };

    // Aggregate Rating Schema - můžeš přidat až budou recenze
    const aggregateRatingSchema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "TaYoga",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5",
        "reviewCount": "1",
        "bestRating": "5",
        "worstRating": "1"
      }
    };

    // Combine all schemas
    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        localBusinessSchema,
        personSchema,
        websiteSchema,
        serviceSchema,
        breadcrumbSchema,
        aggregateRatingSchema
      ]
    };

    // Create or update script tag
    let script = document.querySelector('script[type="application/ld+json"]#tayoga-structured-data');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'tayoga-structured-data';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData, null, 2);

    return () => {
      // Cleanup on unmount
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null;
};

export default StructuredData;
