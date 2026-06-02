import { Metadata } from 'next';
import SATPrepPageClient from './SATPrepPageClient';

export const metadata: Metadata = {
  title: 'Elite SAT Prep Tutoring | Score 1500+ | StudyHours',
  description: 'Specialized 1-on-1 SAT prep. Master the digital SAT with Ivy-league caliber tutors, proven strategies, and comprehensive practice.',
};

export default function SATPrepPage() {
  return <SATPrepPageClient />;
}
