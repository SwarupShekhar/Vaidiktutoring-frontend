'use client';

import { useEffect, useState } from 'react';

/**
 * Detects whether the app is running inside the StudyHours Electron desktop shell.
 *
 * Hydration-safe: returns `false` on the server and during the first client
 * render, then flips to `true` after mount if the Electron preload bridge is
 * present. Use this to branch UI between the web experience and the native
 * desktop app-shell experience WITHOUT affecting web users.
 *
 * For server-side detection (e.g. in layouts that read headers), use the
 * `StudyHoursApp` User-Agent token instead — this hook is client-only.
 */
export function useIsAppShell(): boolean {
  const [isAppShell, setIsAppShell] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const w = window as any;
    const viaBridge = !!(w.electron && w.electron.isDesktopApp);
    const viaUA =
      typeof navigator !== 'undefined' &&
      navigator.userAgent.includes('StudyHoursApp');
    const viaClass =
      typeof document !== 'undefined' &&
      document.documentElement.classList.contains('app-shell-mode');
    setIsAppShell(viaBridge || viaUA || viaClass);
  }, []);

  return isAppShell;
}
