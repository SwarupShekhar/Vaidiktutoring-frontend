// src/app/lib/cms.ts
import api from './api';
import { sanityClient, getSanityClient } from '@/sanity/lib/client';

// Shared projection for every pageBlock variant (hero, features, testimonials,
// faq, stats, twoColumn, cta, videoEmbed, customHtml, richText).
const PAGE_BLOCKS_PROJECTION = `{
  _type, heading, subheading, body, layout,
  html, css, scopeClass, sectionBackground, sectionPadding, maxWidth,
  pillBadge, tagline, primaryButtonText, primaryButtonLink, secondaryButtonText, secondaryButtonLink,
  content,
  features[] { title, description, icon },
  testimonials[] { quote, name, examBoard, grade, avatar { asset->{ url } } },
  faqs[] { question, answer },
  stats[] { value, label, icon },
  ctaText, ctaUrl,
  image { asset->{ url }, alt },
  imagePosition, variant, url, caption
}`;

const LANDING_PAGE_PROJECTION = `{
  _id,
  title,
  "slug": slug.current,
  targetKeywords,
  addToFooter,
  country,
  status,
  alternates[] { locale, path },
  seo { metaTitle, metaDescription, canonicalUrl },
  heroSection {
    heading,
    subheading,
    ctaText,
    backgroundImage { asset->{ url } }
  },
  featuredResource-> {
    _id, title, "slug": slug.current, description,
    "fileUrl": file.asset->url, subject, examBoard, accessType, requiredReferrals
  },
  pageBlocks[] ${PAGE_BLOCKS_PROJECTION}
}`;

export interface SeoMetadata {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
}

export interface PdfResource {
  _id: string;
  title: string;
  slug: string;
  description: string;
  fileUrl?: string; // Only returned if free or unlocked
  subject: string;
  examBoard: string;
  accessType: 'free' | 'gated';
  requiredReferrals: number;
}

export interface HeroSection {
  heading: string;
  subheading: string;
  ctaText: string;
  backgroundImage?: {
    asset: {
      url: string;
    };
  };
}

export interface Feature {
  title: string;
  description: string;
  icon?: string;
}

export interface FeaturesBlock {
  _type: 'featuresBlock';
  heading: string;
  subheading?: string;
  layout?: 'grid-3' | 'grid-2' | 'list';
  features: Feature[];
}

export interface Testimonial {
  quote: string;
  name: string;        // was 'author' — schema field is 'name'
  examBoard?: string;  // was 'role' — schema field is 'examBoard'
  grade?: string;
  avatar?: {
    asset: {
      url: string;
    };
  };
}

