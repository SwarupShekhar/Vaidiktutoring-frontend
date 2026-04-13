import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | StudyHours",
  description: "Read our privacy policy to understand how we collect, use, and protect your personal data.",
  alternates: {
    canonical: "https://studyhours.com/legal/privacy",
  },
  openGraph: {
    title: "Privacy Policy | StudyHours",
    description: "Read our privacy policy to understand how we protect your data.",
    url: "https://studyhours.com/legal/privacy",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | StudyHours",
    description: "Read our privacy policy to understand how we protect your data.",
  },
};

export default function PrivacyPage() {
    return (
        <div className="space-y-12">
            <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase text-deep-navy dark:text-white">
                    Privacy Policy
                </h1>
                <p className="text-lg opacity-60 italic">Last Updated: April 13, 2026</p>
            </div>

            <hr className="border-gray-200 dark:border-gray-800" />

            <div className="prose prose-slate dark:prose-invert max-w-none space-y-10">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">1. Introduction</h2>
                        <p>Welcome to StudyHours. This Privacy Policy covers how we collect, use, disclose, and safeguard your information when you visit our platform. StudyHours is an online tutoring service connecting students with tutors for live video sessions. By using StudyHours, you agree to the collection and use of information in accordance with this policy.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-medium mb-2">Information you provide directly</h3>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Personal identification: name, email address, profile photo, and phone number (verified via Twilio).</li>
                                    <li>Payment information: transaction IDs and amounts. We do NOT store your credit or debit card details; these are handled securely by Razorpay.</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-medium mb-2">Information collected automatically</h3>
                                <p>We collect log and usage data when you access the platform, including your IP address, browser type, device info, and session activity.</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-medium mb-2">Information from third parties</h3>
                                <p>Authentication data: if you use social login (Google/GitHub), we receive authentication data from Clerk.</p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
                        <p>We use your data to maintain and improve our services, including:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Account creation and management.</li>
                            <li>Providing live tutoring services and video sessions.</li>
                            <li>Processing payments and managing billing.</li>
                            <li>Sending transactional emails (via Resend) and SMS verifications (via Twilio).</li>
                            <li>Improving platform functionality and monitoring performance (via Sentry).</li>
                            <li>Preventing fraud and abuse (via Cloudflare Turnstile).</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">4. Session Recordings</h2>
                        <p>Live tutoring sessions conducted via Daily.co may be recorded for quality assurance and safety purposes.</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Storage: Recordings are stored securely on Azure Blob Storage.</li>
                            <li>Access: Access is limited to the student, the tutor, and StudyHours support staff for dispute resolution.</li>
                            <li>Retention: Recordings are retained for 60 days.</li>
                            <li>Consent: By participating in sessions, users consent to the potential recording of their sessions.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">5. Cookies and Tracking Technologies</h2>
                        <p>We use cookies and similar tracking technologies to track activity on our platform and hold certain information. This includes cookies for authentication (Clerk), analytics (Google Analytics GA4, Vercel Analytics), and functionality (Razorpay, Daily.co, Cloudflare Turnstile). For more details, please visit our <a href="/cookies" className="text-blue-600 hover:underline">Cookies Policy</a> page.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">6. Data Sharing and Third Parties</h2>
                        <p>We share data with the following vendors to provide our services:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Clerk:</strong> Authentication and user identity</li>
                            <li><strong>Razorpay:</strong> Payment processing (PCI-DSS compliant)</li>
                            <li><strong>Daily.co:</strong> Video session delivery</li>
                            <li><strong>Sentry:</strong> Error logs and performance monitoring</li>
                            <li><strong>Resend:</strong> Transactional email delivery</li>
                            <li><strong>Twilio:</strong> SMS delivery and phone verification</li>
                            <li><strong>Azure:</strong> Secure file and recording storage</li>
                            <li><strong>Google Analytics / Vercel Analytics:</strong> Anonymized usage analytics</li>
                            <li><strong>Cloudflare:</strong> Bot protection and security</li>
                        </ul>
                        <p>We do not sell personal data to third parties.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">7. Data Retention</h2>
                        <p>We retain your personal data for as long as your account is active plus a reasonable period thereafter for legitimate business or legal purposes. Payment records are retained as required by law. Session recordings are retained for 60 days.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">8. Children's Privacy</h2>
                        <p>The minimum age to use StudyHours is 13. If you are under 18, parental or guardian consent is required. Consent is obtained during the registration process. We do not knowingly collect data from children below the minimum age. If such data is discovered, it will be removed promptly. Please contact us to report any concerns.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">9. Your Rights</h2>
                        <div className="space-y-4">
                            <p>You have rights regarding your personal data depending on your region:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>All users:</strong> Access, correction, and deletion of data via account settings or by emailing support.</li>
                                <li><strong>EU/EEA users (GDPR):</strong> Right to data portability, restriction of processing, objection, and lodging complaints with supervisory authorities.</li>
                                <li><strong>California users (CCPA):</strong> Right to know, delete, and opt-out of sale (Note: we do not sell data).</li>
                                <li><strong>India users (DPDP Act 2023):</strong> Right to access, correct, and erase data; right to grievance redressal.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">10. Data Security</h2>
                        <p>We use industry-standard security measures, including HTTPS, secure storage on Azure, and strict access controls. While we strive to protect your data, no system is 100% secure. Users are responsible for protecting their account credentials.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">11. Changes to This Policy</h2>
                        <p>We may update this policy periodically. Significant changes will be announced via email or a banner on the platform. Continued use of our platform after changes constitutes acceptance.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">12. Contact Us</h2>
                        <p>For any privacy-related questions or to exercise your rights, please contact us at <a href="mailto:support@studyhours.com" className="text-blue-600 hover:underline">support@studyhours.com</a>.</p>
                    </section>
            </div>
        </div>
    );
}
