import { PlaywrightActions } from '../core/playwright.actions';

export abstract class BasePage {
  protected actions: PlaywrightActions;
  protected readonly errorMessageContainer = '.error-message-container.error';

  constructor(actions: PlaywrightActions) {
    this.actions = actions;
  }

  public async getErrorMessage(): Promise<string[]> {
    return this.actions.getTexts(this.errorMessageContainer);
  }
}