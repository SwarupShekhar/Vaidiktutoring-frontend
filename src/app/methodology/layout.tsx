import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI-Based Learning Approach | StudyHours Methodology",
  description:
    "Explore our AI-based learning approach designed to personalize tutoring, identify gaps, and help students achieve better academic results.",
  openGraph: {
    title: "AI-Based Learning Approach | StudyHours Methodology",
    description:
      "Explore our AI-based learning approach designed to personalize tutoring, identify gaps, and help students achieve better academic results.",
    url: "/methodology",
    images: [
      {
        url: "/hero_calm_education.png",
        width: 1200,
        height: 630,
        alt: "StudyHours Methodology",
      },
    ],
    type: "website",
  },
  alternates: {
    canonical: "https://studyhours.com/methodology",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI-Based Learning Approach | StudyHours Methodology",
    description:
      "Explore our AI-based learning approach designed to personalize tutoring, identify gaps, and help students achieve better academic results.",
    images: ["/hero_calm_education.png"],
  },
};

export default function MethodologyLayout({
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
            "@type": "Service",
            serviceType: "Educational Tutoring",
            provider: {
              "@type": "Organization",
              name: "StudyHours",
            },
            description:
              "A high-dosage tutoring methodology that focuses on continuous feedback loops and measured academic outcomes.",
            areaServed: "Global",
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Tutoring Services",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Math Tutoring",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Science Tutoring",
                  },
                },
              ],
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "StudyHours Methodology",
            "image": "https://studyhours.com/hero_calm_education.png",
            "priceRange": "$149 - $499",
            "description": "AI-based learning approach designed to personalize tutoring and identify gaps.",
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
              { "@type": "ListItem", "position": 2, "name": "Methodology", "item": "https://studyhours.com/methodology" }
            ]
          }),
        }}
      />
      {children}
    </>
  );
}
