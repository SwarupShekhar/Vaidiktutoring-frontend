'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { presentationTool, defineLocations, defineDocuments } from 'sanity/presentation'

import { pdfResourceSchema } from './src/sanity/schemas/pdfResource'
import { landingPageSchema } from './src/sanity/schemas/landingPage'
import { authorSchema } from './src/sanity/schemas/author'

const projectId = 'rh6hnlmk'
const dataset = 'production'
const apiVersion = '2024-01-01'

const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost'
const previewOrigin = isLocalhost ? 'http://localhost:3000' : 'https://studyhours.com'

const previewSecret = process.env.NEXT_PUBLIC_SANITY_PREVIEW_SECRET || 'fallback_preview_secret';

export default defineConfig({
  name: 'studyhours-cms',
  title: 'StudyHours CMS',

  projectId,
  dataset,
  apiVersion,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('StudyHours Content')
          .items([
            S.listItem()
              .title('PDF Resources & Lead Magnets')
              .child(S.documentTypeList('pdfResource').title('PDF Resources')),
            S.listItem()
              .title('Tutoring Pages')
              .child(S.documentTypeList('landingPage').title('Tutoring Pages')),
            S.divider(),
            S.listItem()
              .title('Authors')
              .child(S.documentTypeList('author').title('Authors')),
          ]),
    }),
    presentationTool({
      previewUrl: {
        previewMode: {
          enable: `${previewOrigin}/api/preview?secret=${previewSecret}`,
        },
      },
      // Only connect to the current environment — not both localhost and prod simultaneously
      allowOrigins: [previewOrigin],
      resolve: {
        mainDocuments: defineDocuments([
          {
            route: '/tutoring/:slug',
            filter: `_type == "landingPage" && slug.current == $slug`,
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
                  href: `/tutoring/${doc?.slug ? doc.slug.trim() : ''}`,
                },
              ],
            }),
          }),
        },
      },
    }),
    // Vision tool only in local dev — GROQ IDE has a non-trivial memory footprint
    ...(isLocalhost ? [visionTool()] : []),
  ],

  schema: {
    types: [pdfResourceSchema, landingPageSchema, authorSchema],
  },

  basePath: '/studio',
})
