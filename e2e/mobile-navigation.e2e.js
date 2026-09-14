import { test, expect } from '@playwright/test';

test.describe('Responsive mobile navigation', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('nav menu is collapsed behind a toggle button on mobile and opens on tap', async ({ page }) => {
    await page.goto('/');

    const navMenu = page.locator('#nav-wrap ul#nav');
    const showNavBtn = page.locator('a.mobile-btn[href="#nav-wrap"]');
    const hideNavBtn = page.locator('a.mobile-btn[href="#home"]');

    await expect(navMenu).toBeHidden();
    await expect(showNavBtn).toBeVisible();

    await showNavBtn.click();
    await expect(navMenu).toBeVisible();

    await hideNavBtn.click();
    await expect(navMenu).toBeHidden();
  });

  test('mobile nav links still scroll to their target section', async ({ page }) => {
    await page.goto('/');

    await page.locator('a.mobile-btn[href="#nav-wrap"]').click();
    const resumeLink = page.locator('#nav a[href="#resume"]');
    await expect(resumeLink).toBeVisible();

    await resumeLink.click();
    await expect(page.locator('#resume')).toBeInViewport();
  });
});
