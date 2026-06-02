import { Metadata } from 'next';
import APTutoringPageClient from './APTutoringPageClient';

export const metadata: Metadata = {
  title: 'Elite AP Tutoring | Score a 5 | StudyHours',
  description: 'Specialized 1-on-1 AP (Advanced Placement) tutoring. Master AP Calculus, AP Physics, AP US History and more to secure college credit.',
};

export default function APTutoringPage() {
  return <APTutoringPageClient />;
}
