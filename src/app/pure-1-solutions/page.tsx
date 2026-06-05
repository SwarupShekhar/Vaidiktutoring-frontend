import { Metadata } from "next";
import Pure1Client from "./Pure1Client";

export const metadata: Metadata = {
  title: "Free Edexcel A-Level Pure 1 Worked Solutions (June 2026)",
  description: "Get the definitive worked solutions for the Edexcel Pure Mathematics 1 June 2026 paper. Mark your own script accurately.",
  alternates: {
    canonical: "https://studyhours.com/pure-1-solutions",
  },
  openGraph: {
    title: "Free Edexcel Pure 1 Worked Solutions | StudyHours",
    description: "Download the definitive worked solutions for the Edexcel Pure 1 June 2026 paper.",
    url: "https://studyhours.com/pure-1-solutions",
    type: "website",
  },
};

export default function Page() {
  return <Pure1Client />;
}
