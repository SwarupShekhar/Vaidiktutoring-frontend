import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://studyhours.com/students/dashboard',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function StudentsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
