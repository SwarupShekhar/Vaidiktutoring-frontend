// Global type augmentation for the Electron desktop-app preload bridge.
// Exposed via contextBridge in studyhours-desktop/preload.js (window.electron).
// Web users simply have `window.electron === undefined`.

export {};

declare global {
  interface ElectronBridge {
    isDesktopApp: boolean;
    sendNotification: (title: string, body: string) => void;
    onOfflineStatus: (callback: (status: unknown) => void) => void;
    windowReady: () => void;
    windowRetry: () => void;
    setBadgeCount: (count: number) => void;
    windowMinimize: () => void;
    windowMaximize: () => void;
    windowClose: () => void;
    openExternal: (url: string) => void;
    /**
     * Just-in-time camera/mic request. Call right before joining a live session.
     * Triggers the native macOS permission dialog (no-op grant on Win/Linux).
     */
    requestMediaAccess: () => Promise<{ camera: string; microphone: string }>;
    getPlatform: () => string;
  }

  interface Window {
    electron?: ElectronBridge;
  }
}
