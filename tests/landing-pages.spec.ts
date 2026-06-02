import { test, expect } from '@playwright/test';

test.describe('International Landing Pages', () => {
  test('should load the Singapore landing page successfully', async ({ page }) => {
    await page.goto('http://localhost:3000/singapore');
    await expect(page.locator('h1')).toContainText('Singapore Students', { ignoreCase: true });
    
    // Check if some specific curriculum is mentioned
    await expect(page.locator('text=PSLE').first()).toBeVisible();
    await expect(page.locator('text=O-Level').first()).toBeVisible();
  });

  test('should load the Australia landing page successfully', async ({ page }) => {
    await page.goto('http://localhost:3000/australia');
    await expect(page.locator('h1')).toContainText('Australian Students', { ignoreCase: true });
    
    // Check if some specific state curriculum is mentioned
    await expect(page.locator('text=HSC').first()).toBeVisible();
    await expect(page.locator('text=VCE').first()).toBeVisible();
  });

  test('should load the UAE landing page successfully', async ({ page }) => {
    await page.goto('http://localhost:3000/uae');
    await expect(page.locator('h1')).toContainText('UAE Students', { ignoreCase: true });
    
    // Check if EmSAT is mentioned
    await expect(page.locator('text=EmSAT').first()).toBeVisible();
    await expect(page.locator('text=MOE').first()).toBeVisible();
  });
});
