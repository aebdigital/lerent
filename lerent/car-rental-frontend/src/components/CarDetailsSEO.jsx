import { useEffect } from 'react';
import { generateCarProductSchema, generateWebPageSchema } from '../utils/seoOptimizations';

const CarDetailsSEO = ({ car, baseUrl = 'https://lerent.sk' }) => {
  useEffect(() => {
    if (!car) return;

    const carName = `${car.brand} ${car.model} ${car.year || ''}`;
    const carDescription = car.description || `Prenájom ${carName} - luxusné vozidlo s profesionálnymi službami. Výhodné ceny, plné poistenie, 24/7 podpora.`;
    
    // Update document title
    document.title = `${carName} - Prenájom | Lerent autopožičovňa Nitra`;
    
    // Update meta tags
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

    // Basic SEO meta tags
    updateMetaTag('description', carDescription, true);
    updateMetaTag('keywords', `${carName}, prenájom ${car.brand}, ${car.model} prenájom, autopožičovňa Nitra, ${car.category || ''} vozidlo`, true);
    
    // Open Graph tags
    updateMetaTag('og:title', `${carName} - Prenájom | Lerent autopožičovňa`);
    updateMetaTag('og:description', carDescription);
    updateMetaTag('og:type', 'product');
    updateMetaTag('og:url', `${baseUrl}/car/${car._id || car.id}`);
    
    // Car images for social sharing
    if (car.images && car.images.length > 0) {
      updateMetaTag('og:image', car.images[0].url || car.images[0]);
      updateMetaTag('twitter:image', car.images[0].url || car.images[0], true);
    }
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image', true);
    updateMetaTag('twitter:title', `${carName} - Prenájom | Lerent`, true);
    updateMetaTag('twitter:description', carDescription, true);

    // Canonical URL
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', `${baseUrl}/car/${car._id || car.id}`);

    // Structured Data - Car Product Schema
    const carSchema = generateCarProductSchema(car, baseUrl);
    
    // WebPage Schema
    const webPageSchema = generateWebPageSchema({
      title: `${carName} - Prenájom | Lerent autopožičovňa`,
      description: carDescription,
      url: `/car/${car._id || car.id}`,
      breadcrumbs: [
        { name: 'Domov', url: baseUrl },
        { name: 'Autá', url: `${baseUrl}/#cars` },
        { name: carName, url: `${baseUrl}/car/${car._id || car.id}` }
      ]
    }, baseUrl);

    // Combined Schema
    const combinedSchema = {
      "@context": "https://schema.org",
      "@graph": [carSchema, webPageSchema]
    };

    // Remove existing JSON-LD script
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new JSON-LD script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(combinedSchema);
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      // Optional: Clean up dynamic meta tags when component unmounts
      // This prevents meta tag accumulation in single-page apps
    };

  }, [car, baseUrl]);

  return null;
};

export default CarDetailsSEO;