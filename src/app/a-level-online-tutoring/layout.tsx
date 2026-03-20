import { Metadata } from "next";

export const metadata: Metadata = {
  title: "A-Level Online Tutoring | Expert Specialist Tutors & Results",
  description: "Unlock your university goals with StudyHours. Expert A-Level online tutoring for every subject - from first lesson to final exam. Achieve top results through personalized 1-on-1 support.",
  alternates: {
    canonical: "/a-level-online-tutoring",
  },
  openGraph: {
    title: "A-Level Tutors Online | Personalized University Prep",
    description: "Get the best A-Level online tuition with expert specialist tutors. Achieve your university offers through personalized 1-on-1 learning.",
    url: "/a-level-online-tutoring",
    images: [
      {
        url: "/hero_calm_education.png",
        width: 1200,
        height: 630,
        alt: "StudyHours A-Level Tutoring",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "A-Level Online Tutoring | StudyHours",
    description: "Expert specialist tutors for all A-Level subjects including Maths, Sciences, and Humanities.",
    images: ["/hero_calm_education.png"],
  },
};

export default function ALevelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
