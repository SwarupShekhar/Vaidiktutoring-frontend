'use client';

import React, { useEffect, useState } from 'react';

export default function TitleBar() {
  const [isMac, setIsMac] = useState(false);
  const [isWindows, setIsWindows] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.electron) {
      const platform = window.electron.getPlatform ? window.electron.getPlatform() : navigator.platform.toLowerCase();
      if (platform === 'darwin' || platform.includes('mac')) {
        setIsMac(true);
      } else if (platform === 'win32' || platform.includes('win')) {
        setIsWindows(true);
      }
    }
  }, []);

  if (!isMac && !isWindows) {
    return null; // Don't render titlebar if not desktop app or we are somehow unsure
  }

  return (
    <div
      className="fixed top-0 left-0 w-full h-8 z-[9999] flex items-center justify-between pointer-events-none"
      style={{ WebkitAppRegion: 'drag' } as any}
    >
      <div style={{ paddingLeft: isMac ? '80px' : '16px' }} className="flex items-center text-xs text-gray-400 font-medium">
        {isWindows ? 'StudyHours' : ''}
      </div>

      {isWindows && (
        <div className="flex h-full" style={{ WebkitAppRegion: 'no-drag', pointerEvents: 'auto' } as any}>
          <button 
            onClick={() => window.electron?.windowMinimize()}
            className="h-full px-4 hover:bg-white/10 transition-colors flex items-center justify-center text-gray-400"
          >
            <svg width="10" height="1" viewBox="0 0 10 1"><path fill="currentColor" d="M0 0h10v1H0z"/></svg>
          </button>
          <button 
            onClick={() => window.electron?.windowMaximize()}
            className="h-full px-4 hover:bg-white/10 transition-colors flex items-center justify-center text-gray-400"
          >
            <svg width="10" height="10" viewBox="0 0 10 10"><path stroke="currentColor" fill="none" d="M1.5 1.5h7v7h-7z"/></svg>
          </button>
          <button 
            onClick={() => window.electron?.windowClose()}
            className="h-full px-4 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center text-gray-400"
          >
            <svg width="10" height="10" viewBox="0 0 10 10"><path fill="currentColor" d="M1.414 0L5 3.586 8.586 0 10 1.414 6.414 5 10 8.586 8.586 10 5 6.414 1.414 10 0 8.586 3.586 5 0 1.414z"/></svg>
          </button>
        </div>
      )}
    </div>
  );
}
