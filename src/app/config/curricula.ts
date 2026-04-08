export const CURRICULA = [
  {
    id: 'global', flag: '🌍', country: 'Global / Other',
    hero: 'World-class 1-on-1 tutoring for K-12 students',
    subline: 'Expert-guided personalized attention for IB, IGCSE, and national curricula worldwide.',
    gradeLabel: 'Grade', gradeRange: 'KG–Grade 12',
    exams: ['IB', 'IGCSE', 'A-Levels', 'SAT', 'AP'],
    subjects: ['Mathematics', 'English', 'Science', 'Biology', 'Chemistry', 'Physics', 'Languages', 'Humanities'],
    subjectNote: 'We adapt to any international or national syllabus'
  },
  {
    id: 'uk', flag: '🇬🇧', country: 'United Kingdom',
    hero: 'Expert tutoring aligned to the UK National Curriculum',
    subline: 'GCSE and A-Level specialists for Years 1–13',
    gradeLabel: 'Year', gradeRange: 'Year 1–13',
    exams: ['GCSEs', 'A-Levels', 'SATs'],
    subjects: ['Maths', 'English', 'Science', 'History', 'Geography', 'Biology', 'Chemistry', 'Physics', 'French', 'Spanish'],
    subjectNote: null
  },
  {
    id: 'australia', flag: '🇦🇺', country: 'Australia',
    hero: 'ACARA-aligned tutoring for Australian students',
    subline: 'Foundation to Year 10 across all 8 learning areas — NAPLAN, HSC, VCE and ATAR preparation',
    gradeLabel: 'Year', gradeRange: 'Foundation–Year 10',
    exams: ['NAPLAN', 'HSC', 'VCE', 'ATAR'],
    subjects: ['Maths', 'English', 'Science', 'HASS', 'Biology', 'Chemistry', 'Physics', 'Digital Technologies'],
    subjectNote: 'Aligned to the Australian Curriculum Version 9.0'
  },
  {
    id: 'singapore', flag: '🇸🇬', country: 'Singapore',
    hero: 'MOE-aligned tutoring for Singapore students',
    subline: 'PSLE and O-Level specialists — Primary 1 to Secondary 5 with 21st Century Competency focus',
    gradeLabel: 'Primary/Secondary', gradeRange: 'Primary 1–Secondary 5',
    exams: ['PSLE', 'O-Levels', 'N-Levels', 'A-Levels'],
    subjects: ['English', 'Maths', 'Science', 'Mother Tongue', 'Social Studies', 'Additional Maths', 'Combined Science', 'Geography', 'History'],
    subjectNote: 'Aligned to MOE Singapore syllabuses'
  },
  {
    id: 'middleeast', flag: '🇦🇪', country: 'UAE / Middle East',
    hero: 'Multi-curriculum tutoring for UAE and GCC students',
    subline: 'Supporting UAE-MoE, IGCSE, IB, American, and Indian curricula across KG to Grade 12',
    gradeLabel: 'Grade', gradeRange: 'KG–Grade 12',
    exams: ['IGCSE', 'A-Levels', 'IB', 'CBSE', 'AP', 'UAE-MoE'],
    subjects: ['Maths', 'English', 'Science', 'Arabic', 'Physics', 'Chemistry', 'Biology', 'Social Studies', 'Islamic Studies'],
    subjectNote: 'Curriculum-agnostic — we map to your school syllabus'
  },
  {
    id: 'southafrica', flag: '🇿🇦', country: 'South Africa',
    hero: 'CAPS-aligned tutoring for South African students',
    subline: 'Grade R to Matric — NSC and IEB specialists',
    gradeLabel: 'Grade', gradeRange: 'Grade R–Grade 12',
    exams: ['Matric', 'NSC', 'IEB'],
    subjects: ['Maths', 'English', 'Physical Sciences', 'Life Sciences', 'Geography', 'History', 'Accounting', 'Business Studies'],
    subjectNote: 'Aligned to the CAPS curriculum'
  }
]
export const DEFAULT_CURRICULUM = 'global'
