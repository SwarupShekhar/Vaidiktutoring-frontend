import { Metadata } from "next";

export const metadata: Metadata = {
  title: "K–12 Online Tutoring | Expert Live Classes for All Subjects",
  description: "At Studyhours, join K–12 online tutoring with live classes in math, English, science & more. Get personalized support and improve academic performance.",
  alternates: {
    canonical: "https://studyhours.com/k-12-online-tutoring",
  },
  openGraph: {
    title: "K–12 Online Tutoring | Expert Live Classes for All Subjects",
    description: "At Studyhours, join K–12 online tutoring with live classes in math, English, science & more. Get personalized support and improve academic performance.",
    url: "https://studyhours.com/k-12-online-tutoring",
    images: [
      {
        url: "https://studyhours.com/hero_calm_education.png",
        width: 1200,
        height: 630,
        alt: "StudyHours K-12 Online Tutoring",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "K–12 Online Tutoring | Expert Live Classes for All Subjects",
    description: "At Studyhours, join K–12 online tutoring with live classes in math, English, science & more. Get personalized support and improve academic performance.",
  },
};

export default function K12OnlineTutoringLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
