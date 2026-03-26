import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://studyhours.com/tutor/dashboard',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function TutorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
