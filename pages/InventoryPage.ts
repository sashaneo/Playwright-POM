import { Page } from "@playwright/test";

export class InventoryPage {
  constructor(private page: Page) {}

  private productLabel = ".product_label";
  private filterDropdown = ".product_sort_container";
  private productPrices = ".inventory_item_price";
  private productTitle = ".inventory_item_name";
  private cartCounterBadge = ".shopping_cart_badge";
  private cartIcon = ".shopping_cart_link";
  private removeButton = "button.btn_secondary.btn_inventory";

  async navigate() {
    await this.page.goto("v1/inventory.html");
  }

  async isLoaded() {
    await this.page.waitForSelector(this.productLabel);
  }

  async selectSortingOption(option: string) {
    await this.page.selectOption(this.filterDropdown, option);
  }

  async getProductPrices(): Promise<number[]> {
    const priceTexts = await this.page.$$eval(this.productPrices, (elements) =>
      elements.map((el) => parseFloat(el.textContent?.replace("$", "") || "0"))
    );
    return priceTexts;
  }

  async getProductTitles(): Promise<string[]> {
    const titleTexts = await this.page.$$eval(this.productTitle, (elements) =>
      elements.map((el) => el.textContent?.trim() || "")
    );
    return titleTexts;
  }

  async addItemToCart(index: number) {
    await this.page
      .locator(".inventory_item")
      .nth(index)
      .locator("button")
      .click();
  }

  cartCounter() {
    return this.page.locator(this.cartCounterBadge);
  }

  removeItemFromCart(index: number) {
    return this.page
      .locator(".inventory_item")
      .nth(index)
      .locator("button")
      .click();
  }

  async addAllItemsToCart() {
    const itemCount = await this.page.locator(".inventory_item").count();
    for (let i = 0; i < itemCount; i++) {
      await this.page
        .locator(".inventory_item")
        .nth(i)
        .locator("button")
        .click();
    }
  }

  async clickOnCartIcon() {
    await this.page.locator(this.cartIcon).click();
  }

  buttonRemove(index: number) {
    return this.page.locator(".inventory_item").nth(index).locator("button");
  }

  async getItemDetails(index: number) {
    const name = await this.page
      .locator(".inventory_item_name")
      .nth(index)
      .textContent();
    const priceText = await this.page
      .locator(".inventory_item_price")
      .nth(index)
      .textContent();
    const price = priceText?.replace("$", "");

    return { name: name?.trim() || "", price: price?.trim() || "" };
  }
}
