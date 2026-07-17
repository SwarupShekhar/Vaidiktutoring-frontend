// src/app/tutoring/[[...slug]]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { draftMode } from 'next/headers';
import { cmsApi } from '@/app/lib/cms';
// Reuse existing ResourceLandingClient so we don't build duplicate UI
import ResourceLandingClient from '@/app/resources/[slug]/ResourceLandingClient';

export const revalidate = 600;

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

// Pre-render published regional pages at build time
export async function generateStaticParams() {
  try {
    const pages = await cmsApi.getRegionalPages();
    return pages.map((p) => ({ slug: p.slug.split('/') }));
  } catch (e) {
    console.warn('Failed to generate static params for regional pages:', e);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const fullSlug = (slug ?? []).join('/');
  if (!fullSlug) return { title: 'Not Found | StudyHours' };

  let isPreview = false;
  try {
    isPreview = (await draftMode()).isEnabled;
  } catch {}

  try {
    const page = await cmsApi.getRegionalPageBySlug(fullSlug, isPreview);
    if (!page) return { title: 'Not Found | StudyHours' };

    const title = page.seo?.metaTitle || `${page.title} | StudyHours Tutors`;
    const description = page.seo?.metaDescription || `Get the best tutors with StudyHours.`;
    const canonical = `https://studyhours.com/tutoring/${fullSlug}`;

    // Explicit hreflang cluster from the doc's alternates. All country variants are
    // English regional spellings, so hreflang is what tells Google they're alternates,
    // not duplicates. If there are no alternates, we emit only the canonical.
    const alternates: Metadata['alternates'] = { canonical };
    if (page.alternates && page.alternates.length > 0) {
      const languages = Object.fromEntries(
        page.alternates.map((a) => [a.locale, `https://studyhours.com/tutoring/${a.path}`]),
      );
      alternates.languages = { ...languages, 'x-default': canonical };
    }

    return {
      title,
      description,
      alternates,
      openGraph: {
        title,
        description,
        url: canonical,
        type: 'article',
        images: [{ url: page.heroSection?.backgroundImage?.asset?.url || 'https://studyhours.com/hero_calm_education.png' }],
      },
    };
  } catch (error) {
    return { title: 'Study Tutors | StudyHours' };
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const fullSlug = (slug ?? []).join('/');

  if (!fullSlug) {
    return notFound();
  }

  let isPreview = false;
  try {
    isPreview = (await draftMode()).isEnabled;
  } catch {}

  const page = await cmsApi.getRegionalPageBySlug(fullSlug, isPreview);

  if (!page) {
    return notFound();
  }

  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    'name': page.title,
    'description': page.seo?.metaDescription || page.heroSection?.subheading,
    'provider': {
      '@type': 'EducationalOrganization',
      'name': 'StudyHours',
      'sameAs': 'https://studyhours.com',
    },
    'hasCourseInstance': {
      '@type': 'CourseInstance',
      'courseMode': 'online',
    },
  };

  return (
    <>
      <Script
        id="course-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema).replace(/</g, '\\u003c') }}
      />
      <ResourceLandingClient landingPage={page} />
    </>
  );
}
