import { defineType, defineField } from 'sanity'

export const pdfResourceSchema = defineType({
  name: 'pdfResource',
  title: 'PDF Resource / Lead Magnet',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Resource Title',
      type: 'string',
      description: 'e.g. "GCSE Maths Formula Sheet — Edexcel"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      description: 'What does this resource contain? Used on the landing page.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'file',
      title: 'PDF File',
      type: 'file',
      options: { accept: '.pdf' },
      description: 'Upload the actual PDF file here. Access is controlled by accessType below.',
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
          'Psychology', 'Sociology', 'Further Maths',
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'examBoard',
      title: 'Exam Board / Curriculum',
      type: 'string',
      description: 'Which curriculum or exam board is this for?',
      options: {
        list: [
          // UK
          { title: '🇬🇧 GCSE', value: 'GCSE' },
          { title: '🇬🇧 A-Level', value: 'A-Level' },
          { title: '🇬🇧 IGCSE', value: 'IGCSE' },
          // Singapore
          { title: '🇸🇬 O-Level (Singapore)', value: 'O-Level' },
          { title: '🇸🇬 A-Level (Singapore)', value: 'A-Level-SG' },
          { title: '🇸🇬 PSLE', value: 'PSLE' },
          { title: '🇸🇬 IP (Integrated Programme)', value: 'IP' },
          // Australia
          { title: '🇦🇺 ATAR', value: 'ATAR' },
          { title: '🇦🇺 HSC (NSW)', value: 'HSC' },
          { title: '🇦🇺 VCE (Victoria)', value: 'VCE' },
          { title: '🇦🇺 QCE (Queensland)', value: 'QCE' },
          { title: '🇦🇺 WACE (WA)', value: 'WACE' },
          // Middle East
          { title: '🇦🇪 UAE MOE', value: 'UAE-MOE' },
          { title: '🇸🇦 Saudi Ministry', value: 'Saudi-Ministry' },
          // International
          { title: '🌍 IB (International Baccalaureate)', value: 'IB' },
          { title: '🌍 AP (Advanced Placement)', value: 'AP' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'accessType',
      title: 'Access Type',
      type: 'string',
      options: {
        list: [
          { title: 'Free (anyone can download)', value: 'free' },
          { title: 'Gated (requires referrals to unlock)', value: 'gated' },
        ],
        layout: 'radio',
      },
      initialValue: 'free',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'requiredReferrals',
      title: 'Referrals Required to Unlock',
      type: 'number',
      description: 'Only applies when Access Type is "Gated". Set 0 for free.',
      initialValue: 3,
      hidden: ({ document }) => document?.accessType !== 'gated',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
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
      examBoard: 'examBoard',
      subject: 'subject',
      access: 'accessType',
      media: 'coverImage',
    },
    prepare(sel) {
      const lock = sel.access === 'gated' ? '🔒' : '🔓'
      return {
        title: `${lock} ${sel.title}`,
        subtitle: `${sel.examBoard || ''} • ${sel.subject || ''}`,
        media: sel.media,
      }
    },
  },
})
