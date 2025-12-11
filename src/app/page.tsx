import HowItWorks from '@/app/components/home/HowItWorks';
import FAQ from '@/app/components/home/FAQ';
import React from 'react';
import HeroCard from '@/app/components/home/HeroCard';
import InteractiveZone from '@/app/components/home/InteractiveZone';
import SubjectsGrid from '@/app/components/home/subjects/SubjectsGrid';
import TutorVetting from '@/app/components/home/TutorVetting';
import SuccessMetrics from '@/app/components/home/SuccessMetrics';
import VirtualClassroom from '@/app/components/home/VirtualClassroom';
import ReviewsSection from '@/app/components/home/reviews/ReviewsSection';
import HomeCTA from '@/app/components/home/HomeCTA';

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <HeroCard />
      <HowItWorks />
      <InteractiveZone />
      <SubjectsGrid />
      <TutorVetting />
      <SuccessMetrics />
      <VirtualClassroom />
      <ReviewsSection />
      <FAQ />
      <HomeCTA />
    </main>
  );
}