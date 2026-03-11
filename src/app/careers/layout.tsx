import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers | Join the StudyHours Team",
  description:
    "Join our mission to reimagine K-12 education. Explore career opportunities for expert tutors, learning designers, and engineers at StudyHours.",
  openGraph: {
    title: "Careers | StudyHours",
    description: "Help us transform K-12 education. Join the StudyHours team.",
    url: "https://studyhours.com/careers",
    type: "website",
  },
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
