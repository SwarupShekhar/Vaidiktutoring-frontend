// src/app/resources/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { cmsApi } from '@/app/lib/cms';
import ResourceLandingClient from './ResourceLandingClient';

export const revalidate = 600; // Cache on edge for 10 minutes, re-compile in background

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate dynamic metadata for search engines using HSL curated SEO fields
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const page = await cmsApi.getLandingPage(slug);
    if (!page) {
      return {
        title: 'Resource Not Found | StudyHours',
      };
    }

    const title = page.seo?.metaTitle || `${page.title} | StudyHours Prep & Resources`;
    const description = page.seo?.metaDescription || `Get ultimate exam preparation materials, PDF cheat sheets, and mock guides for ${page.title} at StudyHours.`;
    const canonical = page.seo?.canonicalUrl || `https://studyhours.com/resources/${slug}`;

    return {
      title,
      description,
      alternates: {
        canonical,
      },
      openGraph: {
        title,
        description,
        url: canonical,
        type: 'article',
        images: [{ url: page.heroSection.backgroundImage?.asset?.url || 'https://studyhours.com/hero_calm_education.png' }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [page.heroSection.backgroundImage?.asset?.url || 'https://studyhours.com/hero_calm_education.png'],
      },
    };
  } catch (error) {
    return {
      title: 'Study Resource | StudyHours',
    };
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  let page = null;

  try {
    page = await cmsApi.getLandingPage(slug);
  } catch (error) {
    console.error(`Failed to fetch landing page for slug: ${slug}`, error);
    return notFound();
  }

  if (!page) {
    return notFound();
  }

  // Generate dynamic JSON-LD Schema.org structured markup for high-quality SEO crawlers
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    'name': page.title,
    'description': page.seo?.metaDescription || page.heroSection.subheading,
    'provider': {
      '@type': 'EducationalOrganization',
      'name': 'StudyHours',
      'sameAs': 'https://studyhours.com',
    },
    'hasCourseInstance': {
      '@type': 'CourseInstance',
      'courseMode': 'online',
      'courseWorkload': 'PT30M', // Aligned with the 30-min sprints defined in Pricing
    },
  };

  const productSchema = page.featuredResource ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': page.featuredResource.title,
    'description': page.featuredResource.description,
    'category': page.featuredResource.subject,
    'offers': {
      '@type': 'Offer',
      'price': '0.00',
      'priceCurrency': 'USD',
      'availability': 'https://schema.org/InStock',
    },
  } : null;

  return (
    <>
      <Script
        id="course-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema).replace(/</g, '\\u003c') }}
      />
      {productSchema && (
        <Script
          id="resource-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema).replace(/</g, '\\u003c') }}
        />
      )}
      <ResourceLandingClient landingPage={page} />
    </>
  );
}
