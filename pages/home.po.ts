import { Locator, Page, expect } from '@playwright/test';

export class HomePage {
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
    this.dialog = this.main.getByRole('dialog');
  }

  async searchForProduct(label: string) {
      const searchBox =  this.page.getByRole('searchbox', { name: 'Search' });
      await searchBox.click();
      await searchBox.fill(label);
      await this.page.getByRole('navigation', {name: 'Directory'}).waitFor({state: 'visible'})
      await this.page.getByRole('link', { name: label }).nth(0).click();
  }

  async navigateToHome() {
    await this.page.getByRole('link', { name: 'iDrinkCoffee.com', exact: true }).click();
  }
}
