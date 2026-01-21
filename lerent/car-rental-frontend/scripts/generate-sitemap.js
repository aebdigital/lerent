#!/usr/bin/env node

// Script to generate sitemap.xml dynamically
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'cross-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = 'https://lerent.sk';
// Use the tenant email from env if possible, but here we run in node without full vite env loading unless we use dotenv. 
// Given the user request showed VITE_TENANT_EMAIL=lerent@lerent.sk, we'll hardcode or deduce it.
const tenantEmail = 'lerent@lerent.sk';
const apiUrl = `https://carflow-reservation-system.onrender.com/api/public/users/${tenantEmail}`;
const currentDate = new Date().toISOString().split('T')[0];

// Static pages configuration
const staticPages = [
  { url: '', priority: '1.0', changefreq: 'daily' },
  { url: '/sluzby', priority: '0.9', changefreq: 'weekly' },
  { url: '/faq', priority: '0.8', changefreq: 'monthly' },
  { url: '/booking', priority: '0.9', changefreq: 'daily' },
  { url: '/poistenie', priority: '0.7', changefreq: 'monthly' },
  { url: '/autouvery', priority: '0.7', changefreq: 'monthly' },
  { url: '/sprostredkovanie', priority: '0.7', changefreq: 'monthly' },
  { url: '/blog', priority: '0.6', changefreq: 'weekly' },
  { url: '/custom-page', priority: '0.5', changefreq: 'monthly' }, // Example of extending
  { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { url: '/terms', priority: '0.3', changefreq: 'yearly' },
  { url: '/cennik-poplatkov', priority: '0.6', changefreq: 'monthly' }
];

async function fetchData(endpoint) {
  try {
    const response = await fetch(`${apiUrl}${endpoint}`);
    if (!response.ok) throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(`❌ CRITICAL ERROR: Could not fetch ${endpoint}`, error.message);
    throw error; // Propagate error to fail the build
  }
}

async function getDynamicPages() {
  const pages = [];



  // Fetch Cars
  console.log('Fetching cars from:', `${apiUrl}/cars`);

  try {
    const response = await fetchData('/cars');

    if (response && response.success && Array.isArray(response.data)) {
      const cars = response.data;
      if (cars.length === 0) {
        console.warn('⚠️ Warning: API returned 0 cars. Sitemap will be empty for cars.');
      }

      cars.forEach(car => {
        pages.push({
          url: `/car/${car._id}`, // Using _id as ID
          priority: '0.8',
          changefreq: 'weekly'
        });
      });
      console.log(`✅ Added ${cars.length} cars`);
    } else {
      throw new Error('Unexpected response format: ' + JSON.stringify(response).substring(0, 100));
    }
  } catch (error) {
    console.error('🚨 FAILED to fetch cars for sitemap. Stopping build to prevent bad deployment.');
    console.error(error);
    process.exit(1); // Fail the build
  }

  // Fetch Blog Posts (Mock implementation if API endpoint doesn't exist yet, or real if it does)
  // Assuming /posts or /blog endpoint exists. If not, we might need to skip or use static fallback.
  // Based on the codebase, blog content seems hardcoded in BlogPostPage.jsx? 
  // Wait, BlogPostPage.jsx has `sample blog post data`. It's NOT fetching from API.
  // So I cannot fetch blog posts from API dynamically if they don't exist there.
  // I will skip blog fetching for now or hardcode the known IDs from the source file if I had them.
  // Since BlogPostPage has hardcoded ID=1, 2, 4, 6 etc. I should ideally extract them.
  // For now, I will add the static blog posts I saw in the file.

  const staticBlogIds = [1, 2, 4, 6];
  staticBlogIds.forEach(id => {
    pages.push({
      url: `/blog/${id}`,
      priority: '0.7',
      changefreq: 'monthly'
    });
  });

  return pages;
}

// Generate sitemap XML
async function generateSitemap() {
  const dynamicPages = await getDynamicPages();
  const allPages = [...staticPages, ...dynamicPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
}

// Write sitemap to file
async function writeSitemap() {
  try {
    const sitemap = await generateSitemap();
    const sitemapPath = path.join(__dirname, '../public/sitemap.xml');

    fs.writeFileSync(sitemapPath, sitemap, 'utf8');
    console.log('✅ Sitemap generated successfully at:', sitemapPath);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  writeSitemap();
}

export { generateSitemap, writeSitemap };