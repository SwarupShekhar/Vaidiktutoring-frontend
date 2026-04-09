'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CURRICULA, DEFAULT_CURRICULUM } from '../config/curricula';

type Curriculum = typeof CURRICULA[0];

interface CurriculumContextType {
  activeCurriculum: Curriculum;
  setCurriculum: (id: string) => void;
}

const CurriculumContext = createContext<CurriculumContextType | undefined>(undefined);

export function CurriculumProvider({ children }: { children: React.ReactNode }) {
  const [activeCurriculum, setActiveCurriculumState] = useState<Curriculum>(
    CURRICULA.find(c => c.id === DEFAULT_CURRICULUM) || CURRICULA[0]
  );

  useEffect(() => {
    const saved = localStorage.getItem('sh_curriculum');
    if (saved) {
      const curriculum = CURRICULA.find(c => c.id === saved);
      if (curriculum) {
        setActiveCurriculumState(curriculum);
        return;
      }
    }

    // Attempt geo-detection if no preference saved
    const detectCountry = async () => {
      try {
        const res = await fetch('https://ip-api.com/json/?fields=countryCode');
        const data = await res.json();
        const code = data.countryCode;

        let detectedId = DEFAULT_CURRICULUM;
        if (code === 'GB') detectedId = 'uk';
        else if (code === 'AU') detectedId = 'australia';
        else if (code === 'SG') detectedId = 'singapore';
        else if (['AE', 'SA', 'QA', 'KW', 'BH', 'OM'].includes(code)) detectedId = 'middleeast';
        else if (code === 'ZA') detectedId = 'southafrica';

        const curriculum = CURRICULA.find(c => c.id === detectedId);
        if (curriculum) {
          setActiveCurriculumState(curriculum);
          // Auto-save detection if user hasn't explicitly set? Or keep it temporary until interaction?
          // User said "On first visit with no localStorage value..." but also "setCurriculum saves to localStorage immediately"
          // I will save the detection to localStorage to avoid repeated hits to the geo-api
          localStorage.setItem('sh_curriculum', detectedId);
        }
      } catch (e) {
        console.warn('Country detection failed, falling back to default.');
      }
    };

    detectCountry();
  }, []);

  const setCurriculum = (id: string) => {
    const curriculum = CURRICULA.find(c => c.id === id);
    if (curriculum) {
      setActiveCurriculumState(curriculum);
      localStorage.setItem('sh_curriculum', id);
    }
  };

  return (
    <CurriculumContext.Provider value={{ activeCurriculum, setCurriculum }}>
      {children}
    </CurriculumContext.Provider>
  );
}

export function useCurriculum() {
  const context = useContext(CurriculumContext);
  if (context === undefined) {
    throw new Error('useCurriculum must be used within a CurriculumProvider');
  }
  return context;
}
