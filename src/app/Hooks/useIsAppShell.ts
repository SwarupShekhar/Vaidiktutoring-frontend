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
function detectAppShell(): boolean {
  if (typeof window === 'undefined') return false;
  const w = window as any;
  const viaBridge = !!(w.electron && w.electron.isDesktopApp);
  const viaUA =
    typeof navigator !== 'undefined' && navigator.userAgent.includes('StudyHoursApp');
  const viaClass =
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('app-shell-mode');
  const viaCookie =
    typeof document !== 'undefined' && /(?:^|;\s*)sh_app=1(?:;|$)/.test(document.cookie);
  return viaBridge || viaUA || viaClass || viaCookie;
}

export function useIsAppShell(): boolean {
  // Initialise synchronously so a CLIENT-SIDE navigation (component mounts on the
  // client, window.electron present) resolves to `true` on the FIRST render — no
  // false-first flash that briefly (or stickily) renders the web dashboard inside
  // the desktop app. On the server this is false; the effect re-syncs after mount
  // for the initial full page load (layout already gates the shell via the cookie).
  const [isAppShell, setIsAppShell] = useState<boolean>(detectAppShell);

  useEffect(() => {
    const v = detectAppShell();
    setIsAppShell((prev) => (prev === v ? prev : v));
  }, []);

  return isAppShell;
}
