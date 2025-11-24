import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEOHead = ({ 
  title = 'Lerent autopožičovňa - Prenájom áut Košice | Luxusné vozidlá',
  description = 'Prenájom áut v Košiciach s Lerent. Luxusné vozidlá, profesionálne služby, konkurenčné ceny. BMW, Audi, Mercedes a ďalšie prémiové značky. Rezervujte si auto už dnes!',
  keywords = 'prenájom áut Košice, autopožičovňa Košice, luxusné vozidlá, BMW prenájom, Audi prenájom, Mercedes prenájom, car rental Košice',
  image = '/main page final1.jpg',
  url = 'https://lerent.sk',
  type = 'website',
  author = 'Lerent',
  locale = 'sk_SK'
}) => {
  const location = useLocation();
  const currentUrl = `${url}${location.pathname}`;
  
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update or create meta tags
    const updateMetaTag = (property, content, name = false) => {
      const selector = name ? `meta[name="${property}"]` : `meta[property="${property}"]`;
      let tag = document.querySelector(selector);
      
      if (!tag) {
        tag = document.createElement('meta');
        if (name) {
          tag.setAttribute('name', property);
        } else {
          tag.setAttribute('property', property);
        }
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    const updateLinkTag = (rel, href) => {
      let tag = document.querySelector(`link[rel="${rel}"]`);
      if (!tag) {
        tag = document.createElement('link');
        tag.setAttribute('rel', rel);
        document.head.appendChild(tag);
      }
      tag.setAttribute('href', href);
    };

    // Basic SEO meta tags
    updateMetaTag('description', description, true);
    updateMetaTag('keywords', keywords, true);
    updateMetaTag('author', author, true);
    updateMetaTag('robots', 'index, follow', true);
    updateMetaTag('googlebot', 'index, follow', true);
    updateMetaTag('bingbot', 'index, follow', true);
    updateMetaTag('language', 'Slovak', true);
    
    // Open Graph tags
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:type', type);
    updateMetaTag('og:url', currentUrl);
    updateMetaTag('og:image', image);
    updateMetaTag('og:image:alt', 'Lerent autopožičovňa - Prenájom luxusných áut v Košiciach');
    updateMetaTag('og:site_name', 'Lerent');
    updateMetaTag('og:locale', locale);
    updateMetaTag('og:image:width', '1200');
    updateMetaTag('og:image:height', '630');
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image', true);
    updateMetaTag('twitter:title', title, true);
    updateMetaTag('twitter:description', description, true);
    updateMetaTag('twitter:image', image, true);
    updateMetaTag('twitter:image:alt', 'Lerent autopožičovňa - Prenájom luxusných áut v Košiciach', true);
    
    // Additional SEO tags
    updateMetaTag('theme-color', '#FF5722', true);
    updateMetaTag('msapplication-TileColor', '#FF5722', true);
    updateMetaTag('mobile-web-app-capable', 'yes', true);
    updateMetaTag('apple-mobile-web-app-capable', 'yes', true);
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent', true);
    updateMetaTag('apple-mobile-web-app-title', 'Lerent', true);
    
    // Canonical URL
    updateLinkTag('canonical', currentUrl);
    
    // Structured Data (JSON-LD)
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "CarRental",
      "name": "Lerent",
      "description": "Prenájom luxusných áut v Košiciach. Profesionálne služby, konkurenčné ceny.",
      "url": url,
      "logo": `${url}/logoRENT.svg`,
      "image": `${url}${image}`,
      "telephone": "+421 XXX XXX XXX",
      "email": "info@lerent.sk",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Ulica 123",
        "addressLocality": "Košice",
        "postalCode": "04001",
        "addressCountry": "SK"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 48.7164,
        "longitude": 21.2611
      },
      "openingHours": [
        "Mo-Fr 08:00-18:00",
        "Sa 09:00-16:00"
      ],
      "priceRange": "€€€",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Prenájom áut",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Car",
              "name": "Luxusné vozidlá",
              "brand": ["BMW", "Audi", "Mercedes-Benz", "Maserati"]
            }
          }
        ]
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "127",
        "bestRating": "5",
        "worstRating": "1"
      },
      "sameAs": [
        "https://www.facebook.com/lerent",
        "https://www.instagram.com/lerent"
      ]
    };

    // Remove existing JSON-LD script
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new JSON-LD script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

  }, [title, description, keywords, image, currentUrl, url, type, author, locale]);

  return null;
};

export default SEOHead;