import { test, expect } from '@playwright/test';

test('check security headers', async ({ page }) => {
  const response = await page.goto('/');
  const headers = response?.headers();

  if (!headers) {
    throw new Error('No response headers received');
  }

  const isLocalhost = page.url().includes('localhost') || page.url().includes('127.0.0.1');

  const checkHeader = (headerName: string, expectedValue?: string) => {
    const value = headers[headerName];
    
    // If header is missing or doesn't match expected value
    if (value === undefined || (expectedValue && value !== expectedValue)) {
      if (isLocalhost) {
        console.warn(`Security header ${headerName} is missing or incorrect (expected on localhost)`);
        return;
      }
    }

    // Strict assertions for production or if present on localhost
    if (expectedValue) {
      expect.soft(value).toBe(expectedValue);
    } else {
      expect.soft(value).toBeDefined();
    }
  };

  checkHeader('x-content-type-options', 'nosniff');
  checkHeader('x-frame-options');
  checkHeader('content-security-policy');
  checkHeader('strict-transport-security');
  checkHeader('referrer-policy');
});
