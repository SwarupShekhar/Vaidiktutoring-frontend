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
        const params: any = { page, limit };
        if (category && category !== 'All') params.category = category;

        const res = await api.get('/blogs', { params });
        const rawData = Array.isArray(res.data) ? res.data : (res.data.data || []);

        return {
            data: rawData.map(normalizeBlog),
            total: res.data.total || 0,
        };
    },

    // Get single blog by ID or Slug (Public)
    getOne: async (idOrSlug: string) => {
        const res = await api.get(`/blogs/${idOrSlug}`);
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
    updateStatus: async (id: string, status: 'PUBLISHED' | 'REJECTED') => {
        const res = await api.patch(`/admin/blogs/${id}/status`, { status });
        return normalizeBlog(res.data);
    }
};
