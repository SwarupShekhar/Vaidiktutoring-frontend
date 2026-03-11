import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Methodology | StudyHours",
  description:
    "Discover our structured, outcome-driven tutoring approach that blends expert educators with data-driven insights for deep learning and measurable academic growth.",
  openGraph: {
    title: "Our Methodology | StudyHours",
    description:
      "Structured, measurable, and outcome-driven learning for K-12 students.",
    url: "https://studyhours.com/methodology",
    images: [
      {
        url: "https://studyhours.com/hero_calm_education.png",
        width: 1200,
        height: 630,
        alt: "StudyHours Methodology",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Methodology | StudyHours",
    description:
      "Structured, measurable, and outcome-driven learning for K-12 students.",
    images: ["https://studyhours.com/hero_calm_education.png"],
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
      {children}
    </>
  );
}
