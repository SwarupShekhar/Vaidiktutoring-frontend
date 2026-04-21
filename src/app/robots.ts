import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://studyhours.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/parent/",
          "/students/",
          "/tutor/",
          "/suspended/",
          "/unauthorized/",
          "/verify-email/",
          "/change-password/",
          "/checkout/",
          "/bookings/",
          "/onboarding/",
          "/signup/",
          "/login/",
          "/search/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
