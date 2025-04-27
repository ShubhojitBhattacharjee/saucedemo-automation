import { test, expect } from '@playwright/test';
import { PlaywrightActions } from '../../core/playwright.actions';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';

test.describe('Sorting Order Tests', () => {
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

    // Assertion: At least one inventory item is displayed
    const itemCount = await page.locator('.inventory_item').count();
    expect(itemCount, 'Expected at least one inventory item').toBeGreaterThan(0);
  });

  test('Verify sorting order Z-A on All Items page', async () => {
    // Step 2: Select "Name (Z to A)" from sort dropdown
    await inventoryPage.sortByNameDescending();

    // Step 3: Fetch displayed item names
    const displayed = await inventoryPage.getItemNames();

    // Assertion: Expecting more than one item
    expect(displayed.length > 1, 'Expecting more than one item in order to sort').toBeTruthy();

    // Step 4: Prepare expected order
    const expected = [...displayed].sort().reverse();

    // Assertion: names match Z-A
    expect(displayed).toEqual(expected);
  });

  test('Verify price order High-Low on All Items page', async () => {
    await inventoryPage.sortByPriceHighToLow();
    const displayed = await inventoryPage.getItemPrices();

    // Assertion: Expected prices are numeric 
    expect(displayed.every(p => typeof p === 'number'), 'Expected all prices to be numbers').toBeTruthy();
    const expected = [...displayed].sort((a, b) => b - a);
    expect(displayed).toEqual(expected);
  });
});