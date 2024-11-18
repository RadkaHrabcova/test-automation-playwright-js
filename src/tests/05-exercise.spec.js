/*Cvičení 1
Napíšeme si dlouhý testovací script

Jdi na stránku pro příhlášení
Klikni na Přihlásit
Zkontroluj, že se objevila chyba a uživatel se nepřihlásil
Vyplň správný email a nesprávné heslo
Klikni na Přihlásit
Zkontroluj, že se objevila chyba a uživatel se nepřihlásil
Vyplň správný email a správné heslo
Klikni na Přihlásit
Zkontroluj, že se uživatel přihlásil
Jdi na stránku Přihlášky
Vypiš všechny řádky tabulky
Zadej něco do políčka pro filtrování tabulky
Zkontroluj, že se stránka profiltrovala
Odhlaš se a zkontroluj, že jsi byl/a odhlášen/a
*/
/*

import {expect, test} from "@playwright/test";
import {
    username,
    password,
    userFullName,
    applicationsPageSize,
    applicationsSearchText
} from "../fixtures/fixtures.js"
import {RegExp} from "../fixtures/regular-expressions";*/

test("should test login and list applications", async ({ page }) => {
    await page.goto("/prihlaseni");

    const emailField = page.getByLabel("Email");
    const passwordField = page.getByLabel("Heslo");
    const loginButton = page.getByRole("button", { name: "Přihlásit"});

    await emailField.fill(username);
    await passwordField.fill("invalid");
    await loginButton.click();

    const toastMessage = page.locator(".toast-message");
    const fieldError = page.locator(".invalid-feedback");
    await expect(toastMessage).toHaveText("Některé pole obsahuje špatně zadanou hodnotu");
    await expect(fieldError).toHaveText("Tyto přihlašovací údaje neodpovídají žadnému záznamu.");
    await expect(emailField, "email field should be visible").toBeVisible();
    await expect(passwordField, "password field should be visible").toBeVisible();
    await expect(loginButton, "login buton should be visible").toBeVisible();

    await emailField.fill(username);
    await passwordField.fill(password);
    await loginButton.click();

    const currentUser = page
        .locator(".navbar-right")
        .locator("strong");
    await expect(currentUser, "current user should be displayed").toHaveText(userFullName);

    await page.getByRole("link", {name: "Přihlášky"}).click();
    await page.waitForLoadState();

    const loadingIndicator = page.locator("#DataTables_Table_0_processing");
    await loadingIndicator.waitFor({state: "visible"});
    await loadingIndicator.waitFor({state: "hidden"});

    const pageTitle = await page.getByRole("heading", {level: 1});
    await expect(pageTitle, "page title should be displayed").toHaveText("Přihlášky");

    const rows = await page
            .locator(".dataTable")
            .locator("tbody")
            .locator("tr")
            .all();

    await expect(rows.length, "table should have >= " + applicationsPageSize + " rows")
    .toBeGreaterThanOrEqual(applicationsPageSize);

     for (const row of rows) {
        const cells = row.locator("td");            
        await expect(await cells.nth(0).textContent()).toMatch(RegExp.NAME);
        await expect(await cells.nth(1).textContent()).toMatch(RegExp.DATE);
        await expect(await cells.nth(2).textContent()).toMatch(RegExp.PAYMENT_TYPE);
        await expect(await cells.nth(3).textContent()).toMatch(RegExp.TO_PAY);
    }


    await page.locator("input[type='search']").fill(applicationsSearchText);
    await page.waitForLoadState()
    await loadingIndicator.waitFor({state: "visible"});
    await loadingIndicator.waitFor({state: "hidden"});

    const filteredRows = await page
        .locator(".dataTable")
        .locator("tbody")
        .locator("tr")
        .all();

    await expect(filteredRows.length, "table should have < " + applicationsPageSize + " rows")
        .toBeLessThan(applicationsPageSize);

    for (const row of filteredRows) {
        const cells = row.locator("td");
        await expect(await cells.nth(0).textContent()).toMatch(RegExp.NAME);
        await expect(await cells.nth(1).textContent()).toMatch(RegExp.DATE);
        await expect(await cells.nth(2).textContent()).toMatch(RegExp.PAYMENT_TYPE);
        await expect(await cells.nth(3).textContent()).toMatch(RegExp.TO_PAY);
    }
});


