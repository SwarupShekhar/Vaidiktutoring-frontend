export const gradeTokensByCurriculum: Record<string, { value: string, label: string }[]> = {
  psle: [
    { value: 'p1', label: 'Primary 1' },
    { value: 'p2', label: 'Primary 2' },
    { value: 'p3', label: 'Primary 3' },
    { value: 'p4', label: 'Primary 4' },
    { value: 'p5', label: 'Primary 5' },
    { value: 'p6', label: 'Primary 6' }
  ],
  gce_o: [
    { value: 'sec1', label: 'Secondary 1' },
    { value: 'sec2', label: 'Secondary 2' },
    { value: 'sec3', label: 'Secondary 3' },
    { value: 'sec4', label: 'Secondary 4' }
  ],
  gce_a: [
    { value: 'jc1', label: 'JC 1' },
    { value: 'jc2', label: 'JC 2' }
  ],
  gcse: [
    { value: 'y9', label: 'Year 9' },
    { value: 'y10', label: 'Year 10' },
    { value: 'y11', label: 'Year 11' }
  ],
  igcse: [
    { value: 'y9', label: 'Year 9' },
    { value: 'y10', label: 'Year 10' },
    { value: 'y11', label: 'Year 11' }
  ],
  a_levels: [
    { value: 'y12', label: 'Year 12' },
    { value: 'y13', label: 'Year 13' }
  ],
  uk_ks3: [
    { value: 'y7', label: 'Year 7' },
    { value: 'y8', label: 'Year 8' },
    { value: 'y9', label: 'Year 9' }
  ],
  cbse: Array.from({ length: 12 }, (_, i) => ({ value: `g${i + 1}`, label: `Grade ${i + 1}` })),
  icse: Array.from({ length: 12 }, (_, i) => ({ value: `g${i + 1}`, label: `Grade ${i + 1}` })),
  ccss: Array.from({ length: 12 }, (_, i) => ({ value: `g${i + 1}`, label: `Grade ${i + 1}` })),
  ngss: Array.from({ length: 12 }, (_, i) => ({ value: `g${i + 1}`, label: `Grade ${i + 1}` })),
  ap: [
    { value: 'g11', label: 'Grade 11' },
    { value: 'g12', label: 'Grade 12' }
  ],
  teks: Array.from({ length: 12 }, (_, i) => ({ value: `g${i + 1}`, label: `Grade ${i + 1}` })),
  australian_curriculum: [
    { value: 'f', label: 'Foundation' },
    ...Array.from({ length: 10 }, (_, i) => ({ value: `y${i + 1}`, label: `Year ${i + 1}` }))
  ],
  atar: [
    { value: 'y11', label: 'Year 11' },
    { value: 'y12', label: 'Year 12' }
  ],
  ontario: Array.from({ length: 12 }, (_, i) => ({ value: `g${i + 1}`, label: `Grade ${i + 1}` })),
  ib: [
    ...Array.from({ length: 6 }, (_, i) => ({ value: `pyp${i + 1}`, label: `PYP ${i + 1}` })),
    ...Array.from({ length: 5 }, (_, i) => ({ value: `myp${i + 1}`, label: `MYP ${i + 1}` })),
    { value: 'dp1', label: 'DP 1' },
    { value: 'dp2', label: 'DP 2' }
  ],
  sat: [
    { value: 'g10', label: 'Grade 10' },
    { value: 'g11', label: 'Grade 11' },
    { value: 'g12', label: 'Grade 12' }
  ],
  act: [
    { value: 'g10', label: 'Grade 10' },
    { value: 'g11', label: 'Grade 11' },
    { value: 'g12', label: 'Grade 12' }
  ]
};

export function getGradeOptions(curriculumId: string) {
  return gradeTokensByCurriculum[curriculumId] || [];
}
