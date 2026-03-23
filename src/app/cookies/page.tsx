import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | StudyHours",
  description: "Learn how we use cookies and manage your preferences on the StudyHours platform.",
  alternates: {
    canonical: "https://studyhours.com/cookies",
  },
  openGraph: {
    title: "Cookie Policy | StudyHours",
    description: "Learn how we use cookies and manage your preferences.",
    url: "https://studyhours.com/cookies",
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
        <div className="min-h-screen py-24 px-6 md:px-12 bg-white dark:bg-black text-gray-900 dark:text-gray-100">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase">Cookie Policy</h1>
                    <p className="text-lg opacity-60 italic">Last updated: March 20, 2026</p>
                </div>
                <hr className="border-gray-200 dark:border-gray-800" />
                
                <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">1. Introduction</h2>
                        <p className="leading-relaxed">
                            This Cookie Policy explains how StudyHours uses cookies and similar technologies to recognize you when you visit our platform. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">2. How We Use Cookies</h2>
                        <p className="leading-relaxed">
                            We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Platform.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">3. Types of Cookies We Use</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl border border-border dark:border-white/10 bg-slate-50 dark:bg-slate-900/50">
                                <h4 className="font-bold mb-2">Essential Cookies</h4>
                                <p className="text-sm opacity-80">Required for platform security, authentication (via Clerk), and session management.</p>
                            </div>
                            <div className="p-4 rounded-xl border border-border dark:border-white/10 bg-slate-50 dark:bg-slate-900/50">
                                <h4 className="font-bold mb-2">Analytics Cookies</h4>
                                <p className="text-sm opacity-80">Used by Google Analytics to help us understand how visitors interact with the site.</p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">4. Controlling Cookies</h2>
                        <p className="leading-relaxed">
                            Most web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies. If you choose to remove cookies or reject cookies, this could affect certain features or services of our Website.
                        </p>
                    </section>

                    <section className="space-y-8 pt-6 border-t border-gray-100 dark:border-gray-900">
                        <p className="text-sm opacity-50">
                            If you have questions about our use of cookies or other technologies, please email us at <strong>privacy@studyhours.com</strong>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
