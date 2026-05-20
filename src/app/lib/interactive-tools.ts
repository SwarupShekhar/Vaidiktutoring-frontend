export interface InteractiveTool {
  id: 'chem' | 'biology';
  title: string;
  description: string;
  iconName: 'Atom' | 'Microscope';
  url: string;
}

export const INTERACTIVE_TOOLS: InteractiveTool[] = [
  {
    id: 'chem',
    title: 'Studyhours Chemistry Lab',
    description: 'Explore our interactive periodic table, balance complex chemical equations with real-time feedback, calculate molar masses, and run virtual lab simulations.',
    iconName: 'Atom',
    url: process.env.NEXT_PUBLIC_INTERACTIVE_CHEM_URL || 'https://zperiod-alpha.vercel.app/?v=2.0.1',
  },
  /* 
  Temporarily disabled until biology cell studio gets more diagrams and meets our premium quality standards.
  {
    id: 'biology',
    title: '3D Biology Explorer',
    description: 'Dive inside human cell architectures, organelles, and biological models in immersive 3D.',
    iconName: 'Microscope',
    url: process.env.NEXT_PUBLIC_INTERACTIVE_BIOLOGY_URL || 'https://cellstudio.studyhours.com',
  },
  */
];
