import { Metadata } from "next";
import IBPageClient from "./IBPageClient";

export const metadata: Metadata = {
  title: "Expert IB Tutors Online | IB Tutoring You Can Trust",
  description:
    "Expert IB tutoring and help for all IB programmes. StudyHours offers premium 1-on-1 online classes for IB subjects, including IA, EE, and TOK support.",
  alternates: {
    canonical: "https://studyhours.com/ib-online-tutoring",
  },
  openGraph: {
    title: "Expert IB Tutors Online | IB Tutoring You Can Trust",
    description:
      "Looking for an expert IB tutor? StudyHours provides premium International Baccalaureate tutoring online. Personalized support for IA, EE, TOK and more.",
    url: "https://studyhours.com/ib-online-tutoring",
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
    title: "Expert IB Tutors Online | IB Tutoring You Can Trust",
    description:
      "Expert IB tutoring for all programmes. Master your IA, EE, and core subjects.",
    images: ["https://studyhours.com/hero_calm_education.png"],
  },
};

export default function Page() {
  return <IBPageClient />;
}
