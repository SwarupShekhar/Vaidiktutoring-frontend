'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedClient from '@/app/components/ProtectedClient';
import { useAuthContext } from '@/app/context/AuthContext';
import { blogsApi } from '@/app/lib/blogs';
import { BlogEditor, BlogSidebar } from '@/app/components/blog-editor';

export default function NewBlogPage() {
    const router = useRouter();
    const { user } = useAuthContext();
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<string | null>(null);

    // Permission state
    const isAdmin = user?.role?.toLowerCase() === 'admin';
    const isTutor = user?.role?.toLowerCase() === 'tutor';
    
    // For a new blog, anyone who can access this page can edit it
    const canEdit = true;
    // But only admins can publish directly
    const canPublish = isAdmin;

    const [form, setForm] = useState({
        title: '',
        slug: '',
        category: 'Study Tips',
        imageUrl: '',
        imageAlt: '',
        excerpt: '',
        content: '',
        seoTitle: '',
        seoDescription: '',
        publishedAt: '',
        status: 'PENDING' as 'PENDING' | 'PUBLISHED' | 'REJECTED',
    });

    const handleChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleContentChange = (html: string) => {
        setForm(prev => ({ ...prev, content: html }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!form.title) {
            alert('Please enter a title');
            return;
        }

        setSaving(true);
        try {
            const newBlog = await blogsApi.create({
                title: form.title,
                category: form.category,
                imageUrl: form.imageUrl,
                imageAlt: form.imageAlt,
                excerpt: form.excerpt,
                content: form.content,
                publishedAt: form.publishedAt,
            });
            
            setLastSaved(new Date().toISOString());
            
            if (isAdmin) {
                alert('Blog created and published successfully!');
                router.push('/admin/dashboard');
            } else {
                alert('Blog submitted for admin review!');
                router.push('/tutor/dashboard');
            }
        } catch (error: any) {
            console.error('Failed to create blog:', error);
            alert(error.response?.data?.message || 'Failed to create blog post');
        } finally {
            setSaving(false);
        }
    };

    const handlePublishToggle = (newStatus: 'PUBLISHED' | 'PENDING') => {
        // For a NEW blog, "publishing" just means we will set the status 
        // when we finally click "Create Post". 
        // However, the backend currently sets status based on user role.
        // So for an admin, it's always published initially.
        setForm(prev => ({ ...prev, status: newStatus }));
    };

    return (
        <ProtectedClient roles={['admin', 'tutor']}>
            <div className="min-h-screen bg-background py-8 px-4 lg:px-8">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-(--color-text-primary) tracking-tight">
                                {isAdmin ? 'Create New Masterpiece' : 'Draft New Article'}
                            </h1>
                            <p className="text-text-secondary text-sm mt-1">
                                {isAdmin 
                                    ? 'Your post will be published immediately' 
                                    : 'Your post will be sent to admin for final approval'}
                            </p>
                        </div>
                        <button
                            onClick={() => router.back()}
                            className="px-4 py-2 text-sm font-bold text-text-secondary hover:text-primary transition-colors flex items-center gap-2"
                        >
                            <span>✕</span> Cancel
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Main Editor Area */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit}>
                                {/* TipTap Editor */}
                                <BlogEditor
                                    content={form.content}
                                    onChange={handleContentChange}
                                    editable={canEdit}
                                    canPublish={canPublish}
                                    status={form.status}
                                    onPublishToggle={handlePublishToggle}
                                    lastSaved={lastSaved}
                                />

                                {/* Save/Create Button */}
                                <div className="mt-6 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className={`px-10 py-4 rounded-2xl text-white font-black text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 bg-linear-to-r from-purple-600 to-indigo-600 shadow-purple-500/25 ${saving ? 'opacity-70 cursor-wait' : ''}`}
                                    >
                                        {saving ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <span>{isAdmin ? 'Publish Post 🚀' : 'Submit for Review 📤'}</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <BlogSidebar
                                title={form.title}
                                onTitleChange={(v) => handleChange('title', v)}
                                category={form.category}
                                onCategoryChange={(v) => handleChange('category', v)}
                                imageUrl={form.imageUrl}
                                onImageUrlChange={(v) => handleChange('imageUrl', v)}
                                imageAlt={form.imageAlt}
                                onImageAltChange={(v) => handleChange('imageAlt', v)}
                                excerpt={form.excerpt}
                                onExcerptChange={(v) => handleChange('excerpt', v)}
                                seoTitle={form.seoTitle}
                                onSeoTitleChange={(v) => handleChange('seoTitle', v)}
                                seoDescription={form.seoDescription}
                                onSeoDescriptionChange={(v) => handleChange('seoDescription', v)}
                                publishedAt={form.publishedAt}
                                onPublishedAtChange={(v) => handleChange('publishedAt', v)}
                                slug={form.slug}
                                onSlugChange={(v) => handleChange('slug', v)}
                                status={form.status}
                                lastSaved={lastSaved}
                                editable={canEdit}
                                content={form.content}
                            />
                        </div>

                    </div>
                </div>
            </div>
        </ProtectedClient>
    );
}
