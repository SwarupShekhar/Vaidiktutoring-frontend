// src/app/lib/cms.ts
import api from './api';

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

export type PageBlock = FeaturesBlock | TestimonialsBlock | FaqBlock | CustomHtmlBlock | RichTextBlock | StatsBlock | TwoColumnBlock | CtaBlock | VideoEmbedBlock;

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
}

export interface ReferralStatus {
  unlocked: boolean;
  referralsCount: number;
  requiredReferrals: number;
  fileUrl: string | null;
}

export const cmsApi = {
  // Fetch programmatic landing page details
  getLandingPage: async (slug: string, preview = false): Promise<LandingPage | null> => {
    try {
      const res = await api.get(`/cms/landing-pages/${slug}${preview ? '?preview=true' : ''}`);
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error(`[CMS API] Failed to fetch landing page for slug '${slug}':`, error.message || error);
      return null;
    }
  },

  // Fetch all available resource directories
  getResources: async (): Promise<PdfResource[]> => {
    try {
      const res = await api.get('/cms/resources');
      return res.data || [];
    } catch (error: any) {
      console.error('[CMS API] Failed to fetch resources list:', error);
      throw new Error(error.response?.data?.message || 'Failed to load resources directory.');
    }
  },

  // Fetch single resource details
  getResource: async (slug: string): Promise<PdfResource> => {
    try {
      const res = await api.get(`/cms/resources/${slug}`);
      return res.data;
    } catch (error: any) {
      console.error(`[CMS API] Failed to fetch resource for slug '${slug}':`, error);
      throw new Error(error.response?.data?.message || 'Failed to load resource details.');
    }
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
};
