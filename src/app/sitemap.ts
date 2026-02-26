import { MetadataRoute } from 'next';

interface BlogPost {
  id: string;
  slug: string;
  createdAt?: string;
  created_at?: string;
}

// Get blog posts from backend
async function getBlogs(): Promise<BlogPost[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://k-12-backend.onrender.com';
    const res = await fetch(`${baseUrl}/blogs?page=1&limit=1000`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    
    if (!res.ok) throw new Error('Failed to fetch blogs');
    
    const data = await res.json();
    const blogs = Array.isArray(data) ? data : (data.data || []);
    return blogs;
  } catch (error) {
    console.error('Sitemap: Failed to fetch blogs', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://studyhours.com';
  const blogs = await getBlogs();
  const now = new Date().toISOString();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/subjects`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/experts`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/methodology`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Dynamic blog pages with slugs (for SEO indexing)
  const blogPages: MetadataRoute.Sitemap = blogs
    .filter((blog) => blog.slug) // Only include blogs with slugs
    .map((blog) => ({
      url: `${baseUrl}/blogs/${blog.slug}`,
      lastModified: blog.createdAt || blog.created_at || now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

  return [...staticPages, ...blogPages];
}
