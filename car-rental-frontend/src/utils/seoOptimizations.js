// SEO utility functions for enhanced optimization

// Generate breadcrumb schema
export const generateBreadcrumbSchema = (breadcrumbs) => {
  if (!breadcrumbs || breadcrumbs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "WebPage",
        "@id": crumb.url,
        "name": crumb.name
      }
    }))
  };
};

// Generate car product schema for individual car pages
export const generateCarProductSchema = (car, baseUrl = 'https://lerent.sk') => {
  if (!car) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${car.brand} ${car.model} ${car.year || ''}`,
    "description": car.description || `Prenájom ${car.brand} ${car.model} - luxusné vozidlo s profesionálnymi službami`,
    "brand": {
      "@type": "Brand",
      "name": car.brand
    },
    "model": car.model,
    "vehicleModelDate": car.year?.toString(),
    "category": car.category,
    "image": car.images && car.images.length > 0 ? car.images.map(img => img.url || img) : [],
    "offers": {
      "@type": "Offer",
      "priceCurrency": "EUR",
      "price": car.pricing?.dailyRate || car.dailyRate || "40",
      "priceSpecification": {
        "@type": "PriceSpecification",
        "price": car.pricing?.dailyRate || car.dailyRate || "40",
        "priceCurrency": "EUR",
        "unitText": "per day"
      },
      "availability": car.status === 'available' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Lerent",
        "url": baseUrl
      }
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Seats",
        "value": car.seats || "5"
      },
      {
        "@type": "PropertyValue", 
        "name": "Transmission",
        "value": car.transmission || "automatic"
      },
      {
        "@type": "PropertyValue",
        "name": "Fuel Type",
        "value": car.fuelType || "diesel"
      },
      {
        "@type": "PropertyValue",
        "name": "Power",
        "value": `${car.engine?.power || car.power || "140"} kW`
      }
    ]
  };
};

// Generate FAQ schema
export const generateFAQSchema = (faqs) => {
  if (!faqs || faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

// Generate service schema for business services
export const generateServiceSchema = (services, baseUrl = 'https://lerent.sk') => {
  if (!services || services.length === 0) return null;

  return services.map(service => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "description": service.description,
    "provider": {
      "@type": "Organization",
      "name": "Lerent",
      "url": baseUrl
    },
    "areaServed": {
      "@type": "Place",
      "name": "Nitra, Slovakia"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": service.name,
      "itemListElement": service.offerings || []
    }
  }));
};

// Generate review/rating schema
export const generateReviewSchema = (reviews, businessName = 'Lerent') => {
  if (!reviews || reviews.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": businessName,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length,
      "reviewCount": reviews.length,
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": reviews.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author || "Anonymous"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": "5",
        "worstRating": "1"
      },
      "reviewBody": review.text,
      "datePublished": review.date
    }))
  };
};

// Generate blog post schema
export const generateBlogPostSchema = (post, baseUrl = 'https://lerent.sk') => {
  if (!post) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description || post.excerpt,
    "image": post.image || `${baseUrl}/main-page-final1.jpg`,
    "author": {
      "@type": "Person",
      "name": post.author || "Lerent Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Lerent",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logoRENT.svg`
      }
    },
    "datePublished": post.publishedDate,
    "dateModified": post.modifiedDate || post.publishedDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${post.id}`
    }
  };
};

// Add hreflang attributes for internationalization (future use)
export const addHreflangTags = (currentLang = 'sk', alternateUrls = {}) => {
  // Remove existing hreflang tags
  document.querySelectorAll('link[hreflang]').forEach(tag => tag.remove());
  
  // Add new hreflang tags
  Object.entries(alternateUrls).forEach(([lang, url]) => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'alternate');
    link.setAttribute('hreflang', lang);
    link.setAttribute('href', url);
    document.head.appendChild(link);
  });

  // Add x-default if available
  if (alternateUrls['x-default']) {
    const link = document.createElement('link');
    link.setAttribute('rel', 'alternate');
    link.setAttribute('hreflang', 'x-default');
    link.setAttribute('href', alternateUrls['x-default']);
    document.head.appendChild(link);
  }
};

// Optimize images for better SEO and performance
export const optimizeImageSEO = (imgElement, alt, title = null, lazyLoad = true) => {
  if (!imgElement || !alt) return;

  imgElement.setAttribute('alt', alt);
  if (title) imgElement.setAttribute('title', title);
  
  // Add lazy loading for performance
  if (lazyLoad && 'loading' in HTMLImageElement.prototype) {
    imgElement.setAttribute('loading', 'lazy');
  }
  
  // Add decoding attribute for better rendering
  imgElement.setAttribute('decoding', 'async');
};

// Generate WebPage schema for any page
export const generateWebPageSchema = (pageData, baseUrl = 'https://lerent.sk') => {
  const { title, description, url, breadcrumbs, lastModified } = pageData;
  
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": `${baseUrl}${url}`,
    "dateModified": lastModified || new Date().toISOString(),
    "inLanguage": "sk-SK",
    "isPartOf": {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`
    },
    ...(breadcrumbs && breadcrumbs.length > 0 && {
      "breadcrumb": generateBreadcrumbSchema(breadcrumbs)
    })
  };
};