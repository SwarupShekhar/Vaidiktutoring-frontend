import { Metadata } from "next";

export const metadata: Metadata = {
  title: "K-12 Tutoring Subjects | StudyHours",
  description:
    "Explore our wide range of K-12 subjects including Math, Science, English, and Social Studies. Tailored tutoring for IB, IGCSE, GCSE, and US Common Core curricula.",
  openGraph: {
    title: "K-12 Tutoring Subjects | StudyHours",
    description:
      "Expert tutoring across Math, Science, Humanities and more for K-12 students.",
    url: "https://studyhours.com/subjects",
    images: [
      {
        url: "https://studyhours.com/hero_calm_education.png",
        width: 1200,
        height: 630,
        alt: "StudyHours Subjects",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "K-12 Tutoring Subjects | StudyHours",
    description:
      "Expert tutoring across Math, Science, Humanities and more for K-12 students.",
    images: ["https://studyhours.com/hero_calm_education.png"],
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
      {children}
    </>
  );
}
