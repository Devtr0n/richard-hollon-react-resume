import { test, expect } from '@playwright/test';

// Real-browser check that the print stylesheet actually applies the
// on-screen-only chrome hiding and layout rules - jsdom cannot evaluate
// @media print rules, only a real browser rendering engine can.
test.describe('Print stylesheet', () => {
  test('hides on-screen chrome and shows resume content when printing', async ({ page }) => {
    await page.goto('/');
    await page.emulateMedia({ media: 'print' });

    await expect(page.locator('header')).toBeHidden();
    await expect(page.locator('#nav')).toBeHidden();
    await expect(page.locator('#contact')).toBeHidden();
    await expect(page.locator('footer')).toBeHidden();
    await expect(page.locator('a.skip-link')).toBeHidden();

    await expect(page.locator('#about')).toBeVisible();
    await expect(page.locator('#resume')).toBeVisible();
    await expect(page.locator('#portfolio')).toBeVisible();
    await expect(page.locator('#testimonials')).toBeVisible();
  });

  test('does not hide on-screen chrome outside of print media', async ({ page }) => {
    await page.goto('/');
    await page.emulateMedia({ media: 'screen' });

    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('#nav')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });
});
