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
import { useState, useEffect } from 'react'

function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch (e) {
    return false
  }
}

export default function StudioPage() {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null)

  useEffect(() => {
    setWebglSupported(isWebGLAvailable())
  }, [])

  if (webglSupported === null) {
    return null // Wait for client-side check to finish
  }

  if (!webglSupported) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h2 style={{ color: '#ef4444', fontSize: '24px', marginBottom: '16px' }}>Hardware Acceleration Required</h2>
        <p style={{ maxWidth: '600px', margin: '0 auto 24px auto', lineHeight: '1.6', color: '#4b5563' }}>
          The StudyHours Studio requires WebGL to render properly, but it seems your browser's hardware acceleration is disabled or your graphics drivers are unsupported.
        </p>
        <div style={{ background: '#f3f4f6', padding: '24px', borderRadius: '8px', maxWidth: '600px', width: '100%', textAlign: 'left', border: '1px solid #e5e7eb' }}>
          <p style={{ fontWeight: '600', marginBottom: '12px' }}>How to fix this in Google Chrome:</p>
          <ol style={{ paddingLeft: '24px', lineHeight: '1.8', color: '#374151', margin: 0 }}>
            <li>Copy and paste <code>chrome://settings/system</code> into your URL bar and hit enter.</li>
            <li>Turn on <strong>"Use graphics acceleration when available"</strong>.</li>
            <li>Click the <strong>Relaunch</strong> button.</li>
          </ol>
        </div>
      </div>
    )
  }

  return <NextStudio config={config} />
}
