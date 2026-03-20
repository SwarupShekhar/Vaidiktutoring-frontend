import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Latest Insights & Educational Blog | StudyHours",
  description:
    "Explore the StudyHours blog for expert tutoring tips, subject-specific insights, and educational resources to help K-12 students succeed.",
  alternates: {
    canonical: "/blogs",
  },
  openGraph: {
    title: "StudyHours Blog | Educational Insights",
    description:
      "Expert tutoring tips and educational resources for K-12 success.",
    url: "https://studyhours.com/blogs",
    type: "website",
  },
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
