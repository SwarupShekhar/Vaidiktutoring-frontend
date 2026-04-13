import { Metadata } from 'next';
import Breadcrumbs from '@/app/components/Breadcrumbs';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://studyhours.com/admin/dashboard',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[1440px] mx-auto px-6 pt-10 pb-20">
      <Breadcrumbs />
      {children}
    </div>
  );
}
