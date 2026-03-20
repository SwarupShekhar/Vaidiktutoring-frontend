import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online GCSE Tutor | GCSE Private Tuition & Exam Prep",
  description: "Find a reliable online GCSE tutor for private tuition and exam prep. Get expert guidance, practice, and support to achieve top results and boost confidence.",
  alternates: {
    canonical: "/gcse-online-tutoring",
  },
  openGraph: {
    title: "GCSE Tutors Online | Personalized Exam Success",
    description: "Get the best GCSE online tuition with expert tutors. Achieve top results through personalized 1-on-1 learning.",
    url: "/gcse-online-tutoring",
    images: [
      {
        url: "/hero_calm_education.png",
        width: 1200,
        height: 630,
        alt: "StudyHours GCSE Tutoring",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GCSE Online Tutoring | StudyHours",
    description: "Expert tutors for all GCSE subjects including Maths, Sciences, and Humanities.",
    images: ["/hero_calm_education.png"],
  },
};

export default function GCSELayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
