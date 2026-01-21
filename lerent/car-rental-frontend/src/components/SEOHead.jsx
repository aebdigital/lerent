import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SEOHead = ({ 
  title = 'Lerent autopožičovňa - Prenájom áut Nitra | Luxusné vozidlá',
  description = 'Prenájom áut v Nitre s Lerent. Luxusné vozidlá, profesionálne služby, konkurenčné ceny. BMW, Audi, Mercedes a ďalšie prémiové značky. Rezervujte si auto už dnes!',
  keywords = 'prenájom áut Nitra, autopožičovňa Nitra, luxusné vozidlá, BMW prenájom, Audi prenájom, Mercedes prenájom, car rental Nitra',
  image = '/main-page-final1.jpg',
  url = 'https://lerent.sk',
  type = 'website',
  author = 'Lerent',
  locale = 'sk_SK',
  schema = null // New prop for custom schema
}) => {
  const location = useLocation();
  const currentUrl = `${url}${location.pathname}`;
  
  // Default structured data
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "CarRental",
    "name": "Lerent",
    "description": "Prenájom luxusných áut v Nitre. Profesionálne služby, konkurenčné ceny.",
    "url": url,
    "logo": `${url}/logoRENT.svg`,
    "image": `${url}${image}`,
    "telephone": "+421 902 609 837",
    "email": "info@lerent.sk",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Nitra",
      "postalCode": "94901",
      "addressCountry": "SK"
    },
    "openingHours": [
      "Mo-Fr 08:00-18:00",
      "Sa 09:00-16:00"
    ],
    "priceRange": "€€€",
    "sameAs": [
      "https://www.facebook.com/lerent",
      "https://www.instagram.com/lerent"
    ]
  };

  const schemaData = schema || defaultSchema;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content="Slovak" />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={image.startsWith('http') ? image : `${url}${image}`} />
      <meta property="og:site_name" content="Lerent" />
      <meta property="og:locale" content={locale} />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image.startsWith('http') ? image : `${url}${image}`} />

      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

export default SEOHead;