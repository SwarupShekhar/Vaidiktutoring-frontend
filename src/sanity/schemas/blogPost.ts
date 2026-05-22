import { defineType, defineField } from 'sanity'

export const blogPostSchema = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(10).max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt / Summary',
      type: 'text',
      rows: 3,
      description: 'A short 1–2 sentence summary used for blog cards and meta descriptions.',
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: 'mainImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          'GCSE', 'A-Level', 'IB', 'O-Level', 'IGCSE',
          'ATAR', 'HSC', 'VCE', 'QCE', 'WACE', 'PSLE', 'IP',
          'SAT / ACT', 'Study Tips', 'Subject Guides', 'Careers',
        ],
      },
    }),
    defineField({
      name: 'subject',
      title: 'Subject',
      type: 'string',
      options: {
        list: [
          'Mathematics', 'Physics', 'Chemistry', 'Biology',
          'English Language', 'English Literature', 'Economics',
          'Business Studies', 'History', 'Geography', 'Computer Science',
          'Psychology', 'Sociology', 'General',
        ],
      },
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'body',
      title: 'Body Content',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
            defineField({ name: 'caption', title: 'Caption', type: 'string' }),
          ],
        },
        {
          name: 'callout',
          title: 'Callout Box',
          type: 'object',
          fields: [
            defineField({ name: 'text', title: 'Text', type: 'text' }),
            defineField({
              name: 'type',
              title: 'Type',
              type: 'string',
              options: { list: ['tip', 'warning', 'info', 'success'] },
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'metaTitle', title: 'Meta Title', type: 'string' }),
        defineField({ name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 2 }),
        defineField({ name: 'keywords', title: 'Keywords (comma separated)', type: 'string' }),
      ],
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['draft', 'published', 'archived'] },
      initialValue: 'draft',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(sel) {
      return {
        title: sel.title,
        subtitle: sel.author ? `by ${sel.author}` : 'No author assigned',
        media: sel.media,
      }
    },
  },
  orderings: [
    { title: 'Published Date, Newest', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
    { title: 'Title A–Z', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
  ],
})
