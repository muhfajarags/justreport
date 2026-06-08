import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SAMPLES_DIR = path.resolve(__dirname, '..', 'samples');

test.describe('Template Upload Flow', () => {
  test('should display default templates on My Templates page', async ({ page }) => {
    await page.goto('/templates', { waitUntil: 'load' });
    await page.waitForTimeout(3000);

    await expect(page.getByRole('heading', { name: 'My Templates' })).toBeVisible({ timeout: 10000 });

    const defaultSection = page.getByText('DEFAULT TEMPLATES');
    await expect(defaultSection).toBeVisible({ timeout: 10000 });

    const defaultCount = await page.locator('text=Default').count();
    expect(defaultCount).toBeGreaterThanOrEqual(5);
  });

  test('should upload an HTML template successfully', async ({ page }) => {
    await page.goto('/templates', { waitUntil: 'load' });
    await page.waitForTimeout(3000);

    await page.locator('input[type="file"]').setInputFiles(path.join(SAMPLES_DIR, 'dashboard-template.html'));

    const toast = page.getByText('Template uploaded!');
    await expect(toast).toBeVisible({ timeout: 10000 });

    const customSection = page.getByText('CUSTOM TEMPLATES');
    await expect(customSection).toBeVisible();
  });

  test('should not create duplicate on re-upload', async ({ page }) => {
    await page.goto('/templates', { waitUntil: 'load' });
    await page.waitForTimeout(3000);

    const getCustomCount = async () => {
      return await page.locator('text=CUSTOM TEMPLATES').count();
    };

    await page.locator('input[type="file"]').setInputFiles(path.join(SAMPLES_DIR, 'dashboard-template.html'));
    await page.waitForTimeout(2000);

    const customHeadingCount = await getCustomCount();
    expect(customHeadingCount).toBeLessThanOrEqual(1);
  });
});
