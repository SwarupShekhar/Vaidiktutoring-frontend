import { MetadataRoute } from "next";

const PRIVATE_PATHS = [
  "/api/",
  "/admin/",
  "/parent/",
  "/students/",
  "/tutor/",
  "/suspended/",
  "/unauthorized/",
  "/verify-email/",
  "/verify-phone/",
  "/change-password/",
  "/checkout/",
  "/bookings/",
  "/onboarding/",
  "/signup/",
  "/login/",
  "/search/",
  "/enroll/",
  "/session/",
];

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://studyhours.com";
  return {
    rules: [
      // Explicitly allow key AI search crawlers — needed for Google AI Overviews,
      // ChatGPT web search, and Perplexity citations.
      { userAgent: "GPTBot", allow: "/", disallow: PRIVATE_PATHS },
      { userAgent: "OAI-SearchBot", allow: "/", disallow: PRIVATE_PATHS },
      { userAgent: "ChatGPT-User", allow: "/", disallow: PRIVATE_PATHS },
      { userAgent: "ClaudeBot", allow: "/", disallow: PRIVATE_PATHS },
      { userAgent: "PerplexityBot", allow: "/", disallow: PRIVATE_PATHS },
      // Block training-only crawlers (not search features)
      { userAgent: "CCBot", disallow: "/" },
      { userAgent: "anthropic-ai", disallow: "/" },
      // Default rule for all other crawlers
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
