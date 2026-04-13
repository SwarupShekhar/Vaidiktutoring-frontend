import { Metadata } from "next";
import SubjectsPageClient from "./SubjectsPageClient";

export const metadata: Metadata = {
  title: "Curriculum Aligned Tutoring for US, UK & IB Students",
  description:
    "Expert curriculum aligned tutoring for US, UK & IB students. Improve grades, build confidence, and stay ahead with personalized learning.",
  alternates: {
    canonical: "https://studyhours.com/subjects",
  },
  openGraph: {
    title: "Curriculum Aligned Tutoring for US, UK & IB Students",
    description:
      "Expert curriculum aligned tutoring for US, UK & IB students. Improve grades, build confidence, and stay ahead with personalized learning.",
    url: "https://studyhours.com/subjects",
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
  twitter: {
    card: "summary_large_image",
    title: "Curriculum Aligned Tutoring for US, UK & IB Students",
    description:
      "Expert curriculum aligned tutoring for US, UK & IB students. Improve grades, build confidence, and stay ahead with personalized learning.",
    images: ["/hero_calm_education.png"],
  },
};

export default function Page() {
  const courseSchema = {
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
  };

  const eduOrgSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "StudyHours",
    image: "https://studyhours.com/hero_calm_education.png",
    description:
      "Expert curriculum aligned tutoring for US, UK & IB students.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "Global",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://studyhours.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Subjects",
        item: "https://studyhours.com/subjects",
      },
    ],
  };

  return (
    <>
      <script
        id="course-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema).replace(/</g, '\\u003c') }}
      />
      <script
        id="edu-org-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eduOrgSchema).replace(/</g, '\\u003c') }}
      />
      <script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }}
      />
      <SubjectsPageClient />
    </>
  );
}
