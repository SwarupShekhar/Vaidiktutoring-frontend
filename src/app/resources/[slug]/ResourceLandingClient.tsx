// src/app/resources/[slug]/ResourceLandingClient.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Activity, 
  BookOpen, 
  Award, 
  Sparkles, 
  Lock, 
  Unlock, 
  Copy, 
  Check, 
  Users, 
  ChevronDown, 
  ArrowRight,
  ShieldCheck,
  Download,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import Link_Next from 'next/link';
import { LandingPage, cmsApi, ReferralStatus } from '@/app/lib/cms';
import { PortableText } from 'next-sanity';

interface ResourceLandingClientProps {
  landingPage: LandingPage;
}

const getIcon = (name?: string) => {
  if (!name) return <BookOpen className="text-primary dark:text-secondary shrink-0" size={24} />;
  // Emoji: 4 characters or fewer (handles single emoji which may be 1–2 JS chars, or short strings)
  if ([...name].length <= 4) {
    return <span className="text-2xl">{name}</span>;
  }
  switch (name) {
    case 'GraduationCap':
      return <GraduationCap className="text-primary dark:text-secondary shrink-0" size={24} />;
    case 'Activity':
      return <Activity className="text-primary dark:text-secondary shrink-0" size={24} />;
    case 'BookOpen':
      return <BookOpen className="text-primary dark:text-secondary shrink-0" size={24} />;
    case 'Award':
      return <Award className="text-primary dark:text-secondary shrink-0" size={24} />;
    case 'Sparkles':
      return <Sparkles className="text-primary dark:text-secondary shrink-0" size={24} />;
    default:
      return <BookOpen className="text-primary dark:text-secondary shrink-0" size={24} />;
  }
};

