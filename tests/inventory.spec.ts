import { test, expect } from "@playwright/test";
import { InventoryPage } from "../pages/InventoryPage";

let inventoryPage: InventoryPage;

test.beforeEach(async ({ page }) => {
  inventoryPage = new InventoryPage(page);
  await inventoryPage.navigate();
  await inventoryPage.isLoaded();
});

test("Items should be sorted by price (low to high)", async () => {
  await inventoryPage.selectSortingOption("lohi");
  const prices = await inventoryPage.getProductPrices();

  const sortedPrices = [...prices].sort((a, b) => a - b);
  expect(prices).toEqual(sortedPrices);
});

test("Items should be sorted by price (high to low)", async () => {
  await inventoryPage.selectSortingOption("hilo");
  const prices = await inventoryPage.getProductPrices();

  const sortedPrices = [...prices].sort((a, b) => b - a);
  expect(prices).toEqual(sortedPrices);
});

test("Items should be sorted by title (A to Z)", async () => {
  await inventoryPage.selectSortingOption("az");
  const titles = await inventoryPage.getProductTitles();

  const sortedTitles = [...titles].sort();
  expect(titles).toEqual(sortedTitles);
});

test("Items should be sorted by title (Z to A)", async () => {
  await inventoryPage.selectSortingOption("za");
  const titles = await inventoryPage.getProductTitles();

  const sortedTitles = [...titles].sort().reverse();
  expect(titles).toEqual(sortedTitles);
});

test("Cart counter should be updated after adding single item to the cart", async () => {
  await inventoryPage.addItemToCart(0);

  await expect(inventoryPage.cartCounter()).toHaveText("1");
  await expect(inventoryPage.buttonRemove(0)).toBeVisible();
});
