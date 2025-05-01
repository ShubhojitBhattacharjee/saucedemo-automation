import { test, expect } from '@playwright/test';
import { PlaywrightActions } from '../../core/playwright.actions';
import { LoginPage }      from '../../pages/login.page';
import { InventoryPage }  from '../../pages/inventory.page';
import { CheckoutPage }   from '../../pages/checkout.page';
import { appConfig } from '../../config/app.config';
import { stepLogger } from '../../utils/step.logger';

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

    // Step 1: Login
    stepLogger.stepId(1);
    await stepLogger.step('Login to Application');
    await loginPage.loginToApplication(
          appConfig.credentials.user,
          appConfig.credentials.pass
        );
    await expect(page).toHaveURL(/inventory\.html$/);

    // Step 2: Add multiple items to cart
    await stepLogger.step('Add multiple items to cart');
    await inventoryPage.addItemsToCart([
      'Sauce Labs Backpack',
      'Sauce Labs Bolt T-Shirt'
    ]);

    // Step 3: Navigate to cart and start checkout
    await stepLogger.step('Navigate to cart and start checkout');
    await inventoryPage.navigateToCart();
    await inventoryPage.startCheckout();
  });

  test('missing first name shows error', async () => {
    // Step 4: Capture first name missing error
    await stepLogger.step('Capture first name missing error');
    const message = await checkoutPage.processCheckout('', 'Doe', '12345');
    expect(message).toContain('Error: First Name is required');
  });

  test('missing last name shows error', async () => {
    // Step 4: Capture last name missing error
    await stepLogger.step('Capture last name missing error');
    const message = await checkoutPage.processCheckout('John', '', '12345');
    expect(message).toContain('Error: Last Name is required');
  });

  test('missing postal code shows error', async () => {
    // Step 4: Capture postal code missing error
    await stepLogger.step('Capture postal code missing error');
    const message = await checkoutPage.processCheckout('John', 'Doe', '');
    expect(message).toContain('Error: Postal Code is required');
  });

  test('complete checkout shows success message', async () => {
    // Step 4: Capture successful checkout message
    await stepLogger.step('Capture successful checkout message');
    const message = await checkoutPage.processCheckout('John', 'Doe', '12345');
    expect(message).toContain('Thank you for your order!');
  });
});
