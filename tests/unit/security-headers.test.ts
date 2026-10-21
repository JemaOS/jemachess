import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

function readProjectFile(relativePath: string): string {
  return readFileSync(new URL(`../../${relativePath}`, import.meta.url), 'utf8');
}

describe('production security headers', () => {
  it('allows the inline theme script through the CSP hash', () => {
    const html = readProjectFile('index.html');
    const inlineScript = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];

    expect(inlineScript).toBeDefined();

    // Browsers normalize CRLF to LF before hashing inline scripts.
    const normalized = (inlineScript ?? '').replace(/\r\n/g, '\n');
    const hash = createHash('sha256').update(normalized, 'utf8').digest('base64');

    const vercel = JSON.parse(readProjectFile('vercel.json')) as {
      headers: Array<{ source: string; headers: Array<{ key: string; value: string }> }>;
    };
    const csp = vercel.headers
      .flatMap((entry) => entry.headers)
      .find((header) => header.key.toLowerCase() === 'content-security-policy')?.value;

    expect(csp).toBeDefined();
    expect(csp).toContain(`'sha256-${hash}'`);
  });

  it('ships the main hardening headers', () => {
    const vercel = JSON.parse(readProjectFile('vercel.json')) as {
      headers: Array<{ source: string; headers: Array<{ key: string; value: string }> }>;
    };
    const headers = new Map(
      vercel.headers.flatMap((entry) => entry.headers).map((header) => [header.key, header.value])
    );

    expect(headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(headers.get('X-Frame-Options')).toBe('DENY');
    expect(headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(headers.get('Strict-Transport-Security')).toContain('max-age=');
    expect(headers.get('Content-Security-Policy')).toContain("frame-ancestors 'none'");
  });
});
