import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = process.env.SITE_DOMAIN || 'https://thebloomstore.shop';

function toXmlText(unsafe) {
  return String(unsafe)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '<')
    .replaceAll('>', '>')
    .replaceAll('"', '"')
    .replaceAll("'", '&apos;');
}

function buildUrl(locPath) {
  if (locPath.startsWith('http://') || locPath.startsWith('https://')) return locPath;
  if (!locPath.startsWith('/')) locPath = `/${locPath}`;
  return `${DOMAIN}${locPath}`;
}

function lastmodISO(d = new Date()) {
  try {
    return new Date(d).toISOString();
  } catch {
    return new Date().toISOString();
  }
}

async function getProductIds() {
  // Prefer local static data to avoid network/build-time failures.
  // This still gives deterministic product pages for sitemap.
  const localProductsPath = path.resolve(__dirname, '../src/data/products.js');
  try {
    const mod = await import(pathToFileUrl(localProductsPath));
    const prods = mod.products || [];
    return prods.map((p) => p.id).filter(Boolean);
  } catch {
    return [];
  }
}

function pathToFileUrl(p) {
  const resolved = path.resolve(p);
  const prefix = process.platform === 'win32' ? 'file:///' : 'file://';
  return `${prefix}${resolved.replaceAll('\\', '/')}`;
}

async function generate() {
  const publicStaticRoutes = [
    '/',
    '/shop',
    '/about',
    '/contact',
    '/faq',
    '/shipping',
    '/returns',
    '/privacy',
    '/success',
    '/order-tracking',
  ];

  const productDetailTemplate = '/product/{id}';

  // Exclusion rules
  const isExcluded = (p) => {
    const s = p.toLowerCase();
    return (
      s.startsWith('/admin') ||
      s.startsWith('/dashboard') ||
      s.startsWith('/auth') ||
      s.startsWith('/private') ||
      s.includes('admin/')
    );
  };

  const urls = new Map();

  for (const route of publicStaticRoutes) {
    if (isExcluded(route)) continue;
    const loc = buildUrl(route);
    urls.set(loc, {
      loc,
      lastmod: lastmodISO(),
      changefreq: 'weekly',
      priority: route === '/' ? '1.0' : '0.8',
    });
  }

  const productIds = await getProductIds();
  for (const id of productIds) {
    if (!id) continue;
    const route = productDetailTemplate.replace('{id}', encodeURIComponent(id));
    if (isExcluded(route)) continue;
    const loc = buildUrl(route);
    urls.set(loc, {
      loc,
      lastmod: lastmodISO(),
      changefreq: 'weekly',
      priority: '0.7',
    });
  }

  // Vercel/CDN friendly deterministic sitemap output.
  const distDir = path.resolve(__dirname, '../dist');
  fs.mkdirSync(distDir, { recursive: true });
  console.log('Generating sitemap into:', distDir);

  const entries = Array.from(urls.values()).sort((a, b) => a.loc.localeCompare(b.loc));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    entries
      .map((u) => {
        return (
          `  <url>\n` +
          `    <loc>${toXmlText(u.loc)}</loc>\n` +
          `    <lastmod>${toXmlText(u.lastmod)}</lastmod>\n` +
          `    <changefreq>${toXmlText(u.changefreq)}</changefreq>\n` +
          `    <priority>${toXmlText(u.priority)}</priority>\n` +
          `  </url>`
        );
      })
      .join('\n') +
    `\n</urlset>\n`;

  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml, 'utf8');
  console.log(`✅ sitemap.xml generated with ${entries.length} URLs at: ${path.join(distDir, 'sitemap.xml')}`);
}

generate().catch((err) => {
  console.error('❌ Failed to generate sitemap:', err);
  process.exit(1);
});

