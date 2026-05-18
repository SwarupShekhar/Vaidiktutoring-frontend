import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: process.cwd(),
  },
  compiler: {
    styledComponents: true,
  },
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
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
  // Redirects
  async redirects() {
    return [
      {
        source: '/blog',
        destination: '/blogs',
        permanent: true,
      },
      {
        source: '/blog/:slug*',
        destination: '/blogs/:slug*',
        permanent: true,
      },
      {
        source: '/resources/ib-tutors-online',
        destination: '/ib-online-tutoring',
        permanent: true,
      },
      {
        source: '/uae/saudi-ministry-curriculum-tutors',
        destination: '/saudi/saudi-ministry-curriculum-tutors',
        permanent: true,
      },
      {
        source: '/uae/online-tutors-riyadh',
        destination: '/saudi/online-tutors-riyadh',
        permanent: true,
      },
    ];
  },
  // Security headers
  async headers() {
    return [
      {
        // Ensure pdf.js worker is served with correct MIME type on all hosts
        source: '/pdf.worker.min.mjs',
        headers: [
          { key: 'Content-Type', value: 'application/javascript' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://*.clerk.accounts.dev https://clerk.studyhours.com https://js.clerk.com https://challenges.cloudflare.com https://turnstile.cloudflare.com https://*.daily.co https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.daily.co",
              "img-src 'self' data: blob: https: https://*.daily.co",
              "font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com https://*.daily.co data:",
              "connect-src 'self' data: blob: https://api.razorpay.com https://*.clerk.accounts.dev https://clerk.studyhours.com https://api.clerk.com https://challenges.cloudflare.com https://turnstile.cloudflare.com https://api.studyhours.com wss://api.studyhours.com https://va.vercel-scripts.com https://*.daily.co wss://*.daily.co https://placehold.co https://ipapi.co https://www.google-analytics.com https://*.sentry.io https://ip-api.com https://*.blob.core.windows.net https://*.northflank.app wss://*.northflank.app",
              "frame-src 'self' https://checkout.razorpay.com https://api.razorpay.com https://*.clerk.accounts.dev https://clerk.studyhours.com https://challenges.cloudflare.com https://turnstile.cloudflare.com https://*.daily.co",
              "media-src 'self' data: blob: https://assets.mixkit.co https://commondatastorage.googleapis.com https://*.daily.co https://*.blob.core.windows.net",
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
