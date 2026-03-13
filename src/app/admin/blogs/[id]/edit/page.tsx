'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedClient from '@/app/components/ProtectedClient';
import { useAuthContext } from '@/app/context/AuthContext';
import { blogsApi, BlogPost } from '@/app/lib/blogs';
import { BlogEditor, BlogSidebar } from '@/app/components/blog-editor';

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const { user } = useAuthContext();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<string | null>(null);

    // Permission state
    const [canEdit, setCanEdit] = useState(false);
    const [canPublish, setCanPublish] = useState(false);
    const [permissionsLoaded, setPermissionsLoaded] = useState(false);

    const [form, setForm] = useState({
        title: '',
        slug: '',
        category: 'Study Tips',
        imageUrl: '',
        excerpt: '',
        content: '',
        seoTitle: '',
        seoDescription: '',
        status: 'PENDING' as 'PENDING' | 'PUBLISHED' | 'REJECTED',
        author_id: '',
    });

    // Permission Logic: Check if user can edit/publish
    useEffect(() => {
        if (user && form.author_id) {
            const isAdmin = user.role?.toLowerCase() === 'admin';
            const isTutor = user.role?.toLowerCase() === 'tutor';
            const isAuthor = user.userId === form.author_id || user.id === form.author_id;

            // Admin can do everything
            if (isAdmin) {
                setCanEdit(true);
                setCanPublish(true);
            }
            // Tutors can edit only their own blogs, but cannot publish
            else if (isTutor && isAuthor) {
                setCanEdit(true);
                setCanPublish(false);
            }
            // Tutors viewing others' blogs - read only
            else if (isTutor && !isAuthor) {
                setCanEdit(false);
                setCanPublish(false);
            }
            // Students have no access
            else {
                setCanEdit(false);
                setCanPublish(false);
            }
            
            setPermissionsLoaded(true);
        }
    }, [user, form.author_id]);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const blog = await blogsApi.getAdminOne(id);
                setForm({
                    title: blog.title,
                    slug: blog.slug,
                    category: blog.category,
                    imageUrl: blog.imageUrl,
                    excerpt: blog.excerpt,
                    content: blog.content,
                    seoTitle: blog.title,
                    seoDescription: blog.excerpt,
                    status: blog.status,
                    author_id: blog.author_id || '',
                });
            } catch (error) {
                console.error('Failed to fetch blog:', error);
                alert('Failed to load blog post for editing');
                router.push('/admin/dashboard');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchBlog();
    }, [id, router]);

    const handleChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleContentChange = (html: string) => {
        setForm(prev => ({ ...prev, content: html }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            await blogsApi.update(id, {
                title: form.title,
                category: form.category,
                imageUrl: form.imageUrl,
                excerpt: form.excerpt,
                content: form.content,
            });
            setLastSaved(new Date().toISOString());
            alert('Blog updated successfully!');
            router.push('/admin/dashboard');
        } catch (error: any) {
            console.error('Failed to update blog:', error);
            alert(error.response?.data?.message || 'Failed to update blog post');
        } finally {
            setSaving(false);
        }
    };

    const handlePublishToggle = async (newStatus: 'PUBLISHED' | 'PENDING') => {
        if (!canPublish) return;
        
        setSaving(true);
        try {
            await blogsApi.updateStatus(id, newStatus);
            setForm(prev => ({ ...prev, status: newStatus }));
            setLastSaved(new Date().toISOString());
        } catch (error: any) {
            console.error('Failed to update status:', error);
            alert(error.response?.data?.message || 'Failed to update blog status');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Redirect if no permissions - wait for permissions to be determined
    if (!loading && permissionsLoaded && !canEdit && !canPublish) {
        return (
            <ProtectedClient roles={['admin', 'tutor']}>
                <div className="min-h-screen flex items-center justify-center bg-background">
                    <div className="text-center p-8">
                        <h1 className="text-2xl font-bold text-(--color-text-primary) mb-4">Access Denied</h1>
                        <p className="text-text-secondary mb-4">
                            You can only edit blogs that you have authored.
                        </p>
                        <button
                            onClick={() => router.push('/admin/dashboard')}
                            className="px-6 py-2 bg-primary text-white rounded-lg font-bold"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </ProtectedClient>
        );
    }

    return (
        <ProtectedClient roles={['admin', 'tutor']}>
            <div className="min-h-screen bg-background py-8 px-4 lg:px-8">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-(--color-text-primary)">
                                {canEdit ? 'Edit Blog Post' : 'View Blog'}
                            </h1>
                            <p className="text-text-secondary text-sm mt-1">
                                {user?.role?.toLowerCase() === 'admin' 
                                    ? 'You have full access to all blogs' 
                                    : form.author_id && (user?.userId === form.author_id || user?.id === form.author_id)
                                    ? 'You can only edit your own blogs'
                                    : 'Viewing in read-only mode'}
                            </p>
                        </div>
                        <button
                            onClick={() => router.back()}
                            className="px-4 py-2 text-sm font-bold text-text-secondary hover:text-primary transition-colors"
                        >
                            ← Back
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

                                {/* Save Button */}
                                {canEdit && (
                                    <div className="mt-6 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className={`px-8 py-4 rounded-xl text-white font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 shadow-blue-500/25 ${saving ? 'opacity-70 cursor-wait' : ''}`}
                                        >
                                            {saving ? (
                                                <span>Saving...</span>
                                            ) : (
                                                <>
                                                    <span>Save Changes</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
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
                                excerpt={form.excerpt}
                                onExcerptChange={(v) => handleChange('excerpt', v)}
                                seoTitle={form.seoTitle}
                                onSeoTitleChange={(v) => handleChange('seoTitle', v)}
                                seoDescription={form.seoDescription}
                                onSeoDescriptionChange={(v) => handleChange('seoDescription', v)}
                                slug={form.slug}
                                status={form.status}
                                lastSaved={lastSaved}
                                editable={canEdit}
                            />
                        </div>

                    </div>
                </div>
            </div>
        </ProtectedClient>
    );
}
