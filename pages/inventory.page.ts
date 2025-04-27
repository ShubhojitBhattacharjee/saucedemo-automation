import { PlaywrightActions } from '../core/playwright.actions';
import { BasePage } from './base.page';

export class InventoryPage extends BasePage {
    
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
    private cartBadgeLocator = '.shopping_cart_badge';
    private cartLinkLocator = '.shopping_cart_link';
    private cartItemLocator = '.cart_item';
    private checkoutButtonLocator = '#checkout';
    
  
    constructor(actions: PlaywrightActions) {
        super(actions);
      }
  
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

    async getCartBadgeCount(): Promise<string> {
        const texts = await this.actions.getTexts(this.cartBadgeLocator);
        return texts[0] || '';
      }

      async navigateToCart(): Promise<void> {
        await this.actions.click(this.cartLinkLocator);
      }

      async getCartItemCount(): Promise<number> {
        return this.actions.count(this.cartItemLocator);
      }

      async startCheckout() {
        await this.actions.click(this.checkoutButtonLocator);
      }

  }
