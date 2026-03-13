import api from './api';

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    imageUrl: string;
    category: string;
    status: 'PENDING' | 'PUBLISHED' | 'REJECTED';
    author_id?: string;
    author: {
        first_name: string;
        last_name: string;
    };
    createdAt: string;
}

const normalizeBlog = (data: any): BlogPost => {
    return {
        ...data,
        imageUrl: data.imageUrl || data.image_url || '',
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
    update: async (id: string, data: Partial<BlogPost>) => {
        const payload = {
            ...data,
            image_url: data.imageUrl,
            created_at: data.createdAt
        };
        const res = await api.patch(`/admin/blogs/${id}`, payload);
        return normalizeBlog(res.data);
    }
};
