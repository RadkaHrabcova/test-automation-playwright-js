import { test } from "@playwright/test";

test("should make registration page screenshot", async ({ page }) => {
    await page.goto("/registrace");
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({ path: "registration_page_1920_1080.png" });
});

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
    await page.locator("#password-confirm").screenshot({ path: "css_registration_input_password.png" });
});

test("should screenshot registration password confirm input ", async ({ page }) => {
    await page.goto("/registrace");
    await page.locator("#name").screenshot({ path: "css_registration_input_password_confirm.png" });
});

test("should screenshot registration button", async ({ page }) => {
    await page.goto("/registrace");
    await page.locator(".btn-primary").screenshot({ path: "css_registration_btn_primary.png" });
});