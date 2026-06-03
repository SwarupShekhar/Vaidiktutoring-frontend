import React from 'react';
import dynamic from 'next/dynamic';
import HeroSection from './HeroSection';
import ExitPopupHandler from './ExitPopupHandler';


const ProblemSection = dynamic(() => import('./ProblemSection'));
const ShiftSection = dynamic(() => import('./ShiftSection'));
const TrustSection = dynamic(() => import('./TrustSection'));
const ResultsSection = dynamic(() => import('./ResultsSection'));
const ResultsProofSection = dynamic(() => import('./ResultsProofSection'));
const ReviewCarousel = dynamic(() => import('./ReviewCarousel'));
const FinalCTASection = dynamic(() => import('./FinalCTASection'));
const DiscordBanner = dynamic(() => import('./DiscordBanner'));
const HighDosageIntroStrip = dynamic(() => import('./HighDosageIntroStrip'));
const HowItWorksSection = dynamic(() => import('./HowItWorksSection'));
const SessionOutputs = dynamic(() => import('./SessionOutputs'));
const AssessmentJourney = dynamic(() => import('./AssessmentJourney'));

const HighDosageDefinitionSection = dynamic(() => import('./HighDosageDefinitionSection'));
const OurApproachSection = dynamic(() => import('./OurApproachSection'));
const HighDosageProcessFlow = dynamic(() => import('./HighDosageProcessFlow'));
const PlaybookDashboard = dynamic(() => import('./PlaybookDashboard'));

/**
 * NarrativeHome: Full Redesigned homepage with additions
 */
export default function NarrativeHome() {
  return (

    <main className="relative min-h-screen bg-background selection:bg-primary/20 selection:text-primary transition-colors duration-500">
      <HeroSection />
      <AssessmentJourney />
      <ProblemSection />
      <ShiftSection />

      {/* Divider between ShiftSection and TrustSection */}
      <div className="w-full flex justify-center py-2">
        <div className="h-px w-24 bg-border opacity-60 rounded-full" />
      </div>

      <div id="social-proof" className="relative"><TrustSection /></div>
      <div id="results" className="relative"><ResultsSection /></div>
      <div id="results-proof" className="relative"><ResultsProofSection /></div>
      <div id="reviews" className="relative"><ReviewCarousel /></div>

      {/* Divider between ReviewCarousel and mid-page CTA */}
      <div className="w-full flex justify-center py-2">
        <div className="h-px w-24 bg-border opacity-60 rounded-full" />
      </div>

      {/* Mid-page CTA — visible after social proof */}
      <div id="book-trial" className="relative">
        <section className="w-full py-12 flex flex-col items-center gap-4 bg-background">
          <p className="text-sm text-muted-foreground tracking-wide uppercase">
            Ready to get started?
          </p>
          <h2 className="text-2xl font-medium text-center max-w-md">
            Book a free trial lesson — no commitment required
          </h2>
          <a
            href="/book-trial"
            className="mt-2 px-8 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Book your free lesson →
          </a>
          <p className="text-xs text-muted-foreground">No credit card. Cancel anytime.</p>
        </section>
      </div>

      <HighDosageIntroStrip />

      <React.Suspense fallback={null}>
        <HighDosageDefinitionSection />
        <div id="how-it-works" className="relative"><HowItWorksSection /></div>
        <SessionOutputs />

        {/* Divider between SessionOutputs and PlaybookDashboard */}
        <div className="w-full flex justify-center py-2">
          <div className="h-px w-24 bg-border opacity-60 rounded-full" />
        </div>

        <PlaybookDashboard />
        <OurApproachSection />
        <HighDosageProcessFlow />
      </React.Suspense>

      <DiscordBanner />
      <FinalCTASection />

      {/* Shared Layout Background Elements for "Presence" */}
      <div
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 bg-linear-to-tr from-purple-500/5 via-transparent to-indigo-50/5"
      />

      <ExitPopupHandler />
    </main>

  );
}
