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
    title: 'Chemistry Lab',
    description: 'Explore the interactive periodic table, element properties, and chemical reactions.',
    iconName: 'Atom',
    url: process.env.NEXT_PUBLIC_INTERACTIVE_CHEM_URL || 'https://zperiod.studyhours.com',
  },
  {
    id: 'biology',
    title: '3D Biology Explorer',
    description: 'Dive inside human cell architectures, organelles, and biological models in immersive 3D.',
    iconName: 'Microscope',
    url: process.env.NEXT_PUBLIC_INTERACTIVE_BIOLOGY_URL || 'https://cellstudio.studyhours.com',
  },
];
