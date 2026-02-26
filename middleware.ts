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
]);

export default clerkMiddleware(async (auth, req) => {
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
