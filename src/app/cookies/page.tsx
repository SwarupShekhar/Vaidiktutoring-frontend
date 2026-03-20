import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | StudyHours",
  description: "Learn how we use cookies and manage your preferences on the StudyHours platform.",
  alternates: {
    canonical: "/cookies",
  },
  openGraph: {
    title: "Cookie Policy | StudyHours",
    description: "Learn how we use cookies and manage your preferences.",
    url: "/cookies",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Cookie Policy | StudyHours",
    description: "Learn how we use cookies and manage your preferences.",
  },
};

export default function CookiesPage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-3xl font-bold text-(--color-text-primary)">Cookie Settings (Coming Soon)</h1>
        </div>
    );
}
