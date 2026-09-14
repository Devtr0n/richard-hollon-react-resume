import { test, expect } from '@playwright/test';

// Unlike the other e2e suites, this test does not mock fetch/network calls.
// It hits the built preview server and asserts the real public/resumeData.json
// renders correctly end-to-end, catching a broken/malformed JSON file before
// it reaches production.

test.describe('Home page smoke test (real resumeData.json)', () => {
  test('renders real resume content for every major section', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 }).first()).toContainText(
      "I'm Richard Hollon."
    );

    await expect(page.locator('#about')).toBeVisible();
    await expect(page.locator('#resume')).toBeVisible();
    await expect(page.locator('#portfolio-wrapper .portfolio-item').first()).toBeVisible();
    await expect(page.locator('#testimonials blockquote').first()).toBeVisible();
    await expect(page.locator('#contact')).toBeVisible();

    // Sanity check: no leftover template placeholders or fetch failures made it to screen.
    await expect(page.locator('body')).not.toContainText('undefined');
    await expect(page.locator('[role="alert"]')).toHaveCount(0);
  });
});
