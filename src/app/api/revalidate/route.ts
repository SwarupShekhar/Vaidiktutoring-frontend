import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
    return handleRevalidate(request);
}

export async function POST(request: NextRequest) {
    return handleRevalidate(request);
}

async function handleRevalidate(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const secret = searchParams.get('secret');

        const revalidationSecret = process.env.REVALIDATION_SECRET || 'vaidikeduservicespvtltd_revalidate_2026_key';
        if (secret !== revalidationSecret) {
            return NextResponse.json({ message: 'Invalid revalidation token' }, { status: 401 });
        }

        let path = searchParams.get('path');
        if (request.method === 'POST') {
            const body = await request.json().catch(() => ({}));
            if (body.path) path = body.path;
        }

        if (!path) {
            return NextResponse.json({ message: 'Path parameter is required' }, { status: 400 });
        }

        // Perform standard Next.js on-demand path revalidation
        revalidatePath(path);
        
        // Cascade revalidation for parent directories and metadata sitemaps if blog modified
        if (path.includes('/blogs')) {
            revalidatePath('/blogs');
            revalidatePath('/sitemap.xml', 'layout');
        }

        return NextResponse.json({ revalidated: true, path, now: Date.now() });
    } catch (err: any) {
        return NextResponse.json({ message: err?.message || 'Error revalidating' }, { status: 500 });
    }
}
