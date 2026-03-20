/**
 * Sitemap Generator Utility
 * Hybrid Approach: Manual entries for high-priority pages + Auto-generated for other pages
 */

import fs from "fs";
import path from "path";
import { MetadataRoute } from "next";

interface BlogPost {
  id: string;
  slug: string;
  createdAt?: string;
  created_at?: string;
}

interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency:
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "always"
    | "hourly"
    | "never";
  priority: number;
}

/**
 * Configuration for manual/high-priority pages
 * These pages will have custom priority and changeFrequency
 */
const MANUAL_PAGES: Record<
  string,
  { priority: number; changeFrequency: SitemapEntry["changeFrequency"] }
> = {
  "/": { priority: 1, changeFrequency: "daily" },
  "/blogs": { priority: 0.9, changeFrequency: "daily" },
  "/subjects": { priority: 0.8, changeFrequency: "weekly" },
  "/experts": { priority: 0.8, changeFrequency: "weekly" },
  "/about": { priority: 0.7, changeFrequency: "monthly" },
  "/methodology": { priority: 0.7, changeFrequency: "monthly" },
  "/pricing": { priority: 0.8, changeFrequency: "weekly" },
  "/careers": { priority: 0.6, changeFrequency: "monthly" },
  "/contact": { priority: 0.6, changeFrequency: "monthly" },
  "/privacy": { priority: 0.4, changeFrequency: "monthly" },
  "/terms": { priority: 0.4, changeFrequency: "monthly" },
  "/cookies": { priority: 0.4, changeFrequency: "monthly" },
  "/signup": { priority: 0.7, changeFrequency: "weekly" },
  "/login": { priority: 0.6, changeFrequency: "monthly" },
  "/k-12-online-tutoring": { priority: 0.8, changeFrequency: "weekly" },
  "/gcse-online-tutoring": { priority: 0.8, changeFrequency: "weekly" },
  "/igcse-online-tutoring": { priority: 0.7, changeFrequency: "weekly" },
  "/a-level-online-tutoring": { priority: 0.8, changeFrequency: "weekly" },
  "/resources/ib-tutors-online": { priority: 0.7, changeFrequency: "weekly" },
};

/**
 * Paths to exclude from sitemap generation
 */
const EXCLUDED_PATHS = [
  "/api",
  "/admin",
  "/login",
  "/signup",
  "/unauthorized",
  "/blog",
  "/404",
  "/500",
  "/_next",
  "/_vercel",
];

/**
 * Dynamic route patterns to exclude or handle specially
 */
const DYNAMIC_ROUTE_PATTERNS = [
  "/blogs/[",
  "/admin/",
  "/bookings/",
  "/parent/",
  "/student/",
  "/tutor/",
  "/sessions/",
  "/experts/[",
  "/subjects/[",
  "/programs/[",
];

/**
 * Check if a path should be excluded from sitemap
 */
function isExcluded(pathname: string): boolean {
  return EXCLUDED_PATHS.some((excluded) => pathname.startsWith(excluded));
}

/**
 * Check if a path is a dynamic route
 */
function isDynamicRoute(pathname: string): boolean {
  return DYNAMIC_ROUTE_PATTERNS.some((pattern) => pathname.includes(pattern));
}

/**
 * Determine default priority based on route depth
 * Deeper routes get lower priority
 */
function getDefaultPriority(route: string): number {
  const depth = route.split("/").filter(Boolean).length;
  switch (depth) {
    case 0: // root
      return 1;
    case 1:
      return 0.8;
    case 2:
      return 0.6;
    default:
      return 0.5;
  }
}

/**
 * Determine default change frequency based on route
 */
function getDefaultChangeFrequency(
  route: string,
): SitemapEntry["changeFrequency"] {
  if (route.includes("blog")) return "weekly";
  if (route.includes("pricing")) return "weekly";
  if (route.includes("contact")) return "monthly";
  return "monthly";
}

/**
 * Scan the app directory and generate sitemap entries for all pages
 */
