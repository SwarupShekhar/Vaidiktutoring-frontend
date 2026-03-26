import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://studyhours.com/parent/dashboard',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
