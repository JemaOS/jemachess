import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/JemaChess/);
});

test('has logo link', async ({ page }) => {
  await page.goto('/');

  // Check for the icon link
  const iconLink = page.locator('link[rel="icon"][href="/icons/icon-512x512.svg"]');
  await expect(iconLink).toHaveCount(1);
});
