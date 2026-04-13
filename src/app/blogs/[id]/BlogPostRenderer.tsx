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
import { List, ChevronRight, Sparkles } from 'lucide-react';
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

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                // Fetch 7 related posts to have enough for sidebar and bottom section
                const { data } = await blogsApi.getAll(1, 7, blog.category);
                setRelatedPosts(data.filter((p: BlogPost) => p.id !== blog.id));
            } catch (error) {
                console.error('Failed to fetch related posts', error);
            }
        };
        fetchRelated();
    }, [blog.category, blog.id]);

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
            {/* HERO SECTION - Header */}
            <header className="max-w-[1240px] mx-auto px-6 pt-16 pb-8 text-center md:text-left">
                <div className="mb-6 flex justify-center md:justify-start">
                  <Breadcrumbs customLabels={{ [blog.slug]: blog.title }} />
                </div>
                
                <div className="max-w-4xl space-y-6">
                    <div className="flex items-center justify-center md:justify-start gap-3">
                        <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
                            {blog.category || 'Education'}
                        </span>
                        <span className="text-gray-500 text-sm font-medium">{readingTime} min read</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-tight">
                        {blog.title}
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 leading-relaxed font-serif italic max-w-3xl">
                        {blog.excerpt}
                    </p>

                    <div className="flex items-center justify-center md:justify-start gap-4 pt-4 border-t border-gray-100 dark:border-white/10 mt-6">
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md ring-2 ring-white">
                            {blog.author?.first_name?.charAt(0) || 'A'}
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-gray-900 dark:text-gray-100 text-base">
                                {blog.author?.first_name} {blog.author?.last_name}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <span>{blog.createdAt && format(new Date(blog.createdAt), 'MMM d, yyyy')}</span>
                                <span>•</span>
                                <span>Education Specialist</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FEATURE IMAGE */}
                <div className="mt-12 relative aspect-21/9 rounded-3xl overflow-hidden shadow-2xl bg-gray-100 dark:bg-gray-800 ring-1 ring-black/5">
                    {imgSrc ? (
                        <Image
                            src={imgSrc}
                            alt={blog.title}
                            fill
                            className="object-cover"
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

            {/* TWO-COLUMN LAYOUT */}
            <div className="max-w-[1240px] mx-auto px-6 mt-16 lg:grid lg:grid-cols-[1fr_380px] lg:gap-16 items-start relative">
                
                {/* Left Column: Article Content */}
                <article className="w-full">
                    <div className="mb-12">
                        <div className="bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-blue-500 p-8 rounded-r-xl">
                            <p className="text-lg text-blue-900 dark:text-blue-200 italic font-medium">
                                &ldquo;Education is not the filling of a pail, but the lighting of a fire.&rdquo;
                            </p>
                        </div>
                    </div>

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
                </article>

                {/* Right Column: Sticky Sidebar */}
                <aside className="mt-16 lg:mt-0 space-y-8 sticky top-6 self-start">
                    {/* Card 1: Sidebar CTA */}
                    <div className="bg-primary rounded-3xl p-6 text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500" />
                        <div className="relative z-10 space-y-4">
                            <div className="w-full aspect-square rounded-2xl overflow-hidden mb-4 border-2 border-white/20 relative">
                                <Image
                                    src="https://res.cloudinary.com/de8vvmpip/image/upload/v1772453122/Gemini_Generated_Image_9j0g679j0g679j0g_sptjdf.png"
                                    alt="Expert Tutoring"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">PERSONALIZED TUTORING</span>
                                <h3 className="text-xl font-black mt-1 leading-tight">Get expert help tailored to your child&apos;s needs.</h3>
                            </div>
                            <p className="text-white/80 text-sm font-medium">1-on-1 sessions for IB, IGCSE, and national curricula worldwide.</p>
                            <Link 
                                href="/bookings/new"
                                className="block w-full py-3 bg-white text-primary font-black text-center rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
                            >
                                Book Free Session
                            </Link>
                        </div>
                    </div>

                    {/* Card 2: Related Posts List */}
                    {relatedPosts.length > 0 && (
                        <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/10 shadow-sm">
                            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                                <Sparkles size={16} className="text-primary" /> Related Posts
                            </h3>
                            <div className="space-y-6">
                                {relatedPosts.slice(0, 2).map((post) => (
                                    <Link key={post.id} href={`/blogs/${post.slug}`} className="group flex gap-4">
                                        <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                                            <Image
                                                src={post.imageUrl || '/images/blog-placeholder.png'}
                                                alt={post.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                                                {post.title}
                                            </h4>
                                            <p className="text-[10px] text-gray-500 mt-1 font-medium">{post.createdAt && format(new Date(post.createdAt), 'MMM d, yyyy')}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Table of Contents Integration */}
                    {headings.length > 0 && (
                        <div className="bg-gray-50/50 dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/10">
                            <div className="flex items-center gap-2 font-black text-gray-900 dark:text-white mb-4 uppercase tracking-wider text-xs">
                                <List size={14} className="text-primary" />
                                On this page
                            </div>
                            <ul className="space-y-3">
                                {headings.map((heading, i) => (
                                    <li key={i} className={`${heading.level === 3 ? 'ml-4' : ''}`}>
                                        <a 
                                            href={`#${heading.id}`}
                                            className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors line-clamp-1 flex items-center gap-2 group"
                                        >
                                            <span className="w-1 h-1 rounded-full bg-gray-300 group-hover:bg-primary" />
                                            {heading.text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    {/* Share & Links */}
                    <div className="px-2 space-y-6">
                        <div>
                            <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-3">Share this pulse</div>
                            <div className="flex gap-2">
                                <button className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-black hover:text-white transition-all">X</button>
                                <button className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-700 hover:text-white transition-all">in</button>
                            </div>
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
