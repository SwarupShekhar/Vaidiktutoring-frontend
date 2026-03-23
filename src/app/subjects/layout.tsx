import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Curriculum Aligned Tutoring for US, UK & IB Students",
  description:
    "Expert curriculum aligned tutoring for US, UK & IB students. Improve grades, build confidence, and stay ahead with personalized learning.",
  openGraph: {
    title: "Curriculum Aligned Tutoring for US, UK & IB Students",
    description:
      "Expert curriculum aligned tutoring for US, UK & IB students. Improve grades, build confidence, and stay ahead with personalized learning.",
    url: "/subjects",
    images: [
      {
        url: "/hero_calm_education.png",
        width: 1200,
        height: 630,
        alt: "StudyHours Subjects",
      },
    ],
    type: "website",
  },
  alternates: {
    canonical: "https://studyhours.com/subjects",
  },
  twitter: {
    card: "summary_large_image",
    title: "Curriculum Aligned Tutoring for US, UK & IB Students",
    description:
      "Expert curriculum aligned tutoring for US, UK & IB students. Improve grades, build confidence, and stay ahead with personalized learning.",
    images: ["/hero_calm_education.png"],
  },
};

export default function SubjectsLayout({
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
            "@type": "Course",
            name: "K-12 Personalized Tutoring",
            description:
              "Expert tutoring across Math, Science, English, and Social Studies for K-12 students.",
            provider: {
              "@type": "Organization",
              name: "StudyHours",
              url: "https://studyhours.com",
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
            "name": "StudyHours",
            "image": "https://studyhours.com/hero_calm_education.png",
            "priceRange": "$149 - $499",
            "description": "Expert curriculum aligned tutoring for US, UK & IB students.",
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
              { "@type": "ListItem", "position": 2, "name": "Subjects", "item": "https://studyhours.com/subjects" }
            ]
          }),
        }}
      />
      {children}
    </>
  );
}
