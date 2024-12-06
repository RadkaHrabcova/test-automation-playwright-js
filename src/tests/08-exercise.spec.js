
import {username, password, userFullName, ApplicationTexts,applicationsSearchText, applicationsPageSize} from '../fixtures/fixtures.js';
import {expect, test} from "@playwright/test";
import {LoginPage} from "./pages/login.page";
import {RegExp} from "../fixtures/regular-expressions";
import {ApplicationsPage} from "./pages/applications.page";

test.describe('Login Page', async () => {

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.open();
        await test.expect(page).toHaveTitle(ApplicationTexts.loginPage.title);

    });

    test('should show login form', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await expect(loginPage.emailField, 'email field should be visible').toBeVisible();
        await expect(loginPage.emailField, 'email field should be enabled').toBeEnabled();

        await expect(loginPage.passwordField, 'password field should be visible').toBeVisible();
        await expect(loginPage.passwordField, 'password field should be enabled').toBeEnabled();

        await expect(loginPage.loginButton, 'login button should be visible').toBeVisible();
        await expect(loginPage.loginButton, 'login button text should have text').toHaveText('Přihlásit');
    });

    test('should login with valid credentials', async ({page}) => {
        const loginPage = new LoginPage(page);

        await loginPage.login(username, password);
        await expect(loginPage.usernameDropdown).toHaveText(userFullName);
    });

    test('should not login with invalid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);
        
        await loginPage.login(username, 'invalid');

        await expect(loginPage.toast).toHaveText('Některé pole obsahuje špatně zadanou hodnotu');
        await expect(loginPage.fieldError).toHaveText('Tyto přihlašovací údaje neodpovídají žadnému záznamu.');

        await expect(loginPage.emailField).toBeVisible();
        await expect(loginPage.passwordField).toBeVisible();
        await expect(loginPage.loginButton).toBeVisible();
    });

    test('should logout', async ({ page }) => {
        const loginPage = new LoginPage(page);
      
        await loginPage.login(username, password);

        await expect(await loginPage.usernameDropdown).toHaveText(userFullName);

        await loginPage.usernameDropdown.click();
        await loginPage.logoutLink.click();

        await expect(await loginPage.usernameDropdown).toBeVisible({ visible: false });
        await expect(await loginPage.navbarRight).toHaveText('Přihlásit');
    });
});

test.describe('Applications Page', async () => {

    test.beforeEach(async ({page}) => {
        const loginPage = new LoginPage(page);
        const applicationsPage = new ApplicationsPage(page);

        await loginPage.open();
        await loginPage.login(username, password);
        await applicationsPage.goToApplicationsPage();
        await test.expect(page).toHaveTitle(ApplicationTexts.applicationsPage.title);
    });

    test('should list all applications', async ({ page }) => {
        const applicationsPage = new ApplicationsPage(page);

        // get all rows
        const allRows = await applicationsPage.getApplicationsTableRows(page);
        await expect(allRows.length, 'table should have >= ' + applicationsPageSize + ' rows')
            .toBeGreaterThanOrEqual(applicationsPageSize);

        // iterate over rows
        for (const row of allRows) {
            const cells = row.locator('td');
            await expect(await cells.nth(0).textContent()).toMatch(RegExp.NAME);
            await expect(await cells.nth(1).textContent()).toMatch(RegExp.DATE);
            await expect(await cells.nth(2).textContent()).toMatch(RegExp.PAYMENT_TYPE);
            await expect(await cells.nth(3).textContent()).toMatch(RegExp.TO_PAY);
        }
    });

    test('should filter in applications', async ({ page }) => {
        const applicationsPage = new ApplicationsPage(page);

        // get all rows
        const allRows = await applicationsPage.getApplicationsTableRows();
        await expect(allRows.length, 'table should have >= ' + applicationsPageSize + ' rows')
            .toBeGreaterThanOrEqual(applicationsPageSize);

        // search in table
        await applicationsPage.searchInApplicationsTable(applicationsSearchText);
        await applicationsPage.waitForTableToLoad();

        // get filtered rows
        const filteredRows = await applicationsPage.getApplicationsTableRows();
        await expect(filteredRows.length, 'table should have < ' + allRows.length + ' rows')
            .toBeLessThan(allRows.length);

        // iterate over filtered rows
        for (const row of filteredRows) {
            const cells = row.locator('td');
            await expect(await cells.nth(0).textContent()).toContain(applicationsSearchText);
        }
    });
});
