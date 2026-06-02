import { Metadata } from 'next';
import AmericanCurriculumPageClient from './AmericanCurriculumPageClient';

export const metadata: Metadata = {
  title: 'US Curriculum & Common Core Tutoring | StudyHours',
  description: 'Expert online tutoring for the US Curriculum (Common Core, NGSS). GPA management, homework help, and holistic learning for Grades K-12.',
};

export default function AmericanCurriculumPage() {
  return <AmericanCurriculumPageClient />;
}
