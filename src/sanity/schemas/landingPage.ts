import { defineType, defineField } from 'sanity'

export const landingPageSchema = defineType({
  name: 'landingPage',
  title: 'SEO Landing Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      description: 'e.g. "GCSE Maths Cheat Sheets — Free Download"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL path)',
      type: 'slug',
      options: { source: 'title' },
      description: 'The URL will be /resources/[slug]',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'targetKeywords',
      title: 'Target Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Primary SEO keywords for this page.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO Metadata',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title (60 chars max)',
          type: 'string',
          validation: (Rule) => Rule.max(60),
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description (160 chars max)',
          type: 'text',
          rows: 2,
          validation: (Rule) => Rule.max(160),
        }),
        defineField({
          name: 'canonicalUrl',
          title: 'Canonical URL (optional)',
          type: 'url',
        }),
        defineField({
          name: 'ogImage',
          title: 'Open Graph Image',
          type: 'image',
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        defineField({
          name: 'heading',
          title: 'Heading',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'subheading',
          title: 'Subheading',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'ctaText',
          title: 'CTA Button Text',
          type: 'string',
          initialValue: 'Download Free PDF',
        }),
        defineField({
          name: 'backgroundImage',
          title: 'Background Image',
          type: 'image',
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: 'featuredResource',
      title: 'Featured PDF Resource',
      type: 'reference',
      to: [{ type: 'pdfResource' }],
      description: 'The main downloadable resource this landing page promotes.',
    }),
    defineField({
      name: 'pageBlocks',
      title: 'Page Content Blocks',
      type: 'array',
      of: [
        {
          name: 'featuresBlock',
          title: 'Features / Benefits Block',
          type: 'object',
          fields: [
            defineField({ name: 'heading', title: 'Block Heading', type: 'string' }),
            defineField({
              name: 'features',
              title: 'Features List',
              type: 'array',
              of: [{
                type: 'object',
                fields: [
                  defineField({ name: 'icon', title: 'Icon (emoji or lucide name)', type: 'string' }),
                  defineField({ name: 'title', title: 'Title', type: 'string' }),
                  defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
                ],
              }],
            }),
          ],
        },
        {
          name: 'testimonialsBlock',
          title: 'Testimonials Block',
          type: 'object',
          fields: [
            defineField({ name: 'heading', title: 'Block Heading', type: 'string', initialValue: 'What Students Say' }),
            defineField({
              name: 'testimonials',
              title: 'Testimonials',
              type: 'array',
              of: [{
                type: 'object',
                fields: [
                  defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 3 }),
                  defineField({ name: 'name', title: 'Student Name', type: 'string' }),
                  defineField({ name: 'examBoard', title: 'Exam Board', type: 'string' }),
                  defineField({ name: 'grade', title: 'Grade Achieved', type: 'string' }),
                ],
              }],
            }),
          ],
        },
        {
          name: 'faqBlock',
          title: 'FAQ Accordion Block',
          type: 'object',
          fields: [
            defineField({ name: 'heading', title: 'Block Heading', type: 'string', initialValue: 'Frequently Asked Questions' }),
            defineField({
              name: 'faqs',
              title: 'FAQs',
              type: 'array',
              of: [{
                type: 'object',
                fields: [
                  defineField({ name: 'question', title: 'Question', type: 'string' }),
                  defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 4 }),
                ],
              }],
            }),
          ],
        },
        {
          name: 'richTextBlock',
          title: 'Rich Text Block',
          type: 'object',
          fields: [
            defineField({
              name: 'content',
              title: 'Content',
              type: 'array',
              of: [{ type: 'block' }],
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    prepare(sel) {
      return {
        title: sel.title,
        subtitle: sel.slug ? `/resources/${sel.slug}` : 'No slug set',
      }
    },
  },
})
