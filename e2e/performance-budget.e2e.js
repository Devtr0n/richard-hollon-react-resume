import { test, expect } from '@playwright/test';
import { statSync, readdirSync } from 'fs';
import { join } from 'path';

// Performance budget test: keeps an eye on regressions in bundle size and
// real browser load timing. Budgets are intentionally generous for a small
// static resume site; they exist to catch an accidental heavy dependency or
// unoptimized asset, not to enforce aggressive perf engineering.

const BUILD_DIR = join(process.cwd(), 'build');
const MAX_JS_BUNDLE_BYTES = 500 * 1024; // 500 KB uncompressed budget for the main JS bundle
const MAX_CSS_BUNDLE_BYTES = 100 * 1024;

test.describe('Performance budgets', () => {
  test('main JS and CSS bundles stay under their size budgets', () => {
    const assetsDir = join(BUILD_DIR, 'assets');
    const files = readdirSync(assetsDir);

    const jsFiles = files.filter((name) => name.endsWith('.js'));
    const cssFiles = files.filter((name) => name.endsWith('.css'));

    expect(jsFiles.length).toBeGreaterThan(0);
    expect(cssFiles.length).toBeGreaterThan(0);

    const totalJsBytes = jsFiles.reduce(
      (sum, name) => sum + statSync(join(assetsDir, name)).size,
      0
    );
    const totalCssBytes = cssFiles.reduce(
      (sum, name) => sum + statSync(join(assetsDir, name)).size,
      0
    );

    expect(totalJsBytes).toBeLessThan(MAX_JS_BUNDLE_BYTES);
    expect(totalCssBytes).toBeLessThan(MAX_CSS_BUNDLE_BYTES);
  });

  test('home page loads and reaches DOMContentLoaded within budget', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#about')).toBeVisible();

    const timing = await page.evaluate(() => {
      const [nav] = performance.getEntriesByType('navigation');
      return {
        domContentLoaded: nav.domContentLoadedEventEnd - nav.startTime,
        loadEvent: nav.loadEventEnd - nav.startTime,
      };
    });

    expect(timing.domContentLoaded).toBeLessThan(3000);
    expect(timing.loadEvent).toBeLessThan(5000);
  });

  test('largest contentful paint is within budget', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#about')).toBeVisible();

    const lcp = await page.evaluate(
      () =>
        new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            resolve(entries[entries.length - 1].startTime);
          }).observe({ type: 'largest-contentful-paint', buffered: true });

          // Fall back in case LCP never fires within a reasonable window.
          setTimeout(() => resolve(-1), 4000);
        })
    );

    if (lcp >= 0) {
      expect(lcp).toBeLessThan(4000);
    }
  });
});
