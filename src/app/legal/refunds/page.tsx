import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | StudyHours",
  description: "Learn about our refund, cancellation, and credit policies for tutoring sessions.",
  alternates: {
    canonical: "https://studyhours.com/legal/refunds",
  },
};

export default function RefundPolicyPage() {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase text-deep-navy dark:text-white">
          Refund Policy
        </h1>
        <p className="text-lg text-gray-500 italic">Last Updated: April 13, 2026</p>
      </div>

      <hr className="border-gray-200 dark:border-gray-800" />

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-10">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">1. Overview</h2>
          <p className="leading-relaxed">
            StudyHours wants every session to be worth your time. If something goes wrong, we'll make it right where we can. Our goal is to ensure a fair and transparent billing experience for both students and tutors. If you have questions about your charges, please contact us at <strong>support@studyhours.com</strong>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">2. Session Cancellations</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li><strong>Cancelled more than 24 hours before the session:</strong> Full session credit is returned to your account automatically.</li>
            <li><strong>Cancelled less than 24 hours before the session:</strong> The session is charged at the full rate to compensate the tutor's reserved time.</li>
            <li><strong>No-shows:</strong> If a student fails to join a session without prior cancellation, the session is charged at the full rate.</li>
            <li><strong>Tutor Cancellations:</strong> If the tutor cancels or does not show up, the full session credit is returned to your account balance automatically. No action is required from the student.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">3. Technical Issues</h2>
          <p className="leading-relaxed">
            If a session could not take place due to a platform issue on our side, you are eligible for a full credit or a free reschedule. 
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To claim a credit for technical issues, contact <strong>support@studyhours.com</strong> within 48 hours of the affected session.</li>
            <li>Please include a brief description of the issue encountered.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">4. Subscription Plans</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li><strong>Auto-Renewal:</strong> Subscriptions auto-renew at the end of each billing cycle. Fees are non-refundable once a billing cycle has started.</li>
            <li><strong>Cancellation:</strong> If you cancel before the renewal date, you retain access to your plan features until the end of the current billing period.</li>
            <li><strong>Accidental Renewals:</strong> Exceptions for accidental renewals may be considered if a request is raised within 48 hours of the charge. Contact <strong>support@studyhours.com</strong> for assistance.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">5. Unused Credits</h2>
          <p className="leading-relaxed">
            Refund requests for unused session credits are reviewed on a case-by-case basis. 
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Submit refund requests to <strong>support@studyhours.com</strong> within 60 days of purchase.</li>
            <li>Unused credits do not expire as long as your account remains active.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">6. How Refunds Are Processed</h2>
          <p className="leading-relaxed">
            Approved refunds are returned via the original payment method processed through Razorpay.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Refunds typically appear in your account within 7–10 business days.</li>
            <li>We do not issue cash refunds or refunds via check.</li>
          </ul>
        </section>

        <section className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-900 text-center">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">7. Contact</h2>
          <p className="text-sm opacity-60">
            For any queries regarding refunds or billing: <strong>support@studyhours.com</strong>
          </p>
        </section>
      </div>
    </div>
  );
}
