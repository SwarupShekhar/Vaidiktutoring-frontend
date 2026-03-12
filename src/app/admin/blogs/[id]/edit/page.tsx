'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedClient from '@/app/components/ProtectedClient';
import ReactMarkdown from 'react-markdown';
import { useAuthContext } from '@/app/context/AuthContext';
import { blogsApi, BlogPost } from '@/app/lib/blogs';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const { user } = useAuthContext();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

    const [form, setForm] = useState({
        title: '',
        category: 'Study Tips',
        imageUrl: '',
        excerpt: '',
        content: '',
    });

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const blog = await blogsApi.getAdminOne(id);
                setForm({
                    title: blog.title,
                    category: blog.category,
                    imageUrl: blog.imageUrl,
                    excerpt: blog.excerpt,
                    content: blog.content,
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            await blogsApi.update(id, form);
            alert('Blog updated successfully!');
            router.push('/admin/dashboard');
        } catch (error: any) {
            console.error('Failed to update blog:', error);
            alert(error.response?.data?.message || 'Failed to update blog post');
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

    return (
        <ProtectedClient roles={['admin', 'tutor']}>
            <div className="min-h-screen bg-background py-12 px-6">
                <div className="max-w-5xl mx-auto">

                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-(--color-text-primary)">
                            Edit Blog Post
                        </h1>
                        <button
                            onClick={() => router.back()}
                            className="text-text-secondary hover:text-primary"
                        >
                            Cancel
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* FORM */}
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={form.title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-(--color-text-primary) focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>

                            {/* Category & Image */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">Category</label>
                                    <select
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-(--color-text-primary) focus:ring-2 focus:ring-primary outline-none appearance-none"
                                    >
                                        <option>Study Tips</option>
                                        <option>Math</option>
                                        <option>Science</option>
                                        <option>English</option>
                                        <option>College Prep</option>
                                        <option>News</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">Image URL</label>
                                    <input
                                        type="url"
                                        name="imageUrl"
                                        required
                                        value={form.imageUrl}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-(--color-text-primary) focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                            </div>

                            {/* Excerpt */}
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Short Excerpt</label>
                                <textarea
                                    name="excerpt"
                                    required
                                    rows={3}
                                    value={form.excerpt}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-(--color-text-primary) focus:ring-2 focus:ring-primary outline-none resize-none"
                                />
                            </div>

                            {/* Content Editor */}
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-text-secondary">
                                        Content (Markdown supported)
                                    </label>
                                    <div className="flex bg-surface rounded-lg p-1 border border-border">
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('write')}
                                            className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${activeTab === 'write' ? 'bg-primary text-white shadow' : 'text-text-secondary hover:text-(--color-text-primary)'}`}
                                        >
                                            Write
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('preview')}
                                            className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${activeTab === 'preview' ? 'bg-primary text-white shadow' : 'text-text-secondary hover:text-(--color-text-primary)'}`}
                                        >
                                            Preview
                                        </button>
                                    </div>
                                </div>

                                {activeTab === 'write' ? (
                                    <textarea
                                        name="content"
                                        required
                                        rows={15}
                                        value={form.content}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-(--color-text-primary) focus:ring-2 focus:ring-primary outline-none font-mono text-sm"
                                    />
                                ) : (
                                    <div className="w-full h-[380px] overflow-y-auto px-4 py-3 rounded-xl bg-surface border border-border">
                                        <div className="prose prose-sm dark:prose-invert max-w-none">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm, remarkBreaks]}
                                                components={{
                                                    h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-6 mb-3 text-(--color-text-primary)" {...props} />,
                                                    h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-5 mb-2 text-(--color-text-primary)" {...props} />,
                                                    h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-4 mb-2 text-(--color-text-primary)" {...props} />,
                                                    p: ({ node, ...props }) => <p className="mb-4 leading-relaxed text-text-secondary" {...props} />,
                                                    ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-1" {...props} />,
                                                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-1" {...props} />,
                                                    blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-primary pl-4 italic my-4 bg-background py-2 rounded-r" {...props} />,
                                                    a: ({ node, ...props }) => <a className="text-primary hover:underline font-medium" {...props} />,
                                                    table: ({ node, ...props }) => <div className="overflow-x-auto mb-4"><table className="min-w-full divide-y divide-border" {...props} /></div>,
                                                    th: ({ node, ...props }) => <th className="px-3 py-2 bg-background text-left text-xs font-semibold text-text-secondary uppercase tracking-wider" {...props} />,
                                                    td: ({ node, ...props }) => <td className="px-3 py-2 whitespace-nowrap text-sm text-text-secondary border-b border-border" {...props} />,
                                                }}
                                            >
                                                {form.content || '*Nothing to preview*'}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 shadow-blue-500/25 ${saving ? 'opacity-70 cursor-wait' : ''}`}
                                >
                                    {saving ? (
                                        <span>Updating...</span>
                                    ) : (
                                        <span>Save Changes 💾</span>
                                    )}
                                </button>
                            </div>

                        </form>

                        {/* PREVIEW CARD */}
                        <div className="hidden lg:block space-y-4">
                            <p className="text-sm font-bold text-text-secondary uppercase tracking-wider">Live Preview</p>

                            <div className="bg-glass rounded-4xl border border-white/20 shadow-xl overflow-hidden pointer-events-none opacity-90 scale-90 origin-top">
                                <div className="h-48 bg-gray-200 relative w-full group">
                                    {form.imageUrl ? (
                                        <img
                                            src={form.imageUrl}
                                            className="w-full h-full object-cover"
                                            alt="Preview"
                                            onError={(e) => {
                                                e.currentTarget.src = '/images/blog-placeholder.png';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 font-medium">
                                            No Image Selected
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-white text-xs font-bold">
                                        {form.category}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-(--color-text-primary) mb-2">
                                        {form.title || 'Your Title Here'}
                                    </h2>
                                    <p className="text-text-secondary text-sm line-clamp-3">
                                        {form.excerpt || 'Your short summary will appear here...'}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </ProtectedClient>
    );
}
