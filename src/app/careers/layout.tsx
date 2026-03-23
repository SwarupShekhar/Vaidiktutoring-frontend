import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers | Join the StudyHours Team",
  description:
    "Join our mission to reimagine K-12 education. Explore career opportunities for expert tutors, learning designers, and engineers at StudyHours.",
  openGraph: {
    title: "Careers | Join the StudyHours Team",
    description: "Help us transform K-12 education. Join the StudyHours team.",
    url: "/careers",
    type: "website",
    images: [{ url: "/hero_calm_education.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers | Join the StudyHours Team",
    description: "Help us transform K-12 education. Join the StudyHours team.",
    images: ["/hero_calm_education.png"],
  },
  alternates: {
    canonical: "/careers",
  },
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
