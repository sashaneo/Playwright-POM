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

// test.only("Practice - Find locators", async({page}) => {
//   page.locator('[data-test="username"]');
//   page.locator('[data-test="password"]');
//   page.locator('#login-button');
//   page.locator('.shopping_cart_link');
//   page.locator('.inventory_item_name').filter({hasText: "Sauce Labs Bike Light"});
//   page.locator(".inventory_list").nth(0).locator(".inventory_item_price");
//   page.locator(".inventory_item").nth(0).getByRole("button", {name: "ADD TO CART"});
//   page.locator(".inventory_item").nth(0).getByRole("button", {name: "REMOVE"}).click();
//   page.locator(".product_sort_container")
//   page.locator(".social .social_twitter")
//   page.locator(".cart_quantity")
//   page.locator(".inventory_item .inventory_item_desc")
//   page.getByRole("listitem").filter({hasText: "Twitter"})
//   page.getByRole("listitem", {name: "Facebook"})
//   page.getByRole("listitem", {name: "LinkedIn"})
//   page.getByText("Facebook", { exact: true})
//   page.getByText("LinkedIn", { exact: true})
//   page.locator(".social .social_facebook")
//   page.locator(".social .social_linkedin")
//   page.locator(".inventory_item_name").nth(1)
//   page.locator(".inventory_item").nth(3).getByRole("button", {name: "Add to Cart"}).click()
//   const qty = await page.locator(".inventory_item_price").count()
//   page.locator(".inventory_item_price").nth(qty-1).click()
//   page.locator(".social").nth(2).isVisible()
//   page.locator(".cart_quantity").nth(1)

// https://www.saucedemo.com/v1/cart.html

// })
