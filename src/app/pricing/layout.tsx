import { Metadata } from "next";

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
        url: "https://studyhours.com/hero_calm_education.png",
        width: 1200,
        height: 630,
        alt: "StudyHours Pricing Plans",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing & Learning Plans | StudyHours",
    description:
      "Transparent, flexible tutoring plans built around your child’s needs.",
    images: ["https://studyhours.com/hero_calm_education.png"],
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
          }),
        }}
      />
      {children}
    </>
  );
}
