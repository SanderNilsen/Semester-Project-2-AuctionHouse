import { test, expect } from '@playwright/test';

test('should search for a listing', async ({ page }) => {
  await page.goto('/listings.html');

  const searchInput = page.locator('#search-input');
  const searchButton = page.locator('#search-button');

  await searchInput.fill('watch');
  await searchButton.click();

  const searchResults = page.locator('#user-listing');
  await expect(searchResults.first()).toBeVisible();
});