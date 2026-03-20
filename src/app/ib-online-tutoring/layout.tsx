import { Metadata } from "next";

export const metadata: Metadata = {
  title: "IB Coaching Classes | Expert IB Tutors & Exam Preparation",
  description: "Join professional IB coaching classes with expert tutors. Get personalized support, clear concepts & effective exam preparation for better results.",
  alternates: {
    canonical: "/ib-online-tutoring",
  },
  openGraph: {
    title: "Online IB Tutors | Expert International Baccalaureate Support",
    description: "Personalized IB tutoring to help students master PYP, MYP, and DP subjects with confidence.",
    url: "/ib-online-tutoring",
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
