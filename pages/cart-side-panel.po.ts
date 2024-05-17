import { Locator, Page, expect } from '@playwright/test';
const BASE_URL = 'https://idrinkcoffee.com/'

export class CartSidePanel {
  readonly main: Locator;
  readonly dialog: Locator;

  get page(): Page {
    return this.main.page();
  }

  constructor(page: Page);
  constructor(locator: Locator);
  constructor(pageOrLocator: Page | Locator);
  constructor(pageOrLocator: Page | Locator) {
    this.main = pageOrLocator.locator('main');
  }


  async getCartSummaryDetails(label: string | RegExp) {
    return this.page.getByText(label, { exact: true }).evaluate(el => el.nextElementSibling?.querySelector('div')?.textContent);
  }

  async closeCartSidePanel() {
    await this.page.getByRole('button', { name: 'Close panel' }).click();
  }
}
