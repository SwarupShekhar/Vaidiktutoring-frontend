import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy | StudyHours",
  description: "Learn how we use cookies and manage your preferences on the StudyHours platform.",
  alternates: {
    canonical: "https://studyhours.com/legal/cookies",
  },
  openGraph: {
    title: "Cookie Policy | StudyHours",
    description: "Learn how we use cookies and manage your preferences.",
    url: "https://studyhours.com/legal/cookies",
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
        <div className="space-y-12">
            <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase text-deep-navy dark:text-white">
                    Cookie Policy
                </h1>
                <p className="text-lg text-gray-500 italic">Last Updated: April 13, 2026</p>
            </div>
            
            <hr className="border-gray-200 dark:border-gray-800" />
            
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-10">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">1. Introduction</h2>
                        <p className="leading-relaxed">
                            This Cookie Policy explains how StudyHours uses cookies and similar technologies to provide, improve, and protect our platform. This policy should be read alongside our <Link href="/legal/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>. By continuing to use StudyHours after being shown our cookie consent banner, you agree to our use of cookies as described in this policy.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">2. What Are Cookies</h2>
                        <p className="leading-relaxed">
                            Cookies are small text files stored on your device by your browser when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-sm opacity-80">
                            <li><strong>First-party cookies:</strong> Set directly by StudyHours.</li>
                            <li><strong>Third-party cookies:</strong> Set by vendors and service providers we use to deliver platform features.</li>
                        </ul>
                        <p className="text-sm opacity-80 italic">We may also use similar technologies like local storage and session storage to store data on your device for functionality and performance.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">3. Cookies We Use</h2>
                        <div className="overflow-x-auto rounded-xl border border-border dark:border-white/10 shadow-sm bg-white/40 dark:bg-white/5 backdrop-blur-xl mt-6">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="bg-ice-blue dark:bg-white/5 border-b border-border dark:border-white/10">
                                        <th className="p-4 font-bold text-deep-navy dark:text-white">Vendor</th>
                                        <th className="p-4 font-bold text-deep-navy dark:text-white">Purpose</th>
                                        <th className="p-4 font-bold text-deep-navy dark:text-white text-center">Category</th>
                                        <th className="p-4 font-bold text-deep-navy dark:text-white text-center">Type</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border dark:divide-white/5">
                                    <tr>
                                        <td className="p-4 font-bold">Clerk</td>
                                        <td className="p-4">Authentication tokens and session management.</td>
                                        <td className="p-4 text-center">Essential</td>
                                        <td className="p-4 text-center">Third-party</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-bold">Cloudflare Turnstile</td>
                                        <td className="p-4">Bot detection and security verification.</td>
                                        <td className="p-4 text-center">Essential</td>
                                        <td className="p-4 text-center">Third-party</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-bold">Razorpay</td>
                                        <td className="p-4">Payment session state during checkout.</td>
                                        <td className="p-4 text-center">Functional</td>
                                        <td className="p-4 text-center">Third-party</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-bold">Daily.co</td>
                                        <td className="p-4">Video session state and connection management.</td>
                                        <td className="p-4 text-center">Functional</td>
                                        <td className="p-4 text-center">Third-party</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-bold">Google Analytics (GA4)</td>
                                        <td className="p-4">Anonymized usage analytics and user behavior. (Cookies: <code className="text-[10px] bg-slate-100 dark:bg-white/5 px-1 rounded">_ga</code>, <code className="text-[10px] bg-slate-100 dark:bg-white/5 px-1 rounded">_ga_XXXXXXX</code>)</td>
                                        <td className="p-4 text-center">Analytics</td>
                                        <td className="p-4 text-center">Third-party</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-bold">Vercel Analytics</td>
                                        <td className="p-4">Performance analytics (Data collection at edge).</td>
                                        <td className="p-4 text-center">Analytics</td>
                                        <td className="p-4 text-center">First-party (Cookieless)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">4. Cookie Categories Explained</h2>
                        <ul className="space-y-4">
                            <li><strong>Essential:</strong> These are required for the platform to function. They cannot be disabled without breaking core features like login, authentication, and platform security.</li>
                            <li><strong>Functional:</strong> These enhance platform features such as payment processing and live video sessions. Disabling these will significantly affect those features.</li>
                            <li><strong>Analytics:</strong> These help us understand how users interact with StudyHours so we can improve the learning experience. These can be opted out of without affecting core functionality.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">5. What We Do Not Use Cookies For</h2>
                        <p className="leading-relaxed font-medium text-sapphire">
                            StudyHours is committed to learning, not tracking for profit. 
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-sm">
                            <li>We <strong>do not</strong> use advertising cookies.</li>
                            <li>We <strong>do not</strong> use retargeting or behavioral advertising cookies.</li>
                            <li>We <strong>do not</strong> sell your cookie data or tracking information to any third party.</li>
                        </ul>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">6. Managing and Opting Out</h2>
                        <div className="space-y-4 text-sm">
                            <div>
                                <h3 className="font-bold mb-2">Browser controls</h3>
                                <p>You can manage or delete cookies through your browser settings:</p>
                                <div className="flex flex-wrap gap-3 mt-2">
                                    <a href="https://support.google.com/chrome/answer/95647" className="text-blue-600 hover:underline">Chrome</a>
                                    <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" className="text-blue-600 hover:underline">Firefox</a>
                                    <a href="https://support.apple.com/en-in/guide/safari/sfri11471/mac" className="text-blue-600 hover:underline">Safari</a>
                                    <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a346a296231" className="text-blue-600 hover:underline">Edge</a>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold mb-2">Google Analytics opt-out</h3>
                                <p>You can install the <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 hover:underline">Google Analytics opt-out browser extension</a>. Note that GA4 is configured with anonymized IPs on our platform.</p>
                            </div>
                            <div>
                                <h3 className="font-bold mb-2">Cookie consent banner</h3>
                                <p>You can update your preferences at any time by clicking the <strong>"Cookie Preferences"</strong> link in our footer. This will re-open the consent banner.</p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">7. Changes to This Policy</h2>
                        <p className="text-sm opacity-60 italic">
                            We may update this policy periodically as we add or remove vendors. Significant changes will be communicated via platform notifications or email.
                        </p>
                    </section>

                    <section className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-900 text-center">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">8. Contact</h2>
                        <p className="text-sm opacity-60">
                            If you have any questions regarding our use of cookies, please contact us at <strong>privacy@studyhours.com</strong>.
                        </p>
                    </section>
                </div>
        </div>
    );
}
