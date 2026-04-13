'use client';

import React, { useState, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/app/lib/blogs';
import { format } from 'date-fns';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import { List, ChevronRight, Sparkles, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { blogsApi } from '@/app/lib/blogs';

const makeSlug = (text: string) => {
    return String(text)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};

// Recursively extract text from React children to build slugs safely
const extractTextFromNode = (node: React.ReactNode): string => {
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(extractTextFromNode).join('');
    if (React.isValidElement(node) && node.props) {
        return extractTextFromNode((node.props as { children?: React.ReactNode }).children);
    }
    return '';
};

export default function BlogPostRenderer({ blog }: { blog: BlogPost }) {
    const [imgSrc, setImgSrc] = useState<string>(blog?.imageUrl || '');
    const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
    const [activeHeading, setActiveHeading] = useState<string>('');
    const [tocOpen, setTocOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                // Priority 1: Manual related_blog_ids from Admin
                if (blog.related_blog_ids && blog.related_blog_ids.length > 0) {
                    const manualPosts = await Promise.all(
                        blog.related_blog_ids.slice(0, 3).map(id => blogsApi.getOne(id).catch(() => null))
                    );
                    const validManual = manualPosts.filter((p): p is BlogPost => p !== null);
                    
                    // If we have enough manual ones, use them. Otherwise, augment with category search
                    if (validManual.length >= 3) {
                        setRelatedPosts(validManual);
                        return;
                    }
                    
                    // Priority 2: Augment with Category search if needed
                    const { data } = await blogsApi.getAll(1, 7, blog.category);
                    const automatic = data.filter((p: BlogPost) => 
                        p.id !== blog.id && !blog.related_blog_ids?.includes(p.id)
                    );
                    setRelatedPosts([...validManual, ...automatic].slice(0, 7));
                } else {
                    // Priority 3: Pure Category Fallback
                    const { data } = await blogsApi.getAll(1, 7, blog.category);
                    setRelatedPosts(data.filter((p: BlogPost) => p.id !== blog.id));
                }
            } catch (error) {
                console.error('Failed to fetch related posts', error);
            }
        };
        fetchRelated();
    }, [blog.category, blog.id, blog.related_blog_ids]);

    const headings = useMemo(() => {
        if (!blog?.content) return [];
        
        const extracted: { id: string, text: string, level: number }[] = [];
        const lines = blog.content.split('\n');
        let insideCodeBlock = false;

        for (const line of lines) {
            if (line.startsWith('```')) {
                insideCodeBlock = !insideCodeBlock;
                continue;
            }
            if (insideCodeBlock) continue;

            const match = line.match(/^(#{2,3})\s+(.+)/);
            if (match) {
                const level = match[1].length;
                const text = match[2];
                const id = makeSlug(text);
                extracted.push({ id, text, level });
            }
        }
        return extracted;
    }, [blog]);

    useEffect(() => {
        if (headings.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter(e => e.isIntersecting);
                if (visible.length > 0) {
                    const top = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
                    setActiveHeading(top.target.id);
                }
            },
            { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
        );

        headings.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [headings]);

    // Calculate Reading Time (approx 200 words per minute)
    const wordCount = blog.content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const markdownComponents = {
        h1: ({ children, ...props }: any) => {
            const id = makeSlug(extractTextFromNode(children));
            return <h2 id={id} className="text-3xl font-black mt-10 mb-6 text-gray-900 dark:text-white leading-tight tracking-tight scroll-mt-24" {...props}>{children}</h2>
        },
        h2: ({ children, ...props }: any) => {
            const id = makeSlug(extractTextFromNode(children));
            return <h2 id={id} className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white leading-snug tracking-tight scroll-mt-24" {...props}>{children}</h2>
        },
        h3: ({ children, ...props }: any) => {
            const id = makeSlug(extractTextFromNode(children));
            return <h3 id={id} className="text-xl font-bold mt-6 mb-3 text-gray-900 dark:text-white scroll-mt-24" {...props}>{children}</h3>
        },
        p: ({ children, ...props }: any) => <p className="mb-6 leading-loose text-lg text-gray-800 dark:text-gray-300" {...props}>{children}</p>,
        ul: ({ children, ...props }: any) => <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-lg text-gray-800 dark:text-gray-300" {...props}>{children}</ul>,
        ol: ({ children, ...props }: any) => <ol className="list-decimal list-outside ml-6 mb-6 space-y-2 text-lg text-gray-800 dark:text-gray-300" {...props}>{children}</ol>,
        li: ({ children, ...props }: any) => <li className="pl-2" {...props}>{children}</li>,
        blockquote: ({ children, ...props }: any) => <blockquote className="border-l-4 border-blue-600 pl-6 py-2 italic my-8 bg-blue-50 dark:bg-blue-900/10 text-xl text-gray-900 dark:text-gray-100 font-serif leading-relaxed rounded-r-lg" {...props}>{children}</blockquote>,
        a: ({ children, ...props }: any) => <a className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline font-medium transition-colors" {...props}>{children}</a>,
        strong: ({ children, ...props }: any) => <strong className="font-black text-gray-900 dark:text-white" {...props}>{children}</strong>,
        hr: ({ ...props }: any) => <hr className="my-10 border-gray-200 dark:border-white/10" {...props} />,
        code: ({ children, ...props }: any) => <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>{children}</code>,
        img: ({ ...props }: any) => (
            <span className="block my-8 relative aspect-video">
                <Image 
                    src={props.src || ''} 
                    alt={props.alt || ''} 
                    fill 
                    className="rounded-xl shadow-lg object-contain" 
                />
            </span>
        )
    };
    /* eslint-enable @typescript-eslint/no-explicit-any */

    const MidArticleCTA = () => (
        <div className="my-12 p-8 md:p-10 rounded-3xl bg-linear-to-br from-indigo-600 to-purple-700 text-white shadow-xl shadow-purple-500/20 flex flex-col md:flex-row items-center justify-between gap-8 not-prose">
            <div className="flex-1 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">1-ON-1 TUTORING</span>
                <h3 className="text-2xl md:text-3xl font-black leading-tight">Get Personalized Help</h3>
                <p className="text-white/80 font-medium">Match with an expert tutor for your exact curriculum and goals.</p>
            </div>
            <Link 
                href="/bookings/new"
                className="px-8 py-4 bg-white text-indigo-700 font-black rounded-full hover:scale-105 transition-transform whitespace-nowrap shadow-lg shadow-black/10"
            >
                Book Free Session
            </Link>
        </div>
    );

    const renderContent = () => {
        if (!blog?.content) return null;
        const faqMarker = '## FAQ';
        const hasFaq = blog.content.includes(faqMarker);
        
        if (hasFaq) {
          const [before, after] = blog.content.split(faqMarker);
          return (
            <>
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} rehypePlugins={[rehypeRaw]} components={markdownComponents}>{before}</ReactMarkdown>
              <MidArticleCTA />
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} rehypePlugins={[rehypeRaw]} components={markdownComponents}>{faqMarker + after}</ReactMarkdown>
            </>
          );
        }
        
        const lines = blog.content.split('\n');
        const lastH2Index = lines.reduce((acc, line, idx) => line.startsWith('## ') ? idx : acc, -1);
        
        if (lastH2Index !== -1 && lastH2Index > lines.length * 0.5) {
          const before = lines.slice(0, lastH2Index).join('\n');
          const after = lines.slice(lastH2Index).join('\n');
           return (
            <>
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} rehypePlugins={[rehypeRaw]} components={markdownComponents}>{before}</ReactMarkdown>
              <MidArticleCTA />
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} rehypePlugins={[rehypeRaw]} components={markdownComponents}>{after}</ReactMarkdown>
            </>
          );
        }

        return <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} rehypePlugins={[rehypeRaw]} components={markdownComponents}>{blog.content}</ReactMarkdown>;
    };

    return (
        <main className="min-h-screen bg-background pb-24 text-foreground font-sans selection:bg-yellow-200 dark:selection:bg-blue-900">
            {/* Article JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BlogPosting',
                        headline: blog.title,
                        description: blog.excerpt,
                        image: blog.imageUrl,
                        datePublished: blog.publishedAt || blog.createdAt,
                        dateModified: blog.publishedAt || blog.createdAt,
                        author: {
                            '@type': 'Organization',
                            name: 'StudyHours Editorial',
                        },
                        publisher: {
                            '@type': 'Organization',
                            name: 'StudyHours',
                            url: 'https://studyhours.com',
                        },
                        mainEntityOfPage: {
                            '@type': 'WebPage',
                            '@id': `https://studyhours.com/blogs/${blog.slug || blog.id}`,
                        },
                    }),
                }}
            />

            {/* HERO SECTION - Centered Header */}
            <header className="max-w-[1300px] mx-auto px-6 pt-32 pb-16 text-center">
                <div className="mb-16 flex justify-center opacity-40">
                    <Breadcrumbs customLabels={{ [blog.slug]: blog.title }} />
                </div>
                
                <div className="max-w-5xl mx-auto space-y-12">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.02] tracking-tighter">
                        {blog.title}
                    </h1>

                    <div className="space-y-8">
                        <div className="flex flex-col items-center gap-4">
                            <p className="font-bold text-gray-500 dark:text-gray-400 text-sm">
                                By <span className="text-primary font-black uppercase tracking-tight hover:underline cursor-pointer">StudyHours Editorial</span>
                                <span className="mx-3 opacity-20">•</span>
                                <span className="uppercase tracking-[0.2em] text-[10px] font-black">{blog.createdAt && format(new Date(blog.createdAt), 'MMMM d, yyyy')}</span>
                                <span className="mx-3 opacity-20">•</span>
                                <span className="uppercase tracking-[0.2em] text-[10px] font-black">{readingTime} min read</span>
                            </p>
                            
                            <div className="flex flex-wrap items-center justify-center gap-3">
                                <span className="px-5 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.25em]">
                                    {blog.category || 'Education'}
                                </span>
                                {blog.tags && blog.tags.map((tag: string) => (
                                    <span key={tag} className="px-5 py-2 rounded-full border border-gray-100 dark:border-white/5 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <p className="text-xl md:text-2xl text-gray-400 dark:text-gray-500 leading-relaxed font-serif italic max-w-3xl mx-auto border-t border-gray-100 dark:border-white/10 pt-10">
                            {blog.excerpt}
                        </p>
                    </div>
                </div>

                {/* FEATURE IMAGE - Cinematic Full Width */}
                <div className="mt-28 relative aspect-21/9 rounded-[4rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] group">
                    {imgSrc ? (
                        <Image
                            src={imgSrc}
                            alt={blog.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-2000 ease-out"
                            priority
                            sizes="100vw"
                            onError={() => setImgSrc('/images/blog-placeholder.png')}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300 font-bold uppercase tracking-widest text-xs">
                            Academic Resource
                        </div>
                    )}
                </div>
            </header>

            {/* THREE-COLUMN LAYOUT (TOC | Article | Sidebar) */}
            <div className="max-w-[1500px] mx-auto px-6 mt-24 lg:grid lg:grid-cols-[280px_1fr_400px] lg:gap-20 items-start relative">
                
                {/* Left Column: Sticky Table of Contents */}
                <aside className="hidden lg:block sticky top-12 self-start pt-4">
                    {headings.length > 0 && (
                        <div className="space-y-10 pr-6 border-r border-gray-50 dark:border-white/5">
                            <div className="flex items-center gap-2 font-black text-gray-900 dark:text-white uppercase tracking-[0.3em] text-[9px]">
                                <List size={14} className="text-primary" />
                                Index
                            </div>
                            <nav className="flex flex-col gap-2">
                                {headings.map((heading, i) => (
                                    <a
                                        key={i}
                                        href={`#${heading.id}`}
                                        className={`
                                            text-sm py-2 group transition-all duration-300 relative
                                            ${heading.level === 3 ? 'pl-8 text-xs border-l border-gray-100 dark:border-white/5' : 'font-bold pl-2'}
                                            ${activeHeading === heading.id
                                                ? 'text-primary'
                                                : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                            }
                                        `}
                                    >
                                        {activeHeading === heading.id && heading.level !== 3 && (
                                            <motion.div 
                                                layoutId="active-toc"
                                                className="absolute left-[-2px] w-1 h-5 bg-primary rounded-full"
                                            />
                                        )}
                                        {heading.text}
                                    </a>
                                ))}
                            </nav>
                            
                            <div className="pt-10 space-y-5">
                                <div className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">Support Hub</div>
                                <Link href="/bookings/new" className="group flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100 italic">
                                    Book Free Trial <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    )}
                </aside>

                {/* Center Column: Article Content */}
                <article className="w-full">
                    {/* Mobile TOC */}
                    {headings.length > 0 && (
                        <div className="lg:hidden mb-16 border border-gray-100 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm">
                            <button
                                onClick={() => setTocOpen(prev => !prev)}
                                className="w-full flex items-center justify-between px-6 py-5 text-sm font-black text-gray-800 dark:text-white uppercase tracking-widest bg-gray-50 dark:bg-white/5"
                            >
                                <span className="flex items-center gap-3"><List size={16} className="text-primary" /> Index</span>
                                <ChevronDown size={18} className={`transition-transform duration-500 ${tocOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {tocOpen && (
                                    <motion.nav 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="flex flex-col gap-2 px-6 py-5 bg-white dark:bg-[#0A0A0B] border-t border-gray-100 dark:border-white/10"
                                    >
                                        {headings.map((heading, i) => (
                                            <a
                                                key={i}
                                                href={`#${heading.id}`}
                                                onClick={() => setTocOpen(false)}
                                                className={`
                                                    py-2 transition-colors
                                                    ${heading.level === 3 ? 'pl-6 text-xs text-gray-400' : 'font-bold text-sm text-gray-700 dark:text-gray-200'}
                                                    hover:text-primary
                                                `}
                                            >
                                                {heading.text}
                                            </a>
                                        ))}
                                    </motion.nav>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    <div className="prose prose-lg md:prose-xl prose-gray dark:prose-invert w-full max-w-none
                        prose-headings:font-black prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:tracking-tighter 
                        prose-p:text-[1.125rem] prose-p:leading-[2.1] prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:mb-10
                        prose-a:text-primary prose-a:font-bold prose-a:underline-offset-4
                        prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-8 prose-blockquote:px-10 prose-blockquote:rounded-3xl prose-blockquote:not-italic prose-blockquote:my-16
                        prose-li:text-[1.125rem] prose-li:leading-[2] prose-li:mb-4
                        first-letter:text-6xl first-letter:font-black first-letter:text-primary first-letter:mr-4 first-letter:mt-2 first-letter:float-left">
                        {renderContent()}
                    </div>

                    {/* Author Footer */}
                    <div className="mt-24 pt-12 border-t border-gray-100 dark:border-white/10 text-center space-y-4">
                        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.3em]">
                                Verified Curriculum Resource
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 italic">Published by StudyHours Global Editorial Board</p>
                    </div>
                </article>

                {/* Right Column: Sticky Sidebar (CTA & Related) */}
                <aside className="mt-24 lg:mt-0 space-y-12 sticky top-12 self-start">
                    {/* Card 1: Sidebar CTA - High Performance Mastery */}
                    <div className="relative group overflow-hidden rounded-[3rem] bg-[#0F1115] p-8 text-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] border border-white/5">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px] group-hover:bg-primary/30 transition-all duration-1000" />
                        
                        <div className="relative z-10 space-y-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                                <Sparkles size={12} className="text-primary" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Premium Tutoring</span>
                            </div>
                            
                            <div className="space-y-3">
                                <h3 className="text-3xl font-black leading-[1.1] tracking-tighter">Master the Curriculum.</h3>
                                <p className="text-gray-400 text-sm font-medium leading-relaxed">Expert 1-on-1 guidance for IB, IGCSE & A-Levels tailored to your goals.</p>
                            </div>

                            <div className="space-y-4">
                                <Link 
                                    href="/bookings/new"
                                    className="flex items-center justify-center gap-2 w-full py-5 bg-primary hover:bg-primary/90 text-white font-black text-sm rounded-2xl transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Start Free Session <ChevronRight size={16} />
                                </Link>
                                <p className="text-center text-[10px] text-gray-500 font-bold uppercase tracking-widest">No Credit Card Required</p>
                            </div>

                            <div className="pt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                <span>Global Faculty</span>
                                <span className="w-1 h-1 rounded-full bg-white/20" />
                                <span>24/7 Support</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Related Posts List */}
                    {relatedPosts.length > 0 && (
                        <div className="bg-white dark:bg-white/2 rounded-[3rem] p-8 border border-gray-100 dark:border-white/5 shadow-sm">
                            <h3 className="text-[10px] font-black text-gray-900 dark:text-white mb-10 uppercase tracking-[0.3em] flex items-center gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Compendium
                            </h3>
                            <div className="space-y-10">
                                {relatedPosts.slice(0, 3).map((post) => (
                                    <Link key={post.id} href={`/blogs/${post.slug || post.id}`} className="group space-y-3 block">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-16 h-16 shrink-0 rounded-2xl overflow-hidden bg-gray-50 dark:bg-[#15171C] relative border border-gray-100 dark:border-white/5">
                                                <Image
                                                    src={post.imageUrl || '/images/blog-placeholder.png'}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">
                                                    {post.category || 'Opinion'}
                                                </p>
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-[1.3] line-clamp-2 group-hover:text-primary transition-colors">
                                                    {post.title}
                                                </h4>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Share */}
                    <div className="px-8 pt-8 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Social Export</div>
                        <div className="flex gap-6">
                            <button
                                onClick={() => {
                                    const url = encodeURIComponent(window.location.href);
                                    const text = encodeURIComponent(blog.title);
                                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${text}`, '_blank', 'noopener,noreferrer');
                                }}
                                className="text-[10px] font-black text-gray-500 hover:text-primary transition-colors uppercase tracking-[0.2em]"
                            >
                                LI
                            </button>
                            <button
                                onClick={() => {
                                    const url = encodeURIComponent(window.location.href);
                                    const text = encodeURIComponent(blog.title);
                                    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'noopener,noreferrer');
                                }}
                                className="text-[10px] font-black text-gray-500 hover:text-primary transition-colors uppercase tracking-[0.2em]"
                            >
                                TW
                            </button>
                        </div>
                    </div>
                </aside>
            </div>

            {/* FULL WIDTH RELATED STORIES SECTION */}
            {relatedPosts.length > 2 && (
                <section className="max-w-[1240px] mx-auto px-6 mt-32 border-t border-gray-100 dark:border-white/10 pt-20">
                    <div className="text-center mb-16">
                        <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">MORE INSIGHTS</span>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mt-2">Related Stories</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {relatedPosts.slice(2, 5).map((post) => (
                            <Link 
                                key={post.id} 
                                href={`/blogs/${post.slug}`}
                                className="group flex flex-col bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all"
                            >
                                <div className="aspect-16/10 relative overflow-hidden bg-gray-50">
                                    <Image
                                        src={post.imageUrl || '/images/blog-placeholder.png'}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                                <div className="p-6 space-y-3">
                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                                        {post.category || 'Opinion'}
                                    </span>
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                        {post.excerpt || 'Discover more about this topic and enhance your learning journey.'}
                                    </p>
                                    <div className="pt-4 flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            {post.createdAt && format(new Date(post.createdAt), 'MMM d, yyyy')}
                                        </span>
                                        <span className="text-xs font-black text-gray-900 dark:text-white flex items-center gap-1 group-hover:gap-2 transition-all">
                                            Read More <ChevronRight size={14} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Back Button */}
            <div className="mt-20 text-center">
                <Link href="/blogs" className="px-6 py-2 rounded-full border border-gray-200 dark:border-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white font-medium transition-all hover:bg-gray-50 dark:hover:bg-white/5">
                    ← Back to all articles
                </Link>
            </div>
        </main>
    );
}
