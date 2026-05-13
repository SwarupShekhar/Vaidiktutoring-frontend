import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const slug = searchParams.get('slug');

    // Verify the secret against environment variable
    const previewSecret = process.env.PREVIEW_SECRET || 'vaidikeduservicespvtltd_preview_2026_key';
    if (secret !== previewSecret) {
        return new Response('Invalid preview token', { status: 401 });
    }

    if (!slug) {
        return new Response('Slug parameter is required', { status: 400 });
    }

    // Enable Next.js Draft Mode
    const draft = await draftMode();
    draft.enable();

    // Redirect to the dynamic blog path
    redirect(`/blogs/${slug}`);
}
