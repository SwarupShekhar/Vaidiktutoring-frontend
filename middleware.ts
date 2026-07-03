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
    // Service & regional pages — public marketing content, no auth needed
    '/k-12-online-tutoring(.*)',
    '/igcse-online-tutoring(.*)',
    '/gcse-online-tutoring(.*)',
    '/a-level-online-tutoring(.*)',
    '/ib-online-tutoring(.*)',
    '/singapore(.*)',
    '/uae(.*)',
    '/australia(.*)',
    '/saudi(.*)',
    '/resources(.*)',
    '/studio(.*)',
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

        // Check if we are inside the Desktop/Mobile wrapper. Detect via custom
        // User-Agent OR the `sh_app` cookie set by the Electron preload (the UA can
        // be dropped on some client-side/RSC requests; the cookie always rides along).
        const userAgent = req.headers.get("user-agent") || "";
        const cookies = req.headers.get("cookie") || "";
        const isAppShell = userAgent.includes("StudyHoursApp") || cookies.includes("sh_app=1");
        const hasClerkCookie = cookies.includes("__session") || cookies.includes("clerk") || cookies.includes("manual_auth_token");
        
        const path = req.nextUrl.pathname;

        // Strict App Isolation: Fast path for obvious guest users
        if (isAppShell && !hasClerkCookie && isPublicRoute(req)) {
            if (path !== '/login' && !path.startsWith('/signup') && !path.startsWith('/onboarding')) {
                return NextResponse.redirect(new URL('/login', req.url));
            }
        }

        if (!isAppShell && !hasClerkCookie && isPublicRoute(req)) {
            return NextResponse.next();
        }

        const authObject = await auth();
        const { userId, sessionClaims, redirectToSignIn } = authObject;

        // Redirect authenticated users to their specific dashboards if they hit marketing pages or /dashboard
        if (userId) {
            const marketingPaths = ['/', '/about', '/methodology', '/blog', '/blogs', '/careers', '/contact', '/home', '/login', '/signup', '/subjects', '/resources', '/studio', '/experts'];
            // '/pricing' is marketing on the WEBSITE only (logged-in web users route to
            // their dashboard, unchanged). Inside the desktop APP it is NOT marketing:
            // a logged-in parent must be able to open Plans to upgrade. Treating it as
            // marketing in-app bounced role-in-DB-but-not-Clerk accounts through
            // /onboarding first, flashing the parent/student selector before landing
            // back on the dashboard.
            const isMarketingPath =
                marketingPaths.some(p => p === path || path.startsWith(p + '/')) ||
                (!isAppShell && (path === '/pricing' || path.startsWith('/pricing/')));
            const isDashboardRoot = path === '/dashboard' || path === '/dashboard/';

            if (isMarketingPath || isDashboardRoot) {
                const role = (sessionClaims?.publicMetadata as any)?.role || (sessionClaims?.metadata as any)?.role;

                if (!role) {
                    // Brand-new / not-yet-onboarded account: no role in Clerk metadata yet.
                    // Send to the onboarding funnel to pick parent/student instead of
                    // silently defaulting to 'student' — that default dumped fresh signups
                    // on the student dashboard (skipping role choice), and 403'd when their
                    // DB row was 'parent' (ProtectedClient reads the backend role). The
                    // onboarding page self-corrects returning users (it keys on the backend
                    // onboarding_status), so this never traps an existing account.
                    return NextResponse.redirect(new URL('/onboarding', req.url));
                }

                let dashboardPath = '/students/dashboard'; // real route, never the dead /dashboard
                if (role === 'admin') dashboardPath = '/admin/dashboard';
                else if (role === 'tutor') dashboardPath = '/tutor/dashboard';
                else if (role === 'student') dashboardPath = '/students/dashboard';
                else if (role === 'parent') dashboardPath = '/parent/dashboard';

                return NextResponse.redirect(new URL(dashboardPath, req.url));
            }
        }

        // Allow public routes without authentication
        if (isPublicRoute(req)) {
            // In the app, guests are pushed to /login for marketing pages. Authenticated
            // users reach here for genuinely public routes they're allowed to view
            // (e.g. /pricing to upgrade) — don't bounce those to login. Guests never
            // reach this point for /pricing: they're caught by the !hasClerkCookie
            // redirect earlier.
            if (isAppShell && path !== '/login' && !path.startsWith('/signup') && !path.startsWith('/onboarding') && !path.startsWith('/pricing') && !path.startsWith('/checkout')) {
                return NextResponse.redirect(new URL('/login', req.url));
            }
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
                pathname !== '/login' &&
                pathname !== '/signup';



            if (needsPhoneGate) {
                return NextResponse.redirect(new URL('/verify-phone', req.url));
            }
        }

        return NextResponse.next();
    } catch (error: any) {
        // Clerk's redirectToSignIn throws a NEXT_REDIRECT error which we must re-throw to allow Next.js to handle the redirect
        if (error?.message === 'NEXT_REDIRECT' || error?.digest?.startsWith('NEXT_REDIRECT') || error?.clerk_digest) {
            throw error;
        }
        console.error("Middleware Exception:", error);
        // Fail open or just pass through if Clerk fails to invoke 
        // to prevent hard 500 error cascade on Edge
        return NextResponse.next();
    }
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
