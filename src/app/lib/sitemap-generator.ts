/**
 * Sitemap Generator Utility
 * Hybrid Approach: Manual entries for high-priority pages + Auto-generated for other pages
 */

import fs from "fs";
import path from "path";
import { MetadataRoute } from "next";
import { cmsApi } from "./cms";

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
  "/about": { priority: 0.7, changeFrequency: "monthly" },
  "/methodology": { priority: 0.7, changeFrequency: "monthly" },
  "/pricing": { priority: 0.8, changeFrequency: "weekly" },
  "/careers": { priority: 0.6, changeFrequency: "monthly" },
  "/contact": { priority: 0.6, changeFrequency: "monthly" },
  "/k-12-online-tutoring": { priority: 0.8, changeFrequency: "weekly" },
  "/gcse-online-tutoring": { priority: 0.8, changeFrequency: "weekly" },
  "/igcse-online-tutoring": { priority: 0.8, changeFrequency: "weekly" },
  "/a-level-online-tutoring": { priority: 0.8, changeFrequency: "weekly" },
  "/ib-online-tutoring": { priority: 0.8, changeFrequency: "weekly" },
  "/online-tutoring-uk": { priority: 0.9, changeFrequency: "weekly" },
  "/australia/vce-online-tutoring": { priority: 0.85, changeFrequency: "weekly" },
  "/australia/hsc-online-tutoring": { priority: 0.85, changeFrequency: "weekly" },
  "/australia/qce-online-tutoring": { priority: 0.85, changeFrequency: "weekly" },
  "/australia/wace-online-tutoring": { priority: 0.85, changeFrequency: "weekly" },
  "/australia/atar-online-tutoring": { priority: 0.85, changeFrequency: "weekly" },
  "/australia/curriculum-tutoring": { priority: 0.8, changeFrequency: "weekly" },
  "/singapore/psle-tutors-online": { priority: 0.85, changeFrequency: "weekly" },
  "/singapore/o-level-tutors-singapore": { priority: 0.85, changeFrequency: "weekly" },
  "/singapore/a-level-tutors-singapore": { priority: 0.85, changeFrequency: "weekly" },
  "/singapore/ip-programme-tutors-singapore": { priority: 0.8, changeFrequency: "weekly" },
  "/singapore/moe-singapore-curriculum-tutors": { priority: 0.8, changeFrequency: "weekly" },
  "/singapore/primary-school-tutors-singapore": { priority: 0.8, changeFrequency: "weekly" },
  "/singapore-jc-guide": { priority: 0.95, changeFrequency: "weekly" },
  "/uae/moe-uae-curriculum-tutors": { priority: 0.85, changeFrequency: "weekly" },
  "/saudi/saudi-ministry-curriculum-tutors": { priority: 0.85, changeFrequency: "weekly" },
  "/uae/online-tutors-dubai": { priority: 0.85, changeFrequency: "weekly" },
  "/uae/online-tutors-abu-dhabi": { priority: 0.85, changeFrequency: "weekly" },
  "/uae/physics-maths-tutor": { priority: 0.85, changeFrequency: "weekly" },
  "/saudi/online-tutors-riyadh": { priority: 0.8, changeFrequency: "weekly" },
};

/**
 * Paths to exclude from sitemap generation
 */
const EXCLUDED_PATHS = [
  "/api",
  "/admin",
  "/parent",
  "/school",
  "/students",
  "/tutor",
  "/suspended",
  "/unauthorized",
  "/verify-email",
  "/change-password",
  "/checkout",
  "/bookings",
  "/onboarding",
  "/signup",
  "/login",
  "/search",
  "/privacy",
  "/terms",
  "/cookies",
  "/signup/check-inbox",
  "/blog",
  "/experts",
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
          const routeWithSlash = `/${newRoute}`;
          // Check exclusions
          if (isExcluded(routeWithSlash) || isDynamicRoute(routeWithSlash)) {
            scanDirectory(fullPath, newRoute);
            continue;
          }

          // Check if this page is in manual config
          const manualConfig = MANUAL_PAGES[routeWithSlash];

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
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://api.studyhours.com";

  // Use a very short timeout for sitemap generation to avoid blocking the build
  const timeoutMs = 5000;
  
  try {
    // Create a promise that resolves after the timeout
    const timeoutPromise = new Promise<BlogPost[]>((resolve) =>
      setTimeout(() => {
        console.warn(`Sitemap: Blog fetch timed out after ${timeoutMs}ms. Using static pages only.`);
        resolve([]);
      }, timeoutMs)
    );

    // Create the actual fetch promise
    const fetchPromise = (async () => {
      try {
        const res = await fetch(`${baseUrl}/blogs?page=1&limit=100&status=PUBLISHED`, {
          next: { revalidate: 3600 },
        });
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : data.data || [];
      } catch (e) {
        return [];
      }
    })();

    // Race them
    return await Promise.race([fetchPromise, timeoutPromise]);
  } catch (error) {
    return [];
  }
}

/**
 * Fetch dynamic PDF resource lead magnets from backend
 */
interface SitemapResource {
  slug: string;
}

async function getResources(): Promise<SitemapResource[]> {
  const timeoutMs = 5000;

  try {
    const timeoutPromise = new Promise<SitemapResource[]>((resolve) =>
      setTimeout(() => {
        console.warn(`Sitemap: Dynamic landing pages fetch timed out after ${timeoutMs}ms. Skipping dynamic resources.`);
        resolve([]);
      }, timeoutMs)
    );

    const fetchPromise = cmsApi.getLandingPages().catch(() => []);

    return await Promise.race([fetchPromise, timeoutPromise]);
  } catch (error) {
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

  // 1. Get blog posts and programmatic landing pages from backend
  const blogs = await getBlogs();
  const resources = await getResources();

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

  // 5. Create dynamic resource entries
  const resourceEntries: MetadataRoute.Sitemap = resources
    .filter((res: SitemapResource) => res.slug)
    .map((res: SitemapResource) => ({
      url: `${baseUrl}/resources/${res.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  // 6. Combine: manual entries override auto-entries for the same URL
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

  return [...staticPages, ...blogEntries, ...resourceEntries];
}
