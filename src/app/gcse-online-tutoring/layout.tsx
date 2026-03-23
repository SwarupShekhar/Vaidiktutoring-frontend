import { Metadata } from "next";

export const metadata: Metadata = {
  title: "GCSE Tutors Online | Personalized 1-on-1 Learning",
  description:
    "Find expert GCSE tutors online at StudyHours. Get personalized 1-on-1 learning to improve grades and build confidence across all subjects.",
  alternates: {
    canonical: "https://studyhours.com/gcse-online-tutoring",
  },
  openGraph: {
    title: "GCSE Tutors Online | Personalized 1-on-1 Learning",
    description:
      "Get the best GCSE online tuition with expert tutors. Achieve top results through personalized 1-on-1 learning.",
    url: "https://studyhours.com/gcse-online-tutoring",
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
    title: "GCSE Tutors Online | Personalized 1-on-1 Learning",
    description:
      "Expert tutors for all GCSE subjects including Maths, Sciences, and Humanities.",
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
