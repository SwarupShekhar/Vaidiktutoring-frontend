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
  features: Feature[];
}

export interface Testimonial {
  quote: string;
  author: string;
  role?: string;
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
  html?: string;
  css?: string;
}

export interface RichTextBlock {
  _type: 'richTextBlock';
  content?: any;
}

export type PageBlock = FeaturesBlock | TestimonialsBlock | FaqBlock | CustomHtmlBlock | RichTextBlock;

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
  getLandingPage: async (slug: string, preview = false): Promise<LandingPage> => {
    try {
      const res = await api.get(`/cms/landing-pages/${slug}${preview ? '?preview=true' : ''}`);
      return res.data;
    } catch (error: any) {
      console.error(`[CMS API] Failed to fetch landing page for slug '${slug}':`, error);
      throw new Error(error.response?.data?.message || 'Failed to load landing page.');
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
