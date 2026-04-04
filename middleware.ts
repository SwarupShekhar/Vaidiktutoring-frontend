import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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

    // Allow public routes without authentication
    if (isPublicRoute(req)) {
        if (userId) {
            const path = req.nextUrl.pathname;
            if (path === '/' || path.startsWith('/home') || path.startsWith('/about') || 
                path.startsWith('/pricing') || path.startsWith('/login') || path.startsWith('/signup')) {
                
                const role = (sessionClaims?.publicMetadata as any)?.role || (sessionClaims?.metadata as any)?.role || 'student';
                
                let dashboardPath = '/dashboard';
                if (role === 'admin') dashboardPath = '/admin/dashboard';
                else if (role === 'tutor') dashboardPath = '/tutor/dashboard';
                else if (role === 'student') dashboardPath = '/students/dashboard';
                else if (role === 'parent') dashboardPath = '/parent/dashboard';

                return Response.redirect(new URL(dashboardPath, req.url));
            }
        }
        return;
    }
    
    // Protect other routes — check for manual auth token via cookie header
    if (isProtectedRoute(req)) {
        if (!userId) {
            // Check if user has a manual auth token (Direct Access login for tutors/admins)
            const cookieHeader = req.headers.get('cookie') || '';
            if (cookieHeader.includes('manual_auth_token=')) {
                // Manual token found — let the request through, page-level auth handles validation
                return NextResponse.next();
            }
            // No Clerk session AND no manual token — redirect to login
            return redirectToSignIn({ returnBackUrl: req.url });
        }
    }
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
