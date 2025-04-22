// pages/inventory.page.ts
import { PlaywrightActions } from '../core/playwright.actions';

export class InventoryPage {
    private readonly sortDropdown = '.product_sort_container';
    private readonly itemNames = '.inventory_item_name';
    private readonly itemPrices = '.inventory_item_price';
    private readonly cartLink = '.shopping_cart_link';
    private readonly checkoutButton = '#checkout';
    private readonly firstNameField = '#first-name';
    private readonly lastNameField = '#last-name';
    private readonly postalCodeField = '#postal-code';
    private readonly continueButton = '#continue';
    private readonly finishButton = '#finish';
    private readonly confirmationHeader = '.complete-header';
  
    constructor(private actions: PlaywrightActions) {}
  
    async sortByNameDescending() {
      await this.actions.selectByLabel(this.sortDropdown, 'Name (Z to A)');
    }
  
    async sortByPriceHighToLow() {
      await this.actions.selectByLabel(this.sortDropdown, 'Price (high to low)');
    }
  
    async getItemNames(): Promise<string[]> {
      return this.actions.getTexts(this.itemNames);
    }
  
    async getItemPrices(): Promise<number[]> {
      return this.actions.getNumbers(this.itemPrices);
    }
  
    async addItemsToCart(names: string[]) {
      for (const name of names) {
        await this.actions.click(`.inventory_item:has-text("${name}") button`);
      }
    }
  
    async proceedToCheckout(first: string, last: string, zip: string) {
      await this.actions.click(this.cartLink);
      await this.actions.click(this.checkoutButton);
      await this.actions.fill(this.firstNameField, first);
      await this.actions.fill(this.lastNameField, last);
      await this.actions.fill(this.postalCodeField, zip);
      await this.actions.click(this.continueButton);
      await this.actions.click(this.finishButton);
    }
  
    async getOrderConfirmation(): Promise<string> {
      const texts = await this.actions.getTexts(this.confirmationHeader);
      return texts[0] || '';
    }
  }
