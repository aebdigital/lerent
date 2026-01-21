# SEO Implementation Guide - Lerent Car Rental

This document outlines all the SEO optimizations implemented for the Lerent car rental website.

## 🎯 SEO Features Implemented

### 1. **Meta Tags & Open Graph**
- ✅ Comprehensive meta descriptions for all pages
- ✅ Open Graph tags for social media sharing
- ✅ Twitter Card support
- ✅ Proper viewport and charset meta tags
- ✅ Language attributes (`lang="sk"`)

### 2. **Structured Data (JSON-LD)**
- ✅ Business schema for car rental company
- ✅ Product schema for individual cars
- ✅ Review/rating schema
- ✅ FAQ schema (for FAQ page)
- ✅ Blog post schema (for blog articles)
- ✅ Breadcrumb schema

### 3. **Technical SEO**
- ✅ Sitemap.xml generation
- ✅ Robots.txt file
- ✅ Canonical URLs
- ✅ Proper heading hierarchy (H1, H2, H3...)
- ✅ Image alt attributes
- ✅ Performance optimizations (.htaccess)

### 4. **Content Optimization**
- ✅ SEO-friendly URLs
- ✅ Descriptive page titles
- ✅ Optimized keywords for Slovak market
- ✅ Local SEO (Košice references)

## 📁 Files Created/Modified

### New Components:
- `src/components/SEOHead.jsx` - Dynamic meta tag management
- `src/components/SEOWrapper.jsx` - Page-specific SEO wrapper
- `src/components/CarDetailsSEO.jsx` - Car detail page SEO

### New Utilities:
- `src/utils/seoData.js` - SEO data for all pages
- `src/utils/seoOptimizations.js` - SEO utility functions
- `scripts/generate-sitemap.js` - Automatic sitemap generation

### Public Files:
- `public/sitemap.xml` - Website sitemap
- `public/robots.txt` - Search engine instructions
- `public/_headers` - Netlify headers configuration (updated)
- `public/_redirects` - Netlify redirects (already existed)
- `public/main page final1.jpg` - Social sharing image
- `netlify.toml` - Netlify deployment configuration

### Modified Files:
- `index.html` - Enhanced with meta tags
- `src/App.jsx` - Integrated SEO wrapper
- `src/layouts/DefaultLayout.jsx` - Added SEO head
- `package.json` - Added sitemap generation script

## 🔧 How to Use

### Automatic SEO for Pages
Each page automatically gets SEO optimization when wrapped with `SEOWrapper`:

```jsx
<SEOWrapper page="home">
  <HomePage />
</SEOWrapper>
```

### Custom SEO for Specific Pages
```jsx
<SEOWrapper 
  page="home" 
  customSEO={{
    title: "Custom Page Title",
    description: "Custom description"
  }}
>
  <YourPage />
</SEOWrapper>
```

### For Car Detail Pages
```jsx
<CarDetailsSEO car={carData} />
```

## 🚀 Build Process

The sitemap is automatically generated during build:
```bash
npm run build  # Generates sitemap and builds app
npm run generate-sitemap  # Generate sitemap only
```

## 🎯 SEO Benefits

### Social Media Sharing
- Proper Open Graph tags ensure beautiful link previews
- Uses your specified sharing image (`main page final1.jpg`)
- Optimized for Facebook, LinkedIn, Twitter

### Search Engine Optimization
- Structured data helps search engines understand content
- Proper meta descriptions improve click-through rates
- Local SEO targets Košice market
- Sitemap helps with indexing

### Performance (Netlify-Optimized)
- `netlify.toml` includes asset compression and caching
- `_headers` file optimizes delivery
- Image lazy loading and compression
- Automatic HTTPS redirects
- Optimized meta tag management

## 🔍 SEO Data Structure

### Page SEO Data (`src/utils/seoData.js`):
```javascript
{
  title: "Page Title",
  description: "Page Description", 
  keywords: "relevant, keywords, here",
  type: "website" // or "blog", "product", etc.
}
```

### Available Pages:
- `home` - Homepage
- `sluzby` - Services page
- `faq` - FAQ page
- `booking` - Booking page
- `poistenie` - Insurance page
- `autouvery` - Car loans page
- `sprostredkovanie` - Brokerage page
- `blog` - Blog page
- `privacy` - Privacy policy
- `terms` - Terms of service
- `cennik` - Pricing page

## 📈 Monitoring & Maintenance

### Regular Tasks:
1. **Update Sitemap**: Run `npm run generate-sitemap` when adding new pages
2. **Monitor Performance**: Check Core Web Vitals in Google Search Console
3. **Review Meta Tags**: Ensure descriptions are compelling and under 160 characters
4. **Update Structured Data**: Keep business information current

### Tools to Monitor:
- Google Search Console
- Google PageSpeed Insights
- Rich Results Test (for structured data)
- Open Graph Debugger (Facebook)
- Twitter Card Validator

## 🌐 Multi-language Considerations

The current implementation is optimized for Slovak (`sk-SK` locale). To add other languages:

1. Extend `seoData.js` with language variants
2. Use `addHreflangTags()` utility from `seoOptimizations.js`
3. Add language-specific sitemaps

## ⚡ Performance Notes

- Meta tags are dynamically updated via JavaScript
- Structured data is injected client-side
- Images use lazy loading where possible
- Server-side caching configured in .htaccess

## 🔐 Security & SEO

Security headers in .htaccess file also improve SEO trust signals:
- HTTPS enforcement
- XSS protection
- Content type validation
- Frame protection

---

**Note**: This implementation provides excellent SEO foundation for a React SPA. For even better SEO, consider server-side rendering (SSR) with Next.js in future iterations.