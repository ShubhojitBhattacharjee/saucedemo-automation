import { Page, Locator } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import type { AxeResults } from 'axe-core';

export class PlaywrightActions {
  constructor(private page: Page) {}

  async navigateTo(url: string) {
    await this.page.goto(url);
  }

  async click(locator: string | Locator) {
    const el = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await el.click();
  }

  async fill(locator: string | Locator, text: string) {
    const el = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await el.fill(text);
  }

  async selectByLabel(locator: string, optionLabel: string) {
    await this.page.selectOption(locator, { label: optionLabel });
  }

  async getText(locator: string): Promise<string[]> {
    return this.page.locator(locator).allTextContents() ?? '';
  }

  async getTexts(locator: string): Promise<string[]> {
    return this.page.locator(locator).allTextContents();
  }  

  async getNumbers(locator: string, stripChars: string[] = ['$']): Promise<number[]> {
    return this.page.$$eval(
      locator,
      (els, stripChars) =>
        els.map(e => {
          let txt = e.textContent || '';
          for (const ch of stripChars) {
            txt = txt.replace(ch, '');
          }
          return parseFloat(txt.trim()) || 0;
        }),
      stripChars
    );
  }

  async count(locator: string): Promise<number> {
    return this.page.locator(locator).count();
  }

  async isVisible(locator: string): Promise<boolean> {
    return this.page.locator(locator).isVisible();
  }

  async takeScreenshot(fullPage = true): Promise<Buffer> {
    return this.page.screenshot({ fullPage });
  }

  async scanAccessibility(tags: string[]): Promise<AxeResults> {
    return new AxeBuilder({ page: this.page })
      .withTags(tags)
      .analyze();
  }
}
