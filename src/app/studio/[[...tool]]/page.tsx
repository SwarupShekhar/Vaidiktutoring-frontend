/**
 * StudyHours Sanity Studio — embedded at /studio
 *
 * This is a Next.js App Router catch-all page that renders the full
 * Sanity Studio editor. Team members log in at studyhours.com/studio
 * using their Sanity accounts.
 *
 * Access is controlled entirely by Sanity's own project membership
 * (configured at sanity.io/manage → Members).
 *
 * To add team members: sanity.io/manage → studyhours project → Members → Invite
 */

'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
