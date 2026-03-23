import { Metadata } from "next";

export const metadata: Metadata = {
  title: "StudyHours | Expert Tutors & AI Learning System",
  description:
    "A modern learning platform combining expert tutors and AI tools to deliver structured, personalized education for students worldwide.",
  openGraph: {
    title: "StudyHours | Expert Tutors & AI Learning System",
    description:
      "A modern learning platform combining expert tutors and AI tools to deliver structured, personalized education for students worldwide.",
    url: "/about",
    images: [
      {
        url: "/hero_calm_education.png",
        width: 1200,
        height: 630,
        alt: "StudyHours Learning Support",
      },
    ],
    type: "website",
  },
  alternates: {
    canonical: "https://studyhours.com/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "StudyHours | Expert Tutors & AI Learning System",
    description:
      "A modern learning platform combining expert tutors and AI tools to deliver structured, personalized education for students worldwide.",
    images: ["/hero_calm_education.png"],
  },
};

export default function AboutLayout({
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
            "@type": "LocalBusiness",
            "name": "StudyHours",
            "image": "https://studyhours.com/hero_calm_education.png",
            "priceRange": "$149 - $499",
            "description": "A modern learning platform combining expert tutors and AI tools.",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "Global"
            }
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://studyhours.com" },
              { "@type": "ListItem", "position": 2, "name": "About", "item": "https://studyhours.com/about" }
            ]
          }),
        }}
      />
      {children}
    </>
  );
}
