import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'placehold.co' },
      // Razorpay domains
      { protocol: 'https', hostname: 'checkout.razorpay.com' },
      { protocol: 'https', hostname: 'api.razorpay.com' },
      // Clerk domains
      { protocol: 'https', hostname: 'clerk.studyhours.com' },
      { protocol: 'https', hostname: 'js.clerk.com' },
      { protocol: 'https', hostname: 'api.clerk.com' },
      // Mixkit media domains
      { protocol: 'https', hostname: 'assets.mixkit.co' },
    ],
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://clerk.studyhours.com https://js.clerk.com https://challenges.cloudflare.com https://turnstile.cloudflare.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https:",
              "font-src 'self' https://fonts.gstatic.com data:",
              "connect-src 'self' https://api.razorpay.com https://clerk.studyhours.com https://api.clerk.com https://challenges.cloudflare.com https://turnstile.cloudflare.com https://k-12-backend.onrender.com https://va.vercel-scripts.com",
              "frame-src 'self' https://checkout.razorpay.com https://api.razorpay.com https://clerk.studyhours.com https://challenges.cloudflare.com https://turnstile.cloudflare.com",
              "media-src 'self' https://assets.mixkit.co blob:",
              "worker-src 'self' blob:",
            ].join('; '),
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  // Suppresses source map uploading logs during build
  silent: true,
  org: "k12-tutoring", // Mock org
  project: "k12-frontend", // Mock project

  // -- Sentry SDK Options --
  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
  tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,
});
