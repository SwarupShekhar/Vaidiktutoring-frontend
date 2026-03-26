import { Metadata } from 'next';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  return {
    alternates: {
      canonical: `https://studyhours.com/session/${id}`,
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function SessionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
