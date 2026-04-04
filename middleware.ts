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
    // Redirect www to non-www for SEO consistency
    const host = req.headers.get("host");
    if (host && host.startsWith("www.studyhours.com")) {
        const url = req.nextUrl.clone();
        url.host = "studyhours.com";
        return Response.redirect(url, 301);
    }

    const authObject = await auth();
    const { userId, sessionClaims, redirectToSignIn } = authObject;

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
    
    // Protect other routes
    if (isProtectedRoute(req)) {
        const manualToken = req.cookies.get('manual_auth_token');
        if (!userId && !manualToken) {
            const signInUrl = new URL('/login', req.url);
            signInUrl.searchParams.set('redirect_url', req.nextUrl.pathname);
            return Response.redirect(signInUrl);
        }
    }
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
