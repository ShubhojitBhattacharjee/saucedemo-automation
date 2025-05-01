import { test, expect } from '@playwright/test';
import { PlaywrightActions } from '../../core/playwright.actions';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';
import { appConfig } from '../../config/app.config';
import { stepLogger } from '../../utils/step.logger';

test.describe('Sorting Order Tests', () => {
  let actions: PlaywrightActions;
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    actions = new PlaywrightActions(page);
    loginPage = new LoginPage(actions);
    inventoryPage = new InventoryPage(actions);

    // Step 1: Navigate and log in
    stepLogger.stepId(1);
    await stepLogger.step('Login to Application');
    await loginPage.loginToApplication(
          appConfig.credentials.user,
          appConfig.credentials.pass
        );
    // Assertion: we should now be on the inventory page
    await expect(page).toHaveURL(/inventory\.html$/);

    // Assertion: At least one inventory item is displayed
    const itemCount = await inventoryPage.getInventoryItemsCount();
    expect(itemCount, 'Expected at least one inventory item').toBeGreaterThan(0);
  });

  test('Verify sorting order Z-A on All Items page', async () => {
    // Step 2: Select "Name (Z to A)" from sort dropdown
    await stepLogger.step('Select "Name (Z to A)" from sort dropdown');
    await inventoryPage.sortByNameDescending();

    // Step 3: Fetch displayed item names
    await stepLogger.step('Fetch displayed item names');
    const displayed = await inventoryPage.getItemNames();

    // Assertion: Expecting more than one item
    expect(displayed.length > 1, 'Expecting more than one item in order to sort').toBeTruthy();

    // Step 4: Prepare expected order
    await stepLogger.step('Prepare expected order');
    const expected = [...displayed].sort().reverse();

    // Assertion: names match Z-A
    await stepLogger.step('Assert Names Match Z-A');
    expect(displayed).toEqual(expected);
  });

  test('Verify price order High-Low on All Items page', async () => {
    // Step 2: Select "Price high to low" from sort dropdown
    await stepLogger.step('Select "Price high to low" from sort dropdown');
    await inventoryPage.sortByPriceHighToLow();

    // Step 3: Get Prices of all Items
    await stepLogger.step('Get Prices of all Items');
    const displayed = await inventoryPage.getItemPrices();

    // Assertion: Expected prices are numeric
    await stepLogger.step('Assert all prices are numbers');
    expect(displayed.every(p => typeof p === 'number'), 'Expected all prices to be numbers').toBeTruthy();

    await stepLogger.step('Assert prices are sorted in high to low order');
    const expected = [...displayed].sort((a, b) => b - a);
    expect(displayed).toEqual(expected);
  });
});