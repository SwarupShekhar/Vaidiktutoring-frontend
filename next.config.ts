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
  // Bundle the gated Paper 3 PDFs (served as email attachments, not from /public)
  // into the leads API route's serverless trace so readFile works in production.
  outputFileTracingIncludes: {
    '/api/leads': ['./private-assets/paper3/**'],
  },
  // Optimize heavy library imports — only the components actually used are bundled
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      'lucide-react',
      '@tanstack/react-query',
    ],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // Next 16 requires whitelisting any non-default quality values used via <Image quality>.
    // Lower qualities used on large decorative/content images to cut transfer bytes.
    qualities: [60, 65, 75],
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
      // Sanity image CDN
      { protocol: 'https', hostname: 'cdn.sanity.io' },
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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://*.clerk.accounts.dev https://clerk.studyhours.com https://js.clerk.com https://challenges.cloudflare.com https://turnstile.cloudflare.com https://*.daily.co https://www.googletagmanager.com https://www.google-analytics.com https://*.sanity.io https://*.sanity-cdn.com https://sanity-cdn.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.daily.co",
              "img-src 'self' data: blob: https: https://*.daily.co",
              "font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com https://*.daily.co data:",
              "connect-src 'self' data: blob: https://api.razorpay.com https://*.clerk.accounts.dev https://clerk.studyhours.com https://api.clerk.com https://challenges.cloudflare.com https://turnstile.cloudflare.com https://api.studyhours.com wss://api.studyhours.com https://va.vercel-scripts.com https://*.daily.co wss://*.daily.co https://placehold.co https://ipapi.co https://www.google-analytics.com https://*.sentry.io https://ip-api.com https://*.blob.core.windows.net https://*.northflank.app wss://*.northflank.app https://zperiod.studyhours.com https://cellstudio.studyhours.com https://zperiod-alpha.vercel.app https://*.sanity.io https://cdn.sanity.io wss://*.sanity.io https://*.sanity-cdn.com https://sanity-cdn.com",
              "frame-src 'self' https://checkout.razorpay.com https://api.razorpay.com https://*.clerk.accounts.dev https://clerk.studyhours.com https://challenges.cloudflare.com https://turnstile.cloudflare.com https://*.daily.co https://zperiod.studyhours.com https://cellstudio.studyhours.com https://zperiod-alpha.vercel.app https://*.sanity.io",
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

  // Automatically tree-shake Sentry debug logging to reduce bundle size
  // (replaces the deprecated `disableLogger` option).
  webpack: {
    treeshake: {
      removeDebugLogging: true,
    },
  },

  // Shrink the client-side Sentry bundle shipped to every visitor.
  // Replay is not used in this app, so its code is excluded entirely.
  // This reduces main-thread JS (TBT) on marketing pages with zero visual impact.
  bundleSizeOptimizations: {
    excludeDebugStatements: true,
    excludeReplayShadowDom: true,
    excludeReplayIframe: true,
    excludeReplayWorker: true,
  },
});
