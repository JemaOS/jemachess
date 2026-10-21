/**
 * Theme Manager
 *
 * Keeps the interface in sync with the operating system light/dark
 * preference (Windows, ChromeOS, macOS, Linux, Android, iOS).
 *
 * The user can override the system preference from the settings screen:
 * - `system` follows `prefers-color-scheme` and reacts live to OS changes
 * - `light` / `dark` force a theme and persist the choice locally
 */

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'jemachess-theme';
const DARK_THEME_COLOR = '#0a0a0f';
const LIGHT_THEME_COLOR = '#f2f4fa';

export type ThemeListener = (theme: ResolvedTheme, preference: ThemePreference) => void;

function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark';
}

/**
 * Best-effort OS detection. It is exposed as `data-platform` on <html>
 * so platform specific tweaks remain possible without changing the
 * theme resolution logic.
 */
export function detectPlatform(): string {
  if (typeof navigator === 'undefined') return 'unknown';

  const userAgent = navigator.userAgent;
  const platform = (navigator as Navigator & { userAgentData?: { platform?: string } })
    .userAgentData?.platform;

  if (/CrOS/.test(userAgent)) return 'chromeos';
  if (/Windows/i.test(userAgent) || /Win/i.test(platform ?? '')) return 'windows';
  if (/Android/i.test(userAgent)) return 'android';
  if (/iPhone|iPad|iPod/i.test(userAgent)) return 'ios';
  if (/Mac OS X|macOS/i.test(userAgent) || /mac/i.test(platform ?? '')) return 'macos';
  if (/Linux/i.test(userAgent)) return 'linux';

  return 'unknown';
}

class ThemeManager {
  private preference: ThemePreference = 'system';
  private resolved: ResolvedTheme = 'dark';
  private mediaQuery: MediaQueryList | null = null;
  private listeners = new Set<ThemeListener>();
  private initialized = false;

  /**
   * Reads the saved preference, applies it and starts listening to OS changes.
   * Safe to call multiple times.
   */
  init(): void {
    if (this.initialized || typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    this.initialized = true;
    this.preference = this.readStoredPreference();
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.resolved = this.resolveTheme();
    this.applyTheme();

    const handleSystemChange = (): void => {
      if (this.preference !== 'system') return;
      this.resolved = this.resolveTheme();
      this.applyTheme();
    };

    if (typeof this.mediaQuery.addEventListener === 'function') {
      this.mediaQuery.addEventListener('change', handleSystemChange);
    } else {
      // Safari < 14 fallback
      this.mediaQuery.addListener(handleSystemChange);
    }

    // ChromeOS/Windows may not fire the media query change while a tab is
    // backgrounded, so re-sync when the page becomes visible again.
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.preference === 'system') {
        this.refresh();
      }
    });
    window.addEventListener('focus', () => {
      if (this.preference === 'system') {
        this.refresh();
      }
    });

    // Keep multiple tabs/windows in sync when the preference changes.
    window.addEventListener('storage', (event) => {
      if (event.key !== STORAGE_KEY) return;
      this.preference = this.readStoredPreference();
      this.resolved = this.resolveTheme();
      this.applyTheme();
    });

    document.documentElement.dataset.platform = detectPlatform();
  }

  /**
   * Returns the stored preference (defaults to `system`).
   */
  getPreference(): ThemePreference {
    if (!this.initialized) this.preference = this.readStoredPreference();
    return this.preference;
  }

  /**
   * Returns the theme currently applied to the interface.
   */
  getResolvedTheme(): ResolvedTheme {
    if (!this.initialized) this.resolved = this.resolveTheme();
    return this.resolved;
  }

  /**
   * Sets and persists the user preference.
   */
  setPreference(preference: ThemePreference): void {
    if (!isThemePreference(preference)) return;

    this.preference = preference;

    try {
      localStorage.setItem(STORAGE_KEY, preference);
    } catch {
      // Storage may be unavailable (private mode, quotas) - keep in memory.
    }

    this.resolved = this.resolveTheme();
    this.applyTheme();
  }

  /**
   * Cycles system -> light -> dark -> system. Useful for keyboard shortcuts.
   */
  toggle(): ThemePreference {
    const order: ThemePreference[] = ['system', 'light', 'dark'];
    const next = order[(order.indexOf(this.preference) + 1) % order.length];
    this.setPreference(next);
    return next;
  }

  /**
   * Re-evaluates the system preference.
   */
  refresh(): void {
    if (this.preference !== 'system') return;
    const next = this.resolveTheme();
    if (next === this.resolved) return;
    this.resolved = next;
    this.applyTheme();
  }

  /**
   * Subscribes to theme changes. Returns an unsubscribe function.
   */
  subscribe(listener: ThemeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private readStoredPreference(): ThemePreference {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (isThemePreference(stored)) return stored;
    } catch {
      // Ignore storage errors.
    }
    return 'system';
  }

  private resolveTheme(): ResolvedTheme {
    if (this.preference === 'light') return 'light';
    if (this.preference === 'dark') return 'dark';

    const prefersDark = this.mediaQuery
      ? this.mediaQuery.matches
      : typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;

    return prefersDark ? 'dark' : 'light';
  }

  private applyTheme(): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    root.dataset.theme = this.resolved;
    root.style.colorScheme = this.resolved;

    this.updateThemeColorMeta();
    this.updateAppleStatusBarMeta();

    for (const listener of this.listeners) {
      try {
        listener(this.resolved, this.preference);
      } catch (error) {
        console.error('[ThemeManager] Theme listener failed:', error);
      }
    }

    document.dispatchEvent(
      new CustomEvent('jemachess:themechange', {
        detail: { theme: this.resolved, preference: this.preference },
      })
    );
  }

  private updateThemeColorMeta(): void {
    const content = this.resolved === 'light' ? LIGHT_THEME_COLOR : DARK_THEME_COLOR;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) meta.content = content;

    const tile = document.querySelector<HTMLMetaElement>('meta[name="msapplication-TileColor"]');
    if (tile) tile.content = content;
  }

  private updateAppleStatusBarMeta(): void {
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="apple-mobile-web-app-status-bar-style"]'
    );
    if (meta) meta.content = this.resolved === 'light' ? 'default' : 'black-translucent';
  }
}

export const themeManager = new ThemeManager();

/**
 * Initializes the theme manager. Call once, as early as possible.
 */
export function initTheme(): ThemeManager {
  themeManager.init();
  return themeManager;
}
