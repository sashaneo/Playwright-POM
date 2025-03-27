import { test, expect } from "@playwright/test";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";

let inventoryPage: InventoryPage;
let cartPage: CartPage;

test.beforeEach(async ({ page }) => {
  inventoryPage = new InventoryPage(page);
  cartPage = new CartPage(page);
  await inventoryPage.navigate();
});

test("Add multiple items to the cart and verify the correct count", async () => {
  for (let i = 0; i < 3; i++) {
    await inventoryPage.addItemToCart(i);
  }

  await expect(inventoryPage.cartCounter()).toHaveText("3");

  await inventoryPage.addAllItemsToCart();
});

test("Add all items to cart and verify the correct count", async () => {
  await inventoryPage.addAllItemsToCart();

  await expect(inventoryPage.cartCounter()).toHaveText("6");
});

test("Remove item from cart and verify the correct count", async () => {
  await inventoryPage.addItemToCart(0);
  await expect(inventoryPage.cartCounter()).toHaveText("1");

  await inventoryPage.removeItemFromCart(0);
  await expect(inventoryPage.cartCounter()).not.toBeVisible();
});

test("The cart should persist the items after navigating away and back", async () => {
  await inventoryPage.addItemToCart(0);
  await expect(inventoryPage.cartCounter()).toHaveText("1");
  await inventoryPage.clickOnCartIcon();
  await cartPage.isLoaded();
  await cartPage.clickContinueShoppingBtn();
  await inventoryPage.isLoaded();
  await expect(inventoryPage.buttonRemove(0)).toBeVisible();
  await expect(inventoryPage.cartCounter()).toHaveText("1");
});

test("The product details in the cart should match the item that was added", async () => {
  await inventoryPage.addItemToCart(0);
  const invPageItemDetails = await inventoryPage.getItemDetails(0);

  await inventoryPage.clickOnCartIcon();
  await cartPage.isLoaded();
  const cartItemDetails = await cartPage.getItemDetails(0);

  expect(cartItemDetails).toEqual(invPageItemDetails);
});

test("The cart icon should be empty after removing all items", async () => {
  for (let i = 0; i < 3; i++) {
    await inventoryPage.addItemToCart(i);
  }
  await inventoryPage.clickOnCartIcon();
  await cartPage.isLoaded();

  while ((await cartPage.getCartItemCount()) > 0) {
    await cartPage.removeItemFromCart(0);
  }
  await expect(inventoryPage.cartCounter()).not.toBeVisible();
});

test("Verify the 'Add to Cart' button works correctly", async () => {
  await inventoryPage.navigate();
  await inventoryPage.isLoaded();
  await inventoryPage.addItemToCart(0);
  await expect(inventoryPage.cartCounter()).toHaveText("1");
  await inventoryPage.clickOnCartIcon();
  await cartPage.isLoaded();
  await expect(cartPage.getItemDetails(0)).resolves.toBeDefined();
});
