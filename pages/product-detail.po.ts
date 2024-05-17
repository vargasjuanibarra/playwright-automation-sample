import { Locator, Page, expect } from '@playwright/test';
const BASE_URL = 'https://idrinkcoffee.com/'

export class ProductDetail {
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

 async clickColorVariant(label: string) {
    await this.page.getByRole('link', { name: label, exact: true }).click();
 }

 async addQuantity() {
    await this.page.getByRole('button', { name: '+' }).click();
 }

 async addToCart(label: string) {
    await this.page.getByRole('button', { name: label }).click();
 }
}
