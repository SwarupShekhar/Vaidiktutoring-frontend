import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://studyhours.com/bookings/new',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function BookingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
