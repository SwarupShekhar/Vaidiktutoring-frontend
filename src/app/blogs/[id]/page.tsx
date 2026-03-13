import React from 'react';
import type { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import BlogPostRenderer from './BlogPostRenderer';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://k-12-backend.onrender.com').replace(/\/$/, '');

// Generate SEO Metadata dynamically on the Server
export async function generateMetadata(
    { params }: { params: Promise<{ id: string }> },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params;
    
    try {
        const res = await fetch(`${API_URL}/blogs/${id}`, { next: { revalidate: 60 } });
        if (!res.ok) return { title: 'Blog Not Found | Vaidik Tutoring' };
        
        const blog = await res.json();
        const title = blog.seoTitle || blog.title;
        const description = (blog.seoDescription || blog.excerpt || '').substring(0, 160);
        const image = blog.imageUrl || '/images/blog-placeholder.png';
        const keywords = blog.category ? [blog.category, 'education', 'tutoring'] : ['education'];

        return {
            title,
            description,
            keywords,
            openGraph: {
                title,
                description,
                images: [image],
                type: 'article',
                publishedTime: blog.publishedAt || blog.created_at || blog.createdAt,
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
                images: [image],
            }
        };
    } catch (e) {
        return { title: 'Blog Error | Vaidik Tutoring' };
    }
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    let blog = null;
    let error = false;
    
    try {
        const res = await fetch(`${API_URL}/blogs/${id}`, { next: { revalidate: 60 } }); // revalidate every 60s
        if (res.ok) {
            blog = await res.json();
            
            // Normalize backend fields if necessary to match BlogPost interface
            blog = {
                ...blog,
                imageUrl: blog.imageUrl || blog.image_url || '',
                imageAlt: blog.imageAlt || blog.image_alt || '',
                publishedAt: blog.publishedAt || blog.published_at || blog.created_at || new Date().toISOString(),
                createdAt: blog.createdAt || blog.created_at || new Date().toISOString(),
                author: blog.author || { first_name: 'Unknown', last_name: 'Author' }
            };
        } else {
            error = true;
        }
    } catch(e) {
        error = true;
    }
    
    if (error || !blog) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background space-y-4">
                <h1 className="text-2xl font-bold text-(--color-text-primary)">Post not found</h1>
                <Link href="/blogs" className="text-primary hover:underline">
                    ← Back to Blogs
                </Link>
            </div>
        );
    }
    
    // Pass the pre-fetched pure data to the interactive Client Component
    return <BlogPostRenderer blog={blog} />;
}