export default function ResourceLandingClient({ landingPage }: ResourceLandingClientProps) {
  const { isLoaded: isAuthLoaded, isSignedIn, userId } = useAuth();
  const { title, heroSection, featuredResource, pageBlocks } = landingPage;

  // Referral states
  const [referralStatus, setReferralStatus] = useState<ReferralStatus | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // 1. Fetch Referral status if gated and user is signed in
  useEffect(() => {
    if (isSignedIn && featuredResource && featuredResource.accessType === 'gated') {
      fetchReferralStatus();
    }
  }, [isSignedIn, featuredResource]);

  const fetchReferralStatus = async () => {
    if (!featuredResource) return;
    setIsVerifying(true);
    try {
      const status = await cmsApi.verifyReferral(featuredResource.slug);
      setReferralStatus(status);
    } catch (error) {
      console.error('Failed to load referral verification details', error);
      toast.error('Could not sync invite stats. Please refresh the page.');
    } finally {
      setIsVerifying(false);
    }
  };

  // 2. Clipboard copy action
  const handleCopyLink = () => {
    if (!userId) return;
    const referralLink = `${window.location.origin}/signup?ref=${userId}`;
    navigator.clipboard.writeText(referralLink);
    setIsCopied(true);
    toast.success('Your unique referral link was copied to your clipboard!');
    setTimeout(() => setIsCopied(false), 3000);
  };

  // Curricula boards highlighted for targeted marketing
  const curriculums = [
    { name: 'GCSE / AQA / Edexcel', region: 'United Kingdom' },
    { name: 'O-Level / PSLE / IP', region: 'Singapore' },
    { name: 'ATAR / HSC / VCE', region: 'Australia' },
    { name: 'Moe UAE / Saudi Ministry', region: 'Middle East' },
  ];

  return (
    <main className="bg-background min-h-screen text-deep-navy dark:text-white transition-colors duration-300">
      
      {/* Dynamic Curriculum Ribbon Bar */}
      <div className="pt-24 pb-2 bg-gradient-to-r from-sapphire to-primary text-white text-xs font-bold text-center overflow-hidden whitespace-nowrap shadow-md select-none">
        <div className="inline-flex items-center gap-8 md:gap-16 animate-marquee">
          {curriculums.map((cur, i) => (
            <span key={i} className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
              <span>{cur.region}: <strong className="font-extrabold text-secondary">{cur.name}</strong> Syllabus</span>
            </span>
          ))}
          {/* Duplicate for infinite feel */}
          {curriculums.map((cur, i) => (
            <span key={`dup-${i}`} className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
              <span>{cur.region}: <strong className="font-extrabold text-secondary">{cur.name}</strong> Syllabus</span>
            </span>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-6 overflow-hidden">
        {/* Glow circles */}
        <div className="absolute top-0 left-0 w-full h-full opacity-35 pointer-events-none">
          <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] bg-primary/10 rounded-full blur-[80px] animate-blob" />
          <div className="absolute top-[30%] right-[15%] w-[450px] h-[450px] bg-sapphire/15 rounded-full blur-[100px] animate-blob animation-delay-2000" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Main Title & CTA copy */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-md border border-white/20 text-xs font-bold text-sapphire dark:text-secondary mb-6 shadow-sm">
                <ShieldCheck size={14} className="text-primary dark:text-secondary" />
                Verified curriculum resource
              </div>
              
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-deep-navy dark:text-white leading-tight">
                {heroSection?.heading || title}
              </h1>
              
              <p className="mt-6 text-lg md:text-xl text-text-secondary dark:text-slate-300 max-w-2xl leading-relaxed font-medium">
                {heroSection?.subheading}
              </p>
              
              {/* Exam Boards Bullet Tags */}
              <div className="mt-8 flex flex-wrap gap-2">
                <span className="px-3 py-1 text-xs font-bold bg-ice-blue dark:bg-blue-950/40 text-sapphire dark:text-secondary border border-powder-blue/40 rounded-lg">
                  United Kingdom GCSE
                </span>
                <span className="px-3 py-1 text-xs font-bold bg-ice-blue dark:bg-blue-950/40 text-sapphire dark:text-secondary border border-powder-blue/40 rounded-lg">
                  Singapore O-Level / PSLE
                </span>
                <span className="px-3 py-1 text-xs font-bold bg-ice-blue dark:bg-blue-950/40 text-sapphire dark:text-secondary border border-powder-blue/40 rounded-lg">
                  Australia HSC / ATAR
                </span>
                <span className="px-3 py-1 text-xs font-bold bg-ice-blue dark:bg-blue-950/40 text-sapphire dark:text-secondary border border-powder-blue/40 rounded-lg">
                  Middle East Ministry
                </span>
              </div>
            </motion.div>
          </div>

          {/* Lead Magnet Interactive Box */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="p-8 rounded-4xl bg-white/70 dark:bg-slate-900/60 border border-white/20 dark:border-white/10 backdrop-blur-3xl shadow-xl hover:shadow-2xl transition-all"
            >
              {featuredResource ? (
                <div className="space-y-6">
                  {/* Subject Tag */}
                  <div className="flex justify-between items-center">
                    <span className="px-3 py-1 rounded-md bg-sapphire text-white text-[10px] font-black tracking-widest uppercase">
                      {featuredResource.subject}
                    </span>
                    <span className="text-xs font-bold text-text-secondary uppercase">
                      {featuredResource.examBoard}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-deep-navy dark:text-white leading-tight">
                    {featuredResource.title}
                  </h3>
                  
                  <p className="text-sm text-text-secondary dark:text-slate-300 font-medium">
                    {featuredResource.description}
                  </p>

                  <div className="pt-4 border-t border-border dark:border-white/5 space-y-4">
                    {/* Free Access Flow */}
                    {featuredResource.accessType === 'free' ? (
                      <a
                        href={featuredResource.fileUrl || '#'}
                        download
                        className="w-full py-4 px-6 rounded-xl bg-primary hover:bg-sapphire text-white font-bold text-center transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                      >
                        <Download size={18} />
                        Download Free Study Guide
                      </a>
                    ) : (
                      /* Gated Referral Flow */
                      <div className="space-y-4">
                        {!isAuthLoaded ? (
                          <div className="py-4 text-center text-text-secondary text-sm font-semibold animate-pulse">
                            Loading secure lock context...
                          </div>
                        ) : !isSignedIn ? (
                          /* Not Signed In */
                          <div className="space-y-4 text-center p-6 rounded-2xl bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/20">
                            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-primary mx-auto">
                              <Lock size={20} className="stroke-[2.5]" />
                            </div>
                            <div>
                              <h4 className="text-base font-bold text-deep-navy dark:text-white">Premium Locked Guide</h4>
                              <p className="text-xs text-text-secondary dark:text-slate-400 mt-1">
                                Complete Clerk sign-in and invite {featuredResource.requiredReferrals} friends to unlock this resource.
                              </p>
                            </div>
                            <Link_Next
                              href={`/login?redirect_url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname : '')}`}
                              className="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-sapphire text-white font-bold text-center transition-all flex items-center justify-center gap-2 shadow-md"
                            >
                              Sign In to Unlock
                              <ArrowRight size={16} />
                            </Link_Next>
                          </div>
                        ) : isVerifying ? (
                          /* Verifying Invites */
                          <div className="py-8 text-center space-y-3">
                            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                            <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                              Verifying referral invite counts...
                            </p>
                          </div>
                        ) : referralStatus?.unlocked ? (
                          /* Unlocked & Ready for Download */
                          <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center flex items-center gap-3 text-green-600 dark:text-green-400 font-semibold text-sm">
                              <Unlock size={18} className="shrink-0 text-green-500" />
                              <span>Congratulations! Download has been unlocked.</span>
                            </div>
                            <a
                              href={referralStatus.fileUrl || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-4 px-6 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-center transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                            >
                              <Download size={18} />
                              Download Study Sheet (PDF)
                            </a>
                          </div>
                        ) : (
                          /* Gated - Locked and Invite Progress Active */
                          <div className="space-y-5">
                            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                              <div className="flex justify-between text-xs font-extrabold text-amber-700 dark:text-amber-400 uppercase mb-2">
                                <span>Invite Progress</span>
                                <span>{referralStatus?.referralsCount || 0} of {featuredResource.requiredReferrals} friends</span>
                              </div>
                              {/* Sleek HSL Progress Bar */}
                              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                                <motion.div
                                  className="h-full bg-amber-500 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ 
                                    width: `${Math.min(
                                      100, 
                                      ((referralStatus?.referralsCount || 0) / featuredResource.requiredReferrals) * 100
                                    )}%` 
                                  }}
                                  transition={{ duration: 0.6 }}
                                />
                              </div>
                            </div>

                            <p className="text-xs text-text-secondary dark:text-slate-300 leading-relaxed font-semibold">
                              To download, copy your unique invite link below and share it with {featuredResource.requiredReferrals - (referralStatus?.referralsCount || 0)} more friends. Once they register a free student account, this file unlocks instantly.
                            </p>

                            {/* Copy Invite Link field */}
                            <div className="flex gap-2">
                              <div className="flex-1 bg-slate-100 dark:bg-white/5 border border-border dark:border-white/10 rounded-xl px-3.5 py-3 text-xs font-mono font-medium truncate select-all flex items-center">
                                {typeof window !== 'undefined' ? `${window.location.origin}/signup?ref=${userId}` : ''}
                              </div>
                              <button
                                onClick={handleCopyLink}
                                className="px-4 bg-primary hover:bg-sapphire text-white rounded-xl font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
                              >
                                {isCopied ? <Check size={16} /> : <Copy size={16} />}
                              </button>
                            </div>

                            <button
                              onClick={fetchReferralStatus}
                              className="w-full py-2.5 text-xs font-bold text-primary dark:text-secondary hover:underline text-center"
                            >
                              Check Invite Count Again
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Fallback CTA if no featured resource exists */
                <div className="space-y-6 text-center">
                  <BookOpen size={48} className="text-primary mx-auto" />
                  <h3 className="text-xl font-bold">Request Customized Study Roadmap</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Chat with an expert education planner to customize worksheets specifically for your upcoming exams.
                  </p>
                  <Link_Next
                    href="/signup?type=assessment"
                    className="w-full py-3.5 px-6 rounded-xl bg-primary text-white font-bold text-center block transition-all shadow-md"
                  >
                    Request Study Plan
                  </Link_Next>
                </div>
              )}
            </motion.div>
          </div>

        </div>
      </section>

      {/* Programmatic Block Rendering */}
      {pageBlocks && pageBlocks.length > 0 && (
        <div className="space-y-0">
          {pageBlocks.map((block, idx) => {
            
            // 1. Features Block Render
            if (block._type === 'featuresBlock') {
              const isList = block.layout === 'list';
              const isGrid2 = block.layout === 'grid-2';
              const gridClass = isList
                ? 'flex flex-col gap-6'
                : isGrid2
                  ? 'grid grid-cols-1 md:grid-cols-2 gap-8'
                  : 'grid grid-cols-1 md:grid-cols-3 gap-8';

              return (
                <section key={idx} className="py-24 px-6 bg-surface dark:bg-[#000926]/40 border-y border-border dark:border-white/5">
                  <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                      <h2 className="text-3xl md:text-4xl font-extrabold text-deep-navy dark:text-white tracking-tight">
                        {block?.heading}
                      </h2>
                      {block?.subheading && (
                        <p className="text-text-secondary dark:text-slate-400 font-medium">
                          {block.subheading}
                        </p>
                      )}
                    </div>

                    <div className={gridClass}>
                      {block.features.map((feat, fidx) => (
                        <div
                          key={fidx}
                          className={`p-8 rounded-3xl bg-glass border border-border dark:border-white/10 card-hover shadow-sm text-left ${isList ? 'flex flex-row items-start gap-5' : 'flex flex-col items-start gap-5'}`}
                        >
                          <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-900/30 shrink-0">
                            {getIcon(feat.icon)}
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-xl font-bold text-deep-navy dark:text-white">
                              {feat.title}
                            </h3>
                            <p className="text-sm text-text-secondary dark:text-slate-400 leading-relaxed font-medium">
                              {feat.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              );
            }

            // 2. Stats Block Render
            if (block._type === 'statsBlock') {
              return (
                <section key={idx} className="py-16 px-6 bg-surface dark:bg-[#000926]/60 border-y border-border dark:border-white/5">
                  <div className="max-w-7xl mx-auto">
                    {block.heading && (
                      <h2 className="text-center text-2xl font-extrabold text-deep-navy dark:text-white mb-10 tracking-tight">{block.heading}</h2>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                      {(block.stats || []).map((stat: any, sidx: number) => (
                        <div key={sidx} className="text-center space-y-2 p-6 rounded-2xl bg-white/50 dark:bg-white/5 border border-border dark:border-white/10">
                          {stat.icon && <div className="text-3xl mb-1">{stat.icon}</div>}
                          <div className="text-4xl md:text-5xl font-extrabold text-gradient-primary leading-none">
                            {stat.value}
                          </div>
                          <div className="text-sm font-semibold text-text-secondary dark:text-slate-400 uppercase tracking-wide">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              );
            }

            // 3. Two Column Block Render
            if (block._type === 'twoColumnBlock') {
              const reversed = block.imagePosition === 'right';
              return (
                <section key={idx} className="py-24 px-6">
                  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Text side */}
                    <div className={reversed ? 'lg:order-1' : ''}>
                      {block.heading && (
                        <h2 className="text-3xl md:text-4xl font-extrabold text-deep-navy dark:text-white tracking-tight mb-6 leading-tight">
                          {block.heading}
                        </h2>
                      )}
                      {block.body && (
                        <p className="text-base text-text-secondary dark:text-slate-300 leading-relaxed font-medium mb-8">
                          {block.body}
                        </p>
                      )}
                      {block.ctaText && (
                        <a
                          href={block.ctaUrl || '#'}
                          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary hover:bg-sapphire text-white font-bold transition-all shadow-lg shadow-blue-500/20 hover:scale-[1.02]"
                        >
                          {block.ctaText}
                        </a>
                      )}
                    </div>
                    {/* Image side */}
                    <div className={reversed ? 'lg:order-0' : ''}>
                      {block.image?.asset?.url ? (
                        <img
                          src={block.image.asset.url}
                          alt={block.image.alt || block.heading || ''}
                          className="w-full rounded-3xl shadow-xl border border-border dark:border-white/10 object-cover"
                        />
                      ) : (
                        <div className="w-full aspect-video rounded-3xl bg-gradient-to-br from-ice-blue to-powder-blue dark:from-blue-950/40 dark:to-sapphire/20 border border-border dark:border-white/10" />
                      )}
                    </div>
                  </div>
                </section>
              );
            }

            // 4. Testimonials Block Render
            if (block._type === 'testimonialsBlock') {
              return (
                <section key={idx} className="py-24 px-6 relative">
                  <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                      <h2 className="text-3xl md:text-4xl font-extrabold text-deep-navy dark:text-white tracking-tight">
                        {block?.heading}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {block.testimonials.map((test, tidx) => (
                        <div
                          key={tidx}
                          className="p-8 rounded-4xl bg-white/50 dark:bg-white/5 border border-border dark:border-white/10 backdrop-blur-md shadow-sm relative flex flex-col justify-between text-left"
                        >
                          <div className="space-y-4">
                            {/* Decorative large quotation marks */}
                            <span className="text-7xl font-serif text-primary/10 absolute top-4 left-6 pointer-events-none">
                              “
                            </span>
                            <p className="text-base text-deep-navy dark:text-slate-200 italic font-medium leading-relaxed relative z-10 pl-4">
                              {test.quote}
                            </p>
                          </div>

                          <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border dark:border-white/5">
                            {test.avatar?.asset?.url && (
                              <img
                                src={test.avatar.asset.url}
                                alt={test.name}
                                className="h-12 w-12 rounded-full object-cover border border-primary/20 shadow-sm"
                              />
                            )}
                            <div>
                              <h4 className="text-sm font-bold text-deep-navy dark:text-white">{test.name}</h4>
                              {(test.examBoard || test.grade) && (
                                <p className="text-xs text-text-secondary dark:text-slate-400 font-semibold">
                                  {[test.examBoard, test.grade].filter(Boolean).join(' • ')}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              );
            }

            // 5. FAQ Block Render
            if (block._type === 'faqBlock') {
              return (
                <section key={idx} className="py-24 px-6 bg-slate-50 dark:bg-[#00061a] border-t border-border dark:border-white/5">
                  <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                      <h2 className="text-3xl md:text-4xl font-extrabold text-deep-navy dark:text-white tracking-tight">
                        {block?.heading}
                      </h2>
                    </div>

                    <div className="space-y-4">
                      {block.faqs.map((faq, fidx) => {
                        const isOpen = openFaqIdx === fidx;
                        return (
                          <div
                            key={fidx}
                            className="border border-border dark:border-white/10 rounded-2xl bg-white/80 dark:bg-slate-900/40 overflow-hidden shadow-xs hover:border-primary/30 transition-all duration-300"
                          >
                            <button
                              onClick={() => setOpenFaqIdx(isOpen ? null : fidx)}
                              className="w-full p-6 text-left flex justify-between items-center gap-4 focus:outline-none"
                            >
                              <span className="font-bold text-deep-navy dark:text-white text-base md:text-lg">
                                {faq.question}
                              </span>
                              <ChevronDown
                                size={20}
                                className={`text-text-secondary shrink-0 transition-transform duration-300 ${
                                  isOpen ? 'rotate-180 text-primary' : ''
                                }`}
                              />
                            </button>
                            
                            <AnimatePresence initial={false}>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                                >
                                  <div className="px-6 pb-6 text-sm md:text-base text-text-secondary dark:text-slate-300 leading-relaxed font-medium">
                                    {faq.answer}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              );
            }

            // 6. CTA Block Render
            if (block._type === 'ctaBlock') {
              const isDark = block.variant === 'dark';
              const isGradient = !block.variant || block.variant === 'primary';
              const isLight = block.variant === 'light';

              return (
                <section key={idx} className="py-16 px-6">
                  <div className="max-w-5xl mx-auto">
                    <div className={`
                      p-12 rounded-[2rem] text-center relative overflow-hidden
                      ${isGradient ? 'bg-gradient-to-r from-primary to-sapphire text-white shadow-2xl shadow-blue-500/20' : ''}
                      ${isDark ? 'bg-[#000926] text-white border border-white/10' : ''}
                      ${isLight ? 'bg-white dark:bg-white/5 border border-border dark:border-white/10 shadow-sm' : ''}
                    `}>
                      {isGradient && (
                        <>
                          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl -ml-24 -mb-24 pointer-events-none" />
                        </>
                      )}
                      <div className="relative z-10 space-y-6">
                        {block.heading && (
                          <h2 className={`text-3xl md:text-4xl font-extrabold tracking-tight ${isLight ? 'text-deep-navy dark:text-white' : 'text-white'}`}>
                            {block.heading}
                          </h2>
                        )}
                        {block.subheading && (
                          <p className={`text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed ${isGradient ? 'text-blue-100' : isLight ? 'text-text-secondary' : 'text-slate-300'}`}>
                            {block.subheading}
                          </p>
                        )}
                        {block.ctaText && (
                          <a
                            href={block.ctaUrl || '#'}
                            className={`
                              inline-flex items-center gap-3 px-8 py-4 rounded-full font-black text-lg transition-all hover:scale-105 hover:shadow-xl
                              ${isGradient ? 'bg-white text-primary' : 'bg-primary text-white shadow-lg shadow-blue-500/20'}
                            `}
                          >
                            {block.ctaText}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              );
            }

            // 7. Video Embed Block Render
            if (block._type === 'videoEmbedBlock') {
              let embedUrl = '';
              if (block.url) {
                const ytMatch = block.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
                const vimeoMatch = block.url.match(/vimeo\.com\/(\d+)/);
                if (ytMatch) embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`;
                else if (vimeoMatch) embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
                else embedUrl = block.url;
              }

              return (
                <section key={idx} className="py-16 px-6 bg-slate-50 dark:bg-[#000926]/30 border-y border-border dark:border-white/5">
                  <div className="max-w-4xl mx-auto">
                    {block.heading && (
                      <h2 className="text-center text-3xl font-extrabold text-deep-navy dark:text-white mb-10 tracking-tight">
                        {block.heading}
                      </h2>
                    )}
                    {embedUrl ? (
                      <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl border border-border dark:border-white/10">
                        <iframe
                          src={embedUrl}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={block.heading || 'Embedded video'}
                        />
                      </div>
                    ) : (
                      <div className="aspect-video rounded-3xl bg-slate-200 dark:bg-white/5 border border-dashed border-border dark:border-white/10 flex items-center justify-center text-text-secondary text-sm">
                        No video URL set
                      </div>
                    )}
                    {block.caption && (
                      <p className="text-center text-sm text-text-secondary dark:text-slate-400 font-medium mt-4">
                        {block.caption}
                      </p>
                    )}
                  </div>
                </section>
              );
            }

            // 8. Custom HTML & CSS Block Render
            if (block._type === 'customHtmlBlock') {
              const hasCss = !!block.css;
              const hasHtml = !!block.html;
              const blockId = `custom-html-block-${idx}`;

              const bgMap: Record<string, string> = {
                none:     '',
                surface:  'bg-white dark:bg-slate-900/60',
                light:    'bg-[#F5F8FF] dark:bg-[#0D1117]',
                navy:     'bg-[#000926] text-white',
                gradient: 'bg-gradient-to-r from-primary to-sapphire text-white',
              };
              const padMap: Record<string, string> = {
                none: '',
                sm:   'py-8 px-6',
                md:   'py-16 px-6',
                lg:   'py-24 px-6',
              };
              const mwMap: Record<string, string> = {
                full: 'w-full',
                '7xl': 'max-w-7xl mx-auto px-6',
                '5xl': 'max-w-5xl mx-auto px-6',
                '3xl': 'max-w-3xl mx-auto px-6',
              };

              const sectionBg  = bgMap[block.sectionBackground  || 'none'] ?? '';
              const sectionPad = padMap[block.sectionPadding     || 'md']   ?? 'py-16 px-6';
              const innerMw    = mwMap[block.maxWidth            || '7xl']  ?? 'max-w-7xl mx-auto px-6';

              return (
                <section key={idx} id={blockId} className={`w-full relative ${sectionBg} ${sectionPad}`}>
                  {hasCss && (
                    <style dangerouslySetInnerHTML={{ __html: block.css || '' }} />
                  )}
                  {hasHtml ? (
                    <div
                      className={innerMw}
                      dangerouslySetInnerHTML={{ __html: block.html || '' }}
                    />
                  ) : (
                    <div className="py-12 px-6 text-center text-xs text-text-secondary bg-slate-50/50 dark:bg-slate-900/10 border border-dashed border-border dark:border-white/5 rounded-3xl max-w-7xl mx-auto my-8">
                      [Empty Custom HTML & CSS Block — add HTML in the CMS]
                    </div>
                  )}
                </section>
              );
            }

            // 9. Rich Text Block Render
            if (block._type === 'richTextBlock') {
              return (
                <section key={idx} className="py-16 px-6 bg-background prose max-w-3xl mx-auto dark:prose-invert text-left font-medium">
                  {block.content && (
                    <PortableText value={block.content} />
                  )}
                </section>
              );
            }

            return null;
          })}
        </div>
      )}

      {/* Unified footer call to action */}
      <section className="py-20 px-6 text-center bg-white dark:bg-[#000926] border-t border-border dark:border-white/5 transition-colors relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="p-12 rounded-[2.5rem] bg-gradient-to-r from-primary to-sapphire text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Need targeted tutoring support?</h2>
              <p className="text-base md:text-lg text-blue-100 mb-8 opacity-90 font-medium max-w-2xl mx-auto">
                Get high-dosage tutoring sprints matched directly to GCSE, O-Level, A-Level, and ATAR curricula with direct tracking.
              </p>
              <Link_Next
                href="/signup?type=assessment"
                className="inline-flex items-center gap-3 px-8 py-4.5 bg-white text-primary font-black text-lg rounded-full hover:scale-105 hover:shadow-xl transition-all"
              >
                Book Free Trial Session
                <ArrowRight size={20} />
              </Link_Next>
            </div>
            {/* Design circle blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl -ml-24 -mb-24" />
          </div>
        </div>
      </section>

    </main>
  );
}
