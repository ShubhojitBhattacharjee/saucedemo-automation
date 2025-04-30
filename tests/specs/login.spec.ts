import { test, expect } from '@playwright/test';
import { PlaywrightActions } from '../../core/playwright.actions';
import { LoginPage } from '../../pages/login.page';

test.describe('Login / Authentication Tests', () => {
  let actions: PlaywrightActions;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    actions = new PlaywrightActions(page);
    loginPage = new LoginPage(actions);
  });

  test('Invalid credentials should show error', async () => {
    // Step 1: Attempt login with wrong password
    await loginPage.loginToApplication('standard_user', 'wrong_password');

    // Step 2: Capture login error message
    // TODO: Move to BasePage: getErrorMessage()
    const errorText = await loginPage.getErrorMessage();

    // Assertion: verify correct error shown
    expect(errorText).toContain(
      'Epic sadface: Username and password do not match any user in this service'
    );
  });

  test('Missing username should show appropriate error', async () => {
    // Step 1: Attempt login with no username
    await loginPage.loginToApplication('', 'secret_sauce');

    // Step 2: Capture login error message
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Epic sadface: Username is required');
  });

  test('Missing password should show appropriate error', async () => {
    // Step 1: Attempt login with no password
    await loginPage.loginToApplication('standard_user', '');

    // Step 2: Capture login error message
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Epic sadface: Password is required');
  });

  test('Locked out user should be prevented from logging in', async () => {
    // Step 1: Attempt login with locked_out_user
    await loginPage.loginToApplication('locked_out_user', 'secret_sauce');

    // Step 2: Capture login error message
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Epic sadface: Sorry, this user has been locked out.');
  });

});
