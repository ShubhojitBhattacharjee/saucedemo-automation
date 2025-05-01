import { PlaywrightActions } from '../core/playwright.actions';
import { autoHealClick } from '../utils/auto.healing';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  private readonly url = 'https://www.saucedemo.com/';
  private readonly usernameField = '#user-name';
  private readonly passwordField = '#password';
  private loginButtonSelectors = [
    '#login-button',
    'button[type="submit"]',
    '.btn_action',            // e.g. fallback if class name changes
    '[data-test="login-button"]'
  ];

  constructor(actions: PlaywrightActions) {
    super(actions);
  }

  async loginToApplication(user: string, pass: string) {
    await this.actions.navigateTo(this.url);
    await this.actions.fill(this.usernameField, user);
    await this.actions.fill(this.passwordField, pass);
    
    // Try each selector in order until one clicks successfully
    await autoHealClick(this.actions, this.loginButtonSelectors);

  }
}
