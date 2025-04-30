import { test, expect } from '@playwright/test';
import { PlaywrightActions } from '../../core/playwright.actions';
import { InventoryPage } from '../../pages/inventory.page';
import { LoginPage } from '../../pages/login.page';
import { appConfig } from '../../config/app.config';


test.describe('SauceDemo Accessibility Checks', () => {
    let actions: PlaywrightActions;
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
  
    test.beforeEach(async ({ page }) => {
      actions       = new PlaywrightActions(page);
      loginPage     = new LoginPage(actions);
      inventoryPage = new InventoryPage(actions);
  
      // 1) Login and land on inventory
      await loginPage.loginToApplication(
        appConfig.credentials.user,
        appConfig.credentials.pass
      );
      await expect(page).toHaveURL(/inventory\.html$/);
  
      // 2) Ensure the product list is rendered 
      await inventoryPage.sortByNameDescending();
    });
  
    test.only('Inventory Page should have zero WCAG2 A/AA violations', async () => {
      // 3) Run axe-core, focusing on core WCAG 2.1 A & AA rules
      const axeOptions = {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        }
      };
      const results = await actions.scanAccessibility(axeOptions.runOnly.values);
  
      // 4) If violations exist, log actionable info
      if (results.violations.length > 0) {
        console.error('Detected accessibility violations:\n');
        for (const v of results.violations) {
          console.error(`• [${v.id}] ${v.help}: ${v.helpUrl}`);
          for (const node of v.nodes) {
            console.error(`    Selector: ${node.target.join(' ')}`);
            console.error(`    Failure Summary: ${node.failureSummary}\n`);
          }
        }
      }
  
      // 5) Assert no violations
      expect(results.violations, 'Expected no WCAG2 A/AA violations').toEqual([]);
    });
  });