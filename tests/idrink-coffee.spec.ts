import test, { expect } from "@playwright/test";
import { HomePage } from "../pages/home.po";
import { CartSidePanel } from "../pages/cart-side-panel.po";
import { ProductDetail } from "../pages/product-detail.po";

test.describe('Idrink Coffee', () => {
    const BASE_URL = 'https://idrinkcoffee.com/'
    test('Interview test', async ({page}) => {
        const homePage = new HomePage(page)
        const cartPanel = new CartSidePanel(page);
        const productDetail = new ProductDetail(page);
        await test.step('should navigate to idrinkcoffee', async () => {
            await page.goto(BASE_URL);
        });
        await test.step('should close the modal and discount should be visible', async () => {
            const dialog = page.getByRole('dialog')
            await expect(dialog.getByText('5% Off')).toBeVisible();
            await page.getByRole('dialog').getByRole('button', { name: 'Close' }).click();
        });
        await test.step('should search for a La Marzocco Espresso machine and should navigate to details page of the product', async () => {
            await homePage.searchForProduct('La Marzocco');
        });
        await test.step('should select the blue variant, add 2 to cart and navigate back to home', async () => {
            await productDetail.clickColorVariant('Blue');
            await productDetail.addQuantity();
            await productDetail.addToCart('Pre Order');

            await expect(page.getByRole('heading', { name: 'Cart Summary' })).toBeVisible();
            
            const subTotal = await cartPanel.getCartSummaryDetails('Item subtotal:');
            expect(subTotal).toBe('CA$10,800.00');
            const shippingCost = await cartPanel.getCartSummaryDetails('Free Shipping:');
            expect(shippingCost).toBe(' Yes!');
            const totalValue = await cartPanel.getCartSummaryDetails('Total:');
            expect(totalValue).toBe('CA$10,800.00');
            
            await cartPanel.closeCartSidePanel();
            await homePage.navigateToHome();

        });
        await test.step('Expect to be navigated to the open box products list page', async () => {
            const openBox = page.getByRole('link', { name: 'View Open Box Sale Open Box' });
            await openBox.scrollIntoViewIfNeeded();
            await openBox.click();
            await expect(page).toHaveURL(/.*open-box-returns/)
        });
        await test.step('Find the first "Machine" in the list of products that is a La Marzocco and click that product', async () => {
            const productLink =  page.locator('css=.group').filter({hasText: 'La Marzocco Linea Mini Nordic'})
            await productLink.scrollIntoViewIfNeeded();
            await expect(productLink.getByText('$8,895.00')).toBeVisible();
            await expect(productLink.getByText('$1,100.00')).toBeVisible();
            await productLink.click();
        });
        await test.step('expect to navigateto that "La Marzocco" product details page', async () => {
            await expect(page).toHaveURL(/.*la-marzocco-linea-mini-nordic-special-edition-espresso-machine-s9-store-demo/);
            const windowTitle = await page.title()
            expect(windowTitle).toContain('iDrinkCoffee.com Canada');

            await productDetail.addQuantity();
            await productDetail.addToCart('Add to Cart');

            await expect(page.getByRole('heading', { name: 'Cart Summary' })).toBeVisible();
            await page.waitForLoadState('networkidle');

            const subTotal = await cartPanel.getCartSummaryDetails('Item subtotal:');
            expect(subTotal).toBe('CA$19,695.00');
            const shippingCost = await cartPanel.getCartSummaryDetails('Free Shipping:');
            expect(shippingCost).toBe(' Yes!');
            const savings = await cartPanel.getCartSummaryDetails('Savings:');
            expect(savings).toBe('CA$1,100.00');
            const totalValue = await cartPanel.getCartSummaryDetails('Total:');
            expect(totalValue).toBe('CA$19,695.00');

            await cartPanel.closeCartSidePanel();
        });

        await test.step('Should navigate back to Home page', async () => {
            await homePage.navigateToHome();
        });
    })
})