import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acceptable Use Policy | StudyHours",
  description: "Guidelines and rules for using the StudyHours platform for students, tutors, and guardians.",
  alternates: {
    canonical: "https://studyhours.com/legal/aup",
  },
};

export default function AcceptableUsePolicyPage() {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase text-deep-navy dark:text-white">
          Acceptable Use Policy
        </h1>
        <p className="text-lg opacity-60 italic">Last Updated: April 13, 2026</p>
      </div>

      <hr className="border-gray-200 dark:border-gray-800" />

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-10">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">1. Overview</h2>
          <p className="leading-relaxed">
            This policy defines what is and isn't acceptable behavior on StudyHours. It applies to all users — students, tutors, and guardians. Our goal is to maintain a safe, professional, and effective learning environment for everyone. Violations of this policy may result in warnings, account suspension, or permanent termination. For questions, contact <strong>support@studyhours.com</strong>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">2. Who This Applies To</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li><strong>Students:</strong> Anyone using the platform to book, attend, or manage tutoring sessions.</li>
            <li><strong>Tutors:</strong> Educators delivering sessions and providing academic content through the platform.</li>
            <li><strong>Guardians:</strong> Parents or legal guardians managing accounts on behalf of minor students.</li>
            <li><strong>General Users:</strong> Anyone accessing StudyHours website, applications, or infrastructure in any capacity.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">3. Prohibited Conduct — All Users</h2>
          <p className="leading-relaxed font-bold text-red-600 dark:text-red-400">The following behaviors are strictly prohibited:</p>
          <ul className="list-disc pl-6 space-y-3">
            <li><strong>Abuse:</strong> Harassment, bullying, threats, or the use of abusive/hateful language toward any other user.</li>
            <li><strong>Circumvention:</strong> Sharing personal contact info (phone numbers, emails, social handles) to arrange sessions or payments outside StudyHours.</li>
            <li><strong>Unauthorized Recording:</strong> Recording sessions without explicit consent from all parties and StudyHours management.</li>
            <li><strong>Impersonation:</strong> Falsely representing yourself as another person, tutor, or StudyHours staff member.</li>
            <li><strong>Illegal Content:</strong> Uploading or sharing content that is illegal, offensive, discriminatory, or sexually explicit.</li>
            <li><strong>Disruption:</strong> Attempting to circumvent, hack, or disrupt the platform’s security or performance.</li>
            <li><strong>Policy Abuse:</strong> Creating multiple accounts to exploit credits, referral bonuses, or promotional offers.</li>
            <li><strong>Legal Compliance:</strong> Any conduct that violates applicable local or international laws and regulations.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">4. Prohibited Conduct — Tutors Specifically</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li><strong>Misrepresentation:</strong> Falsifying qualifications, certifications, or teaching experience on your profile.</li>
            <li><strong>Academic Dishonesty:</strong> Providing content that encourages academic cheating (e.g., writing essays for submission or completing exams for students).</li>
            <li><strong>Off-Platform Solicitation:</strong> Directly or indirectly soliciting students for tutoring or payments outside the platform.</li>
            <li><strong>Copyright Infringement:</strong> Sharing educational materials or content without the appropriate rights or licenses.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">5. Session Conduct</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li><strong>Academic Focus:</strong> Sessions must remain professional and focused on the stated academic subject.</li>
            <li><strong>Professional Environment:</strong> Both tutors and students must be in a private, reasonably quiet, and appropriate environment during live sessions.</li>
            <li><strong>Visibility:</strong> No third parties should be audible or visible during a session without the prior consent of the other participant.</li>
            <li><strong>Safety Monitoring:</strong> StudyHours may review session recordings for quality assurance and safety as described in our Privacy Policy.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">6. Content Standards</h2>
          <p className="leading-relaxed">All content uploaded (photos, documents, materials) must:</p>
          <ul className="list-disc pl-6 space-y-3">
            <li>Be strictly relevant to academic tutoring and learning.</li>
            <li>Not contain offensive, explicit, or unauthorized copyrighted material.</li>
            <li>Not contain malware, scripts, or any executable files that could compromise platform security.</li>
          </ul>
          <p className="text-sm opacity-60">StudyHours reserves the right to remove any content that violates these standards without prior notice.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">7. Minors</h2>
          <p className="leading-relaxed">
            Students under 18 are subject to additional safety protections. Tutors must maintain strictly professional conduct at all times. Any behavior toward a minor deemed inappropriate, grooming-related, or predatory will be reported to relevant law enforcement authorities immediately and result in a permanent platform ban.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">8. Reporting Violations</h2>
          <p className="leading-relaxed">
            If you witness or experience a violation of this policy, please report it to <strong>support@studyhours.com</strong> with as much detail as possible. We take all reports seriously and will investigate promptly. You can also flag a session or user directly from your dashboard.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">9. Enforcement</h2>
          <p className="leading-relaxed">Depending on the severity of the violation, StudyHours may:</p>
          <ul className="list-disc pl-6 space-y-3">
            <li>Issue a formal warning to the user.</li>
            <li>Apply a temporary suspension to the user account.</li>
            <li>Permanently terminate the account without refund.</li>
            <li>Report the user to law enforcement authorities where applicable.</li>
          </ul>
          <p className="text-sm opacity-60 italic">StudyHours reserves the right to make enforcement decisions at its sole discretion.</p>
        </section>

        <section className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-900 text-center">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-sapphire">10. Contact</h2>
          <p className="text-sm opacity-60">
            Questions regarding this policy: <strong>support@studyhours.com</strong>
          </p>
        </section>
      </div>
    </div>
  );
}
