import { redirect } from 'next/navigation';

// Redirect /admin/blogs/[id] → /admin/blogs/[id]/edit
// This prevents 404 if a direct link or the browser history hits the bare ID route.
export default function BlogRedirectPage({ params }: { params: { id: string } }) {
    redirect(`/admin/blogs/${params.id}/edit`);
}
