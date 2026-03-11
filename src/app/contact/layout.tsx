import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | StudyHours",
  description:
    "Get in touch with StudyHours for any questions about our K-12 tutoring services, enrollment, or support. We are here to help your child succeed.",
  openGraph: {
    title: "Contact Us | StudyHours",
    description:
      "Connect with StudyHours for personalized K-12 tutoring support.",
    url: "https://studyhours.com/contact",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
