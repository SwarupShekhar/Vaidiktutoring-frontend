import { Metadata } from "next";

export const metadata: Metadata = {
  title: "International Baccalaureate (IB) Tutors Online | StudyHours",
  description: "Expert IB tutoring for PYP, MYP, DP, and CP. Get personalized 1-on-1 support for all IB subjects, External Assessments, and Internal Assessments.",
  alternates: {
    canonical: "/resources/ib-tutors-online",
  },
  openGraph: {
    title: "Online IB Tutors | Expert International Baccalaureate Support",
    description: "Personalized IB tutoring to help students master PYP, MYP, and DP subjects with confidence.",
    url: "/resources/ib-tutors-online",
    images: [
      {
        url: "/hero_calm_education.png",
        width: 1200,
        height: 630,
        alt: "StudyHours IB Tutoring",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online IB Tutors | StudyHours",
    description: "Expert IB tutoring for all programmes. Master your IA, EA, and core subjects.",
    images: ["/hero_calm_education.png"],
  },
};

export default function IBTutorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