//const toastMessage = page.locator(".toast-message");

/*Pěkně si testy rozděl a zorganizuj pomocí test.beforeAll a test.beforeEach

Měly by vzniknout pravděpodobně alespoň 4 samostatné testy:
test pro nesprávné přihlášení
test pro správné přihlášení
test pro odhlášení
test pro výpis tabulky přihlášek bez filtrování
test pro filtrování tabulky přihlášek
Nezapomeň testy hezky pojmenovat
Potom rozděl testy do dvou describe bloků
jedna sekce bude obsahovat testy pro login
druhá sekce bude obsahovat testy pro tabulku přihlášek
Opět nezapomeň obě sekce hezky popsat
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

/**
 * Lesson 5: Test organization
 */
test.describe('Login Page', () => {

    test.beforeEach(async ({page}) => {
        await page.goto('/prihlaseni');
    });

    test('should show login form', async ({ page }) => {
        const emailField = page.getByLabel('Email');
        await expect(emailField, 'email field should be visible').toBeVisible();
       
        const passwordField = page.getByLabel('Heslo');
        await expect(passwordField, 'password field should be visible').toBeVisible();

        const loginButton = page.getByRole('button', { name: 'Přihlásit'});
        await expect(loginButton, 'login button should be visible').toBeVisible();
        await expect(loginButton, 'login button text should have text').toHaveText('Přihlásit');
    });

    test('should login with valid credentials', async ({ page }) => {
        const emailField = page.getByLabel('Email');
        const passwordField = page.getByLabel('Heslo');
        const loginButton = page.getByRole('button', { name: 'Přihlásit'});

        await emailField.fill(username);
        await passwordField.fill(password);
        await loginButton.click();

        const currentUser = page
            .locator('.navbar-right')
            .locator('strong');
        await expect(currentUser, 'current user should be displayed').toHaveText(userFullName);
    });

    test('should not login with invalid credentials', async ({ page }) => {
        const emailField = page.getByLabel('Email');
        const passwordField = page.getByLabel('Heslo');
        const loginButton = page.getByRole('button', { name: 'Přihlásit'});

        await emailField.fill(username);
        await passwordField.fill('invalid');
        await loginButton.click();

        const toastMessage = page.locator('.toast-message');
        const fieldError = page.locator('.invalid-feedback');
        await expect(toastMessage).toHaveText('Některé pole obsahuje špatně zadanou hodnotu');
        await expect(fieldError).toHaveText('Tyto přihlašovací údaje neodpovídají žadnému záznamu.');
        await expect(emailField, 'email field should be visible').toBeVisible();
        await expect(passwordField, 'password field should be visible').toBeVisible();
        await expect(loginButton, 'login buton should be visible').toBeVisible();
    });

    test('should logout', async ({ page }) => {
        const emailField = page.getByLabel('Email');
        const passwordField = page.getByLabel('Heslo');
        const loginButton = page.getByRole('button', { name: 'Přihlásit'});
        const navbarRight = page.locator('.navbar-right')
        const userNameDropdown = navbarRight.locator('[data-toggle="dropdown"]');
        const logoutLink = page.locator('#logout-link');

        await emailField.fill(username);
        await passwordField.fill(password);
        await loginButton.click();

        await expect(userNameDropdown).toHaveText(userFullName);

        await userNameDropdown.click();
        await logoutLink.click();

        await expect(userNameDropdown).toBeVisible({ visible: false });
        await expect(navbarRight).toHaveText('Přihlásit');
    });
});

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
    

