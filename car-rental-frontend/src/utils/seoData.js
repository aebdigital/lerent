// SEO data for different pages
export const seoData = {
  home: {
    title: 'Lerent autopožičovňa - Prenájom áut Nitra | Luxusné vozidlá',
    description: 'Prenájom áut v Nitre s Lerent. Luxusné vozidlá, profesionálne služby, konkurenčné ceny. BMW, Audi, Mercedes a ďalšie prémiové značky. Rezervujte si auto už dnes!',
    keywords: 'prenájom áut Nitra, autopožičovňa Nitra, luxusné vozidlá, BMW prenájom, Audi prenájom, Mercedes prenájom, car rental Nitra, lerent',
    type: 'website'
  },
  
  booking: {
    title: 'Rezervácia vozidla - Lerent autopožičovňa Nitra',
    description: 'Rezervujte si vozidlo online v autopožičovni Lerent. Jednoduchý proces rezervácie, flexibilné platby, okamžité potvrdenie. Prenájom áut Nitra.',
    keywords: 'rezervácia auta, booking car rental, prenájom vozidla online, rezervácia Nitra',
    type: 'website'
  },

  sluzby: {
    title: 'Naše služby - Lerent autopožičovňa | Komplexné služby pre prenájom áut',
    description: 'Objavte všetky naše služby: prenájom luxusných áut, dlhodobý prenájom, autopožičky, sprostredkovanie, poistenie. Profesionálne služby v Nitre.',
    keywords: 'služby autopožičovne, dlhodobý prenájom, autopožičky Nitra, sprostredkovanie áut, poistenie vozidiel',
    type: 'website'
  },

  faq: {
    title: 'Často kladené otázky - Lerent autopožičovňa | FAQ',
    description: 'Odpovede na najčastejšie otázky o prenájme áut. Podmienky prenájmu, dokumenty, poistenie, platby. Všetko čo potrebujete vedieť.',
    keywords: 'FAQ autopožičovňa, často kladené otázky, podmienky prenájmu, dokumenty na prenájom',
    type: 'website'
  },

  poistenie: {
    title: 'Poistenie vozidiel - Lerent autopožičovňa | Komplexné poistenie',
    description: 'Komplexné poistenie pre prenajímané vozidlá. Povinné zmluvné poistenie, havarijné poistenie, asistenčné služby. Bezpečný prenájom áut.',
    keywords: 'poistenie prenájom áut, havarijné poistenie, PZP, asistenčné služby, poistenie vozidiel Nitra',
    type: 'website'
  },

  autouvery: {
    title: 'Autoúvery - Lerent | Financovanie vozidiel na mieru',
    description: 'Výhodné autoúvery a financovanie vozidiel. Flexibilné splátky, rýchle schválenie, konkurenčné úrokové sadzby. Získajte auto už dnes.',
    keywords: 'autoúver, financovanie vozidla, úver na auto, leasing, splátky auto',
    type: 'website'
  },

  sprostredkovanie: {
    title: 'Sprostredkovanie nákupu - Lerent | Pomôžeme vám vybrať auto',
    description: 'Sprostredkovanie nákupu vozidiel. Pomôžeme vám nájsť a kúpiť ideálne vozidlo. Profesionálne poradenstvo, overenie vozidla, vybavenie dokladov.',
    keywords: 'sprostredkovanie nákupu auta, pomoc pri výbere auta, nákup vozidla, poradenstvo auto',
    type: 'website'
  },

  blog: {
    title: 'Blog - Lerent autopožičovňa | Tipy a rady pre vodičov',
    description: 'Blog o autách, prenájme a všetkom čo súvisí s vozidlami. Užitočné tipy, novinky z automobilového sveta, rady pre vodičov.',
    keywords: 'blog o autách, tipy pre vodičov, automobilový blog, novinky autá, rady prenájom',
    type: 'blog'
  },

  privacy: {
    title: 'Ochrana osobných údajov - Lerent autopožičovňa | GDPR',
    description: 'Zásady ochrany osobných údajov v súlade s GDPR. Ako spracovávame a chránime vaše osobné údaje pri prenájme vozidiel.',
    keywords: 'ochrana osobných údajov, GDPR, súkromie, spracovanie údajov',
    type: 'website'
  },

  terms: {
    title: 'Obchodné podmienky - Lerent autopožičovňa | Všeobecné podmienky',
    description: 'Všeobecné obchodné podmienky pre prenájom vozidiel. Práva a povinnosti, podmienky prenájmu, zmluvné ustanovenia.',
    keywords: 'obchodné podmienky, všeobecné podmienky, zmluva o prenájme, práva povinnosti',
    type: 'website'
  },

  cennik: {
    title: 'Cenník poplatkov - Lerent autopožičovňa | Prehľadný cenník',
    description: 'Prehľadný cenník všetkých poplatkov a služieb. Ceny prenájmu, dodatočné poplatky, zľavy, špeciálne ponuky.',
    keywords: 'cenník prenájom áut, ceny autopožičovne, poplatky prenájom, tarify vozidlá',
    type: 'website'
  }
};

// Generate sitemap data
export const generateSitemapData = () => {
  const baseUrl = 'https://lerent.sk';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const pages = [
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: '/sluzby', priority: '0.9', changefreq: 'weekly' },
    { url: '/faq', priority: '0.8', changefreq: 'monthly' },
    { url: '/booking', priority: '0.9', changefreq: 'daily' },
    { url: '/poistenie', priority: '0.7', changefreq: 'monthly' },
    { url: '/autouvery', priority: '0.7', changefreq: 'monthly' },
    { url: '/sprostredkovanie', priority: '0.7', changefreq: 'monthly' },
    { url: '/blog', priority: '0.6', changefreq: 'weekly' },
    { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
    { url: '/terms', priority: '0.3', changefreq: 'yearly' },
    { url: '/cennik-poplatkov', priority: '0.6', changefreq: 'monthly' }
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};

// Generate robots.txt content
export const generateRobotsTxt = () => {
  const baseUrl = 'https://lerent.sk';
  
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Block sensitive areas
Disallow: /admin/
Disallow: /api/
Disallow: /payment-success/
Disallow: /payment-cancelled/
Disallow: /bank-transfer-info/

# Crawl-delay for polite crawling
Crawl-delay: 1`;
};