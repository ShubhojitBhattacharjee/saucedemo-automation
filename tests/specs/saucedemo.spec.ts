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

    // Assertion: At least one inventory item is displayed
    const itemCount = await page.locator('.inventory_item').count();
    expect(itemCount, 'Expected at least one inventory item').toBeGreaterThan(0);
  });

  test('Verify sorting order Z-A on All Items page', async () => {
    // Step 2: Select "Name (Z to A)" from sort dropdown
    await inventoryPage.sortByNameDescending();

    // Step 3: Fetch displayed item names
    const displayed = await inventoryPage.getItemNames();

    // Step 4: 
    expect(displayed.length > 1, 'Expecting more than one item in order to sort').toBeTruthy();

    // Step 5: Prepare expected order
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

  test.only('Should show error when checkout information is incomplete', async () => {
    await inventoryPage.addItemsToCart(['Sauce Labs Backpack']);
    await actions.click(inventoryPage['cartLink']);
    await actions.click(inventoryPage['checkoutButton']);

    // Click continue without filling mandatory fields
    await actions.click(inventoryPage['continueButton']);

    // Assertion: error message appears
    const errorText = await inventoryPage.getErrorMessage();
    expect(errorText, 'Expected error message for missing first name').toContain('Error: First Name is required');
  });

});
