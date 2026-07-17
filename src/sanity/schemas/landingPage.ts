import { defineType, defineField } from 'sanity'

export const landingPageSchema = defineType({
  name: 'landingPage',
  title: 'SEO Landing Page',
  type: 'document',

  // Tabs split the form into 3 sections — eliminates the single infinite scroll
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO & Meta' },
    { name: 'settings', title: 'Settings' },
  ],

  fields: [
    // ── Content Tab ─────────────────────────────────────────────────────────

    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      description: 'e.g. "GCSE Maths Cheat Sheets — Free Download"',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL path)',
      type: 'slug',
      options: {
        source: 'title',
        // Preserve forward slashes so regional editors can type full paths
        // like `uk/gcse/maths`. Each segment is normalized independently:
        // lowercase, trim, collapse whitespace to hyphens, strip stray chars.
        // Example: ' UK/GCSE Maths / ' -> 'uk/gcse-maths'
        slugify: (input: string) =>
          input
            .toLowerCase()
            .trim()
            .split('/')
            .map((segment) =>
              segment
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]+/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-+|-+$/g, '')
            )
            .filter(Boolean)
            .join('/'),
      },
      description:
        'For /resources pages, a single segment (e.g. "gcse-maths"). For regional /tutors pages (Country set), the FULL path e.g. "uk", "uk/gcse", "uk/gcse/maths". Forward slashes are preserved.',
      validation: (Rule) =>
        Rule.required().custom(async (value, context) => {
          const current = value?.current
          if (!current) return true // `required` above handles the empty case

          // Segments must be lowercase [a-z0-9-] with no leading/trailing slash.
          const pattern = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/
          if (!pattern.test(current)) {
            return 'Use lowercase path segments (a–z, 0–9, hyphens) separated by "/", with no leading or trailing slash, e.g. "uk/gcse/maths".'
          }

          // Enforce uniqueness across all landingPage documents.
          const { document, getClient } = context
          const client = getClient({ apiVersion: '2024-01-01' })
          const id = document?._id.replace(/^drafts\./, '') || ''
          const draftId = `drafts.${id}`
          const isUnique = await client.fetch(
            `count(*[_type=="landingPage" && slug.current==$slug && !(_id in [$id, $draftId])])==0`,
            { slug: current, id, draftId }
          )
          if (!isUnique) {
            return 'Another landing page already uses this slug — slugs must be unique.'
          }

          return true
        }),
      group: 'content',
    }),
    defineField({
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      group: 'content',
      options: { collapsible: true, collapsed: false },
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
      group: 'content',
    }),

    // ── Page Builder ─────────────────────────────────────────────────────────
    defineField({
      name: 'pageBlocks',
      title: 'Page Content Blocks',
      type: 'array',
      group: 'content',
      of: [
        // ── Hero Block ───────────────────────────────────────────────────────
        {
          name: 'heroBlock',
          title: 'Hero Section',
          type: 'object',
          options: { collapsible: true, collapsed: false },
          preview: {
            select: { title: 'heading', media: 'image' },
            prepare: ({ title, media }) => ({
              title: title || 'Hero Block',
              subtitle: 'Top of page hero section with image',
              media,
            }),
          },
          fields: [
            defineField({ name: 'pillBadge', title: 'Top Pill Badge (e.g. 🇬🇧 UK Specialists)', type: 'string' }),
            defineField({ name: 'heading', title: 'Main Heading', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'tagline', title: 'Tagline / Subheading', type: 'text', rows: 3 }),
            defineField({ name: 'primaryButtonText', title: 'Primary Button Text', type: 'string' }),
            defineField({ name: 'primaryButtonLink', title: 'Primary Button Link', type: 'string' }),
            defineField({ name: 'secondaryButtonText', title: 'Secondary Button Text', type: 'string' }),
            defineField({ name: 'secondaryButtonLink', title: 'Secondary Button Link', type: 'string' }),
            defineField({
              name: 'image',
              title: 'Hero Image',
              type: 'image',
              options: { hotspot: true },
              fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })]
            }),
          ],
        },

        // ── Rich Text ───────────────────────────────────────────────────────
        {
          name: 'richTextBlock',
          title: 'Rich Text',
          type: 'object',
          options: { collapsible: true, collapsed: true },
          preview: {
            select: { heading: 'heading' },
            prepare: ({ heading }) => ({
              title: heading || 'Rich Text Block',
              subtitle: 'Text / prose content',
            }),
          },
          fields: [
            defineField({ name: 'heading', title: 'Admin Label', type: 'string', description: 'Internal label only — not shown on page' }),
            defineField({
              name: 'content',
              title: 'Content',
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
              ],
            }),
          ],
        },

        // ── Features / Benefits ─────────────────────────────────────────────
        {
          name: 'featuresBlock',
          title: 'Features / Benefits',
          type: 'object',
          options: { collapsible: true, collapsed: true },
          preview: {
            select: { heading: 'heading', features: 'features' },
            prepare: ({ heading, features }) => ({
              title: heading || 'Features Block',
              subtitle: features?.length ? `${features.length} feature${features.length !== 1 ? 's' : ''}` : 'No features yet',
            }),
          },
          fields: [
            defineField({ name: 'heading', title: 'Block Heading', type: 'string' }),
            defineField({ name: 'subheading', title: 'Block Subheading', type: 'text', rows: 2 }),
            defineField({
              name: 'layout',
              title: 'Layout',
              type: 'string',
              options: {
                list: [
                  { title: '3 columns (default)', value: 'grid-3' },
                  { title: '2 columns', value: 'grid-2' },
                  { title: 'List', value: 'list' },
                ],
                layout: 'radio',
              },
              initialValue: 'grid-3',
            }),
            defineField({
              name: 'features',
              title: 'Features',
              type: 'array',
              of: [{
                type: 'object',
                preview: {
                  select: { title: 'title', icon: 'icon' },
                  prepare: ({ title, icon }) => ({ title: `${icon || ''} ${title || 'Untitled feature'}`.trim() }),
                },
                fields: [
                  defineField({ name: 'icon', title: 'Icon (emoji)', type: 'string', description: 'e.g. ✅ 📚 🎯' }),
                  defineField({ name: 'title', title: 'Title', type: 'string' }),
                  defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
                ],
              }],
            }),
          ],
        },

        // ── Stats Bar ────────────────────────────────────────────────────────
        {
          name: 'statsBlock',
          title: 'Stats Bar',
          type: 'object',
          options: { collapsible: true, collapsed: true },
          preview: {
            select: { heading: 'heading', stats: 'stats' },
            prepare: ({ heading, stats }) => ({
              title: heading || 'Stats Bar',
              subtitle: stats?.length ? `${stats.length} stat${stats.length !== 1 ? 's' : ''}` : 'e.g. 500+ Students • 98% Pass Rate',
            }),
          },
          fields: [
            defineField({ name: 'heading', title: 'Admin Label', type: 'string' }),
            defineField({
              name: 'stats',
              title: 'Stats',
              type: 'array',
              of: [{
                type: 'object',
                preview: {
                  select: { value: 'value', label: 'label' },
                  prepare: ({ value, label }) => ({ title: `${value || '?'} ${label || ''}` }),
                },
                fields: [
                  defineField({ name: 'value', title: 'Value', type: 'string', description: 'e.g. 500+ or 98%' }),
                  defineField({ name: 'label', title: 'Label', type: 'string', description: 'e.g. Students Taught' }),
                  defineField({ name: 'icon', title: 'Icon (emoji)', type: 'string' }),
                ],
              }],
            }),
          ],
        },

        // ── Two-Column (Image + Text) ────────────────────────────────────────
        {
          name: 'twoColumnBlock',
          title: 'Image + Text (2 Column)',
          type: 'object',
          options: { collapsible: true, collapsed: true },
          preview: {
            select: { heading: 'heading', imagePosition: 'imagePosition' },
            prepare: ({ heading, imagePosition }) => ({
              title: heading || 'Two Column Block',
              subtitle: imagePosition === 'right' ? 'Text left, Image right' : 'Image left, Text right',
            }),
          },
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string' }),
            defineField({ name: 'body', title: 'Body Text', type: 'text', rows: 4 }),
            defineField({ name: 'ctaText', title: 'Button Text (optional)', type: 'string' }),
            defineField({ name: 'ctaUrl', title: 'Button URL (optional)', type: 'url' }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
            }),
            defineField({
              name: 'imagePosition',
              title: 'Image Position',
              type: 'string',
              options: {
                list: [
                  { title: 'Image left, Text right', value: 'left' },
                  { title: 'Text left, Image right', value: 'right' },
                ],
                layout: 'radio',
              },
              initialValue: 'left',
            }),
          ],
        },

        // ── Testimonials ─────────────────────────────────────────────────────
        {
          name: 'testimonialsBlock',
          title: 'Testimonials',
          type: 'object',
          options: { collapsible: true, collapsed: true },
          preview: {
            select: { heading: 'heading', testimonials: 'testimonials' },
            prepare: ({ heading, testimonials }) => ({
              title: heading || 'Testimonials',
              subtitle: testimonials?.length ? `${testimonials.length} testimonial${testimonials.length !== 1 ? 's' : ''}` : 'No testimonials yet',
            }),
          },
          fields: [
            defineField({ name: 'heading', title: 'Block Heading', type: 'string', initialValue: 'What Students Say' }),
            defineField({
              name: 'testimonials',
              title: 'Testimonials',
              type: 'array',
              of: [{
                type: 'object',
                preview: {
                  select: { name: 'name', quote: 'quote' },
                  prepare: ({ name, quote }) => ({
                    title: name || 'Anonymous',
                    subtitle: quote ? `"${quote.slice(0, 60)}…"` : '',
                  }),
                },
                fields: [
                  defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 3 }),
                  defineField({ name: 'name', title: 'Student Name', type: 'string' }),
                  defineField({ name: 'examBoard', title: 'Exam Board', type: 'string' }),
                  defineField({ name: 'grade', title: 'Grade Achieved', type: 'string' }),
                  defineField({
                    name: 'avatar',
                    title: 'Avatar (optional)',
                    type: 'image',
                    options: { hotspot: true },
                  }),
                ],
              }],
            }),
          ],
        },

        // ── FAQ ───────────────────────────────────────────────────────────────
        {
          name: 'faqBlock',
          title: 'FAQ Accordion',
          type: 'object',
          options: { collapsible: true, collapsed: true },
          preview: {
            select: { heading: 'heading', faqs: 'faqs' },
            prepare: ({ heading, faqs }) => ({
              title: heading || 'FAQ',
              subtitle: faqs?.length ? `${faqs.length} question${faqs.length !== 1 ? 's' : ''}` : 'No FAQs yet',
            }),
          },
          fields: [
            defineField({ name: 'heading', title: 'Block Heading', type: 'string', initialValue: 'Frequently Asked Questions' }),
            defineField({
              name: 'faqs',
              title: 'Questions',
              type: 'array',
              of: [{
                type: 'object',
                preview: {
                  select: { question: 'question' },
                  prepare: ({ question }) => ({ title: question || 'Untitled question' }),
                },
                fields: [
                  defineField({ name: 'question', title: 'Question', type: 'string' }),
                  defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 4 }),
                ],
              }],
            }),
          ],
        },

        // ── CTA Section ───────────────────────────────────────────────────────
        {
          name: 'ctaBlock',
          title: 'CTA Section',
          type: 'object',
          options: { collapsible: true, collapsed: true },
          preview: {
            select: { heading: 'heading', ctaText: 'ctaText' },
            prepare: ({ heading, ctaText }) => ({
              title: heading || 'CTA Section',
              subtitle: ctaText || 'Call to action',
            }),
          },
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string' }),
            defineField({ name: 'subheading', title: 'Subheading', type: 'text', rows: 2 }),
            defineField({ name: 'ctaText', title: 'Button Text', type: 'string', initialValue: 'Download Free PDF' }),
            defineField({ name: 'ctaUrl', title: 'Button URL (leave blank to use resource download)', type: 'url' }),
            defineField({
              name: 'variant',
              title: 'Style',
              type: 'string',
              options: {
                list: [
                  { title: 'Primary (brand colour)', value: 'primary' },
                  { title: 'Dark', value: 'dark' },
                  { title: 'Light / Card', value: 'light' },
                ],
                layout: 'radio',
              },
              initialValue: 'primary',
            }),
          ],
        },

        // ── Video Embed ───────────────────────────────────────────────────────
        {
          name: 'videoEmbedBlock',
          title: 'Video Embed',
          type: 'object',
          options: { collapsible: true, collapsed: true },
          preview: {
            select: { heading: 'heading', url: 'url' },
            prepare: ({ heading, url }) => ({
              title: heading || 'Video',
              subtitle: url || 'No URL set yet',
            }),
          },
          fields: [
            defineField({ name: 'heading', title: 'Section Heading (optional)', type: 'string' }),
            defineField({
              name: 'url',
              title: 'YouTube or Vimeo URL',
              type: 'url',
              description: 'Paste the full video URL, e.g. https://youtube.com/watch?v=...',
              validation: (Rule) => Rule.uri({ allowRelative: false }),
            }),
            defineField({ name: 'caption', title: 'Caption (optional)', type: 'string' }),
          ],
        },

        // ── Custom HTML ───────────────────────────────────────────────────────
        {
          name: 'customHtmlBlock',
          title: 'Custom HTML & CSS',
          type: 'object',
          options: { collapsible: true, collapsed: true },
          preview: {
            select: { heading: 'heading', scopeClass: 'scopeClass' },
            prepare: ({ heading, scopeClass }) => ({
              title: heading || 'Custom HTML Block',
              subtitle: scopeClass ? `.${scopeClass}` : 'No scope class set — add one before writing CSS',
            }),
          },
          fields: [
            defineField({
              name: 'heading',
              title: 'Admin Label',
              type: 'string',
              description: 'Internal label — not shown on the page',
            }),
            defineField({
              name: 'scopeClass',
              title: 'CSS Scope Class',
              type: 'string',
              description: 'Unique kebab-case class for scoping your CSS, e.g. "promo-banner-2026". Prefix ALL your CSS rules with this class.',
              validation: (Rule) =>
                Rule.regex(/^[a-z][a-z0-9-]*$/, {
                  name: 'kebab-case',
                  invert: false,
                }).warning('Use lowercase letters, numbers and hyphens only'),
            }),
            defineField({
              name: 'sectionBackground',
              title: 'Section Background',
              type: 'string',
              options: {
                list: [
                  { title: 'Transparent (inherits page background)', value: 'none' },
                  { title: 'White / Surface', value: 'surface' },
                  { title: 'Light Blue (page background)', value: 'light' },
                  { title: 'Deep Navy (dark)', value: 'navy' },
                  { title: 'Gradient (primary → sapphire)', value: 'gradient' },
                ],
                layout: 'radio',
              },
              initialValue: 'none',
            }),
            defineField({
              name: 'sectionPadding',
              title: 'Vertical Padding',
              type: 'string',
              options: {
                list: [
                  { title: 'None', value: 'none' },
                  { title: 'Small (py-8)', value: 'sm' },
                  { title: 'Medium (py-16)', value: 'md' },
                  { title: 'Large (py-24)', value: 'lg' },
                ],
                layout: 'radio',
              },
              initialValue: 'md',
            }),
            defineField({
              name: 'maxWidth',
              title: 'Content Container Width',
              type: 'string',
              options: {
                list: [
                  { title: 'Full width (no container)', value: 'full' },
                  { title: 'Wide (max-w-7xl — 1280px)', value: '7xl' },
                  { title: 'Medium (max-w-5xl — 1024px)', value: '5xl' },
                  { title: 'Narrow (max-w-3xl — 768px)', value: '3xl' },
                ],
                layout: 'radio',
              },
              initialValue: '7xl',
            }),
            defineField({
              name: 'html',
              title: 'HTML',
              type: 'text',
              rows: 14,
              description: 'Wrap content in <div class="{your-scope-class}">. Use the master prompt for AI-generated blocks.',
            }),
            defineField({
              name: 'css',
              title: 'CSS',
              type: 'text',
              rows: 10,
              description: 'Prefix every rule with .{scope-class} { } and .dark .{scope-class} { } for dark mode.',
            }),
          ],
        },
      ],
    }),

    // ── SEO Tab ──────────────────────────────────────────────────────────────

    defineField({
      name: 'targetKeywords',
      title: 'Target Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Primary SEO keywords for this page.',
      group: 'seo',
    }),
    defineField({
      name: 'seo',
      title: 'SEO Metadata',
      type: 'object',
      group: 'seo',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: '60 characters max',
          validation: (Rule) => Rule.max(60).warning('Over 60 chars — Google will truncate'),
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          description: '160 characters max',
          validation: (Rule) => Rule.max(160).warning('Over 160 chars — Google will truncate'),
        }),
        defineField({
          name: 'canonicalUrl',
          title: 'Canonical URL (optional)',
          type: 'url',
        }),
        defineField({
          name: 'ogImage',
          title: 'Open Graph / Social Image',
          type: 'image',
          description: 'Ideal size: 1200×630px',
          options: { hotspot: true },
        }),
        defineField({
          name: 'noIndex',
          title: 'Hide from search engines (noindex)',
          type: 'boolean',
          initialValue: false,
          description: 'Turn on to prevent Google from indexing this page.',
        }),
      ],
    }),
    defineField({
      name: 'alternates',
      title: 'hreflang Alternates',
      type: 'array',
      group: 'seo',
      description:
        'Drives hreflang tags pointing to the equivalent page in other countries (the same course/subject on a different regional /tutors path). Add one entry per sibling locale. Leave empty and the page self-canonicals with no cluster.',
      of: [{
        type: 'object',
        preview: {
          select: { locale: 'locale', path: 'path' },
          prepare: ({ locale, path }) => ({
            title: locale || 'No locale set',
            subtitle: path ? `/tutoring/${path}` : 'No path set',
          }),
        },
        fields: [
          defineField({
            name: 'locale',
            title: 'Locale',
            type: 'string',
            description: 'BCP-47 locale of the alternate page, e.g. en-GB, en-US, en-AU, en-SG, en-AE',
          }),
          defineField({
            name: 'path',
            title: 'Regional Path',
            type: 'string',
            description: 'Sibling regional path WITHOUT the leading /tutoring/, e.g. "usa/gcse/maths".',
          }),
        ],
      }],
    }),

    // ── Settings Tab ─────────────────────────────────────────────────────────

    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      group: 'settings',
    }),
    defineField({
      name: 'status',
      title: 'Publish Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'In Review', value: 'review' },
          { title: 'Published', value: 'published' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      group: 'settings',
    }),
    defineField({
      name: 'country',
      title: 'Country slug (e.g. uk)',
      type: 'string',
      group: 'settings',
    }),
    defineField({
      name: 'level',
      title: 'Level slug (e.g. gcse)',
      type: 'string',
      group: 'settings',
    }),
    defineField({
      name: 'subject',
      title: 'Subject slug (e.g. maths)',
      type: 'string',
      group: 'settings',
    }),
    defineField({
      name: 'addToFooter',
      title: 'Show in Footer Links?',
      type: 'boolean',
      initialValue: false,
      description: 'Toggle on to include this landing page in the website footer.',
      group: 'settings',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      country: 'country',
    },
    prepare(sel) {
      return {
        title: sel.title,
        subtitle: sel.slug ? (sel.country ? `/tutoring/${sel.slug}` : `/resources/${sel.slug}`) : 'No slug set',
      }
    },
  },
})
