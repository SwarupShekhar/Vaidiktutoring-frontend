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
    getPlatform: () => string;
  }

  interface Window {
    electron?: ElectronBridge;
  }
}
