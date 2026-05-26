/**
 * PWA Installation & Update Helper
 * 
 * Handles:
 * - Service worker registration via vite-plugin-pwa
 * - Automatic update detection
 * - Update on reconnect (when coming back online)
 * - Install prompt management
 * - Offline/online connectivity monitoring
 */

import { registerSW } from 'virtual:pwa-register';

export interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

// ============================================
// Service Worker Registration & Update System
// ============================================

let updateSW: ((reloadPage?: boolean) => Promise<void>) | null = null;
let swRegistration: ServiceWorkerRegistration | null = null;
let updateAvailable = false;

// Callbacks for the app to hook into
let onUpdateAvailableCallback: (() => void) | null = null;
let onOfflineReadyCallback: (() => void) | null = null;

/**
 * Initialize the service worker with automatic update support.
 * 
 * The SW will:
 * - Precache all app assets on first install (offline support)
 * - Check for updates periodically and on reconnect
 * - Notify the app when an update is available
 */
export function initServiceWorker(): void {
  updateSW = registerSW({
    immediate: true,
    onRegisteredSW(swUrl, registration) {
      swRegistration = registration ?? null;
      console.log('[PWA] Service Worker registered:', swUrl);

      if (registration) {
        // Check for updates periodically (every 60 minutes)
        setInterval(() => {
          registration.update().catch((err: unknown) => {
            console.warn('[PWA] Periodic update check failed:', err);
          });
        }, 60 * 60 * 1000);

        // Check for updates when coming back online
        window.addEventListener('online', () => {
          console.log('[PWA] Back online - checking for updates...');
          registration.update().catch((err: unknown) => {
            console.warn('[PWA] Online update check failed:', err);
          });
        });

        // Check for updates when app becomes visible again
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible' && navigator.onLine) {
            registration.update().catch((err: unknown) => {
              console.warn('[PWA] Visibility update check failed:', err);
            });
          }
        });
      }
    },
    onNeedRefresh() {
      // A new version of the app is available
      updateAvailable = true;
      console.log('[PWA] New content available - update ready');
      if (onUpdateAvailableCallback) {
        onUpdateAvailableCallback();
      }
    },
    onOfflineReady() {
      console.log('[PWA] App is ready for offline use');
      if (onOfflineReadyCallback) {
        onOfflineReadyCallback();
      }
    },
    onRegisterError(error) {
      console.error('[PWA] Service Worker registration failed:', error);
    },
  });
}

/**
 * Apply the pending update and reload the page.
 * Call this when the user accepts the update.
 */
export async function applyUpdate(): Promise<void> {
  if (updateSW && updateAvailable) {
    await updateSW(true);
  }
}

/**
 * Check if an update is available
 */
export function isUpdateAvailable(): boolean {
  return updateAvailable;
}

/**
 * Manually trigger an update check
 */
export async function checkForUpdate(): Promise<void> {
  if (swRegistration) {
    try {
      await swRegistration.update();
    } catch (err) {
      console.warn('[PWA] Manual update check failed:', err);
    }
  }
}

/**
 * Set callback for when an update is available
 */
export function onUpdateAvailable(callback: () => void): void {
  onUpdateAvailableCallback = callback;
  // If update is already available, call immediately
  if (updateAvailable) {
    callback();
  }
}

/**
 * Set callback for when the app is ready for offline use
 */
export function onOfflineReady(callback: () => void): void {
  onOfflineReadyCallback = callback;
}

// ============================================
// PWA Install Prompt
// ============================================

export class PWAInstaller {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private isInstalled: boolean = false;

  // Event callbacks
  public onInstallAvailable: (() => void) | null = null;
  public onInstalled: (() => void) | null = null;

  constructor() {
    this.isInstalled = this.checkIfInstalled();
  }

  /**
   * Initialize the PWA installer - listen for install events
   */
  init(): void {
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (event: BeforeInstallPromptEvent) => {
      // Prevent the mini-infobar from appearing on mobile
      event.preventDefault();
      
      // Store the event for later use
      this.deferredPrompt = event;
      
      // Notify that installation is available
      if (this.onInstallAvailable) {
        this.onInstallAvailable();
      }
    });

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.deferredPrompt = null;
      
      // Notify that app was installed
      if (this.onInstalled) {
        this.onInstalled();
      }
      
      // Persist installation flag
      this.markAsInstalled();
      console.log('[PWA] JemaChess was installed');
    });

    // Check if already running as PWA
    if (this.isRunningAsPWA()) {
      this.isInstalled = true;
    }
  }

  /**
   * Check if the app can be installed
   */
  canInstall(): boolean {
    return this.deferredPrompt !== null && !this.isInstalled;
  }

  /**
   * Check if the app is already installed
   */
  isAppInstalled(): boolean {
    return this.isInstalled;
  }

  /**
   * Trigger the install prompt
   * @returns Promise<boolean> - true if user accepted, false if dismissed
   */
  async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt) {
      console.warn('[PWA] Install prompt not available');
      return false;
    }

    // Show the install prompt
    await this.deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await this.deferredPrompt.userChoice;

    // Clear the deferred prompt
    this.deferredPrompt = null;

    if (outcome === 'accepted') {
      console.log('[PWA] User accepted the install prompt');
      return true;
    } else {
      console.log('[PWA] User dismissed the install prompt');
      return false;
    }
  }

  /**
   * Check if the app is running as a PWA (standalone mode)
   */
  isRunningAsPWA(): boolean {
    // Check display-mode media query
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return true;
    }

    // Check iOS standalone mode
    if ((navigator as Navigator & { standalone?: boolean }).standalone === true) {
      return true;
    }

    // Check if launched from home screen on Android
    if (document.referrer.includes('android-app://')) {
      return true;
    }

    return false;
  }

  /**
   * Check if running on ChromeOS
   */
  isChromeos(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes('cros');
  }

  /**
   * Check if the device supports PWA installation
   */
  supportsPWA(): boolean {
    return 'serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window;
  }

  /**
   * Get the current platform for display purposes
   */
  getPlatform(): 'chromeos' | 'android' | 'ios' | 'windows' | 'macos' | 'linux' | 'unknown' {
    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();

    if (userAgent.includes('cros')) return 'chromeos';
    if (userAgent.includes('android')) return 'android';
    if (/iphone|ipad|ipod/.test(userAgent)) return 'ios';
    if (platform.includes('win')) return 'windows';
    if (platform.includes('mac')) return 'macos';
    if (platform.includes('linux')) return 'linux';
    
    return 'unknown';
  }

  /**
   * Check if the app was installed (persisted check)
   */
  private checkIfInstalled(): boolean {
    const installed = localStorage.getItem('jemachess-installed');
    if (installed === 'true') {
      return true;
    }
    return this.isRunningAsPWA();
  }

  /**
   * Mark the app as installed in localStorage
   */
  markAsInstalled(): void {
    localStorage.setItem('jemachess-installed', 'true');
    this.isInstalled = true;
  }
}

// Singleton instance
export const pwaInstaller = new PWAInstaller();

// ============================================
// Connectivity helpers
// ============================================

/**
 * Check if the app is online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Listen for online/offline status changes
 */
export function onConnectivityChange(callback: (online: boolean) => void): () => void {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}
