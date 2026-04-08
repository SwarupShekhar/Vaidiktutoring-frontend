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
    '/verify-phone(.*)',
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
            return NextResponse.redirect(url, 301);
        }

        const authObject = await auth();
        const { userId, sessionClaims, redirectToSignIn } = authObject;

        // Redirect authenticated users to their specific dashboards if they hit marketing pages or /dashboard
        if (userId) {
            const path = req.nextUrl.pathname;
            const marketingPaths = ['/', '/about', '/methodology', '/pricing', '/blog', '/blogs', '/careers', '/contact', '/home', '/login', '/signup'];
            const isMarketingPath = marketingPaths.some(p => p === path || path.startsWith(p + '/'));
            const isDashboardRoot = path === '/dashboard' || path === '/dashboard/';

            if (isMarketingPath || isDashboardRoot) {
                const role = (sessionClaims?.publicMetadata as any)?.role || (sessionClaims?.metadata as any)?.role;

                // If we have a role, redirect to the correct dashboard
                if (role) {
                    let dashboardPath = '/dashboard'; // Fallback
                    if (role === 'admin') dashboardPath = '/admin/dashboard';
                    else if (role === 'tutor') dashboardPath = '/tutor/dashboard';
                    else if (role === 'student') dashboardPath = '/students/dashboard';
                    else if (role === 'parent') dashboardPath = '/parent/dashboard';

                    return NextResponse.redirect(new URL(dashboardPath, req.url));
                }
            }
        }

        // Allow public routes without authentication
        if (isPublicRoute(req)) {
            return NextResponse.next();
        }
        
        // Protect other routes — check for manual auth token via cookie header
        if (isProtectedRoute(req)) {
            if (!userId) {
                // Check if user has a manual auth token (Direct Access login for tutors/admins)
                const cookieHeader = req.headers.get('cookie') || '';
                if (cookieHeader.includes('manual_auth_token=')) {
                    // Manual token found — check if they're landing on the generic /dashboard
                    const path = req.nextUrl.pathname;
                    if (path === '/dashboard' || path === '/dashboard/') {
                        // Extract role from cookie if possible
                        const roleMatch = cookieHeader.match(/user_role=([^;]+)/);
                        const role = roleMatch ? roleMatch[1] : null;

                        if (role) {
                            let dashboardPath = '/dashboard';
                            if (role === 'admin') dashboardPath = '/admin/dashboard';
                            else if (role === 'tutor') dashboardPath = '/tutor/dashboard';
                            else if (role === 'student') dashboardPath = '/students/dashboard';
                            else if (role === 'parent') dashboardPath = '/parent/dashboard';
                            
                            if (dashboardPath !== '/dashboard') {
                                return NextResponse.redirect(new URL(dashboardPath, req.url));
                            }
                        }
                    }
                    return NextResponse.next();
                }
                // No Clerk session AND no manual token — redirect to login
                return redirectToSignIn({ returnBackUrl: req.url });
            }
        }

        // Phone verification gate — only fires for accounts where phone_verified was explicitly set to false
        // (new accounts created after this feature shipped). Existing accounts have undefined → skipped.
        if (userId) {
            const publicMeta = (sessionClaims?.publicMetadata as any) ?? {};
            const role = publicMeta.role as string | undefined;
            const phoneVerified = publicMeta.phone_verified;
            const pathname = req.nextUrl.pathname;

            const needsPhoneGate =
                phoneVerified === false &&
                (role === 'parent' || role === 'student') &&
                !pathname.startsWith('/verify-phone') &&
                !pathname.startsWith('/api/') &&
                !pathname.startsWith('/onboarding') &&
                pathname !== '/login' &&
                pathname !== '/signup';

            if (needsPhoneGate) {
                return NextResponse.redirect(new URL('/verify-phone', req.url));
            }
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Middleware Exception:", error);
        // Fail open or just pass through if Clerk fails to invoke 
        // to prevent hard 500 error cascade on Edge
        return NextResponse.next();
    }
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
