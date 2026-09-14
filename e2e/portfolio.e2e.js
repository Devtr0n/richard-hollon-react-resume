import { test, expect } from '@playwright/test';

test.describe('Portfolio project links', () => {
  test('each project thumbnail opens its project in a new tab, not the current one', async ({ page, context }) => {
    await page.goto('/');

    const firstProject = page.locator('#portfolio-wrapper .portfolio-item a').first();
    await expect(firstProject).toHaveAttribute('target', '_blank');
    await expect(firstProject).toHaveAttribute('rel', /noopener/);

    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      firstProject.click(),
    ]);

    await newPage.waitForLoadState('domcontentloaded');
    expect(newPage.url()).not.toBe('about:blank');
    expect(page.url()).toContain('localhost');
    await expect(page.locator('#portfolio')).toBeInViewport();

    await newPage.close();
  });

  test('every project link has target=_blank and rel=noopener noreferrer', async ({ page }) => {
    await page.goto('/');

    const projectLinks = page.locator('#portfolio-wrapper .portfolio-item a');
    const count = await projectLinks.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i += 1) {
      const link = projectLinks.nth(i);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
      await expect(link).toHaveAttribute('rel', /noreferrer/);
    }
  });
});
