import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const slug = searchParams.get('slug');
    const type = searchParams.get('type') || 'blogPost';

    // Verify the secret against environment variable
    const previewSecret = process.env.NEXT_PUBLIC_SANITY_PREVIEW_SECRET || 'vaidikeduservicespvtltd_preview_2026_key';
    if (secret !== previewSecret) {
        return new Response('Invalid preview token', { status: 401 });
    }

    // If no slug is specified, enable draft mode and redirect to home (allows visual editor connection)
    if (!slug) {
        const draft = await draftMode();
        draft.enable();
        redirect('/');
    }

    // Enable Next.js Draft Mode
    const draft = await draftMode();
    draft.enable();

    // Dynamically route to correct visual template
    const cleanSlug = slug.trim();
    // Regional (tutors) pages carry multi-segment slugs like "uk/gcse" and live only
    // under /tutors; single-segment landingPage slugs are the /resources pages.
    const redirectPath =
        type === 'landingPage'
            ? cleanSlug.includes('/')
                ? `/tutoring/${cleanSlug}`
                : `/resources/${cleanSlug}`
            : `/blogs/${cleanSlug}`;
    redirect(redirectPath);
}
