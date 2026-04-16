import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const url = request.nextUrl.searchParams.get('url');
    
    if (!url) {
        return new NextResponse('URL query parameter is required', { status: 400 });
    }

    try {
        const fetchRes = await fetch(url);
        
        if (!fetchRes.ok) {
            console.error(`Vault Proxy: Failed to fetch from origin. Status: ${fetchRes.status}`);
            return new NextResponse('Failed to fetch asset from vault origin', { status: fetchRes.status });
        }

        const arrayBuffer = await fetchRes.arrayBuffer();

        // Pass headers through to client, ensuring CORS are properly overwritten by Next.js
        return new NextResponse(arrayBuffer, {
            status: 200,
            headers: {
                'Content-Type': fetchRes.headers.get('Content-Type') || 'application/pdf',
                'Cache-Control': 'public, max-age=3600',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
            },
        });
    } catch (error) {
        console.error('Vault Proxy Error:', error);
        return new NextResponse('Internal Server Error while proxying vault asset', { status: 500 });
    }
}
