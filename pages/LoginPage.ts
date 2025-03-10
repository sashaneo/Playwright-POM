import { Page } from "@playwright/test";

export class LoginPage {
  private usernameInput = "#user-name";
  private passwordInput = "#password";
  private loginButton = "#login-button";

  constructor(private page: Page) {} // page - параметр конструктора

  async navigate() {
    await this.page.goto("https://www.saucedemo.com/v1/index.html");
  }

  async login(username: string, password: string) {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
  }
}
