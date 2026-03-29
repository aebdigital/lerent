import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const SEOHead = ({
  title,
  description,
  keywords,
  image = '/main-page-final1.jpg',
  url = 'https://lerent.sk',
  type = 'website',
  author = 'Lerent',
  locale: localeProp,
  schema = null
}) => {
  const location = useLocation();
  const { language, t } = useLanguage();
  const currentUrl = `${url}${location.pathname}`;
  const resolvedLocale = localeProp || (language === 'en' ? 'en_GB' : 'sk_SK');
  const resolvedTitle = title || t('seo.home.title');
  const resolvedDescription = description || t('seo.home.description');
  const resolvedKeywords = keywords || t('seo.home.keywords');
  const langLabel = language === 'en' ? 'English' : 'Slovak';

  // Default structured data
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "CarRental",
    "name": "Lerent",
    "description": language === 'en' ? "Premium car rental in Nitra. Professional services, competitive prices." : "Prenájom luxusných áut v Nitre. Profesionálne služby, konkurenčné ceny.",
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
      <html lang={language} />
      <title>{resolvedTitle}</title>
      <meta name="description" content={resolvedDescription} />
      <meta name="keywords" content={resolvedKeywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content={langLabel} />

      {/* Open Graph */}
      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={image.startsWith('http') ? image : `${url}${image}`} />
      <meta property="og:site_name" content="Lerent" />
      <meta property="og:locale" content={resolvedLocale} />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
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