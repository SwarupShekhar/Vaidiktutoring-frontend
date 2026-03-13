'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/app/lib/blogs';
import { format } from 'date-fns';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import { List } from 'lucide-react';

const makeSlug = (text: string) => {
    return String(text)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};

// Recursively extract text from React children to build slugs safely
const extractTextFromNode = (node: any): string => {
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(extractTextFromNode).join('');
    if (node?.props?.children) return extractTextFromNode(node.props.children);
    return '';
};

export default function BlogPostRenderer({ blog }: { blog: BlogPost }) {
    const [imgSrc, setImgSrc] = useState<string>(blog?.imageUrl || '');
    const [headings, setHeadings] = useState<{ id: string, text: string, level: number }[]>([]);

    useEffect(() => {
        if (!blog?.content) return;
        
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
        setHeadings(extracted);
    }, [blog]);

    // Calculate Reading Time (approx 200 words per minute)
    const wordCount = blog.content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    return (
        <main className="min-h-screen bg-[#FDFDFC] pb-24 text-gray-900 font-sans selection:bg-yellow-200">
            {/* HERO SECTION - Split Layout */}
            <header className="max-w-[1240px] mx-auto px-6 pt-16 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Left: Text Content */}
                    <div className="space-y-6 order-2 md:order-1">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
                                {blog.category || 'Opinion'}
                                {!blog.category && <span className="opacity-50 ml-1 text-[10px]">// FALLBACK CATEGORY</span>}
                            </span>
                            <span className="text-gray-500 text-sm font-medium">{readingTime} min read</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] tracking-tight">
                            {blog.title}
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-500 leading-relaxed font-serif italic">
                            {blog.excerpt || 'An in-depth look at how personalized education is reshaping the future of student success.'}
                        </p>

                        <div className="flex items-center gap-4 pt-4 border-t border-gray-100 mt-6">
                            <div className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md ring-2 ring-white">
                                {blog.author?.first_name?.charAt(0) || 'A'}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-base">
                                    {blog.author?.first_name} {blog.author?.last_name}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span>
                                        {blog.createdAt && !isNaN(new Date(blog.createdAt).getTime())
                                            ? format(new Date(blog.createdAt), 'MMM d, yyyy')
                                            : <span className="text-red-400 text-xs bg-red-50 px-2 py-0.5 rounded">Date Missing</span>}
                                    </span>
                                    <span>•</span>
                                    <span>Education Specialist</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Feature Image */}
                    <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-2xl order-1 md:order-2 group bg-gray-100">
                        {imgSrc ? (
                            <Image
                                src={imgSrc}
                                alt={blog.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                                onError={() => setImgSrc('/images/blog-placeholder.png')}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 font-bold">
                                Loading Image...
                            </div>
                        )}
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl"></div>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-6 mb-16">
                <div className="bg-blue-50/50 border-l-4 border-blue-500 p-8 rounded-r-xl">
                    <p className="text-lg text-blue-900 italic font-medium">
                        "Education is not the filling of a pail, but the lighting of a fire."
                    </p>
                </div>
            </div>

            {/* CONTENT CONTAINER WITH TOC ON LARGE SCREENS */}
            <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 xl:grid-cols-[1fr_250px] gap-12 items-start relative">
                
                {/* Main Article Content */}
                <article className="prose prose-lg md:prose-xl prose-gray mx-auto xl:mx-0 w-full max-w-[750px]
                    prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight 
                    prose-p:text-[1.2rem] prose-p:leading-[2rem] prose-p:text-[#242424] 
                    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-gray-900 prose-strong:font-black
                    prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
                    prose-blockquote:border-l-4 prose-blockquote:border-gray-900 prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:not-italic
                    prose-li:text-[1.125rem] prose-li:text-gray-700
                    first-letter:text-5xl first-letter:font-bold first-letter:text-gray-900 first-letter:float-left first-letter:mr-3 first-letter:mt-[-4px]">

                    <ReactMarkdown 
                        remarkPlugins={[remarkGfm, remarkBreaks]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                            h1: ({ node, ...props }: any) => {
                                const id = makeSlug(extractTextFromNode(props.children));
                                return <h2 id={id} className="text-3xl font-black mt-10 mb-6 text-gray-900 leading-tight tracking-tight scroll-mt-24" {...props} />
                            },
                            h2: ({ node, ...props }: any) => {
                                const id = makeSlug(extractTextFromNode(props.children));
                                return <h2 id={id} className="text-2xl font-bold mt-8 mb-4 text-gray-900 leading-snug tracking-tight scroll-mt-24" {...props} />
                            },
                            h3: ({ node, ...props }: any) => {
                                const id = makeSlug(extractTextFromNode(props.children));
                                return <h3 id={id} className="text-xl font-bold mt-6 mb-3 text-gray-900 scroll-mt-24" {...props} />
                            },
                            p: ({ node, ...props }: any) => <p className="mb-6 leading-loose text-lg text-gray-800" {...props} />,
                            ul: ({ node, ...props }: any) => <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-lg text-gray-800" {...props} />,
                            ol: ({ node, ...props }: any) => <ol className="list-decimal list-outside ml-6 mb-6 space-y-2 text-lg text-gray-800" {...props} />,
                            li: ({ node, ...props }: any) => <li className="pl-2" {...props} />,
                            blockquote: ({ node, ...props }: any) => <blockquote className="border-l-4 border-blue-600 pl-6 py-2 italic my-8 bg-blue-50 text-xl text-gray-900 font-serif leading-relaxed rounded-r-lg" {...props} />,
                            a: ({ node, ...props }: any) => <a className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors" {...props} />,
                            strong: ({ node, ...props }: any) => <strong className="font-black text-gray-900" {...props} />,
                            hr: ({ node, ...props }: any) => <hr className="my-10 border-gray-200" {...props} />,
                            code: ({ node, ...props }: any) => <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />,
                            img: ({ node, ...props }: any) => (
                                <span className="block my-8">
                                    <img className="rounded-xl shadow-lg w-full object-cover max-h-[500px]" {...props} alt={props.alt || ''} />
                                </span>
                            )
                        }}>
                        {blog.content}
                    </ReactMarkdown>

                    {/* CTA BLOCK (Appears immediately after text) */}
                    <div className="mt-20 p-10 bg-gray-900 rounded-3xl text-center relative overflow-hidden not-prose">
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl"></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold text-white mb-4">Want this for your child or school?</h2>
                            <p className="text-gray-300 text-lg mb-8 max-w-lg mx-auto">
                                Experience the difference of personalized K-12 learning support. Book a free demo session today.
                            </p>
                            <Link
                                href="/demo"
                                className="inline-block px-8 py-4 bg-white text-gray-900 font-bold text-lg rounded-full hover:bg-gray-100 transition-transform hover:scale-105 shadow-lg shadow-white/10"
                            >
                                Book a free demo session →
                            </Link>
                        </div>
                    </div>
                </article>

                {/* Left Sidebar Table of Contents */}
                <aside className="hidden xl:block sticky top-24 pt-8 border-l border-gray-100 pl-8">
                    {headings.length > 0 && (
                        <nav className="text-sm">
                            <div className="flex items-center gap-2 font-bold text-gray-900 mb-4 uppercase tracking-wider text-xs">
                                <List size={14} />
                                Table of Contents
                            </div>
                            <ul className="space-y-3">
                                {headings.map((heading, i) => (
                                    <li key={i} className={`${heading.level === 3 ? 'ml-4' : ''}`}>
                                        <a 
                                            href={`#${heading.id}`}
                                            className="text-gray-500 hover:text-blue-600 transition-colors line-clamp-2 leading-relaxed"
                                        >
                                            {heading.text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    )}

                    <div className="mt-12">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Share</div>
                        <div className="flex gap-2">
                            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-500 hover:text-white transition-all">X</button>
                            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-700 hover:text-white transition-all">in</button>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Back Button */}
            <div className="mt-16 text-center">
                <Link href="/blogs" className="text-gray-500 hover:text-gray-900 font-medium transition-colors border-b border-transparent hover:border-gray-900 pb-0.5">
                    ← Back to all articles
                </Link>
            </div>
        </main>
    );
}
