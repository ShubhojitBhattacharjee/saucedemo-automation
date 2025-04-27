import { PlaywrightActions } from '../core/playwright.actions';
import { BasePage } from './base.page';

export class CheckoutPage extends BasePage {

  private firstNameInput       = '#first-name';
  private lastNameInput        = '#last-name';
  private postalCodeInput      = '#postal-code';
  private continueButton       = '#continue';
  private finishButton         = '#finish';
  private successMessageLocator = '.complete-header';

  constructor(actions: PlaywrightActions) {
    super(actions);
  }

  async processCheckout(
    first: string,
    last: string,
    postal: string
  ): Promise<string[]> {
    await this.actions.fill(this.firstNameInput, first);
    await this.actions.fill(this.lastNameInput, last);
    await this.actions.fill(this.postalCodeInput, postal);
    await this.actions.click(this.continueButton);

    // if error banner, return it
    if (await this.actions.isVisible(this.errorMessageContainer)) {
      return this.getErrorMessage();
    }

    // else complete the flow
    await this.actions.click(this.finishButton);
    return this.actions.getText(this.successMessageLocator);
  }
}
