import { Metadata } from "next";
import BlogsPageClient from "./BlogsPageClient";
import { blogsApi } from "@/app/lib/blogs";

export const revalidate = 3600; // Cache on edge for 1 hour, re-compile in background

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

export async function generateStaticParams() {
  // Generate static paths for blogs (optional, for full SSG)
  return [];
}

export default async function Page() {
  // Fetch initial blogs for SSR with fallback
  let initialBlogs = [];
  try {
    const res = await blogsApi.getAll(1, 12, "All");
    initialBlogs = res.data || [];
  } catch (error) {
    console.warn("Failed to fetch initial blogs for SSR:", error);
    // Provide static fallback data to ensure content
    initialBlogs = [
      {
        id: 1,
        title: "High Dosage Tutoring: The Science of Rapid Mastery",
        excerpt: "Explore the principles of high dosage tutoring and how it accelerates learning outcomes.",
        imageUrl: "/images/blog-placeholder.png",
        category: "Study Tips",
        createdAt: new Date().toISOString(),
        author: { first_name: "StudyHours", last_name: "Team" },
        slug: "high-dosage-tutoring-the-science-of-rapid-mastery"
      },
      // Add more fallback blogs as needed
    ];
  }

  return <BlogsPageClient initialBlogs={initialBlogs} />;
}
