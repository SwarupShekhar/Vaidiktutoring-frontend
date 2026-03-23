import { Metadata } from "next";
import BlogsPageClient from "./BlogsPageClient";
import { blogsApi } from "@/app/lib/blogs";

export const metadata: Metadata = {
  title: "Educational Insights & Study Tips | StudyHours Blog",
  description:
    "Explore the latest educational insights, study tips, and academic success strategies from the expert tutors at StudyHours. Helping students and parents navigate K-12, GCSE, A-Level, and IB.",
  alternates: {
    canonical: "https://studyhours.com/blogs",
  },
  openGraph: {
    title: "Educational Insights & Study Tips | StudyHours Blog",
    description: "Expert educational resources for students and parents.",
    url: "https://studyhours.com/blogs",
    type: "website",
    images: [{ url: "https://studyhours.com/hero_calm_education.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Educational Insights & Study Tips | StudyHours Blog",
    description: "Expert educational resources for students and parents.",
    images: ["https://studyhours.com/hero_calm_education.png"],
  },
};

export default async function Page() {
  // Fetch initial blogs for SSR
  let initialBlogs = [];
  try {
    const res = await blogsApi.getAll(1, 12, "All");
    initialBlogs = res.data;
  } catch (error) {
    console.warn("Failed to fetch initial blogs for SSR:", error);
  }

  return <BlogsPageClient initialBlogs={initialBlogs} />;
}
