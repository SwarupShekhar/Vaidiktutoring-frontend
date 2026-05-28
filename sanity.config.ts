'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { presentationTool, defineLocations, defineDocuments } from 'sanity/presentation'

import { blogPostSchema } from './src/sanity/schemas/blogPost'
import { pdfResourceSchema } from './src/sanity/schemas/pdfResource'
import { landingPageSchema } from './src/sanity/schemas/landingPage'
import { authorSchema } from './src/sanity/schemas/author'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'studyhours-cms',
  title: 'StudyHours CMS',

  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('StudyHours Content')
          .items([
            S.listItem()
              .title('Blog Posts')
              .child(S.documentTypeList('blogPost').title('Blog Posts')),
            S.listItem()
              .title('PDF Resources & Lead Magnets')
              .child(S.documentTypeList('pdfResource').title('PDF Resources')),
            S.listItem()
              .title('SEO Landing Pages')
              .child(S.documentTypeList('landingPage').title('Landing Pages')),
            S.divider(),
            S.listItem()
              .title('Authors')
              .child(S.documentTypeList('author').title('Authors')),
          ]),
    }),
    presentationTool({
      previewUrl: {
        previewMode: {
          enable: '/api/preview?secret=vaidikeduservicespvtltd_preview_2026_key',
        },
      },
      resolve: {
        mainDocuments: defineDocuments([
          {
            route: '/resources/:slug',
            filter: `_type == "landingPage" && slug.current == $slug`,
          },
          {
            route: '/blogs/:slug',
            filter: `_type == "blogPost" && slug.current == $slug`,
          },
        ]),
        locations: {
          landingPage: defineLocations({
            select: {
              title: 'title',
              slug: 'slug.current',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled Landing Page',
                  href: `/resources/${doc?.slug}`,
                },
              ],
            }),
          }),
          blogPost: defineLocations({
            select: {
              title: 'title',
              slug: 'slug.current',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled Blog Post',
                  href: `/blogs/${doc?.slug}`,
                },
              ],
            }),
          }),
        },
      },
    }),
    visionTool(),
  ],

  schema: {
    types: [blogPostSchema, pdfResourceSchema, landingPageSchema, authorSchema],
  },

  basePath: '/studio',
})
