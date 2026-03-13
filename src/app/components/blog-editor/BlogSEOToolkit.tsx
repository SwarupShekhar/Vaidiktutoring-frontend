'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, CheckCircle2, AlertCircle, Info, ChevronRight, BarChart3, 
  BookOpen, Link as LinkIcon, Hash, Target
} from 'lucide-react';

interface SEOToolkitProps {
  content: string;
  title: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  imageAlt: string;
}

export default function BlogSEOToolkit({
  content,
  title,
  excerpt,
  seoTitle,
  seoDescription,
  imageAlt
}: SEOToolkitProps) {
  const [targetKeyword, setTargetKeyword] = useState('');
  const [activeTab, setActiveTab] = useState<'score' | 'details'>('score');

  // Helpers
  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const calculateSyllables = (word: string) => {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const syllables = word.match(/[aeiouy]{1,2}/g);
    return syllables ? syllables.length : 1;
  };

  // SEO Analysis Logic
  const analysis = useMemo(() => {
    const plainText = stripHtml(content);
    const words = plainText.split(/\s+/).filter(w => w.length > 0);
    const sentences = plainText.split(/[.!?]+/).filter(s => s.length > 0);
    const wordCount = words.length;
    const sentenceCount = sentences.length || 1;

    // Readability (Simplified Flesch-Kincaid)
    const totalSyllables = words.reduce((acc, word) => acc + calculateSyllables(word), 0);
    const averageWordsPerSentence = wordCount / sentenceCount;
    const averageSyllablesPerWord = totalSyllables / (wordCount || 1);
    const readingEase = 206.835 - 1.015 * averageWordsPerSentence - 84.6 * averageSyllablesPerWord;

    // Keyword Density
    let keywordDensity = 0;
    if (targetKeyword.trim()) {
      const regex = new RegExp(`\\b${targetKeyword.trim()}\\b`, 'gi');
      const matches = plainText.match(regex);
      keywordDensity = matches ? (matches.length / (wordCount || 1)) * 100 : 0;
    }

    // Heading Analysis
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const h1s = doc.querySelectorAll('h1').length;
    const h2s = doc.querySelectorAll('h2').length;
    const h3s = doc.querySelectorAll('h3').length;
    const h4s = doc.querySelectorAll('h4').length;
    const h5s = doc.querySelectorAll('h5').length;
    const h6s = doc.querySelectorAll('h6').length;
    const subheadingsCount = h2s + h3s + h4s + h5s + h6s;

    // Link Analysis
    const links = doc.querySelectorAll('a');
    const totalImages = doc.querySelectorAll('img').length;
    const imagesWithoutAlt = Array.from(doc.querySelectorAll('img')).filter(img => !img.alt || img.alt.trim().length < 5).length;
    
    const externalLinks = Array.from(links).filter(a => a.href.startsWith('http') && !a.href.includes(window.location.hostname)).length;
    const internalLinks = links.length - externalLinks;

    // Length Validations
    const titleStatus = seoTitle.length >= 50 && seoTitle.length <= 60 ? 'good' : 'warning';
    const descStatus = seoDescription.length >= 120 && seoDescription.length <= 160 ? 'good' : 'warning';

    // Scoring (Base 100)
    let score = 0;
    const checks: { label: string; status: 'good' | 'warning' | 'error'; tip: string }[] = [];

    // Title Check
    if (titleStatus === 'good') score += 15;
    checks.push({
      label: 'SEO Title Length',
      status: titleStatus,
      tip: titleStatus === 'good' ? 'Perfect length!' : 'Try to stay between 50-60 characters.'
    });

    // Description Check
    if (descStatus === 'good') score += 15;
    checks.push({
      label: 'Meta Description',
      status: descStatus,
      tip: descStatus === 'good' ? 'Perfect length!' : 'Aim for 120-160 characters for best CTR.'
    });

    // Word Count
    if (wordCount > 300) score += 10;
    checks.push({
      label: 'Content Length',
      status: wordCount > 300 ? 'good' : 'warning',
      tip: wordCount > 300 ? `${wordCount} words is great.` : 'Try to reach at least 300 words for better ranking.'
    });

    // Readability
    if (readingEase > 60) score += 10;
    checks.push({
      label: 'Readability',
      status: readingEase > 60 ? 'good' : (readingEase > 40 ? 'warning' : 'error'),
      tip: readingEase > 60 ? `Good! Score: ${Math.round(readingEase)}` : 'This content might be difficult to read.'
    });

    // Keyword Density
    if (targetKeyword) {
      const kdStatus = keywordDensity >= 0.5 && keywordDensity <= 2.5 ? 'good' : 'warning';
      if (kdStatus === 'good') score += 15;
      checks.push({
        label: 'Keyword Density',
        status: kdStatus,
        tip: `Density is ${keywordDensity.toFixed(1)}%. Aim for 0.5% - 2.5%.`
      });
    }

    // Headings
    if (h1s === 0) checks.push({ label: 'Main Heading', status: 'error', tip: 'Add one (and only one) H1 tag.' });
    else if (h1s > 1) checks.push({ label: 'Main Heading', status: 'warning', tip: 'Multiple H1 tags found. Use only one.' });
    else {
      score += 15;
      checks.push({ label: 'Main Heading', status: 'good', tip: 'Single H1 found.' });
    }

    // Accessibility Check (Header + Content Images)
    const headerAltStatus = imageAlt && imageAlt.length > 10 ? 'good' : 'warning';
    const contentAltStatus = totalImages > 0 && imagesWithoutAlt > 0 ? 'error' : 'good';
    
    if (headerAltStatus === 'good') score += 5;
    if (totalImages > 0 && contentAltStatus === 'good') score += 5;
    else if (totalImages === 0) score += 5; // No images is neutral

    checks.push({
      label: 'Image Accessibility',
      status: headerAltStatus === 'good' && contentAltStatus === 'good' ? 'good' : 'warning',
      tip: contentAltStatus === 'error' 
        ? `${imagesWithoutAlt} inline images missing alt text.` 
        : (headerAltStatus === 'warning' ? 'Header image needs better alt text.' : 'All images have alt text!')
    });

    return { 
      score: Math.min(score, 100), 
      checks, 
      readingEase, 
      wordCount, 
      keywordDensity, 
      h1s, 
      subheadingsCount,
      totalImages,
      internalLinks, 
      externalLinks 
    };
  }, [content, title, excerpt, seoTitle, seoDescription, imageAlt, targetKeyword]);

  const scoreColor = useMemo(() => {
    if (analysis.score >= 80) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (analysis.score >= 50) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
  }, [analysis.score]);

  return (
    <div className="rounded-2xl border border-white/20 dark:border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl">
      {/* Header with Score */}
      <div className={`p-5 flex items-center justify-between border-b border-white/10 ${scoreColor}`}>
        <div className="flex items-center gap-3">
          <Zap size={20} className="animate-pulse" />
          <span className="text-sm font-black uppercase tracking-widest">SEO Health Score</span>
        </div>
        <div className="text-3xl font-black">
          {analysis.score}<span className="text-lg opacity-50">/100</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Keyword Input */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
            <Target size={10} /> Focus Keyword
          </label>
          <div className="relative">
            <input 
              type="text"
              value={targetKeyword}
              onChange={(e) => setTargetKeyword(e.target.value)}
              placeholder="e.g. Study Tips"
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-black/20 border border-white/10 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
            />
            <Hash size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-secondary" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex p-1 rounded-xl bg-black/20">
          <button 
            onClick={() => setActiveTab('score')}
            className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'score' ? 'bg-white/10 text-white' : 'text-text-secondary hover:text-white'}`}
          >
            Checklist
          </button>
          <button 
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'details' ? 'bg-white/10 text-white' : 'text-text-secondary hover:text-white'}`}
          >
            Metrics
          </button>
        </div>

        <div className="min-h-[220px]">
          {activeTab === 'score' ? (
            <div className="space-y-2">
              {analysis.checks.map((check, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/5 group relative overflow-hidden">
                  <div className="flex items-start gap-3 relative z-10">
                    {check.status === 'good' ? (
                      <CheckCircle2 size={16} className="text-emerald-500 mt-0.5" />
                    ) : check.status === 'warning' ? (
                      <AlertCircle size={16} className="text-amber-500 mt-0.5" />
                    ) : (
                      <AlertCircle size={16} className="text-rose-500 mt-0.5" />
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-white leading-none mb-1">{check.label}</h4>
                      <p className="text-[10px] text-text-secondary leading-tight">{check.tip}</p>
                    </div>
                  </div>
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity ${
                    check.status === 'good' ? 'bg-emerald-500' : 
                    check.status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'
                  }`} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <MetricBox label="Word Count" value={analysis.wordCount} icon={<FileText size={12}/>} />
              <MetricBox label="Readability" value={Math.round(analysis.readingEase)} icon={<BookOpen size={12}/>} />
              <MetricBox label="H1 Count" value={analysis.h1s} icon={<span className="font-black text-[10px]">H1</span>} />
              <MetricBox label="Images" value={analysis.totalImages} icon={<ImageIcon size={12}/>} />
              <MetricBox label="Subheadings" value={analysis.subheadingsCount} icon={<span className="font-black text-[10px]">H2-H6</span>} />
              <MetricBox label="Internal Links" value={analysis.internalLinks} icon={<LinkIcon size={12}/>} />
              <MetricBox label="External Links" value={analysis.externalLinks} icon={<LinkIcon size={12}/>} />
            </div>
          )}
        </div>
      </div>

      {/* Improvement Recommendation Banner */}
      {analysis.score < 90 && (
        <div className="p-4 bg-primary/20 border-t border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <Info size={14} className="text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Pro Tip</span>
          </div>
          <p className="text-xs text-white/80 leading-relaxed italic">
            {analysis.score < 50 
              ? "Your content structure needs work. Focus on adding more descriptive meta tags and organizing with clear headings."
              : "You're getting close! Try cross-linking to other related study guides to boost your internal link score."}
          </p>
        </div>
      )}
    </div>
  );
}

function MetricBox({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="p-3 rounded-xl bg-black/20 border border-white/5 flex flex-col items-center justify-center text-center">
      <div className="text-primary mb-1">{icon}</div>
      <div className="text-lg font-black text-white">{value}</div>
      <div className="text-[9px] font-black text-text-secondary uppercase tracking-tight">{label}</div>
    </div>
  );
}

function ImageIcon({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}

function FileText({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}
