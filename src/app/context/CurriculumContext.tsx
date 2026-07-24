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
    try {
      const saved = localStorage.getItem('sh_curriculum');
      if (saved) {
        const curriculum = CURRICULA.find(c => c.id === saved);
        if (curriculum) {
          setActiveCurriculumState(curriculum);
          return;
        }
      }
    } catch (e) {
      console.warn('LocalStorage access failed in CurriculumContext:', e);
    }

    // Attempt geo-detection if no preference saved
    const detectCountry = async () => {
      try {
        const { getDetectedCountryCode } = await import('../actions/geo');
        let code = await getDetectedCountryCode();
        
        // Fallback for local dev or when server cannot see the client IP (e.g. localhost):
        // Query client-side directly from the browser so it sees the user's actual VPN IP!
        if (!code && typeof window !== 'undefined') {
          try {
            // Cloudflare trace is bulletproof, free, HTTPS, unlimited, and ignores adblockers
            const cfRes = await fetch('https://1.1.1.1/cdn-cgi/trace', { cache: 'no-store' });
            if (cfRes.ok) {
              const text = await cfRes.text();
              const locMatch = text.match(/loc=([A-Z]{2})/i);
              if (locMatch && locMatch[1]) {
                code = locMatch[1];
              }
            }
          } catch {
            // Backup client fetch
            try {
              const clientRes = await fetch('https://ipapi.co/json/', { cache: 'no-store' });
              if (clientRes.ok) {
                const clientData = await clientRes.json();
                code = clientData.country_code || null;
              }
            } catch { /* ignore */ }
          }
        }

        if (!code) return; // Fallback to default if detection fails

        let detectedId = DEFAULT_CURRICULUM;
        const upperCode = code.toUpperCase();
        if (upperCode === 'GB' || upperCode === 'UK') detectedId = 'uk';
        else if (upperCode === 'US') detectedId = 'us';
        else if (upperCode === 'AU') detectedId = 'australia';
        else if (upperCode === 'SG') detectedId = 'singapore';
        else if (['AE', 'SA', 'QA', 'KW', 'BH', 'OM'].includes(upperCode)) detectedId = 'middleeast';
        else if (upperCode === 'ZA') detectedId = 'southafrica';

        // Set the detected country in state (don't save to localStorage automatically so VPN toggling works)
        const curriculum = CURRICULA.find(c => c.id === detectedId);
        if (curriculum) {
          setActiveCurriculumState(curriculum);
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
      try {
        localStorage.setItem('sh_curriculum', id);
      } catch (e) {
        console.warn('Failed to save curriculum to localStorage:', e);
      }
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
