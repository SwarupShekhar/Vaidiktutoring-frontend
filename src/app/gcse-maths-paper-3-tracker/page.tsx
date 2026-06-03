import { Metadata } from 'next';
import GCSEMathsTracker from './GCSEMathsTracker';

export const metadata: Metadata = {
  title: 'GCSE Maths Paper 3 (Calculator) Unseen Topic Tracker & Hacks | StudyHours',
  description: 'Wednesday 10 June is Paper 3. Use this interactive tool to track remaining unseen topics for Edexcel, AQA, and OCR, and unlock top Casio calculator shortcuts.',
  openGraph: {
    title: 'GCSE Maths Paper 3 (Calculator) Unseen Topic Tracker',
    description: 'Track remaining unseen topics for Edexcel, AQA, and OCR, and unlock top Casio calculator shortcuts.',
    url: 'https://studyhours.com/gcse-maths-paper-3-tracker',
  },
};

export default function GCSEMathsTrackerPage() {
  return <GCSEMathsTracker />;
}
