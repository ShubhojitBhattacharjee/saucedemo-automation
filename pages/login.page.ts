// pages/login.page.ts
import { PlaywrightActions } from '../core/playwright.actions';

export class LoginPage {
  private readonly url = 'https://www.saucedemo.com/';
  private readonly usernameField = '#user-name';
  private readonly passwordField = '#password';
  private readonly loginButton = '#login-button';

  constructor(private actions: PlaywrightActions) {}

  async loginToApplication(user: string, pass: string) {
    await this.actions.navigateTo(this.url);
    await this.actions.fill(this.usernameField, user);
    await this.actions.fill(this.passwordField, pass);
    await this.actions.click(this.loginButton);
  }
}
