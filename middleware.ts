import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
    '/dashboard(.*)',
    '/parent(.*)',
    '/students(.*)',
    '/tutor(.*)',
    '/admin(.*)',
    '/profile(.*)',
    '/settings(.*)',
    '/session(.*)',
]);

const isPublicRoute = createRouteMatcher([
    '/',
    '/subjects(.*)',
    '/methodology(.*)',
    '/about(.*)',
    '/pricing(.*)',
    '/blogs(.*)',
    '/blog(.*)',
    '/contact(.*)',
    '/privacy(.*)',
    '/terms(.*)',
    '/cookies(.*)',
    '/login(.*)',
    '/signup(.*)',
    '/checkout(.*)',
    '/experts(.*)',
    '/careers(.*)',
    '/onboarding(.*)',
    '/k-12-online-tutoring(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
    try {
        // Redirect www to non-www for SEO consistency
        const host = req.headers.get("host");
        if (host && host.startsWith("www.studyhours.com")) {
            const url = req.nextUrl.clone();
            url.host = "studyhours.com";
            return Response.redirect(url, 301);
        }

        const authObject = await auth();
        const { userId, sessionClaims } = authObject;

        // Allow public routes without authentication, BUT redirect authenticated users to their dashboard
        if (isPublicRoute(req)) {
            if (userId) {
                const path = req.nextUrl.pathname;
                // Redirect from marketing/auth pages to dashboard
                if (path === '/' || path.startsWith('/home') || path.startsWith('/about') || 
                    path.startsWith('/pricing') || path.startsWith('/login') || path.startsWith('/signup')) {
                    
                    // Get role from Clerk publicMetadata
                    const role = (sessionClaims?.publicMetadata as any)?.role || (sessionClaims?.metadata as any)?.role || 'student';
                    
                    let dashboardPath = '/dashboard';
                    if (role === 'admin') dashboardPath = '/admin/dashboard';
                    else if (role === 'tutor') dashboardPath = '/tutor/dashboard';
                    else if (role === 'student') dashboardPath = '/students/dashboard';
                    else if (role === 'parent') dashboardPath = '/parent/dashboard';

                    return Response.redirect(new URL(dashboardPath, req.url));
                }
            }
            return; // Don't require auth for public routes if not logged in
        }
        
        // Protect other routes — allow both Clerk sessions and manual auth tokens
        if (isProtectedRoute(req)) {
            // Check for manual auth token via cookie header (safe string parsing)
            const cookieHeader = req.headers.get('cookie') || '';
            const hasManualToken = cookieHeader.includes('manual_auth_token=');
            
            if (!userId && !hasManualToken) {
                const signInUrl = new URL('/login', req.url);
                signInUrl.searchParams.set('redirect_url', req.nextUrl.pathname);
                return Response.redirect(signInUrl);
            }
        }
    } catch (error) {
        // Never let middleware crash — allow the request through and let
        // the page-level auth handle it instead of showing a 500
        console.error('[Middleware] Error:', error);
        return;
    }
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
