import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online IB Tutoring & Help | 1-on-1 Personalized Classes",
  description:
    "Expert online IB tutoring & help with personalized 1-on-1 classes. Ace your IA, EE, and core subjects with StudyHours' expert tutors.",
  alternates: {
    canonical: "https://studyhours.com/ib-online-tutoring",
  },
  openGraph: {
    title: "Online IB Tutoring & Help | 1-on-1 Personalized Classes",
    description:
      "Personalized IB tutoring to help students master PYP, MYP, and DP subjects with confidence.",
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
    title: "Online IB Tutoring & Help | 1-on-1 Personalized Classes",
    description:
      "Expert IB tutoring for all programmes. Master your IA, EE, and core subjects.",
    images: ["https://studyhours.com/hero_calm_education.png"],
  },
};

export default function IBTutorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
