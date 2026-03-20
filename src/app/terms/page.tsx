import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | StudyHours",
  description: "Read our terms of service to understand your rights and responsibilities when using our tutoring platform.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service | StudyHours",
    description: "Read our terms of service to understand your rights and responsibilities.",
    url: "/terms",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Terms of Service | StudyHours",
    description: "Read our terms of service to understand your rights and responsibilities.",
  },
};

export default function TermsPage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-3xl font-bold text-(--color-text-primary)">Terms of Service (Coming Soon)</h1>
        </div>
    );
}
