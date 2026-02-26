import { Metadata } from 'next';
import { blogMetadata } from '@/app/lib/blogSeo';

interface BlogLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

// Generate metadata for blog pages
export async function generateMetadata(props: BlogLayoutProps): Promise<Metadata> {
  const params = await props.params;
  const { id: slug } = params;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://k-12-backend.onrender.com';
    const res = await fetch(`${baseUrl}/blogs/${slug}`, {
      next: { revalidate: 3600 }, // Revalidate hourly
    });

    if (!res.ok) {
      return {
        title: 'Blog Not Found | StudyHours',
        description: 'This blog post could not be found.',
      };
    }

    const blog = await res.json();

    return {
      title: `${blog.title} | StudyHours Blog`,
      description: blog.excerpt,
      keywords: [blog.category, 'tutoring', 'education', 'learning'],
      openGraph: {
        type: 'article',
        title: blog.title,
        description: blog.excerpt,
        url: `https://studyhours.com/blogs/${blog.slug}`,
        images: [
          {
            url: blog.imageUrl || blog.image_url,
            width: 1200,
            height: 630,
            alt: blog.title,
          },
        ],
        publishedTime: blog.created_at,
        modifiedTime: blog.updated_at || blog.created_at,
        authors: [`${blog.author?.first_name} ${blog.author?.last_name}`],
        tags: [blog.category],
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.title,
        description: blog.excerpt,
        images: [blog.imageUrl || blog.image_url],
      },
      alternates: {
        canonical: `https://studyhours.com/blogs/${blog.slug}`,
      },

      // Structured data (JSON-LD)
      other: {
        'script:ld+json': JSON.stringify(
          blogMetadata.getArticleSchema(blog)
        ),
      },
    };
  } catch (error) {
    console.error('Error generating blog metadata:', error);
    return {
      title: 'Blog Post | StudyHours',
      description: 'Read our latest blog post on tutoring and education.',
    };
  }
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return <>{children}</>;
}
