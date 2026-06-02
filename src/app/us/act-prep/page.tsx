import { Metadata } from 'next';
import ACTPrepPageClient from './ACTPrepPageClient';

export const metadata: Metadata = {
  title: 'Elite ACT Prep Tutoring | Score 34+ | StudyHours',
  description: 'Specialized 1-on-1 ACT prep. Master the pace of the ACT with Ivy-league caliber tutors and proven strategies.',
};

export default function ACTPrepPage() {
  return <ACTPrepPageClient />;
}
