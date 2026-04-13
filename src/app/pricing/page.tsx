import { Metadata } from "next";
import PricingPageClient from "./PricingPageClient";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Pricing & Learning Plans | StudyHours",
  description:
    "Transparent pricing for K-12 tutoring. Explore our Foundations, Core Mastery, and Advanced Growth plans tailored to your child's educational needs.",
  openGraph: {
    title: "Pricing & Learning Plans | StudyHours",
    description:
      "Transparent, flexible tutoring plans built around your child’s needs.",
    url: "https://studyhours.com/pricing",
    images: [
      {
        url: "/hero_calm_education.png",
        width: 1200,
        height: 630,
        alt: "StudyHours Pricing Plans",
      },
    ],
    type: "website",
  },
  alternates: {
    canonical: "https://studyhours.com/pricing",
    languages: {
      "en-GB": "https://studyhours.com/pricing",
      "en-US": "https://studyhours.com/pricing",
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing & Learning Plans | StudyHours",
    description:
      "Transparent, flexible tutoring plans built around your child’s needs.",
    images: ["/hero_calm_education.png"],
  },
};

export default function Page() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Why show “Starting at” prices?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Every child is different. Final pricing follows a free assessment where we determine the frequency and depth of support needed.",
        },
      },
      {
        "@type": "Question",
        name: "Can I switch plans?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, you can upgrade, downgrade, or pause your plan at any time. We are flexible to your child's schedule.",
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <PricingPageClient />
    </>
  );
}
