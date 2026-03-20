import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | StudyHours",
  description: "Latest articles on K-12 education, tutoring tips, and learning strategies.",
  alternates: { canonical: "/blog" }
};

export default function BlogPage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-3xl font-bold text-(--color-text-primary)">Blog (Coming Soon)</h1>
        </div>
    );
}
