import { Page } from "@playwright/test";

export class CartPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto("v1/cart.html");
  }

  async isLoaded() {
    await this.page
      .locator("div.subheader", { hasText: "Your Cart" })
      .waitFor();
  }

  async clickContinueShoppingBtn() {
    await this.page.getByRole("link", { name: "Continue Shopping" }).click();
  }

  async getItemDetails(index: number) {
    const name = await this.page
      .locator(".cart_item .inventory_item_name")
      .nth(index)
      .textContent();
    const price = await this.page
      .locator(".cart_item .inventory_item_price")
      .nth(index)
      .textContent();

    return { name: name?.trim() || "", price: price?.trim() || "" };
  }

  async removeItemFromCart(index: number) {
    return this.page
      .locator(".cart_item")
      .nth(index)
      .locator(".btn_secondary.cart_button")
      .click();
  }

  async getCartItemCount(): Promise<number> {
    return this.page.locator(".cart_item").count();
  }
}
