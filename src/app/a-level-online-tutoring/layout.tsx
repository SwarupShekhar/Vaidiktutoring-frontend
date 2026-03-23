import { Metadata } from "next";

export const metadata: Metadata = {
  title: "A-Level Tutors Online | Top Experts | Study Hours",
  description: "Looking for top A-Level tutors online? StudyHours offers personalized 1-on-1 tutoring from experts to help students improve grades & boost confidence.",
  alternates: {
    canonical: "https://studyhours.com/a-level-online-tutoring",
  },
  openGraph: {
    title: "A-Level Tutors Online | Top Experts | Study Hours",
    description: "Looking for top A-Level tutors online? StudyHours offers personalized 1-on-1 tutoring from experts to help students improve grades & boost confidence.",
    url: "https://studyhours.com/a-level-online-tutoring",
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
    title: "A-Level Tutors Online | Top Experts | Study Hours",
    description: "Looking for top A-Level tutors online? StudyHours offers personalized 1-on-1 tutoring from experts to help students improve grades & boost confidence.",
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
