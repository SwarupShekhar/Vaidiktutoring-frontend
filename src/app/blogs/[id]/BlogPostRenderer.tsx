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
                            '@type': 'Person',
                            name: `${blog.author?.first_name ?? ''} ${blog.author?.last_name ?? ''}`.trim(),
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
            <header className="max-w-[1240px] mx-auto px-6 pt-24 pb-12 text-center">
                <div className="mb-12 flex justify-center opacity-50">
                    <Breadcrumbs customLabels={{ [blog.slug]: blog.title }} />
                </div>
                
                <div className="max-w-5xl mx-auto space-y-10">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.05] tracking-tighter">
                        {blog.title}
                    </h1>

                    <div className="space-y-6">
                        <div className="flex flex-col items-center gap-3">
                            <p className="font-bold text-gray-600 dark:text-gray-400 text-sm">
                                By <span className="text-primary font-black uppercase tracking-tight hover:underline cursor-pointer">{blog.author?.first_name} {blog.author?.last_name}</span>
                                <span className="mx-2 opacity-30">•</span>
                                <span className="uppercase tracking-widest text-[10px] font-black">{blog.createdAt && format(new Date(blog.createdAt), 'MMMM d, yyyy')}</span>
                                <span className="mx-2 opacity-30">•</span>
                                <span className="uppercase tracking-widest text-[10px] font-black">{readingTime} min read</span>
                            </p>
                            
                            <div className="flex flex-wrap items-center justify-center gap-2">
                                <span className="px-4 py-1.5 rounded-full border-2 border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                                    {blog.category || 'Opinion'}
                                </span>
                                {blog.tags && blog.tags.map((tag: string) => (
                                    <span key={tag} className="px-4 py-1.5 rounded-full border-2 border-gray-100 dark:border-white/10 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <p className="text-xl md:text-2xl text-gray-400 dark:text-gray-500 leading-relaxed font-serif italic max-w-3xl mx-auto border-t border-gray-100 dark:border-white/10 pt-8">
                            {blog.excerpt}
                        </p>
                    </div>
                </div>

                {/* FEATURE IMAGE - Full Width with significant top spacing */}
                <div className="mt-24 relative aspect-21/9 rounded-[3rem] overflow-hidden shadow-2xl bg-gray-50 dark:bg-gray-800 group ring-1 ring-black/5">
                    {imgSrc ? (
                        <Image
                            src={imgSrc}
                            alt={blog.title}
                            fill
                            className="object-cover group-hover:scale-[1.02] transition-transform duration-1000"
                            priority
                            sizes="100vw"
                            onError={() => setImgSrc('/images/blog-placeholder.png')}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 font-bold">
                            Loading Image...
                        </div>
                    )}
                </div>
            </header>

            {/* THREE-COLUMN LAYOUT (TOC | Article | Sidebar) */}
            <div className="max-w-[1440px] mx-auto px-6 mt-16 lg:grid lg:grid-cols-[260px_1fr_380px] lg:gap-16 items-start relative">
                
                {/* Left Column: Sticky Table of Contents */}
                <aside className="hidden lg:block sticky top-8 self-start">
                    {headings.length > 0 && (
                        <div className="space-y-8 pr-4">
                            <div className="flex items-center gap-2 font-black text-gray-900 dark:text-white mb-6 uppercase tracking-[0.2em] text-[10px]">
                                <List size={14} className="text-primary" />
                                On this page
                            </div>
                            <nav className="flex flex-col gap-1 border-l border-gray-100 dark:border-white/5">
                                {headings.map((heading, i) => (
                                    <a
                                        key={i}
                                        href={`#${heading.id}`}
                                        className={`
                                            text-sm py-2 pl-4 border-l-2 transition-all duration-300
                                            ${heading.level === 3 ? 'ml-4 text-xs' : 'font-bold'}
                                            ${activeHeading === heading.id
                                                ? 'border-primary text-primary'
                                                : 'border-transparent text-gray-400 hover:text-primary hover:border-primary/30'
                                            }
                                        `}
                                    >
                                        {heading.text}
                                    </a>
                                ))}
                            </nav>
                            
                            <div className="pt-8 border-t border-gray-100 dark:border-white/5 space-y-4">
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Help & Support</div>
                                <Link href="/bookings/new" className="block text-sm font-bold text-gray-900 dark:text-gray-100 hover:text-primary transition-colors">
                                    Book Free Trial →
                                </Link>
                            </div>
                        </div>
                    )}
                </aside>

                {/* Center Column: Article Content */}
                <article className="w-full">
                    {/* Floating Breadcrumbs above content on mobile */}
                    <div className="lg:hidden mb-12">
                        <Breadcrumbs customLabels={{ [blog.slug]: blog.title }} />
                    </div>

                    {/* Mobile TOC */}
                    {headings.length > 0 && (
                        <div className="lg:hidden mb-10 border border-gray-100 dark:border-white/10 rounded-2xl overflow-hidden">
                            <button
                                onClick={() => setTocOpen(prev => !prev)}
                                className="w-full flex items-center justify-between px-5 py-4 text-sm font-black text-gray-700 dark:text-white uppercase tracking-widest bg-gray-50 dark:bg-white/5"
                            >
                                <span className="flex items-center gap-2"><List size={14} className="text-primary" /> On this page</span>
                                <ChevronDown size={16} className={`transition-transform duration-300 ${tocOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {tocOpen && (
                                <nav className="flex flex-col gap-1 px-5 py-4 bg-white dark:bg-black/20 border-t border-gray-100 dark:border-white/10">
                                    {headings.map((heading, i) => (
                                        <a
                                            key={i}
                                            href={`#${heading.id}`}
                                            onClick={() => setTocOpen(false)}
                                            className={`
                                                text-sm py-1.5 transition-colors
                                                ${heading.level === 3 ? 'ml-4 text-xs text-gray-400' : 'font-bold text-gray-700 dark:text-gray-300'}
                                                hover:text-primary
                                            `}
                                        >
                                            {heading.text}
                                        </a>
                                    ))}
                                </nav>
                            )}
                        </div>
                    )}

                    <div className="prose prose-lg md:prose-xl prose-gray dark:prose-invert w-full max-w-none
                        prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:tracking-tight 
                        prose-p:text-[1.2rem] prose-p:leading-[2rem] prose-p:text-[#242424] dark:prose-p:text-gray-300
                        prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-black
                        prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
                        prose-blockquote:border-l-4 prose-blockquote:border-gray-900 dark:prose-blockquote:border-white prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-white/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:not-italic
                        prose-li:text-[1.125rem] prose-li:text-gray-700 dark:prose-li:text-gray-300
                        first-letter:text-5xl first-letter:font-bold first-letter:text-gray-900 dark:first-letter:text-white first-letter:float-left first-letter:mr-3 first-letter:mt-[-4px]">
                        {renderContent()}
                    </div>

                    {/* Author Bio Card */}
                    <div className="mt-16 pt-10 border-t border-gray-100 dark:border-white/10 flex items-start gap-5">
                        <div className="w-16 h-16 shrink-0 rounded-2xl bg-linear-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                            <span className="text-2xl font-black text-primary">
                                {blog.author?.first_name?.[0]}{blog.author?.last_name?.[0]}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <p className="font-black text-gray-900 dark:text-white text-base">
                                {blog.author?.first_name} {blog.author?.last_name}
                            </p>
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">
                                Expert Tutor · StudyHours
                            </p>
                            {blog.author?.bio && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mt-2 max-w-md">
                                    {blog.author.bio}
                                </p>
                            )}
                        </div>
                    </div>
                </article>

                {/* Right Column: Sticky Sidebar (CTA & Related) */}
                <aside className="mt-16 lg:mt-0 space-y-10 sticky top-8 self-start">
                    {/* Card 1: Sidebar CTA */}
                    <div className="bg-primary rounded-[2.5rem] p-8 text-white shadow-2xl shadow-primary/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
                        <div className="relative z-10 space-y-6">
                            <div className="w-full aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 relative">
                                <Image
                                    src="https://res.cloudinary.com/de8vvmpip/image/upload/v1772453122/Gemini_Generated_Image_9j0g679j0g679j0g_sptjdf.png"
                                    alt="Expert Tutoring"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                            </div>
                            <div className="space-y-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">1-on-1 Help</span>
                                <h3 className="text-2xl font-black leading-tight">Struggling with this concept?</h3>
                                <p className="text-white/80 text-sm font-medium leading-relaxed">Our expert tutors simplify complex topics for IB, IGCSE & A-Levels.</p>
                            </div>
                            <Link 
                                href="/bookings/new"
                                className="block w-full py-4 bg-white text-primary font-black text-center rounded-2xl hover:scale-[1.02] transition-all shadow-xl active:scale-95"
                            >
                                Book Free Session
                            </Link>
                        </div>
                    </div>

                    {/* Card 2: Related Posts List */}
                    {relatedPosts.length > 0 && (
                        <div className="bg-gray-50 dark:bg-white/2 rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5">
                            <h3 className="text-sm font-black text-gray-900 dark:text-white mb-8 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary" /> More to Read
                            </h3>
                            <div className="space-y-8">
                                {relatedPosts.slice(0, 3).map((post) => (
                                    <Link key={post.id} href={`/blogs/${post.slug || post.id}`} className="group flex gap-4 items-start">
                                        <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-white dark:bg-gray-800 relative shadow-sm border border-gray-100 dark:border-white/5">
                                            <Image
                                                src={post.imageUrl || '/images/blog-placeholder.png'}
                                                alt={post.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                                                {post.title}
                                            </h4>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                {post.category || 'Education'}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Share */}
                    <div className="px-6 space-y-4">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Share Insight</div>
                        <div className="flex gap-3 flex-wrap">
                            <button
                                onClick={() => {
                                    const url = encodeURIComponent(window.location.href);
                                    const text = encodeURIComponent(blog.title);
                                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${text}`, '_blank', 'noopener,noreferrer');
                                }}
                                className="text-xs font-bold text-gray-500 hover:text-primary transition-colors uppercase tracking-widest"
                            >
                                LinkedIn
                            </button>
                            <button
                                onClick={() => {
                                    const url = encodeURIComponent(window.location.href);
                                    const text = encodeURIComponent(blog.title);
                                    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'noopener,noreferrer');
                                }}
                                className="text-xs font-bold text-gray-500 hover:text-primary transition-colors uppercase tracking-widest"
                            >
                                Twitter
                            </button>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href).then(() => {
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2000);
                                    });
                                }}
                                className="text-xs font-bold text-gray-500 hover:text-primary transition-colors uppercase tracking-widest"
                            >
                                {copied ? 'Copied!' : 'Copy Link'}
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
