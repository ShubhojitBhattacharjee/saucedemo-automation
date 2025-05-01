import { test, expect } from '@playwright/test';
import { PlaywrightActions } from '../../core/playwright.actions';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';
import { appConfig } from '../../config/app.config';
import { stepLogger } from '../../utils/step.logger';


test.describe('Cart Operations Tests', () => {
    let actions: PlaywrightActions;
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
  
    test.beforeEach(async ({ page }) => {
      actions = new PlaywrightActions(page);
      loginPage = new LoginPage(actions);
      inventoryPage = new InventoryPage(actions);
      await loginPage.loginToApplication(
            appConfig.credentials.user,
            appConfig.credentials.pass
        );
      await expect(page).toHaveURL(/inventory\.html$/);
    });
  
    test('should add and remove an item from the cart', async () => {
      // Step 1: Add an item
      stepLogger.stepId(1);
      await stepLogger.step('Add an item');
      await inventoryPage.addItemsToCart(['Sauce Labs Backpack']);
  
      // Step 2: Assert cart badge shows 1
      await stepLogger.step('Assert cart badge shows 1');
      const badgeCount = await inventoryPage.getCartBadgeCount();
    expect(badgeCount, 'Cart count should equal 1 after add').toBe('1');

    // Step 3: Remove the same item
    await stepLogger.step('Remove the same item');
    await inventoryPage.addItemsToCart(['Sauce Labs Backpack']); // toggles removal

    // Step 4: Get cart badge value after removal
    await stepLogger.step('Get cart badge value after removal');
    const badgeAfterRemoval = await inventoryPage.getCartBadgeCount();
    expect(badgeAfterRemoval, 'Cart should be empty after removal').toBe('');

    // Step 5: Navigate to cart and verify items
    await stepLogger.step('Navigate to cart and verify items');
    await inventoryPage.navigateToCart();
    const cartItemCount = await inventoryPage.getCartItemCount();
    expect(cartItemCount, 'Cart should be empty').toBe(0);
    });
  });