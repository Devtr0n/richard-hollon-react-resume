import { test, expect } from '@playwright/test';

// These tests exercise real browser rendering/CSS cascade, which is exactly
// what unit tests (jsdom) cannot verify - e.g. the display:none bug that
// previously hid the contact form's sending/success/error feedback.

test.describe('Contact form feedback', () => {
  test('shows a visible validation error when required fields are empty', async ({ page }) => {
    await page.goto('/');

    const submitButton = page.locator('#contactForm button.submit');
    await submitButton.scrollIntoViewIfNeeded();
    await submitButton.click();

    const warning = page.locator('#message-warning');
    await expect(warning).toBeVisible();
    await expect(warning).toContainText(/please fill in your name, email, and message/i);
  });

  test('shows a visible validation error for an invalid email address', async ({ page }) => {
    await page.goto('/');

    await page.fill('#contactName', 'Jane Doe');
    await page.fill('#contactEmail', 'not-an-email');
    await page.fill('#contactMessage', 'Hello there!');
    await page.click('#contactForm button.submit');

    const warning = page.locator('#message-warning');
    await expect(warning).toBeVisible();
    await expect(warning).toContainText(/please enter a valid email address/i);
  });

  test('shows a sending spinner then a visible success message on successful submission', async ({ page }) => {
    await page.route('https://formspree.io/f/test', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.goto('/');

    await page.fill('#contactName', 'Jane Doe');
    await page.fill('#contactEmail', 'jane@example.com');
    await page.fill('#contactMessage', 'Hello there!');

    const submitButton = page.locator('#contactForm button.submit');
    await submitButton.click();

    await expect(page.locator('#image-loader img')).toBeVisible();
    await expect(submitButton).toBeDisabled();

    const success = page.locator('#message-success');
    await expect(success).toBeVisible();
    await expect(success).toContainText(/your message was sent, thank you/i);

    await expect(page.locator('#contactName')).toHaveValue('');
    await expect(page.locator('#contactEmail')).toHaveValue('');
    await expect(page.locator('#contactMessage')).toHaveValue('');
  });
});
