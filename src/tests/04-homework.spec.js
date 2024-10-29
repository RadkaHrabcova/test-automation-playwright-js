/*Test který provede validní registraci uživatele - zkontroluj, že registrace proběhla úspěšně

Test, který provede registraci uživatele s již existujícím emailem - zkontroluj, že registrace neproběhla a ověř chyby

Test, který provede registraci uživatele s nevalidním heslem (obsahující pouze čísla) - zkontroluj, že registrace neproběhla a ověř chyby
*/

import { expect,test } from "@playwright/test";

test("should register new user", async ({ page }) => {
    await page.goto("/registrace");
    // Generování náhodného jména a e-mailu
    const randomName = `User${Math.floor(Math.random() * 1000)}`;
    const randomEmail = `user${Math.floor(Math.random() * 1000)}@test.com`;
    // Vyplnění formuláře s náhodnými daty
    await page.locator("#name").fill(randomName);
    await page.locator("#email").fill(randomEmail);
    await page.locator("#password").fill("Petrtest1");
    await page.locator("#password-confirm").fill("Petrtest1");
    // Odeslání formuláře
    await page.locator(".btn-primary").click();
    // Ověření přihlášení s náhodným jménem
    await expect(page.locator(".navbar-right").locator("strong")).toHaveText(randomName);
});


test("should not register user with existing email", async ({ page }) => {
    await page.goto("/registrace");
    // Vyplnění formuláře s duplicovaným emailem
    await page.locator("#name").fill("Pavel");
    await page.locator("#email").fill(`paveltest@gmail.com`);
    await page.locator("#password").fill(`Paveltest1`);
    await page.locator("#password-confirm").fill(`Paveltest1`);
    await page.locator(".btn-primary").click();
    // Ověření chyby
    await expect(page.getByText('Účet s tímto emailem již existuje')).toBeVisible();
});


test("should not register user with invalid password", async ({ page }) => {
    await page.goto("/registrace");
    // Generování náhodného jména a e-mailu
    const randomName = `User${Math.floor(Math.random() * 1000)}`;
    const randomEmail = `user${Math.floor(Math.random() * 1000)}@test.com`;
    // Vyplnění formuláře s náhodnými daty
    await page.locator("#name").fill(randomName);
    await page.locator("#email").fill(randomEmail);
    await page.locator("#password").fill("123456789");
    await page.locator("#password-confirm").fill("123456789");
    // Odeslání formuláře
    await page.locator(".btn-primary").click();
    // Ověření chyby
    await expect(page.getByText('Heslo musí obsahovat minimálně 6 znaků, velké i malé písmeno a číslici')).toBeVisible();
});
