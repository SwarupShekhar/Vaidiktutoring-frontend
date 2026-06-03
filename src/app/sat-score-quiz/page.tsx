import { Metadata } from 'next';
import SATScoreQuiz from './SATScoreQuiz';

export const metadata: Metadata = {
  title: 'What\'s Your SAT Score Ceiling? | StudyHours',
  description: 'Answer 3 quick questions to find out exactly what\'s capping your SAT score — and what to fix first.',
  openGraph: {
    title: 'What\'s Your SAT Score Ceiling?',
    description: 'Answer 3 quick questions to find out exactly what\'s capping your SAT score.',
    url: 'https://studyhours.com/sat-score-quiz',
  },
};

export default function SATScoreQuizPage() {
  return <SATScoreQuiz />;
}
