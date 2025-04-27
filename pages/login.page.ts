import { PlaywrightActions } from '../core/playwright.actions';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  private readonly url = 'https://www.saucedemo.com/';
  private readonly usernameField = '#user-name';
  private readonly passwordField = '#password';
  private readonly loginButton = '#login-button';

  constructor(actions: PlaywrightActions) {
    super(actions);
  }

  async loginToApplication(user: string, pass: string) {
    await this.actions.navigateTo(this.url);
    await this.actions.fill(this.usernameField, user);
    await this.actions.fill(this.passwordField, pass);
    await this.actions.click(this.loginButton);
  }
}
