import api from './api';

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    imageUrl: string;
    imageAlt?: string;
    category: string;
    status: 'PENDING' | 'PUBLISHED' | 'REJECTED';
    publishedAt?: string;
    author_id?: string;
    author: {
        first_name: string;
        last_name: string;
    };
    createdAt: string;
}

export interface BlogVersion {
    id: string;
    blog_id: string;
    title: string;
    excerpt: string;
    content: string;
    image_url: string;
    image_alt?: string;
    category: string;
    summary: string;
    author_id: string;
    author: {
        first_name: string;
        last_name: string;
    };
    created_at: string;
}

const normalizeBlog = (data: any): BlogPost => {
    return {
        ...data,
        imageUrl: data.imageUrl || data.image_url || '',
        imageAlt: data.imageAlt || data.image_alt || '',
        publishedAt: data.publishedAt || data.published_at || data.created_at || new Date().toISOString(),
        createdAt: data.createdAt || data.created_at || new Date().toISOString(),
        author: data.author || { first_name: 'Unknown', last_name: 'Author' }
    };
};

export const blogsApi = {
    // Get all published blogs (Public)
    getAll: async (page = 1, limit = 9, category?: string) => {
        try {
            const params: any = { page, limit };
            if (category && category !== 'All') params.category = category;

            console.log('[Blogs API] Fetching blogs with params:', params);
            
            const res = await api.get('/blogs', { params });
            const rawData = Array.isArray(res.data) ? res.data : (res.data.data || []);

            console.log('[Blogs API] Successfully fetched blogs:', rawData.length);

            return {
                data: rawData.map(normalizeBlog),
                total: res.data.total || 0,
            };
        } catch (error: any) {
            console.error('[Blogs API] Failed to fetch blogs:', error);
            
            if (error.code === 'ECONNABORTED') {
                throw new Error('Network timeout. Please check your connection.');
            }
            
            if (error.response?.status === 404) {
                // Return empty result if no blogs found
                return {
                    data: [],
                    total: 0,
                };
            }
            
            throw new Error(error.response?.data?.message || 'Failed to load blogs');
        }
    },

    // Get single blog by ID or Slug (Public)
    getOne: async (idOrSlug: string) => {
        const res = await api.get(`/blogs/${idOrSlug}`);
        return normalizeBlog(res.data);
    },

    // Get single blog (Protected: Admin/Tutor)
    getAdminOne: async (id: string) => {
        const res = await api.get(`/admin/blogs/${id}`);
        return normalizeBlog(res.data);
    },

    // Create new blog (Protected: Admin/Tutor)
    create: async (data: Partial<BlogPost>) => {
        // Map camelCase to snake_case for backend
        const payload = {
            ...data,
            image_url: data.imageUrl,
            image_alt: data.imageAlt,
            published_at: data.publishedAt,
            created_at: data.createdAt
        };
        const res = await api.post('/admin/blogs', payload);
        return normalizeBlog(res.data);
    },

    // Admin: Get all blogs (including pending)
    getAdminAll: async (page = 1, limit = 10) => {
        const res = await api.get('/admin/blogs', { params: { page, limit } });
        const rawData = Array.isArray(res.data) ? res.data : (res.data.data || []);
        return {
            data: rawData.map(normalizeBlog),
            total: res.data.total || 0
        };
    },

    // Admin: Approve/Reject
    updateStatus: async (id: string, status: 'PUBLISHED' | 'PENDING' | 'REJECTED') => {
        const res = await api.patch(`/admin/blogs/${id}/status`, { status });
        return normalizeBlog(res.data);
    },

    // Update blog (Protected: Admin/Tutor)
    update: async (id: string, data: Partial<BlogPost> & { summary?: string }) => {
        const payload = {
            ...data,
            image_url: data.imageUrl,
            image_alt: data.imageAlt,
            published_at: data.publishedAt,
            created_at: data.createdAt,
            summary: data.summary
        };
        const res = await api.patch(`/admin/blogs/${id}`, payload);
        return normalizeBlog(res.data);
    },

    // Upload media (Protected: Admin/Tutor)
    uploadMedia: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await api.post('/admin/media/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data; // { url: string }
    },

    // Get version history
    getVersions: async (id: string): Promise<BlogVersion[]> => {
        const res = await api.get(`/admin/blogs/${id}/versions`);
        return res.data;
    },

    // Restore a version
    restoreVersion: async (blogId: string, versionId: string): Promise<BlogPost> => {
        const res = await api.post(`/admin/blogs/${blogId}/versions/${versionId}/restore`);
        return normalizeBlog(res.data);
    },

    // Delete a blog (Protected: Admin Only)
    delete: async (id: string) => {
        const res = await api.delete(`/admin/blogs/${id}`);
        return res.data;
    }
};
