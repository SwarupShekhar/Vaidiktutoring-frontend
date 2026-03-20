import { MetadataRoute } from "next";
import { getAllSitemapEntries } from "./lib/sitemap-generator";

/**
 * Sitemap generation using Hybrid Approach:
 * - Manual entries for high-priority pages (defined in sitemap-generator.ts)
 * - Auto-generated entries by scanning src/app directory
 * - Dynamic entries from blog posts (fetched from API)
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getAllSitemapEntries();
}
