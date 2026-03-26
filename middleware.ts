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

    // Allow public routes without authentication
    if (isPublicRoute(req)) {
        return; // Don't require auth
    }
    
    // Protect other routes
    if (isProtectedRoute(req)) {
        const { userId, redirectToSignIn } = await auth();
        // if (!userId) return redirectToSignIn();
    }
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
