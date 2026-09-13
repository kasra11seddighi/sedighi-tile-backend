import { asyncHandler } from "../utils/asyncHandler";
import * as sitemapService from "../services/sitemap.service";
import { env } from "../config/env";

const SITE_URL = env.SITE_URL.replace(/\/+$/, ""); // حذف اسلش انتهایی احتمالی

// slug یا مقادیر دیگه ممکنه شامل کاراکترهای خاص XML باشن (& < > ' ")
// اگه encode نشن، فایل XML نامعتبر می‌شه.
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildUrlTag(loc: string, lastmod?: Date): string {
  const lastmodTag = lastmod
    ? `\n    <lastmod>${lastmod.toISOString()}</lastmod>`
    : "";
  return `  <url>\n    <loc>${escapeXml(loc)}</loc>${lastmodTag}\n  </url>`;
}

export const getSitemap = asyncHandler(async (_req, res) => {
  const { products, projects, magazines } = await sitemapService.getSitemapData();

  const staticPaths = [
    "",
    "/about",
    "/contact",
    "/products",
    "/brands",
    "/projects",
    "/magazine",
  ];

  const staticUrls = staticPaths.map((path) => buildUrlTag(`${SITE_URL}${path}`));

  const productUrls = products.map((item) =>
    buildUrlTag(`${SITE_URL}/products/${item.slug}`, item.updatedAt),
  );

  const projectUrls = projects.map((item) =>
    buildUrlTag(`${SITE_URL}/projects/${item.slug}`, item.updatedAt),
  );

  const magazineUrls = magazines.map((item) =>
    buildUrlTag(`${SITE_URL}/magazine/${item.slug}`, item.updatedAt),
  );

  const body = [...staticUrls, ...productUrls, ...projectUrls, ...magazineUrls].join(
    "\n",
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;

  res.status(200).set("Content-Type", "application/xml").send(xml);
});
