// Blog metadata for SEO
// This ensures all blog pages are properly indexed with their slugs in search engines

export const blogMetadata = {
  // Canonical URL base for blogs
  canonicalBase: 'https://studyhours.com/blogs',
  
  // Schema.org structured data for blog articles
  getArticleSchema: (blog: any) => ({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.imageUrl,
    datePublished: blog.created_at || new Date().toISOString(),
    dateModified: blog.updated_at || blog.created_at || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: `${blog.author?.first_name || ''} ${blog.author?.last_name || ''}`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://studyhours.com/blogs/${blog.slug}`,
    },
  }),

  // OG tags for social media sharing
  getOpenGraphTags: (blog: any) => ({
    'og:type': 'article',
    'og:title': blog.title,
    'og:description': blog.excerpt,
    'og:image': blog.imageUrl,
    'og:url': `https://studyhours.com/blogs/${blog.slug}`,
  }),

  // Twitter card tags
  getTwitterCardTags: (blog: any) => ({
    'twitter:card': 'summary_large_image',
    'twitter:title': blog.title,
    'twitter:description': blog.excerpt,
    'twitter:image': blog.imageUrl,
  }),
};
