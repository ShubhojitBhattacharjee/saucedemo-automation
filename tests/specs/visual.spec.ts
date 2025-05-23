import { test, expect } from '@playwright/test';
import { PlaywrightActions } from '../../core/playwright.actions';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';
import { appConfig } from '../../config/app.config';
import { stepLogger } from '../../utils/step.logger';

test.describe('SauceDemo Visual Test', () => {
  let actions: PlaywrightActions;
  let login: LoginPage;
  let inventory: InventoryPage;

  test.beforeEach(async ({ page }) => {
    actions   = new PlaywrightActions(page);
    login     = new LoginPage(actions);
    inventory = new InventoryPage(actions);

    // Step 1: Log in
    stepLogger.stepId(1);
    await stepLogger.step('Login to Application');
    await login.loginToApplication(
          appConfig.credentials.user,
          appConfig.credentials.pass
        );
    await expect(page).toHaveURL(/inventory\.html$/);

    // Step 2: Ensure products are visible
    await stepLogger.step('Perform some action on the web page (Sort By Name)');
    await inventory.sortByNameDescending(); // any action to ensure page is fully loaded
  });

  test.skip('All Items page should match visual baseline', async () => {
    // Step 3: Capture current screenshot
    await stepLogger.step('Capture current screenshot');
    const screenshot = await actions.takeScreenshot();

    // Assertion: Compare against stored snapshot
    await stepLogger.step('Compare against stored snapshot');
    expect(screenshot).toMatchSnapshot('inventory-page.png');
  });
});
