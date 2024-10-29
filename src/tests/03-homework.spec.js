/*Domácí úkol: Lekce 3

Prohldédni si strnánku pro registraci Otevřít stránku pro registraci https://team8-2022brno.herokuapp.com/registrace.

Vycházej z úkolu z lekce 2 a napiš kód který na stránce pro registraci
Vyplní jméno a příjmení
Vyplní email
Vyplní a potvrdí heslo
Klikne na tlačítko pro odeslání registračního formuláře

Zatím nemusíš kontrolovat, zda registrace proběhla v pořádku, to budeme řešit později.
*/
import { test } from "@playwright/test";

test("should register new user ", async ({ page }) => {
    await page.goto("/registrace");
    await page.locator("#name").fill("Pavel");
    await page.locator("#email").fill(`paveltest@gmail.com`);
    await page.locator("#password").fill(`Paveltest1`);
    await page.locator("#password-confirm").fill(`Paveltest1`);
    await page.locator(".btn-primary").click();
});
   