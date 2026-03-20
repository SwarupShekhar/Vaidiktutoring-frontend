import { Metadata } from "next";

export const metadata: Metadata = {
  title: "IGCSE Online Tuition | Expert Tutors & Online Courses",
  description: "At Studyhours, get quality IGCSE online tuition with expert tutors. Join flexible IGCSE online courses & improve your grades with personalized learning support.",
  alternates: {
    canonical: "/igcse-online-tutoring",
  },
  openGraph: {
    title: "IGCSE Tutors Online | Personalized Exam Success",
    description: "Get the best IGCSE online tuition with expert tutors. Achieve top results through personalized 1-on-1 learning.",
    url: "/igcse-online-tutoring",
    images: [
      {
        url: "/hero_calm_education.png",
        width: 1200,
        height: 630,
        alt: "StudyHours IGCSE Tutoring",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IGCSE Online Tuition | StudyHours",
    description: "Expert tutors for all IGCSE subjects including Maths, Sciences, and Humanities.",
    images: ["/hero_calm_education.png"],
  },
};

export default function IGCSELayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
