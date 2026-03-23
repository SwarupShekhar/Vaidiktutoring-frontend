import { Metadata } from "next";

export const metadata: Metadata = {
  title: "IGCSE Online Tutoring | Personalised 1-on-1 Classes",
  description:
    "Boost your grades with IGCSE online tutoring. Get personalised 1-on-1 classes from expert tutors and master every subject with confidence.",
  alternates: {
    canonical: "https://studyhours.com/igcse-online-tutoring",
  },
  openGraph: {
    title: "IGCSE Online Tutoring | Personalised 1-on-1 Classes",
    description:
      "Get the best IGCSE online tuition with expert tutors. Achieve top results through personalized 1-on-1 learning.",
    url: "https://studyhours.com/igcse-online-tutoring",
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
    title: "IGCSE Online Tutoring | Personalised 1-on-1 Classes",
    description:
      "Expert tutors for all IGCSE subjects including Maths, Sciences, and Humanities.",
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
