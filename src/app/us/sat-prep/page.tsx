import { Metadata } from 'next';
import SATPrepPageClient from './SATPrepPageClient';

export const metadata: Metadata = {
  title: 'Elite Digital SAT Prep Tutoring | Score 1500+ Guaranteed | StudyHours',
  description: 'Specialized 1-on-1 Digital SAT prep online. Master the new adaptive SAT with Ivy-league caliber tutors, proven strategies, and comprehensive practice. Join top percentile scorers.',
  alternates: {
    canonical: 'https://studyhours.com/us/sat-prep',
  },
};

export default function SATPrepPage() {
  return <SATPrepPageClient />;
}
