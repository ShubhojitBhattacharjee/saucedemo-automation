import { test, expect } from '@playwright/test';
import { PlaywrightActions } from '../../core/playwright.actions';
import { LoginPage }      from '../../pages/login.page';
import { InventoryPage }  from '../../pages/inventory.page';
import { CheckoutPage }   from '../../pages/checkout.page';
import { appConfig } from '../../config/app.config';

test.describe('Checkout Validation Tests', () => {
  let actions: PlaywrightActions;
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    actions       = new PlaywrightActions(page);
    loginPage     = new LoginPage(actions);
    inventoryPage = new InventoryPage(actions);
    checkoutPage  = new CheckoutPage(actions);

    // 1) Login
    await loginPage.loginToApplication(
          appConfig.credentials.user,
          appConfig.credentials.pass
        );
    await expect(page).toHaveURL(/inventory\.html$/);

    // 2) Add multiple items to cart
    await inventoryPage.addItemsToCart([
      'Sauce Labs Backpack',
      'Sauce Labs Bolt T-Shirt'
    ]);
    await inventoryPage.navigateToCart();
    await inventoryPage.startCheckout();
  });

  test('missing first name shows error', async () => {
    const message = await checkoutPage.processCheckout('', 'Doe', '12345');
    expect(message).toContain('Error: First Name is required');
  });

  test('missing last name shows error', async () => {
    const message = await checkoutPage.processCheckout('John', '', '12345');
    expect(message).toContain('Error: Last Name is required');
  });

  test('missing postal code shows error', async () => {
    const message = await checkoutPage.processCheckout('John', 'Doe', '');
    expect(message).toContain('Error: Postal Code is required');
  });

  test('complete checkout shows success message', async () => {
    const message = await checkoutPage.processCheckout('John', 'Doe', '12345');
    expect(message).toContain('Thank you for your order!');
  });
});
