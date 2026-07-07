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

      {/* Windows min/maximize/close are now drawn by the OS via Electron's native
          titleBarOverlay (see main.js). The old web-rendered buttons were unreliable
          inside the frameless shell, so they're intentionally removed here to avoid
          a duplicate, non-functional set. This strip stays as the draggable region. */}
    </div>
  );
}
