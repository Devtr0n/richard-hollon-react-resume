import { test, expect } from '@playwright/test';

test.describe('Navigation and social links', () => {
  test('nav links scroll to their target sections and turn orange on hover', async ({ page }) => {
    await page.goto('/');

    const resumeNavLink = page.locator('#nav a[href="#resume"]');
    await resumeNavLink.hover();
    await expect(resumeNavLink).toHaveCSS('color', 'rgb(240, 96, 0)');

    await resumeNavLink.click();
    await expect(page.locator('#resume')).toBeInViewport();
  });

  test('header social icons open in a new tab and match nav hover color', async ({ page }) => {
    await page.goto('/');

    const socialLink = page.locator('header .social li a').first();
    await expect(socialLink).toHaveAttribute('target', '_blank');
    await expect(socialLink).toHaveAttribute('rel', /noopener/);

    await socialLink.hover();
    await expect(socialLink).toHaveCSS('color', 'rgb(240, 96, 0)');
  });
});
