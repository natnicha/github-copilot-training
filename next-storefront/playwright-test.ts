import { test, expect } from '@playwright/test';

test('order-and-confirm', async ({ page }) => {
  // 1. Go to localhost:3000
  await page.goto('http://localhost:3000');

  // 2. Try order 3 items and place order.
  // We'll click "Add to Cart" on the first 3 items.
  const addToCartButtons = page.locator('button:has-text("Add to Cart")');
  await addToCartButtons.nth(0).click();
  await addToCartButtons.nth(1).click();
  await addToCartButtons.nth(2).click();

  // Place order
  await page.click('button:has-text("Place Order")');

  // Wait for success message
  await expect(page.locator('text=Order placed.')).toBeVisible();

  // 3. Go to order page and click confirm order.
  await page.goto('http://localhost:3000/orders');

  // Find the first pending order and click Confirm
  // Assuming the orders display a status and a button.
  // We'll search for the first "Confirm" button.
  const confirmButton = page.locator('button:has-text("Confirm")').first();
  await confirmButton.click();

  // Wait for the UI to update or a brief moment to ensure action registered
  await page.waitForTimeout(1000);

  // 4. Capture the screen and save into document/playwright
  await page.screenshot({ path: '../document/playwright/order-confirmation.png', fullPage: true });
});

