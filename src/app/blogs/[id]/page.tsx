import React from 'react';
import type { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import BlogPostRenderer from './BlogPostRenderer';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://vaidiktutoring-backend.onrender.com').replace(/\/$/, '');

// Generate SEO Metadata dynamically on the Server
export async function generateMetadata(
    { params }: { params: Promise<{ id: string }> },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params;
    
    try {
        const res = await fetch(`${API_URL}/blogs/${id}`, { next: { revalidate: 60 } });
        if (!res.ok) return { 
            title: 'Blog Not Found | StudyHours',
            robots: { index: false, follow: true },
            alternates: {
                canonical: `https://studyhours.com/blogs/${id}`
            }
        };
        
        const blog = await res.json();
        const title = blog.seoTitle || blog.title;
        const description = (blog.seoDescription || blog.excerpt || '').substring(0, 160);
        const image = blog.imageUrl || '/images/blog-placeholder.png';
        const keywords = blog.category ? [blog.category, 'education', 'tutoring'] : ['education'];

        return {
            title,
            description,
            keywords,
            alternates: {
                canonical: `https://studyhours.com/blogs/${id}`
            },
            openGraph: {
                title,
                description,
                images: [image],
                url: `https://studyhours.com/blogs/${id}`,
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
        return {
            title: 'Blog Error | StudyHours',
            robots: { index: false, follow: false },
            alternates: {
                canonical: `https://studyhours.com/blogs/${id}`
            }
        };
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
        // Provide fallback content instead of error page for better SEO
        blog = {
            id: 1,
            title: "Educational Insights & Study Tips | StudyHours Blog",
            content: "Discover expert educational resources, study tips, and academic success strategies from StudyHours tutors. Learn about effective learning methods, exam preparation, and student success stories.",
            excerpt: "Expert educational resources for students and parents.",
            imageUrl: "/images/blog-placeholder.png",
            category: "Education",
            createdAt: new Date().toISOString(),
            publishedAt: new Date().toISOString(),
            author: { first_name: 'StudyHours', last_name: 'Team' },
            seoTitle: "Educational Insights & Study Tips | StudyHours Blog",
            seoDescription: "Explore the latest educational insights, study tips, and academic success strategies from the expert tutors at StudyHours."
        };
        error = false; // Prevent error rendering
    }

    // Pass the pre-fetched pure data to the interactive Client Component
    return <BlogPostRenderer blog={blog} />;
}