export function generateSitemapEntries(
  baseUrl: string,
  now: string,
): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  const appDir = path.join(process.cwd(), "src", "app");
  const seenUrls = new Set<string>();

  function scanDirectory(dir: string, currentRoute: string = ""): void {
    if (!fs.existsSync(dir)) return;

    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        // Skip route groups (folder names starting with parenthesis)
        if (item.name.startsWith("(") && item.name.endsWith(")")) {
          scanDirectory(fullPath, currentRoute);
          continue;
        }

        // Skip dynamic segments: [id], [...slug], [[...catchall]]
        if (item.name.charAt(0) === "[") {
          continue;
        }

        // Skip private/routes
        if (item.name.startsWith("_")) {
          continue;
        }

        const newRoute =
          currentRoute === "" ? item.name : `${currentRoute}/${item.name}`;

        // Check if this directory contains a page file
        const hasPageFile = ["page.tsx", "page.js", "page.ts", "page.jsx"].some(
          (file) => fs.existsSync(path.join(fullPath, file)),
        );

        if (hasPageFile) {
          // Check exclusions
          if (isExcluded(newRoute) || isDynamicRoute(newRoute)) {
            scanDirectory(fullPath, newRoute);
            continue;
          }

          // Check if this page is in manual config
          const manualConfig = MANUAL_PAGES[`/${newRoute}`];

          if (!seenUrls.has(newRoute)) {
            seenUrls.add(newRoute);
            entries.push({
              url: `${baseUrl}/${newRoute}`,
              lastModified: now,
              changeFrequency:
                manualConfig?.changeFrequency ||
                getDefaultChangeFrequency(newRoute),
              priority: manualConfig?.priority || getDefaultPriority(newRoute),
            });
          }
        }

        // Continue scanning subdirectories
        scanDirectory(fullPath, newRoute);
      }
    }
  }

  scanDirectory(appDir);
  return entries;
}

/**
 * Fetch blog posts from backend
 */
async function getBlogs(): Promise<BlogPost[]> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://k-12-backend.onrender.com";
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${baseUrl}/blogs?page=1&limit=100`, {
      next: { revalidate: 3600 },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error("Failed to fetch blogs");
    const data = await res.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error("Sitemap: Failed to fetch blogs", error);
    return [];
  }
}

/**
 * Get all sitemap entries combining manual, auto-generated, and blog entries
 */
export async function getAllSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  // Validate required environment variable
  if (!baseUrl) {
    const errorMsg = "Sitemap Error: NEXT_PUBLIC_APP_URL environment variable is missing.";
    console.error(errorMsg);
    
    if (process.env.NODE_ENV === "production") {
      // In production, we MUST have a valid base URL for SEO.
      // If the env var is missing, use the known production domain as a safety fallback
      // but keep the error log loud.
      const fallbackUrl = "https://studyhours.com";
      return getAllSitemapEntriesWithUrl(fallbackUrl);
    }
    
    // In development, return empty or a localhost default
    return [];
  }

  return getAllSitemapEntriesWithUrl(baseUrl);
}

/**
 * Internal helper to generate entries with a confirmed baseUrl
 */
async function getAllSitemapEntriesWithUrl(baseUrl: string): Promise<MetadataRoute.Sitemap> {

  const now = new Date().toISOString();

  // 1. Get blog posts from backend
  const blogs = await getBlogs();

  // 2. Generate auto-entries from app directory
  const autoEntries = generateSitemapEntries(baseUrl, now);

  // 3. Create manual entries (these override auto-entries for specific URLs)
  const manualEntries: SitemapEntry[] = Object.entries(MANUAL_PAGES).map(
    ([route, config]) => ({
      url: `${baseUrl}${route}`,
      lastModified: now,
      changeFrequency: config.changeFrequency,
      priority: config.priority,
    }),
  );

  // 4. Create blog entries
  const blogEntries: MetadataRoute.Sitemap = blogs
    .filter((blog: BlogPost) => blog.slug)
    .map((blog: BlogPost) => ({
      url: `${baseUrl}/blogs/${blog.slug}`,
      lastModified: blog.createdAt || blog.created_at || now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  // 5. Combine: manual entries override auto-entries for the same URL
  const sitemapMap = new Map<string, SitemapEntry>();

  // First add auto-entries
  for (const entry of autoEntries) {
    sitemapMap.set(entry.url, entry);
  }

  // Then override with manual entries
  for (const entry of manualEntries) {
    sitemapMap.set(entry.url, entry);
  }

  // Convert to array
  const staticPages = Array.from(sitemapMap.values());

  return [...staticPages, ...blogEntries];
}
