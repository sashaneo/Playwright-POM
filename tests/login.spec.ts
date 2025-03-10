import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";

let loginPage: LoginPage;
let inventoryPage: InventoryPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  inventoryPage = new InventoryPage(page);
  await loginPage.navigate();
});

test("User can log in with valid credentials", async ({ page }) => {
  await loginPage.login("standard_user", "secret_sauce");

  expect(page.url()).toContain("/inventory.html");
  await expect(page.locator(".product_label")).toHaveText("Products");
});

test("User cannot log in with invalid credentials", async ({ page }) => {
  await loginPage.login("standard_user", "wrong_password");

  await expect(page.locator("data-test=error")).toBeVisible();
});

test("User can log out", async ({ page }) => {
  await loginPage.login("standard_user", "secret_sauce");
  await inventoryPage.isLoaded();

  await page.click(".bm-burger-button");
  await page.click("#logout_sidebar_link");

  await expect(page).toHaveURL("https://www.saucedemo.com/v1/index.html");
});
