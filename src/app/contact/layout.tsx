import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | StudyHours",
  description:
    "Get in touch with StudyHours for any questions about our K-12 tutoring services, enrollment, or support. We are here to help your child succeed.",
  openGraph: {
    title: "Contact Us | StudyHours",
    description:
      "Connect with StudyHours for personalized K-12 tutoring support.",
    url: "/contact",
    type: "website",
    images: [{ url: "/hero_calm_education.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | StudyHours",
    description: "Connect with StudyHours for personalized K-12 tutoring support.",
    images: ["/hero_calm_education.png"],
  },
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
