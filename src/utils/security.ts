/**
 * Small, dependency-free helpers used to keep untrusted data (peer
 * messages, localStorage, user input) from breaking the UI or injecting
 * markup.
 */

const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/**
 * Escapes a value for safe interpolation in HTML text or attribute values.
 * Accepts unknown so callers can safely escape network/localStorage data.
 */
export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[&<>"']/g, (character) => HTML_ENTITIES[character] ?? character);
}

/**
 * Truncates text and returns a fallback when the value is not a string.
 */
export function clampText(value: unknown, maxLength: number, fallback = ''): string {
  if (typeof value !== 'string') return fallback;
  return value.slice(0, Math.max(0, maxLength));
}

/**
 * Normalizes a player name: keeps it on one line, removes control
 * characters and enforces a reasonable maximum length.
 */
export function sanitizeDisplayName(
  value: unknown,
  fallback = 'Joueur',
  maxLength = 20
): string {
  if (typeof value !== 'string') return fallback;

  const cleaned = value
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    // Strip zero-width and bidirectional control characters used for spoofing.
    .replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u206F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, Math.max(1, maxLength));

  return cleaned || fallback;
}

/**
 * Validates and clamps a numeric value.
 */
export function clampNumber(
  value: unknown,
  min: number,
  max: number,
  fallback: number
): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}
