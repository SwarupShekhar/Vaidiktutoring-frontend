import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | StudyHours",
  description: "Read our terms of service to understand your rights and responsibilities when using our tutoring platform.",
  alternates: {
    canonical: "https://studyhours.com/terms",
  },
  openGraph: {
    title: "Terms of Service | StudyHours",
    description: "Read our terms of service to understand your rights and responsibilities.",
    url: "https://studyhours.com/terms",
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
        <div className="min-h-screen py-24 px-6 md:px-12 bg-white dark:bg-black text-gray-900 dark:text-gray-100">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase">Terms of Service</h1>
                    <p className="text-lg opacity-60 italic">Last updated: March 20, 2026</p>
                </div>
                
                <hr className="border-gray-200 dark:border-gray-800" />
                
                <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">1. Agreement to Terms</h2>
                        <p className="leading-relaxed">
                            By accessing or using StudyHours ("the Platform"), you agree to be bound by these Terms of Service. These terms constitute a legally binding agreement between you and StudyHours regarding your use of our tutoring services, website, and applications.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">2. Description of Service</h2>
                        <p className="leading-relaxed">
                            StudyHours provides an online educational platform connecting students with expert tutors for 1-on-1 and group instructional sessions. We provide the tools for scheduling, communication, and curriculum-aligned learning but do not guarantee specific academic outcomes or grades.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">3. User Conduct & Safety</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>All interactions between tutors and students must remain professional and focused on academic support.</li>
                            <li>Users must not share personal contact information (emails, phone numbers, social media) through the platform.</li>
                            <li>Any form of harassment, bullying, or inappropriate behavior will result in immediate account termination without refund.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">4. Payments & Refund Policy</h2>
                        <p className="leading-relaxed">
                            Payments for tutoring credit or subscriptions must be made in advance. Refunds are subject to our 24-hour cancellation policy: sessions cancelled with less than 24 hours notice will be charged at the full rate. Requests for refunds on unused credits will be evaluated on a case-by-case basis.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">5. Limitation of Liability</h2>
                        <p className="leading-relaxed">
                            StudyHours is not liable for any indirect, incidental, or consequential damages arising from the use of our platform. We make every effort to vet tutors, but we are not responsible for the specific content of individual tutoring sessions.
                        </p>
                    </section>

                    <section className="space-y-8 pt-6 border-t border-gray-100 dark:border-gray-900">
                        <p className="text-sm opacity-50">
                            For any questions regarding these terms, please contact our legal team at <strong>legal@studyhours.com</strong>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
