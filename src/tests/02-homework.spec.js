import { test } from "@playwright/test";

test("should screenshot registration name input ", async ({ page }) => {
    await page.goto("/registrace");
    await page.locator("#name").screenshot({ path: "css_registration_input_name.png" });
});

test("should screenshot registration email input ", async ({ page }) => {
    await page.goto("/registrace");
    await page.locator("#email").screenshot({ path: "css_registration_input_email.png" });
});

test("should screenshot registration password input ", async ({ page }) => {
    await page.goto("/registrace");
    await page.locator("#password").screenshot({ path: "css_registration_input_password.png" });
});

test("should screenshot registration password confirm input ", async ({ page }) => {
    await page.goto("/registrace");
    await page.locator("#password-confirm").screenshot({ path: "css_registration_input_password_confirm.png" });
});

test("should screenshot registration button", async ({ page }) => {
    await page.goto("/registrace");
    await page.locator(".btn-primary").screenshot({ path: "css_registration_btn_primary.png" });
});