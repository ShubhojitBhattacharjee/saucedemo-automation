import { test, expect } from '@playwright/test';
import { PlaywrightActions } from '../../core/playwright.actions';
import { InventoryPage } from '../../pages/inventory.page';
import { LoginPage } from '../../pages/login.page';
import { appConfig } from '../../config/app.config';


test.only('Accessibility check on Inventory Page', async ({ page }) => {
    const actions = new PlaywrightActions(page);
    const login   = new LoginPage(actions);
    const inv     = new InventoryPage(actions);
  
    await login.loginToApplication(
        appConfig.credentials.user,
        appConfig.credentials.pass
    );
    await inv.sortByNameDescending();

    const result = await actions.scanAccessibility();
    expect(result.violations).toEqual([]);
});
