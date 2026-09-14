import { test, expect } from '@playwright/test';

test.describe('Keyboard accessibility: skip link', () => {
  test('skip link is hidden until focused, then jumps focus to main content', async ({ page }) => {
    await page.goto('/');

    const skipLink = page.locator('a.skip-link');
    await expect(skipLink).toHaveText('Skip to main content');

    // Off-screen until focused.
    const hiddenBox = await skipLink.boundingBox();
    expect(hiddenBox.x).toBeLessThan(0);

    // Tab from the top of the page; the skip link should be the first stop.
    await page.keyboard.press('Tab');
    await expect(skipLink).toBeFocused();

    const visibleBox = await skipLink.boundingBox();
    expect(visibleBox.x).toBeGreaterThanOrEqual(0);

    await page.keyboard.press('Enter');
    await expect(page.locator('#about')).toBeInViewport();
    expect(page.url()).toContain('#about');
  });
});
