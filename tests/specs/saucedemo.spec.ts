// tests/specs/saucedemo.spec.ts
import { test, expect } from '@playwright/test';
import { PlaywrightActions } from '../../core/playwright.actions';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';

test.describe('SauceDemo Functional Tests', () => {
  let actions: PlaywrightActions;
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    actions = new PlaywrightActions(page);
    loginPage = new LoginPage(actions);
    inventoryPage = new InventoryPage(actions);

    // Step 1: Navigate and log in
    await loginPage.loginToApplication('standard_user', 'secret_sauce');
    // Assertion: we should now be on the inventory page
    await expect(page).toHaveURL(/inventory\.html$/);
  });

  test('Verify sorting order Z-A on All Items page', async () => {
    // Step 2: Select "Name (Z to A)" from sort dropdown
    await inventoryPage.sortByNameDescending();

    // Step 3: Fetch displayed item names
    const displayed = await inventoryPage.getItemNames();

    // Step 4: Prepare expected order
    const expected = [...displayed].sort().reverse();

    // Assertion: names match Z-A
    expect(displayed).toEqual(expected);
  });

  test('Verify price order High-Low on All Items page', async () => {
    await inventoryPage.sortByPriceHighToLow();
    const displayed = await inventoryPage.getItemPrices();
    const expected = [...displayed].sort((a, b) => b - a);
    expect(displayed).toEqual(expected);
  });

  test('Add multiple items to cart and validate checkout journey', async () => {
    // Step 2: Add two items
    await inventoryPage.addItemsToCart([
      'Sauce Labs Backpack',
      'Sauce Labs Bolt T-Shirt'
    ]);

    // Step 3: Proceed through checkout
    await inventoryPage.proceedToCheckout('John', 'Doe', '12345');

    // Step 4: Verify confirmation message
    const confirmation = await inventoryPage.getOrderConfirmation();
    expect(confirmation).toContain('Thank you for your order!');
  });
  
});
