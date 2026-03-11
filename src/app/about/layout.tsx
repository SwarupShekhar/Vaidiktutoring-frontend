import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | StudyHours",
  description:
    "Learn about StudyHours academic mission, our hybrid pedagogy, and how we are reimagining K-12 learning support through expert tutors and intelligent systems.",
  openGraph: {
    title: "About Us | StudyHours",
    description:
      "Reimagining K-12 learning support through expert educators and intelligent systems.",
    url: "https://studyhours.com/about",
    images: [
      {
        url: "https://studyhours.com/hero_calm_education.png",
        width: 1200,
        height: 630,
        alt: "StudyHours Learning Support",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | StudyHours",
    description:
      "Reimagining K-12 learning support through expert educators and intelligent systems.",
    images: ["https://studyhours.com/hero_calm_education.png"],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