export interface TestimonialsBlock {
  _type: 'testimonialsBlock';
  heading: string;
  testimonials: Testimonial[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqBlock {
  _type: 'faqBlock';
  heading: string;
  faqs: FaqItem[];
}

export interface CustomHtmlBlock {
  _type: 'customHtmlBlock';
  heading?: string;
  scopeClass?: string;
  sectionBackground?: 'none' | 'surface' | 'light' | 'navy' | 'gradient';
  sectionPadding?: 'none' | 'sm' | 'md' | 'lg';
  maxWidth?: 'full' | '7xl' | '5xl' | '3xl';
  html?: string;
  css?: string;
}

export interface RichTextBlock {
  _type: 'richTextBlock';
  content?: any;
}

export interface Stat {
  value: string;
  label: string;
  icon?: string;
}

export interface StatsBlock {
  _type: 'statsBlock';
  heading?: string;
  stats: Stat[];
}

export interface TwoColumnBlock {
  _type: 'twoColumnBlock';
  heading?: string;
  body?: string;
  ctaText?: string;
  ctaUrl?: string;
  image?: {
    asset: { url: string };
    alt?: string;
  };
  imagePosition?: 'left' | 'right';
}

export interface CtaBlock {
  _type: 'ctaBlock';
  heading?: string;
  subheading?: string;
  ctaText?: string;
  ctaUrl?: string;
  variant?: 'primary' | 'dark' | 'light';
}

export interface VideoEmbedBlock {
  _type: 'videoEmbedBlock';
  heading?: string;
  url?: string;
  caption?: string;
}

export interface HeroBlock {
  _type: 'heroBlock';
  pillBadge?: string;
  heading?: string;
  tagline?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  image?: {
    asset: { url: string };
    alt?: string;
  };
}

export type PageBlock = HeroBlock | FeaturesBlock | TestimonialsBlock | FaqBlock | CustomHtmlBlock | RichTextBlock | StatsBlock | TwoColumnBlock | CtaBlock | VideoEmbedBlock;

export interface LandingPage {
  _id: string;
  title: string;
  slug: string;
  targetKeywords?: string[];
  addToFooter?: boolean;
  seo?: SeoMetadata;
  heroSection: HeroSection;
  featuredResource?: PdfResource;
  pageBlocks?: PageBlock[];
  country?: string;
  status?: string;
  alternates?: { locale: string; path: string }[];
}

export interface ReferralStatus {
  unlocked: boolean;
  referralsCount: number;
  requiredReferrals: number;
  fileUrl: string | null;
}

export const cmsApi = {
  getLandingPage: async (slug: string, preview = false): Promise<LandingPage | null> => {
    // !defined(country) excludes regional/tutoring pages — those are served only via
    // /tutoring/[...]. Serving them here too = duplicate content with conflicting canonicals.
    const query = `*[_type == "landingPage" && !defined(country) && slug.current == $slug] | order(_updatedAt desc)[0] ${LANDING_PAGE_PROJECTION}`;
    try {
      return (await getSanityClient(preview).fetch<LandingPage | null>(query, { slug })) || null;
    } catch (error: any) {
      console.error(`[CMS] Failed to fetch landing page for slug '${slug}':`, error.message || error);
      return null;
    }
  },

  // Fetch programmatic regional landing page (Tutors) by full slug path
  getRegionalPageBySlug: async (slug: string, preview = false): Promise<LandingPage | null> => {
    // Normalize: lowercase, strip leading/trailing slashes, collapse dupes so
    // "/UK//GCSE/" -> "uk/gcse" (editors store the full path in slug.current).
    const normalizedSlug = (slug || '').toLowerCase().replace(/\/+/g, '/').replace(/^\/|\/$/g, '');
    const statusFilter = preview ? '' : ' && status == "published"';
    const query = `*[_type == "landingPage" && defined(country) && slug.current == $slug${statusFilter}] | order(_updatedAt desc)[0] ${LANDING_PAGE_PROJECTION}`;
    try {
      return (await getSanityClient(preview).fetch<LandingPage | null>(query, { slug: normalizedSlug })) || null;
    } catch (error: any) {
      console.error(`[CMS] Failed to fetch regional page for slug '${normalizedSlug}':`, error.message || error);
      return null;
    }
  },

  // Fetch all published regional pages (for static params + sitemap)
  getRegionalPages: async (): Promise<{ slug: string; title?: string; country?: string; alternates?: { locale: string; path: string }[] }[]> => {
    const query = `*[_type == "landingPage" && defined(country) && !(_id in path("drafts.**"))] | order(slug.current asc) {
      "slug": slug.current, title, country, alternates[] { locale, path }
    }`;
    try {
      return (await sanityClient.fetch(query)) || [];
    } catch (error: any) {
      console.error('[CMS] Failed to fetch regional pages list:', error.message || error);
      return [];
    }
  },

  // Fetch dynamic landing pages (footer links + sitemap indexation)
  getLandingPages: async (): Promise<{ _id: string; title: string; slug: string; addToFooter?: boolean }[]> => {
    const query = `*[_type == "landingPage" && !(_id in path("drafts.**")) && !defined(country)] | order(title asc) {
      _id, title, "slug": slug.current, addToFooter
    }`;
    try {
      return (await sanityClient.fetch(query)) || [];
    } catch (error: any) {
      console.error('[CMS] Failed to fetch landing pages list:', error.message || error);
      return [];
    }
  },

  // Fetch all available resource directories
  getResources: async (): Promise<PdfResource[]> => {
    const query = `*[_type == "pdfResource" && !(_id in path("drafts.**"))] | order(title asc) {
      _id, title, "slug": slug.current, description, subject, examBoard, accessType, requiredReferrals
    }`;
    try {
      return (await sanityClient.fetch<PdfResource[]>(query)) || [];
    } catch (error: any) {
      console.error('[CMS] Failed to fetch resources list:', error.message || error);
      throw new Error('Failed to load resources directory.');
    }
  },

  // Fetch single resource details
  getResource: async (slug: string): Promise<PdfResource> => {
    const query = `*[_type == "pdfResource" && slug.current == $slug][0] {
      _id, title, "slug": slug.current, description,
      "fileUrl": file.asset->url, subject, examBoard, accessType, requiredReferrals
    }`;
    const resource = await sanityClient.fetch<PdfResource | null>(query, { slug });
    if (!resource) {
      throw new Error(`Resource with slug '${slug}' not found.`);
    }
    return resource;
  },

  // Check referral counts and fetch gated download link (Clerk JWT is automatically added by AuthContext/Axios interceptor)
  verifyReferral: async (slug: string): Promise<ReferralStatus> => {
    try {
      const res = await api.get(`/cms/resources/${slug}/verify-referral`);
      return res.data;
    } catch (error: any) {
      console.error(`[CMS API] Failed to check referral verification for '${slug}':`, error);
      throw new Error(error.response?.data?.message || 'Failed to verify referral eligibility.');
    }
  },

  // Attribute a peer referral for the current authenticated user (one-shot, backend-guarded).
  attributeReferral: async (referredBy: string): Promise<boolean> => {
    try {
      const res = await api.post('/cms/attribute-referral', { referredBy });
      return res.data?.attributed === true;
    } catch (error: any) {
      console.warn('[CMS API] Referral attribution failed:', error.message || error);
      return false;
    }
  },
};
