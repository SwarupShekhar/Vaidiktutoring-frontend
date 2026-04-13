import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | StudyHours",
  description: "Read our terms of service to understand your rights and responsibilities when using our tutoring platform.",
  alternates: {
    canonical: "https://studyhours.com/legal/terms",
  },
  openGraph: {
    title: "Terms of Service | StudyHours",
    description: "Read our terms of service to understand your rights and responsibilities.",
    url: "https://studyhours.com/legal/terms",
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
        <div className="space-y-12">
            <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase text-deep-navy dark:text-white">
                    Terms of Service
                </h1>
                <p className="text-lg opacity-60 italic">Last updated: April 13, 2026</p>
            </div>
            
            <hr className="border-gray-200 dark:border-gray-800" />
            
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-10">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">1. Agreement to Terms</h2>
                        <p className="leading-relaxed">
                            By accessing or using StudyHours ("the Platform"), you agree to be bound by these Terms of Service. These terms constitute a legally binding agreement between you and StudyHours regarding your use of our tutoring services, website, and applications. This agreement applies to all users, including students, tutors, and parents or legal guardians managing accounts for minors. If you are under the age of 13, you may not use the Platform without the express consent and supervision of a parent or legal guardian.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">2. Description of Service</h2>
                        <p className="leading-relaxed">
                            StudyHours is a direct service provider offering expert-led 1-on-1 and group live video tutoring sessions.
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                             <li><strong>Direct Service Model:</strong> StudyHours employs or directly contracts tutors to deliver tutoring sessions on the Platform. Tutors are not independent third-party providers listed for students to browse and hire; they are part of the StudyHours academic team.</li>
                             <li><strong>Responsibility:</strong> StudyHours is responsible for the tutoring services delivered through the Platform.</li>
                             <li><strong>No Guarantees:</strong> While we strive for excellence, we do not guarantee specific academic outcomes, grades, or exam results.</li>
                             <li><strong>Availability:</strong> Access to the Platform is provided on a "best-effort" basis. We do not guarantee uninterrupted access or that the Platform will be error-free at all times.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">3. Account Registration and Security</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Accuracy:</strong> Users must provide accurate and complete information during registration (managed via Clerk).</li>
                            <li><strong>Confidentiality:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</li>
                            <li><strong>Reporting:</strong> You must notify us immediately at <strong>support@studyhours.com</strong> if you suspect any unauthorized access to your account.</li>
                            <li><strong>Non-Transferability:</strong> Each account is for use by one person only and is non-transferable.</li>
                            <li><strong>Termination:</strong> We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activity.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">4. Tutor Terms</h2>
                        <p className="leading-relaxed">Tutors engaged by StudyHours represent and warrant that:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>All qualifications, experience, and credentials provided to StudyHours are accurate and verifiable.</li>
                            <li>They will conduct themselves as professional representatives of the StudyHours academic team.</li>
                            <li>They will not solicit students to move off-platform for tutoring sessions, communication, or payments.</li>
                            <li>The quality and accuracy of the academic content provided during sessions is maintained to StudyHours' professional standards.</li>
                            <li>StudyHours reserves the right to reassess or remove any tutor from the Platform for conduct violations, performance, or safety concerns.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">5. Student and Guardian Terms</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Legitimate Use:</strong> Students must use the Platform solely for legitimate academic and learning purposes.</li>
                            <li><strong>Minor Consent:</strong> For students under the age of 18, a parent or legal guardian must review and accept these Terms on their behalf.</li>
                            <li><strong>Monitoring:</strong> Guardians are responsible for monitoring their child's interactions and usage of the Platform.</li>
                            <li><strong>Recordings:</strong> Students and guardians must not record sessions without the explicit consent of the tutor and StudyHours. Note that StudyHours may record sessions for safety and quality as outlined in the Privacy Policy.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">6. Session Conduct and Safety</h2>
                        <p className="leading-relaxed">
                            All video sessions are conducted via Daily.co. Users must ensure they have a stable internet connection and compatible video/audio equipment.
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Professionalism:</strong> Professional and respectful conduct is required from all users at all times.</li>
                            <li><strong>Privacy:</strong> Users must not share personal contact information (emails, phone numbers, home addresses) during sessions.</li>
                            <li><strong>Zero Tolerance:</strong> Any form of harassment, bullying, or inappropriate behavior will result in immediate account termination without refund.</li>
                            <li><strong>Review:</strong> Session recordings may be reviewed by StudyHours support for dispute resolution or quality assurance.</li>
                            <li><strong>Circumvention:</strong> Users must not attempt to circumvent the Platform's payment systems to arrange off-platform transactions.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">7. Payments and Billing</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Razorpay:</strong> All payments are processed securely via Razorpay. StudyHours does not store your credit card or bank details.</li>
                            <li><strong>Pre-payment:</strong> Payment must be made in full in advance to book and confirm tutoring sessions.</li>
                            <li><strong>Currency:</strong> All pricing is displayed in your local currency at the time of purchase and is subject to change with prior notice.</li>
                            <li><strong>Auto-Renewal:</strong> Subscription plans auto-renew unless cancelled through your account settings before the next billing date.</li>
                            <li><strong>Cancellations:</strong> Our 24-hour cancellation policy applies: sessions cancelled with less than 24 hours' notice will be charged at the full rate.</li>
                            <li><strong>Disputes:</strong> Any disputes regarding charges must be raised within 30 days of the transaction by contacting <strong>support@studyhours.com</strong>.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">8. Refund Policy</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Late Cancellations:</strong> Sessions cancelled with less than 24 hours' notice are non-refundable.</li>
                            <li><strong>Unused Credits:</strong> Refunds for unused credits are evaluated on a case-by-case basis and must be requested within 60 days of purchase.</li>
                            <li><strong>Processing:</strong> Approved refunds are credited back to the original payment method via Razorpay within 7–10 business days.</li>
                            <li><strong>Subscriptions:</strong> Subscription fees are generally non-refundable once a billing cycle has started, except where required by law.</li>
                            <li><strong>Technical Issues:</strong> Technical failures caused by the Platform that prevent a session from occurring are eligible for full credit or complimentary rescheduling.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">9. Intellectual Property</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Platform Ownership:</strong> All Platform content, branding, logos, and software are the exclusive property of StudyHours.</li>
                            <li><strong>Tutor Materials:</strong> Tutors retain ownership of their original teaching materials but grant StudyHours a non-exclusive, worldwide license to display and use those materials within the Platform.</li>
                            <li><strong>Redistribution:</strong> Users may not copy, reproduce, or redistribute Platform content or session recordings without express written permission.</li>
                            <li><strong>Recordings:</strong> Session recordings stored on StudyHours infrastructure are the property of StudyHours and are subject to the data retention terms in our Privacy Policy.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">10. Privacy and Data</h2>
                        <p className="leading-relaxed">
                            Your use of the Platform is also governed by our <a href="/legal/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>, <a href="/legal/cookies" className="text-blue-600 hover:underline">Cookie Policy</a>, and <a href="/legal/refunds" className="text-blue-600 hover:underline">Refund Policy</a>. By agreeing to these Terms, you also acknowledge and agree to the collection and use of your data as described in those policies.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">11. Third-Party Services</h2>
                        <p className="leading-relaxed">
                            The Platform integrates various third-party services including Clerk, Razorpay, Daily.co, and Cloudflare. StudyHours is not responsible for the performance, terms, or privacy policies of these third-party providers.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">12. Disclaimers and Limitation of Liability</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>"As Is":</strong> The Platform is provided on an "as is" and "as available" basis without any warranties of any kind.</li>
                            <li><strong>No Warranty:</strong> we do not warrant that the Platform will be uninterrupted, secure, or free from viruses or errors.</li>
                            <li><strong>Conduct:</strong> StudyHours is not liable for the individual conduct or content provided by tutors or students during sessions.</li>
                            <li><strong>Liability Cap:</strong> To the maximum extent permitted by law, StudyHours' total liability shall not exceed the total amount paid by the user in the six (6) months preceding the claim.</li>
                            <li><strong>Jurisdiction:</strong> Some jurisdictions do not allow the exclusion or limitation of certain liabilities; in such cases, our liability will be limited to the greatest extent permitted by law.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">13. Indemnification</h2>
                        <p className="leading-relaxed">
                            You agree to indemnify, defend, and hold harmless StudyHours and its officers from any claims, damages, or expenses (including legal fees) arising from your violation of these Terms, your misuse of the Platform, or your interactions with other Platform users.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">14. Governing Law and Disputes</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Governing Law:</strong> These Terms are governed by and construed in accordance with the laws of Singapore.</li>
                            <li><strong>Informal Resolution:</strong> Any disputes should first be attempted to be resolved informally by contacting <strong>legal@studyhours.com</strong>.</li>
                            <li><strong>Arbitration:</strong> If informal resolution fails, disputes will be resolved through the courts of Singapore or binding arbitration under the Singapore International Arbitration Centre (SIAC) rules.</li>
                            <li><strong>Class Action Waiver:</strong> You waive any right to participate in a class action lawsuit or class-wide arbitration against StudyHours.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">15. Changes to These Terms</h2>
                        <p className="leading-relaxed">
                            We may update these Terms from time to time. Material changes will be communicated via email or an in-app notice at least 14 days before they take effect. Continued use of the Platform after the effective date constitutes your acceptance of the revised Terms.
                        </p>
                    </section>

                    <section className="space-y-4 pt-8 border-t border-gray-100 dark:border-gray-900 text-center">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">16. Contact</h2>
                        <p className="text-sm opacity-60">For legal inquiries, please contact <strong>legal@studyhours.com</strong>.</p>
                        <p className="text-sm opacity-60">For general support and account help, please contact <strong>support@studyhours.com</strong>.</p>
                    </section>
                </div>
        </div>
    );
}
