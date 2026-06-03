import { Metadata } from 'next';
import DesmosTool from './DesmosTool';

export const metadata: Metadata = {
  title: 'SAT Desmos Cheat Sheet — Custom Shortcuts for Your Weak Topics | StudyHours',
  description: 'Pick your 3 weakest SAT Math topics and get the exact Desmos shortcuts that solve them in under 10 seconds. Used by 500+ students.',
  openGraph: {
    title: 'SAT Desmos Cheat Sheet — Solve Any Math Question in 10 Seconds',
    description: 'Pick your 3 weakest SAT Math topics and get the exact Desmos shortcuts.',
    url: 'https://studyhours.com/sat-desmos-guide',
  },
};

export default function DesmosTool_Page() {
  return <DesmosTool />;
}
