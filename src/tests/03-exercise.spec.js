import { test } from "@playwright/test";

test("should check if email input is visible", async ({ page }) => {
    await page.goto("/prihlaseni");
    await page.getByLabel('Email').isVisible();
});

test("should check if email input is enabled", async ({ page }) => {
    await page.goto("/prihlaseni");
    await page.getByLabel('Email').isEnabled();
 });

 test("should check if password input is visible", async ({ page }) => {
    await page.goto("/prihlaseni");
    await page.getByLabel('Heslo').isVisible();
});

test("should check if password input is enabled", async ({ page }) => {
    await page.goto("/prihlaseni");
    await page.getByLabel('Heslo').isEnabled();
});

test("should write text content of sign in button", async ({ page }) => {
    await page.goto("/prihlaseni");
    console.log(await page.getByRole('button', { name: 'Přihlásit' }).textContent());
});

test("should wrrite attribute of Zapomněli jste své heslo?", async ({ page }) => {
    await page.goto("/prihlaseni");
    console.log(await page.getByText('Zapomněli jste své heslo?').getAttribute('href'));
});

test("should sign in", async ({ page }) => {
    await page.goto("/prihlaseni");
    await page.getByLabel('Email').fill(`paveltest@gmail.com`);
    await page.getByLabel('Heslo').fill(`Paveltest1`);
    await page.getByRole('button', { name: 'Přihlásit' }).click();
});

test("should write name and surname of user", async ({ page }) => {
    await page.goto("/prihlaseni");
    await page.getByLabel('Email').fill(`paveltest@gmail.com`);
    await page.getByLabel('Heslo').fill(`Paveltest1`);
    await page.getByRole('button', { name: 'Přihlásit' }).click();
    console.log(await page.locator(".navbarSupportedContent").getByText("Přihlásit"));
});