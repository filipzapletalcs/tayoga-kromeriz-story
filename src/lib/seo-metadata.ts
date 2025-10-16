// SEO metadata pro každou sekci/URL
export type SEOMetadata = {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalPath: string;
};

export const SEO_METADATA: Record<string, SEOMetadata> = {
  "/": {
    title: "TaYoga - Jógové studio Kroměříž | Barbora Zapletalová",
    description: "Jógové studio TaYoga ve Vodní ulici v Kroměříži. Kurzy jógy s pomůckami pro začátečníky, pokročilé i seniory. Lektorka Barbora Zapletalová.",
    keywords: "jóga, yoga, Kroměříž, jóga s pomůckami, kurzy jógy, Barbora Zapletalová, Vodní ulice, wellness, meditace, jógové studio",
    ogTitle: "TaYoga - Jógové studio Kroměříž | Barbora Zapletalová",
    ogDescription: "Jógové studio TaYoga ve Vodní ulici v Kroměříži. Kurzy jógy s pomůckami pro začátečníky, pokročilé i seniory.",
    ogImage: "https://tayoga.cz/og-image.jpg",
    canonicalPath: "/"
  },
  "/o-studiu": {
    title: "O studiu TaYoga - Jóga v Kroměříži | TaYoga",
    description: "Poznejte jógové studio TaYoga v Kroměříži. Moderní prostory ve Vodní ulici, kde se věnujeme józe s pomůckami. Přijďte na zkušební lekci!",
    keywords: "jógové studio, TaYoga Kroměříž, Vodní ulice, jóga s pomůckami, moderní studio, zkušební lekce",
    ogTitle: "O studiu TaYoga - Jóga v Kroměříži",
    ogDescription: "Moderní jógové studio v srdci Kroměříže. Jóga s pomůckami pro všechny úrovně.",
    ogImage: "https://tayoga.cz/og-image.jpg",
    canonicalPath: "/o-studiu"
  },
  "/lektorka": {
    title: "Lektorka Barbora Zapletalová - Certifikovaná instruktorka jógy | TaYoga",
    description: "Barbora Zapletalová, certifikovaná lektorka jógy s dlouholetou praxí. Specializace na jógu s pomůckami. Osobní přístup ke každému studentovi.",
    keywords: "Barbora Zapletalová, lektorka jógy, instruktorka jógy Kroměříž, certifikace jóga",
    ogTitle: "Barbora Zapletalová - Certifikovaná instruktorka jógy",
    ogDescription: "Certifikovaná lektorka jógy s osobním přístupem. Specializace na jógu s pomůckami.",
    ogImage: "https://tayoga.cz/og-image.jpg",
    canonicalPath: "/lektorka"
  },
  "/lekce": {
    title: "Jógové lekce - Co vás čeká na hodinách | TaYoga Kroměříž",
    description: "Objevte, co vás čeká na jógových lekcích v TaYoga. Lekce pro začátečníky i pokročilé, jóga pro seniory, používání pomůcek. Přátelská atmosféra a individuální přístup.",
    keywords: "jógové lekce, hodiny jógy Kroměříž, lekce pro začátečníky, jóga pro seniory, skupinové lekce jógy",
    ogTitle: "Jógové lekce v TaYoga - Pro začátečníky i pokročilé",
    ogDescription: "Poznejte naše jógové lekce. Pro všechny úrovně, přátelská atmosféra, moderní pomůcky.",
    ogImage: "https://tayoga.cz/og-image.jpg",
    canonicalPath: "/lekce"
  },
  "/unikatnost": {
    title: "Proč právě TaYoga? Unikátnost našeho studia | Kroměříž",
    description: "Zjistěte, co dělá TaYoga jedinečným. Individuální přístup, kvalitní pomůcky, malé skupiny, certifikovaná lektorka. Jóga jinak v centru Kroměříže.",
    keywords: "unikátní jógové studio, individuální přístup, kvalitní pomůcky jóga, malé skupiny, Kroměříž",
    ogTitle: "Proč TaYoga? Unikátnost našeho studia",
    ogDescription: "Individuální přístup, kvalitní pomůcky, malé skupiny. Objevte, co nás odlišuje.",
    ogImage: "https://tayoga.cz/og-image.jpg",
    canonicalPath: "/unikatnost"
  },
  "/rozvrh": {
    title: "Rozvrh lekcí - Termíny jógových hodin | TaYoga Kroměříž",
    description: "Aktuální rozvrh jógových lekcí v TaYoga Kroměříž. Ranní i večerní hodiny, víkendové lekce. Rezervujte si svůj čas online nebo zavolejte.",
    keywords: "rozvrh jógy, termíny lekcí, hodiny jógy Kroměříž, rezervace jóga, časy lekcí",
    ogTitle: "Rozvrh jógových lekcí TaYoga Kroměříž",
    ogDescription: "Aktuální rozvrh lekcí. Najděte si čas, který vám vyhovuje. Ranní, večerní i víkendové hodiny.",
    ogImage: "https://tayoga.cz/og-image.jpg",
    canonicalPath: "/rozvrh"
  },
  "/kontakt": {
    title: "Kontakt - Rezervace a informace | TaYoga Kroměříž",
    description: "Kontaktujte nás a rezervujte si jógovou lekci. TaYoga studio v Kroměříži, Vodní ulice. Telefon, email, mapa. Těšíme se na vás!",
    keywords: "kontakt jóga Kroměříž, rezervace lekce, telefon TaYoga, adresa studio, Vodní ulice Kroměříž",
    ogTitle: "Kontakt - Rezervujte si lekci v TaYoga",
    ogDescription: "Kontaktujte nás a rezervujte si jógovou lekci. Vodní ulice, Kroměříž. Těšíme se na vás!",
    ogImage: "https://tayoga.cz/og-image.jpg",
    canonicalPath: "/kontakt"
  }
};

// Získat metadata pro danou cestu
export const getMetadataForPath = (path: string): SEOMetadata => {
  return SEO_METADATA[path] || SEO_METADATA["/"];
};
