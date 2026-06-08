import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SAMPLES_DIR = path.resolve(__dirname, '..', 'samples');

test.describe('Report Generation Flow', () => {
  test('should upload data, select template, and generate PDF', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await page.waitForTimeout(3000);

    await expect(page.getByRole('heading', { name: 'Report Generator' })).toBeVisible();

    await page.locator('input[type="file"]').setInputFiles(path.join(SAMPLES_DIR, 'sales.csv'));

    await expect(page.getByText('sales.csv')).toBeVisible({ timeout: 10000 });

    await expect(page.getByText('Choose Template')).toBeVisible({ timeout: 5000 });

    const simpleTable = page.getByText('Simple Table');
    await simpleTable.click();

    const reportNameInput = page.getByPlaceholder('Enter report name...');
    await reportNameInput.fill('E2E Test Report');

    const generateBtn = page.getByRole('button', { name: 'Generate PDF' });
    await expect(generateBtn).toBeEnabled();
  });

  test('should show all default templates in template picker', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await page.waitForTimeout(3000);

    await page.locator('input[type="file"]').setInputFiles(path.join(SAMPLES_DIR, 'sales.csv'));

    await expect(page.getByText('Choose Template')).toBeVisible({ timeout: 10000 });

    await expect(page.getByRole('button', { name: /Simple Table/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Summary Card/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Invoice/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Business Report/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Minimal List/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Dashboard Default/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Modern Analytics/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Compact Report/ })).toBeVisible();

    const defaultBadges = await page.locator('text=Default').count();
    expect(defaultBadges).toBeGreaterThanOrEqual(7);
  });

  test('should navigate between pages', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await page.waitForTimeout(3000);

    await page.getByRole('link', { name: 'My Reports' }).click();
    await page.waitForTimeout(2000);
    await expect(page.getByRole('heading', { name: 'My Reports' })).toBeVisible();

    await page.getByRole('link', { name: 'My Templates' }).click();
    await page.waitForTimeout(2000);
    await expect(page.getByRole('heading', { name: 'My Templates' })).toBeVisible();

    await page.getByRole('link', { name: 'Generator' }).click();
    await page.waitForTimeout(2000);
    await expect(page.getByRole('heading', { name: 'Report Generator' })).toBeVisible();
  });
});
