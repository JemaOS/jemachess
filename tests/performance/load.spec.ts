import { test, expect } from '@playwright/test';

test('measure DOMContentLoaded time', async ({ page }) => {
  await page.goto('/');

  const domContentLoadedTime = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return navigation.domContentLoadedEventEnd - navigation.startTime;
  });

  console.log(`DOMContentLoaded time: ${domContentLoadedTime}ms`);

  // Basic assertion to ensure it loads reasonably fast (adjust threshold as needed)
  expect(domContentLoadedTime).toBeLessThan(2000);
});
