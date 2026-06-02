import { Metadata } from 'next';
import APTutoringPageClient from './APTutoringPageClient';

export const metadata: Metadata = {
  title: 'Elite AP Tutoring | Score a 5 in AP Exams | StudyHours',
  description: 'Specialized 1-on-1 AP (Advanced Placement) tutoring online. Master AP Calculus, AP Physics, AP US History, AP Biology, and more to secure college credit and top grades.',
  alternates: {
    canonical: 'https://studyhours.com/us/ap-tutoring',
  },
};

export default function APTutoringPage() {
  return <APTutoringPageClient />;
}
