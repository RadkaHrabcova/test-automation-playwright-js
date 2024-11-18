/*
Napiš funkce na:
otevření login stránky (openLoginPage)
přihlášení (funkce se dvěma parametry: login(username, password))
přechod na stránku s přihláškami (goToApplications)
získání řádků tabulky (getTableRows)
hledání v tabulce (searchInTable)
počkání na načtení tabulky (waitForTableToLoad)

Zrefaktoruj testy aby používaly tyto funkce
*/

import {expect, test} from "@playwright/test";
import {
    username,
    password,
    userFullName,
    applicationsPageSize,
    applicationsSearchText
} from "../fixtures/fixtures.js"
import {RegExp} from "../fixtures/regular-expressions";


test.describe('Applications Page', async () => {

    test.beforeEach(async ({page}) => {
        await page.goto('/prihlaseni');
        await page.getByLabel('Email').fill(username);
        await page.getByLabel('Heslo').fill(password);
        await page.getByRole('button', { name: 'Přihlásit'}).click();
        await page.getByRole('link', {name: 'Přihlášky'}).click();
        await page.waitForLoadState();

        const loadingIndicator = page.locator('#DataTables_Table_0_processing');
        await loadingIndicator.waitFor({state: 'visible'});
        await loadingIndicator.waitFor({state: 'hidden'});

        const pageTitle = await page.getByRole("heading", {level: 1});
        await expect(pageTitle, 'page title should be displayed').toHaveText("Přihlášky");
    });

    /* přiklad fcd
    async function getEmailField(page) {
        return await page.getByLabel('Email');
     };

     */
    async function openLoginPage(page) {
        return await page.goto('/prihlaseni');    
    }
     async function login(page, username, password) {
         openLoginPage(page);
     }
    test('should list all applications', async ({ page }) => {
        const rows = await page
            .locator('.dataTable')
            .locator('tbody')
            .locator('tr')
            .all();

        await expect(rows.length, 'table should have >= ' + applicationsPageSize + ' rows')
            .toBeGreaterThanOrEqual(applicationsPageSize);

        for (const row of rows) {
            const cells = row.locator('td');
            await expect(await cells.nth(0).textContent()).toMatch(RegExp.NAME);
            await expect(await cells.nth(1).textContent()).toMatch(RegExp.DATE);
            await expect(await cells.nth(2).textContent()).toMatch(RegExp.PAYMENT_TYPE);
            await expect(await cells.nth(3).textContent()).toMatch(RegExp.TO_PAY);
        }
    });

    test('should filter in applications', async ({ page }) => {
        const loadingIndicator = page.locator('#DataTables_Table_0_processing');

        await page.locator("input[type='search']").fill(applicationsSearchText);
        await page.waitForLoadState()
        await loadingIndicator.waitFor({state: 'visible'});
        await loadingIndicator.waitFor({state: 'hidden'});

        const filteredRows = await page
            .locator(".dataTable")
            .locator("tbody")
            .locator("tr")
            .all();

        await expect(filteredRows.length, 'table should have < ' + applicationsPageSize + ' rows')
            .toBeLessThan(applicationsPageSize);

        for (const row of filteredRows) {
            const cells = row.locator('td');
            await expect(await cells.nth(0).textContent()).toMatch(RegExp.NAME);
            await expect(await cells.nth(1).textContent()).toMatch(RegExp.DATE);
            await expect(await cells.nth(2).textContent()).toMatch(RegExp.PAYMENT_TYPE);
            await expect(await cells.nth(3).textContent()).toMatch(RegExp.TO_PAY);
        }
    });

});
    