import { test } from "@playwright/test";

const URL = "https://buggy.justtestit.org/";

test("should open page", async ({ page }) => {
    await page.goto(URL);
    
    // Čekání na plné načtení stránky
    await page.waitForLoadState('load'); // nebo 'networkidle' pro čekání na konec všech síťových požadavků
    
    console.log(await page.title());
    console.log("This is my first test!");
    
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({ path: "page_1920_1080.png" });
});

test("should login and list applications", async ({ page }) => {

    await page.goto("/prihlaseni");

    const loginField = page.getByLabel("Login");
    await expect(loginField, "login field should be visible").toBeVisible();
    await expect(loginField, "login field should be enabled").toBeEnabled();
  
    const passwordField = page.getByLabel("Password");
    await expect(passwordField, "password field should be visible").toBeVisible();
    await expect(passwordField, "password field should be enabled").toBeEnabled();

    const loginButton = page.getByRole("button", { name: "Přihlásit"});
    await expect(loginButton, "login button should be visible").toBeVisible();
    await expect(loginButton, "login button text should have text").toHaveText("Přihlásit");

    await emailField.fill(username);
    await passwordField.fill(password);
    await loginButton.click();

});